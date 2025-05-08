import React from 'react';
import { Group } from '../data/mockData';
import IOSButton from './ui/IOSButton';

interface GroupListProps {
  groups: Group[];
  onCreateGroup: () => void;
  onSelectGroup: (group: Group) => void;
  selectedGroup: Group | null;
}

const GroupList: React.FC<GroupListProps> = ({ groups, onCreateGroup, onSelectGroup, selectedGroup }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Your Groups</h2>
        {groups.length < 3 && (
          <IOSButton
            onClick={onCreateGroup}
            variant="secondary"
            className="text-sm px-3 py-1"
          >
            Create Group
          </IOSButton>
        )}
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-dark-700 rounded-xl">
          <div className="w-12 h-12 bg-gray-100 dark:bg-dark-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <p className="text-gray-500 dark:text-gray-400">No groups created yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {groups.map(group => (
            <button
              key={group.id}
              onClick={() => onSelectGroup(group)}
              className={`w-full p-4 rounded-xl text-left transition-colors ${
                selectedGroup?.id === group.id
                  ? 'bg-primary-50 dark:bg-primary-900/30 border-2 border-primary-500 dark:border-primary-400'
                  : 'bg-gray-50 dark:bg-dark-700 hover:bg-gray-100 dark:hover:bg-dark-600'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-gray-100">{group.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {group.memberIds.length} member{group.memberIds.length !== 1 ? 's' : ''}
                  </p>
                </div>
                {selectedGroup?.id === group.id && (
                  <div className="w-2 h-2 rounded-full bg-primary-500 dark:bg-primary-400" />
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default GroupList; 