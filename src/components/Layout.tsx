import React, { useState, useEffect } from 'react';
import { Person, Group } from '../data/mockData';
import IOSButton from './ui/IOSButton';

interface LayoutProps {
  children: React.ReactNode;
  people: Person[];
  onAddPerson: (person: Omit<Person, 'id' | 'groupIds'>) => void;
  selectedGroup: Group | null;
}

const Layout: React.FC<LayoutProps> = ({ children, people, onAddPerson, selectedGroup }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAddingPerson, setIsAddingPerson] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference and localStorage on mount
    const darkModePreference = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedTheme = localStorage.getItem('theme');
    setIsDarkMode(storedTheme === 'dark' || (!storedTheme && darkModePreference));
  }, []);

  useEffect(() => {
    // Update document class and localStorage when theme changes
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleAddPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPersonName.trim()) return;

    onAddPerson({
      name: newPersonName.trim(),
    });

    setNewPersonName('');
    setIsAddingPerson(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 transition-colors duration-200">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed bottom-4 left-4 z-50 md:hidden bg-white dark:bg-dark-800 p-3 rounded-full shadow-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-200 ease-in-out z-30 w-72 bg-white dark:bg-dark-800 shadow-lg`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              {selectedGroup ? `${selectedGroup.name} Members` : 'People'}
            </h2>
            {selectedGroup && (
              <button
                onClick={() => setIsAddingPerson(true)}
                className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-dark-700 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            )}
          </div>

          {isAddingPerson && selectedGroup ? (
            <form onSubmit={handleAddPerson} className="mb-6">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newPersonName}
                  onChange={(e) => setNewPersonName(e.target.value)}
                  placeholder="Enter name"
                  className="flex-1 px-3 py-2 border-2 border-gray-200 dark:border-dark-600 rounded-lg focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors bg-white dark:bg-dark-700 text-gray-900 dark:text-gray-100"
                  autoFocus
                />
                <button
                  type="submit"
                  className="p-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </div>
            </form>
          ) : null}

          <div className="space-y-2">
            {people.map(person => (
              <div
                key={person.id}
                className="flex items-center p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-medium">
                  {person.name[0].toUpperCase()}
                </div>
                <span className="ml-3 text-gray-700 dark:text-gray-300">{person.name}</span>
              </div>
            ))}

            {selectedGroup && people.length === 0 && (
              <div className="text-center py-4">
                <p className="text-gray-500 dark:text-gray-400">No members yet</p>
                <button
                  onClick={() => setIsAddingPerson(true)}
                  className="mt-2 text-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  Add your first member
                </button>
              </div>
            )}

            {!selectedGroup && (
              <div className="text-center py-4">
                <p className="text-gray-500 dark:text-gray-400">Create or select a group first</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:pl-72 min-h-screen">
        <div className="max-w-4xl mx-auto p-6">
          {children}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout; 