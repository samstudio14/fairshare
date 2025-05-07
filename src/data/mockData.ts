export interface Person {
  id: string;
  name: string;
  groupIds: string[];  // Store group IDs instead of Group objects
}

export interface Group {
  id: string;
  name: string;
  memberIds: string[];  // Store member IDs instead of Person objects
  createdById: string;  // Store creator's ID instead of Person object
  createdAt: string;
}

export interface Expense {
  id: string;
  groupId: string;
  description: string;
  amount: number;
  date: string;
  paidById: string;  // Store payer's ID instead of Person object
  splitBetweenIds: string[];  // Store participant IDs instead of Person objects
  addedById: string;  // Store creator's ID instead of Person object
  customSplits?: { [key: string]: number };
}

// Initial empty arrays
export const initialPeople: Person[] = [];
export const initialGroups: Group[] = [];
export const initialExpenses: Expense[] = [];