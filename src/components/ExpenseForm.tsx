import React, { useState, useEffect } from 'react';
import { Person, Expense } from '../data/mockData';
import IOSButton from './ui/IOSButton';

interface ExpenseFormProps {
  people: Person[];
  onSubmit: (expense: Omit<Expense, 'id' | 'addedById' | 'groupId'>) => void;
  onCancel: () => void;
  isOpen: boolean;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ people, onSubmit, onCancel, isOpen }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidById, setPaidById] = useState<string | null>(null);
  const [splitBetweenIds, setSplitBetweenIds] = useState<string[]>([]);
  const [splitType, setSplitType] = useState<'equal' | 'unequal'>('equal');
  const [customSplits, setCustomSplits] = useState<{ [key: string]: number }>({});

  // Update state when people changes
  useEffect(() => {
    if (people.length > 0) {
      setPaidById(people[0].id);
      setSplitBetweenIds(people.map(p => p.id));
    } else {
      setPaidById(null);
      setSplitBetweenIds([]);
    }
  }, [people]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paidById) return;
    
    // Validate minimum 2 people requirement
    if (splitBetweenIds.length < 2) {
      alert('Please select at least 2 people to split the expense');
      return;
    }

    const totalAmount = parseFloat(amount);
    const splits = splitType === 'equal'
      ? splitBetweenIds.map(id => ({ id, amount: totalAmount / splitBetweenIds.length }))
      : splitBetweenIds.map(id => ({ id, amount: customSplits[id] || 0 }));

    onSubmit({
      description,
      amount: totalAmount,
      paidById,
      date: new Date().toISOString().split('T')[0],
      splitBetweenIds,
      customSplits: splitType === 'unequal' ? customSplits : undefined,
    });

    // Reset form
    setDescription('');
    setAmount('');
    if (people.length > 0) {
      setPaidById(people[0].id);
      setSplitBetweenIds(people.map(p => p.id));
    }
    setSplitType('equal');
    setCustomSplits({});
  };

  const togglePerson = (person: Person) => {
    setSplitBetweenIds(prev => {
      const isSelected = prev.includes(person.id);
      if (isSelected) {
        return prev.filter(id => id !== person.id);
      } else {
        return [...prev, person.id];
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 overflow-y-auto">
      <div className="min-h-screen px-4 text-center">
        <div className="fixed inset-0" onClick={onCancel} />
        
        <div className="inline-block w-full max-w-md my-8 text-left align-middle">
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-xl transform transition-all">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Add Expense</h2>
              <button
                onClick={onCancel}
                className="p-2 text-gray-400 hover:text-gray-500 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600">
                    Description
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Enter expense description"
                    required
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2 transition-colors group-focus-within:text-blue-600">
                    Paid by
                  </label>
                  <select
                    value={paidById || ''}
                    onChange={(e) => setPaidById(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 transition-colors appearance-none bg-white"
                    style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E\")",
                             backgroundRepeat: "no-repeat",
                             backgroundPosition: "right 1rem center",
                             backgroundSize: "1.5em 1.5em" }}
                    required
                  >
                    <option value="" disabled>Select a person</option>
                    {people.map(person => (
                      <option key={person.id} value={person.id}>
                        {person.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Split between
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {people.map(person => (
                      <label key={person.id} className="flex items-center p-3 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-200 transition-colors">
                        <input
                          type="checkbox"
                          checked={splitBetweenIds.includes(person.id)}
                          onChange={() => togglePerson(person)}
                          className="w-5 h-5 rounded text-blue-500 focus:ring-blue-500 focus:ring-offset-0"
                        />
                        <span className="ml-3 text-gray-700">{person.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Split Type
                  </label>
                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 bg-gray-50 p-2 rounded-xl">
                    <label className="flex-1">
                      <input
                        type="radio"
                        name="splitType"
                        value="equal"
                        checked={splitType === 'equal'}
                        onChange={() => setSplitType('equal')}
                        className="sr-only"
                      />
                      <div className={`cursor-pointer text-center py-2 px-4 rounded-lg transition-colors ${
                        splitType === 'equal'
                          ? 'bg-white shadow-sm text-blue-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}>
                        Equal Split
                      </div>
                    </label>
                    <label className="flex-1">
                      <input
                        type="radio"
                        name="splitType"
                        value="unequal"
                        checked={splitType === 'unequal'}
                        onChange={() => setSplitType('unequal')}
                        className="sr-only"
                      />
                      <div className={`cursor-pointer text-center py-2 px-4 rounded-lg transition-colors ${
                        splitType === 'unequal'
                          ? 'bg-white shadow-sm text-blue-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}>
                        Custom Split
                      </div>
                    </label>
                  </div>
                </div>

                {splitType === 'unequal' && (
                  <div className="group animate-fadeIn">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Custom Splits
                    </label>
                    <div className="space-y-3 bg-gray-50 p-4 rounded-xl">
                      {people.filter(person => splitBetweenIds.includes(person.id)).map(person => (
                        <div key={person.id} className="flex items-center">
                          <span className="w-24 text-gray-700">{person.name}:</span>
                          <div className="relative flex-1">
                            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                            <input
                              type="number"
                              value={customSplits[person.id] || ''}
                              onChange={(e) => setCustomSplits({ ...customSplits, [person.id]: parseFloat(e.target.value) })}
                              className="w-full pl-8 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                              min="0"
                              step="0.01"
                              placeholder="0.00"
                              required
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
                <IOSButton
                  type="button"
                  variant="secondary"
                  onClick={onCancel}
                  className="flex-1"
                >
                  Cancel
                </IOSButton>
                <IOSButton type="submit" className="flex-1">
                  Add Expense
                </IOSButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm; 