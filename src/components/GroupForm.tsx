import React, { useState } from 'react';
import { Group } from '../data/mockData';
import IOSButton from './ui/IOSButton';

interface GroupFormProps {
  onSubmit: (group: Pick<Group, 'name'>) => void;
  onCancel: () => void;
  isOpen: boolean;
  currentUserGroups: Group[];
}

const GroupForm: React.FC<GroupFormProps> = ({ onSubmit, onCancel, isOpen, currentUserGroups }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate group limit
    if (currentUserGroups.length >= 3) {
      setError('You can only create up to 3 groups');
      return;
    }

    // Validate group name
    if (!name.trim()) {
      setError('Please enter a group name');
      return;
    }

    // Clear any previous errors
    setError(null);

    // Create the group
    onSubmit({
      name: name.trim(),
    });

    // Reset form
    setName('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 overflow-y-auto">
      <div className="min-h-screen px-4 text-center">
        <div className="fixed inset-0" onClick={onCancel} />
        
        <div className="inline-block w-full max-w-md my-8 text-left align-middle">
          <div className="bg-white dark:bg-dark-800 rounded-xl shadow-xl transform transition-all">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-dark-700">
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Create New Group</h2>
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
                {error && (
                  <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Group Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border-2 border-gray-200 dark:border-dark-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                    placeholder="Enter group name"
                    maxLength={50}
                  />
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400">
                  You can add members to your group after creating it.
                </div>
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
                  Create Group
                </IOSButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupForm; 