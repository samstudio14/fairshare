import { Person, Expense } from '../data/mockData';

export interface Balance {
  person: Person;    // person who owes
  creditor: Person;  // person who is owed
  amount: number;    // amount owed
}

export function calculateBalances(expenses: Expense[], primaryUser: Person): Balance[] {
  // Create a map to store debts between each pair of people
  const debts = new Map<string, Map<string, number>>();

  // Initialize the nested maps for all people
  expenses.forEach(expense => {
    const allPeople = new Set([expense.paidBy.id, ...expense.splitBetween.map(p => p.id)]);
    allPeople.forEach(personId => {
      if (!debts.has(personId)) {
        debts.set(personId, new Map());
      }
    });
  });

  // Calculate debts for each expense
  expenses.forEach(expense => {
    if (!expense.paidBy) return;
    
    const totalAmount = expense.amount;
    const customSplits = expense.customSplits || {};

    expense.splitBetween.forEach(person => {
      if (!person || person.id === expense.paidBy.id) return;
      
      // Calculate this person's share
      const personShare = customSplits[person.id] || (totalAmount / expense.splitBetween.length);
      
      // Update the debt: person owes to paidBy
      const personDebts = debts.get(person.id)!;
      const currentDebt = personDebts.get(expense.paidBy.id) || 0;
      personDebts.set(expense.paidBy.id, currentDebt + personShare);
    });
  });

  // Convert the nested maps to the Balance array format
  const balances: Balance[] = [];
  debts.forEach((personDebts, personId) => {
    personDebts.forEach((amount, creditorId) => {
      if (amount > 0) {
        const person = expenses.flatMap(e => [e.paidBy, ...e.splitBetween])
          .find(p => p && p.id === personId);
        const creditor = expenses.flatMap(e => [e.paidBy, ...e.splitBetween])
          .find(p => p && p.id === creditorId);
        
        if (person && creditor) {
          balances.push({
            person,
            creditor,
            amount: Number(amount.toFixed(2))
          });
        }
      }
    });
  });

  return balances;
}

export function simplifyDebts(balances: Balance[]): { from: Person; to: Person; amount: number }[] {
  // Create a map of net balances for each person
  const netBalances = new Map<string, number>();
  
  balances.forEach(balance => {
    // Add to debtor's balance (negative because they owe)
    netBalances.set(balance.person.id, 
      (netBalances.get(balance.person.id) || 0) - balance.amount);
    
    // Add to creditor's balance (positive because they are owed)
    netBalances.set(balance.creditor.id, 
      (netBalances.get(balance.creditor.id) || 0) + balance.amount);
  });

  const debtors = Array.from(netBalances.entries())
    .filter(([_, amount]) => amount < 0)
    .sort(([, a], [, b]) => a - b);
  
  const creditors = Array.from(netBalances.entries())
    .filter(([_, amount]) => amount > 0)
    .sort(([, a], [, b]) => b - a);

  const result: { from: Person; to: Person; amount: number }[] = [];
  
  let debtorIdx = 0;
  let creditorIdx = 0;

  while (debtorIdx < debtors.length && creditorIdx < creditors.length) {
    const [debtorId, debtorAmount] = debtors[debtorIdx];
    const [creditorId, creditorAmount] = creditors[creditorIdx];

    const debtor = balances.find(b => b.person.id === debtorId)?.person;
    const creditor = balances.find(b => b.creditor.id === creditorId)?.creditor;

    if (!debtor || !creditor) continue;

    const amount = Math.min(-debtorAmount, creditorAmount);
    
    if (amount > 0) {
      result.push({
        from: debtor,
        to: creditor,
        amount: Number(amount.toFixed(2))
      });
    }

    debtors[debtorIdx] = [debtorId, debtorAmount + amount];
    creditors[creditorIdx] = [creditorId, creditorAmount - amount];

    if (debtors[debtorIdx][1] === 0) debtorIdx++;
    if (creditors[creditorIdx][1] === 0) creditorIdx++;
  }

  return result;
} 