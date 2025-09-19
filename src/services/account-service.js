import {ensureAccountsSeed, getAccountState, setAccountState} from './storage-service.js';

const DEFAULT_ACCOUNTS = {
  brooks: {
    childId: 'brooks',
    name: 'Brooks',
    balance: 0,
    transactions: []
  },
  charlie: {
    childId: 'charlie',
    name: 'Charlie',
    balance: 0,
    transactions: []
  },
  alexandra: {
    childId: 'alexandra',
    name: 'Alexandra',
    balance: 0,
    transactions: []
  }
};

function roundCurrency(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function parsePercentage(input) {
  const rate = Number.parseFloat(input);
  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error('Enter an interest percentage greater than zero.');
  }
  return rate;
}

function persist(state) {
  setAccountState(state);
  return state;
}

function createTransaction({type, amount, memo, balanceAfter}) {
  return {
    id: crypto.randomUUID ? crypto.randomUUID() : `${type}-${Date.now()}-${Math.random()}`,
    timestamp: new Date().toISOString(),
    type,
    amount: roundCurrency(amount),
    memo: memo?.trim() || '',
    balanceAfter: roundCurrency(balanceAfter)
  };
}

export function initializeAccounts() {
  return ensureAccountsSeed(DEFAULT_ACCOUNTS);
}

export function listAccounts() {
  const map = getAccountState();
  return Object.keys(map).map((key) => ({
    ...map[key],
    transactions: [...map[key].transactions]
  }));
}

export function getAccount(childId) {
  const map = getAccountState();
  const account = map[childId];
  if (!account) {
    return undefined;
  }
  return {
    ...account,
    transactions: [...account.transactions]
  };
}

export function deposit(childId, amount, memo = '') {
  const value = Number.parseFloat(amount);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error('Deposit amount must be greater than zero.');
  }
  const map = getAccountState();
  const account = map[childId];
  if (!account) {
    throw new Error('Account not found.');
  }
  const nextBalance = roundCurrency(account.balance + value);
  const transaction = createTransaction({
    type: 'deposit',
    amount: value,
    memo,
    balanceAfter: nextBalance
  });
  const nextTransactions = [transaction, ...account.transactions];
  map[childId] = {...account, balance: nextBalance, transactions: nextTransactions};
  persist(map);
  const updated = map[childId];
  return {
    ...updated,
    transactions: [...updated.transactions]
  };
}

export function withdraw(childId, amount, memo = '') {
  const value = Number.parseFloat(amount);
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error('Withdrawal amount must be greater than zero.');
  }
  const map = getAccountState();
  const account = map[childId];
  if (!account) {
    throw new Error('Account not found.');
  }
  if (value > account.balance) {
    throw new Error('Insufficient funds.');
  }
  const nextBalance = roundCurrency(account.balance - value);
  const transaction = createTransaction({
    type: 'withdrawal',
    amount: value,
    memo,
    balanceAfter: nextBalance
  });
  const nextTransactions = [transaction, ...account.transactions];
  map[childId] = {...account, balance: nextBalance, transactions: nextTransactions};
  persist(map);
  const updated = map[childId];
  return {
    ...updated,
    transactions: [...updated.transactions]
  };
}

export function estimateInterestPayouts(percentage) {
  const rate = parsePercentage(percentage);
  const map = getAccountState();
  const breakdown = {};
  let total = 0;
  Object.entries(map).forEach(([childId, account]) => {
    const payout = roundCurrency((Number(account.balance) || 0) * (rate / 100));
    if (payout > 0) {
      breakdown[childId] = {
        amount: payout,
        name: account.name
      };
      total += payout;
    }
  });
  return {
    total: roundCurrency(total),
    breakdown
  };
}

export function applyInterest(percentage, memo = 'Interest payment') {
  const {breakdown} = estimateInterestPayouts(percentage);
  if (!Object.keys(breakdown).length) {
    throw new Error('No interest due for current balances.');
  }
  const map = getAccountState();
  Object.entries(breakdown).forEach(([childId, info]) => {
    const account = map[childId];
    if (!account) {
      return;
    }
    const nextBalance = roundCurrency(account.balance + info.amount);
    const transaction = createTransaction({
      type: 'interest',
      amount: info.amount,
      memo,
      balanceAfter: nextBalance
    });
    const nextTransactions = [transaction, ...account.transactions];
    map[childId] = {...account, balance: nextBalance, transactions: nextTransactions};
  });
  persist(map);
  return listAccounts();
}

export function resetData() {
  const clone = JSON.parse(JSON.stringify(DEFAULT_ACCOUNTS));
  persist(clone);
  return listAccounts();
}

export function formatCurrency(value) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD'
  }).format(Number(value || 0));
}
