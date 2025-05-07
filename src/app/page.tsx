'use client';

import { useState, useEffect } from 'react';
import { type Person, type Expense } from '../data/mockData';
import { calculateBalances, simplifyDebts } from '../lib/calculations';
import IOSButton from '../components/ui/IOSButton';
import IOSCard from '../components/ui/IOSCard';
import IOSModal from '../components/ui/IOSModal';
import ExpenseForm from '../components/ExpenseForm';

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddPersonModalOpen, setIsAddPersonModalOpen] = useState(false);
  const [isViewExpenseModalOpen, setIsViewExpenseModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const currentUser = people[0];
  
  useEffect(() => {
    const storedPeople = localStorage.getItem('people');
    if (storedPeople) {
      setPeople(JSON.parse(storedPeople));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('people', JSON.stringify(people));
  }, [people]);

  // Calculate balances (needed for debts calculations)
  const balances = calculateBalances(expenses, currentUser);
  const debts = simplifyDebts(balances);

  const addExpense = (newExpense: Omit<Expense, 'id' | 'addedBy'>) => {
    setExpenses([...expenses, { 
      ...newExpense, 
      id: Date.now().toString(), 
      addedBy: currentUser 
    }]);
    setIsModalOpen(false);
  };

  const addPerson = (name: string) => {
    setPeople([...people, { id: Date.now().toString(), name }]);
    setIsAddPersonModalOpen(false);
  };

  const viewExpenseDetails = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsViewExpenseModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex">
      <aside className="w-1/4 bg-white p-4 border-r">
        <h2 className="text-lg font-semibold mb-4">People</h2>
        <ul className="space-y-2">
          {people.map(person => (
            <li key={person.id} className="text-gray-800">
              {person.name}
            </li>
          ))}
        </ul>
      </aside>
      <div className="w-3/4 max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Splitwise</h1>
          <p className="text-gray-600 mt-1">Track shared expenses and balances</p>
        </header>

        {/* Add person button */}
        <div className="mb-6">
          <IOSButton fullWidth onClick={() => setIsAddPersonModalOpen(true)}>
            Add Person
          </IOSButton>
        </div>

        {/* Debts section */}
        {debts.length > 0 && (
          <IOSCard title="Debts Summary" className="mb-6">
            {debts.map((debt, index) => (
              debt.from && debt.to ? (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{debt.from.name}</span>
                    <span className="text-gray-500">owes</span>
                    <span className="font-medium">{debt.to.name}</span>
                  </div>
                  <span className="font-medium text-blue-600">₹{Math.abs(debt.amount)}</span>
                </div>
              ) : null
            ))}
          </IOSCard>
        )}

        {/* Add expense button */}
        <div className="mb-6">
          <IOSButton fullWidth onClick={() => setIsModalOpen(true)}>
            Add Expense
          </IOSButton>
        </div>

        {/* Expenses list */}
        <IOSCard title="Recent Expenses">
          {expenses.map(expense => (
            <div 
              key={expense.id} 
              className="flex justify-between items-center py-3 border-b last:border-0 cursor-pointer hover:bg-gray-50"
              onClick={() => viewExpenseDetails(expense)}
            >
              <div className="flex items-center gap-3">
                <div>
                  <div className="font-medium">{expense.description}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(expense.date).toLocaleDateString('en-GB')}
                  </div>
                  <div className="text-sm text-gray-500">
                    Added by: {expense.addedBy.name}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">₹{expense.amount}</div>
                <div className="text-sm text-gray-500">
                  {expense.customSplits 
                    ? `Unequal split between ${expense.splitBetween.length}`
                    : `Equal split between ${expense.splitBetween.length}`
                  }
                </div>
                <div className="text-xs text-gray-500">
                  Paid by: {expense.paidBy.name}
                </div>
              </div>
            </div>
          ))}
        </IOSCard>

        {/* Expense form modal */}
        <IOSModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Add Expense"
        >
          <ExpenseForm
            people={people}
            onSubmit={addExpense}
            onCancel={() => setIsModalOpen(false)}
          />
        </IOSModal>

        {/* Add person modal */}
        <IOSModal
          isOpen={isAddPersonModalOpen}
          onClose={() => setIsAddPersonModalOpen(false)}
          title="Add Person"
        >
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const name = formData.get('name') as string;
            addPerson(name);
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex space-x-3 pt-4">
              <IOSButton
                type="button"
                variant="secondary"
                onClick={() => setIsAddPersonModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </IOSButton>
              <IOSButton type="submit" className="flex-1">
                Add Person
              </IOSButton>
            </div>
          </form>
        </IOSModal>

        {/* View Expense Detail Modal */}
        <IOSModal
          isOpen={isViewExpenseModalOpen}
          onClose={() => setIsViewExpenseModalOpen(false)}
          title={selectedExpense?.description || "Expense Details"}
        >
          {selectedExpense && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">Amount</div>
                <div className="font-semibold">₹{selectedExpense.amount}</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">Paid by</div>
                <div className="font-semibold">{selectedExpense.paidBy.name}</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">Date</div>
                <div className="font-semibold">{new Date(selectedExpense.date).toLocaleDateString('en-GB')}</div>
              </div>
              
              <div className="pt-2">
                <div className="text-sm text-gray-500 mb-2">Split Details</div>
                <div className="border rounded-lg overflow-hidden">
                  {selectedExpense.splitBetween.map(person => {
                    const customAmount = selectedExpense.customSplits?.[person.id];
                    const equalAmount = selectedExpense.amount / selectedExpense.splitBetween.length;
                    const amount = customAmount !== undefined ? customAmount : equalAmount;
                    
                    return (
                      <div key={person.id} className="flex justify-between items-center p-2 border-b last:border-0">
                        <div className="font-medium">{person.name}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {person.id === selectedExpense.paidBy.id ? "(paid)" : ""}
                          </span>
                          <span>₹{amount.toFixed(2)}</span>
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
      </div>
    </main>
  );
} 