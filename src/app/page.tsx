'use client';

import React, { useState, useEffect } from 'react';
import { type Person, type Expense, initialPeople, initialExpenses } from '../data/mockData';
import { calculateBalances, simplifyDebts } from '../lib/calculations';
import IOSButton from '../components/ui/IOSButton';
import IOSCard from '../components/ui/IOSCard';
import IOSModal from '../components/ui/IOSModal';
import ExpenseForm from '../components/ExpenseForm';
import Layout from '../components/Layout';
import AddExpenseButton from '../components/AddExpenseButton';

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [people, setPeople] = useState<Person[]>(initialPeople);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddPersonModalOpen, setIsAddPersonModalOpen] = useState(false);
  const [isViewExpenseModalOpen, setIsViewExpenseModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference for dark mode
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }

    const storedPeople = localStorage.getItem('people');
    const storedExpenses = localStorage.getItem('expenses');
    if (storedPeople) {
      setPeople(JSON.parse(storedPeople));
    }
    if (storedExpenses) {
      setExpenses(JSON.parse(storedExpenses));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('people', JSON.stringify(people));
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [people, expenses]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  // Calculate balances only if there are people and expenses
  const balances = people.length > 0 ? calculateBalances(expenses, people[0]) : [];
  const debts = people.length > 0 ? simplifyDebts(balances) : [];

  const handleAddPerson = (person: Omit<Person, 'id'>) => {
    setPeople([...people, { ...person, id: `person-${Date.now()}` }]);
  };

  const handleAddExpense = (expense: Omit<Expense, 'id' | 'addedBy'>) => {
    if (people.length < 2) {
      alert('Please add at least two people before creating an expense.');
      return;
    }
    
    setExpenses([...expenses, {
      ...expense,
      id: `expense-${Date.now()}`,
      addedBy: people[0]
    }]);
    setIsModalOpen(false);
  };

  const viewExpenseDetails = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsViewExpenseModalOpen(true);
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <Layout people={people} onAddPerson={handleAddPerson}>
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleDarkMode}
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
          {people.length === 0 ? (
            <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Welcome to FairShare!</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Start by adding people to your group using the sidebar.</p>
                <button
                  onClick={() => setIsAddPersonModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-dark-800"
                >
                  Add Your First Person
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Debts Summary Section - Now at the top */}
              <div className="sticky top-4 z-10 mb-6">
                {debts.length > 0 ? (
                  <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Debts Summary</h2>
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
                ) : (
                  <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
                    <div className="text-center py-4">
                      <p className="text-gray-500 dark:text-gray-400">No debts to settle</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Expenses List - Now below debts summary */}
              <div className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Expenses</h2>
                {expenses.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 dark:bg-dark-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No expenses yet</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      {people.length < 2 
                        ? 'Add at least one more person to start adding expenses'
                        : 'Add your first expense by clicking the + button'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {expenses.map(expense => (
                      <div
                        key={expense.id}
                        onClick={() => viewExpenseDetails(expense)}
                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-xl hover:bg-gray-100 dark:hover:bg-dark-600 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300 flex items-center justify-center font-medium">
                            {expense.paidBy.name[0].toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-gray-100">{expense.description}</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Paid by {expense.paidBy.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium text-gray-900 dark:text-gray-100">₹{expense.amount.toFixed(2)}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{new Date(expense.date).toLocaleDateString()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Add Expense Form */}
        <ExpenseForm
          people={people}
          onSubmit={handleAddExpense}
          onCancel={() => setIsModalOpen(false)}
          isOpen={isModalOpen}
        />

        {/* Add Expense Button */}
        {people.length >= 2 && (
          <AddExpenseButton onClick={() => setIsModalOpen(true)} />
        )}

        {/* View Expense Detail Modal */}
        <IOSModal
          isOpen={isViewExpenseModalOpen}
          onClose={() => setIsViewExpenseModalOpen(false)}
          title={selectedExpense?.description || "Expense Details"}
        >
          {selectedExpense && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">Amount</div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">₹{selectedExpense.amount.toFixed(2)}</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">Paid by</div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">{selectedExpense.paidBy.name}</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">Date</div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">{new Date(selectedExpense.date).toLocaleDateString()}</div>
              </div>
              
              <div className="pt-2">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Split Details</div>
                <div className="border dark:border-dark-600 rounded-lg overflow-hidden">
                  {selectedExpense.splitBetween.map(person => {
                    const customAmount = selectedExpense.customSplits?.[person.id];
                    const equalAmount = selectedExpense.amount / selectedExpense.splitBetween.length;
                    const amount = customAmount !== undefined ? customAmount : equalAmount;
                    
                    return (
                      <div key={person.id} className="flex justify-between items-center p-2 border-b dark:border-dark-600 last:border-0">
                        <div className="font-medium text-gray-900 dark:text-gray-100">{person.name}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {person.id === selectedExpense.paidBy.id ? "(paid)" : ""}
                          </span>
                          <span className="text-gray-900 dark:text-gray-100">₹{amount.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="pt-4">
                <IOSButton 
                  variant="secondary" 
                  fullWidth 
                  onClick={() => setIsViewExpenseModalOpen(false)}
                >
                  Close
                </IOSButton>
              </div>
            </div>
          )}
        </IOSModal>
      </Layout>
    </div>
  );
} 