import React, { useState } from 'react';
import { Person, Expense } from '../data/mockData';
import IOSButton from './ui/IOSButton';

interface ExpenseFormProps {
  people: Person[];
  onSubmit: (expense: Omit<Expense, 'id' | 'addedBy'>) => void;
  onCancel: () => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ people, onSubmit, onCancel }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState<Person>(people[0]);
  const [splitBetween, setSplitBetween] = useState<Person[]>(people);
  const [splitType, setSplitType] = useState<'equal' | 'unequal'>('equal');
  const [customSplits, setCustomSplits] = useState<{ [key: string]: number }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmount = parseFloat(amount);
    const splits = splitType === 'equal'
      ? splitBetween.map(person => ({ person, amount: totalAmount / splitBetween.length }))
      : splitBetween.map(person => ({ person, amount: customSplits[person.id] || 0 }));

    onSubmit({
      description,
      amount: totalAmount,
      paidBy,
      date: new Date().toISOString().split('T')[0],
      splitBetween: splits.map(s => s.person),
      customSplits: splitType === 'unequal' ? customSplits : undefined,
    });
  };

  const togglePerson = (person: Person) => {
    if (splitBetween.includes(person)) {
      setSplitBetween(splitBetween.filter(p => p.id !== person.id));
    } else {
      setSplitBetween([...splitBetween, person]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amount
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Paid by
        </label>
        <select
          value={paidBy.id}
          onChange={(e) => setPaidBy(people.find(p => p.id === e.target.value)!)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {people.map(person => (
            <option key={person.id} value={person.id}>
              {person.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Split between
        </label>
        <div className="space-y-2">
          {people.map(person => (
            <label key={person.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={splitBetween.includes(person)}
                onChange={() => togglePerson(person)}
                className="rounded text-blue-500 focus:ring-blue-500"
              />
              <span>{person.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Split Type
        </label>
        <div className="flex space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="splitType"
              value="equal"
              checked={splitType === 'equal'}
              onChange={() => setSplitType('equal')}
              className="rounded text-blue-500 focus:ring-blue-500"
            />
            <span>Equal</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="splitType"
              value="unequal"
              checked={splitType === 'unequal'}
              onChange={() => setSplitType('unequal')}
              className="rounded text-blue-500 focus:ring-blue-500"
            />
            <span>Unequal</span>
          </label>
        </div>
      </div>

      {splitType === 'unequal' && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Custom Splits
          </label>
          <div className="space-y-2">
            {splitBetween.map(person => (
              <div key={person.id} className="flex items-center space-x-2">
                <span>{person.name}:</span>
                <input
                  type="number"
                  value={customSplits[person.id] || ''}
                  onChange={(e) => setCustomSplits({ ...customSplits, [person.id]: parseFloat(e.target.value) })}
                  className="w-24 px-2 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex space-x-3 pt-4">
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
  );
};

export default ExpenseForm; 