'use client';

import React, { useState, useEffect } from 'react';
import { type Person, type Expense, type Group, initialPeople, initialExpenses } from '../data/mockData';
import { calculateBalances, simplifyDebts } from '../lib/calculations';
import IOSButton from '../components/ui/IOSButton';
import IOSCard from '../components/ui/IOSCard';
import IOSModal from '../components/ui/IOSModal';
import ExpenseForm from '../components/ExpenseForm';
import Layout from '../components/Layout';
import AddExpenseButton from '../components/AddExpenseButton';
import GroupForm from '../components/GroupForm';
import GroupList from '../components/GroupList';

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [people, setPeople] = useState<Person[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isAddPersonModalOpen, setIsAddPersonModalOpen] = useState(false);
  const [isViewExpenseModalOpen, setIsViewExpenseModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const storedPeople = localStorage.getItem('people');
    const storedExpenses = localStorage.getItem('expenses');
    const storedGroups = localStorage.getItem('groups');
    
    if (storedPeople) setPeople(JSON.parse(storedPeople));
    if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
    if (storedGroups) setGroups(JSON.parse(storedGroups));
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem('people', JSON.stringify(people));
    localStorage.setItem('expenses', JSON.stringify(expenses));
    localStorage.setItem('groups', JSON.stringify(groups));
  }, [people, expenses, groups]);

  // Helper function to get person by ID
  const getPersonById = (id: string) => people.find(p => p.id === id);

  // Filter expenses by selected group
  const filteredExpenses = selectedGroup
    ? expenses.filter(expense => expense.groupId === selectedGroup.id)
    : [];

  // Get group members
  const selectedGroupMembers = selectedGroup
    ? selectedGroup.memberIds.map(id => getPersonById(id)).filter((p): p is Person => p !== undefined)
    : [];

  // Calculate balances for the selected group
  const balances = selectedGroup && selectedGroupMembers.length > 0
    ? calculateBalances(filteredExpenses, selectedGroupMembers)
    : [];
  const debts = selectedGroup && selectedGroupMembers.length > 0
    ? simplifyDebts(balances)
    : [];

  const handleAddPerson = (person: Omit<Person, 'id' | 'groupIds'>) => {
    if (!selectedGroup) {
      alert('Please select a group first');
      return;
    }

    const newPerson = {
      ...person,
      id: `person-${Date.now()}`,
      groupIds: [selectedGroup.id],
    };

    // Add person to the list and update the selected group
    setPeople([...people, newPerson]);
    const updatedGroup = {
      ...selectedGroup,
      memberIds: [...selectedGroup.memberIds, newPerson.id],
    };
    setGroups(groups.map(g => g.id === selectedGroup.id ? updatedGroup : g));
    setSelectedGroup(updatedGroup);
  };

  const handleAddGroup = (groupData: Pick<Group, 'name'>) => {
    const newGroup = {
      ...groupData,
      id: `group-${Date.now()}`,
      createdAt: new Date().toISOString(),
      memberIds: [],
      createdById: `person-${Date.now()}`,
    };

    setGroups([...groups, newGroup]);
    setSelectedGroup(newGroup);
    setIsGroupModalOpen(false);
  };

  const handleAddExpense = (expense: Omit<Expense, 'id' | 'addedById' | 'groupId'>) => {
    if (!selectedGroup) {
      alert('Please select a group first');
      return;
    }
    
    if (selectedGroupMembers.length < 2) {
      alert('Please add at least one more person to the group before creating an expense.');
      return;
    }
    
    setExpenses([...expenses, {
      ...expense,
      id: `expense-${Date.now()}`,
      addedById: selectedGroupMembers[0].id,
      groupId: selectedGroup.id,
    }]);
    setIsModalOpen(false);
  };

  // Get groups for current user
  const userGroups = groups;

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <Layout 
        people={selectedGroupMembers} 
        onAddPerson={handleAddPerson}
        selectedGroup={selectedGroup}
      >
        {/* Theme toggle button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-full bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-gray-200"
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

        <div className="space-y-6">
          {/* Groups Section */}
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
            <GroupList
              groups={userGroups}
              onCreateGroup={() => setIsGroupModalOpen(true)}
              onSelectGroup={setSelectedGroup}
              selectedGroup={selectedGroup}
            />
          </div>

          {selectedGroup && (
            <>
              {/* Debts Summary */}
              {debts.length > 0 && (
                <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
                    Debts Summary - {selectedGroup.name}
                  </h2>
                  <div className="space-y-4">
                    {debts.map((debt, index) => (
                      debt.from && debt.to ? (
                        <div key={index} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-dark-700 rounded-xl">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-gray-100">{debt.from.name}</span>
                            <span className="text-gray-500 dark:text-gray-400">owes</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{debt.to.name}</span>
                          </div>
                          <span className="font-medium text-primary-600 dark:text-primary-400">₹{Math.abs(debt.amount).toFixed(2)}</span>
                        </div>
                      ) : null
                    ))}
                  </div>
                </div>
              )}

              {/* Expenses List */}
              <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
                  Expenses - {selectedGroup.name}
                </h2>
                {filteredExpenses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No expenses yet</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {selectedGroupMembers.length < 2 
                        ? 'Add at least one more person to start adding expenses'
                        : 'Add your first expense by clicking the + button'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredExpenses.map(expense => {
                      const paidByPerson = getPersonById(expense.paidById);
                      if (!paidByPerson) return null;
                      
                      return (
                        <div
                          key={expense.id}
                          onClick={() => {
                            setSelectedExpense(expense);
                            setIsViewExpenseModalOpen(true);
                          }}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors cursor-pointer"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 flex items-center justify-center font-medium">
                              {paidByPerson.name[0].toUpperCase()}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-gray-100">{expense.description}</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Paid by {paidByPerson.name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium text-gray-900 dark:text-gray-100">₹{expense.amount.toFixed(2)}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{new Date(expense.date).toLocaleDateString()}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Add Expense Button */}
        {selectedGroup && selectedGroupMembers.length >= 2 && (
          <AddExpenseButton onClick={() => setIsModalOpen(true)} />
        )}

        {/* Group Form Modal */}
        <GroupForm
          onSubmit={handleAddGroup}
          onCancel={() => setIsGroupModalOpen(false)}
          isOpen={isGroupModalOpen}
          currentUserGroups={userGroups}
        />

        {/* Expense Form Modal */}
        <ExpenseForm
          people={selectedGroupMembers}
          onSubmit={handleAddExpense}
          onCancel={() => setIsModalOpen(false)}
          isOpen={isModalOpen && !!selectedGroup}
        />

        {/* View Expense Modal */}
        <IOSModal
          isOpen={isViewExpenseModalOpen}
          onClose={() => setIsViewExpenseModalOpen(false)}
          title={selectedExpense?.description || "Expense Details"}
        >
          {selectedExpense && (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Amount</div>
                <div className="text-lg font-semibold text-primary-600 dark:text-primary-400">₹{selectedExpense.amount.toFixed(2)}</div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Paid by</div>
                <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {getPersonById(selectedExpense.paidById)?.name}
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</div>
                <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {new Date(selectedExpense.date).toLocaleDateString()}
                </div>
              </div>
              
              <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Split between</div>
                <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {selectedExpense.splitBetweenIds
                    .map(id => getPersonById(id)?.name)
                    .filter(Boolean)
                    .join(', ')}
                </div>
              </div>
            </div>
          )}
        </IOSModal>
      </Layout>
    </div>
  );
} 