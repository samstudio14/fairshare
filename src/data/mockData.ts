export interface Person {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: Person;
  date: string;
  splitBetween: Person[];
  addedBy: Person;
  customSplits?: { [key: string]: number };
}

export const mockPeople: Person[] = [
  { id: '1', name: 'You' },
  { id: '2', name: 'Alex' },
  { id: '3', name: 'Sam' },
];

export const mockExpenses: Expense[] = [
  {
    id: '1',
    description: 'Dinner',
    amount: 90,
    paidBy: mockPeople[0],
    date: '2024-03-15',
    splitBetween: mockPeople,
    addedBy: mockPeople[0],
  },
  {
    id: '2',
    description: 'Movie Tickets',
    amount: 45,
    paidBy: mockPeople[1],
    date: '2024-03-14',
    splitBetween: mockPeople,
    addedBy: mockPeople[1],
  },
  {
    id: '3',
    description: 'Groceries',
    amount: 120,
    paidBy: mockPeople[2],
    date: '2024-03-13',
    splitBetween: mockPeople,
    addedBy: mockPeople[2],
  },
]; 