const ACCOUNT_KEY = 'bankOfDad_accounts';
const AUTH_KEY = 'bankOfDad_auth';

function read(key) {
  const raw = localStorage.getItem(key);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Failed to parse storage payload for', key, error);
    return null;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function ensureAuthSeed(defaults) {
  const existing = read(AUTH_KEY);
  if (!existing) {
    write(AUTH_KEY, defaults);
    return defaults;
  }
  return existing;
}

export function ensureAccountsSeed(seed) {
  const existing = read(ACCOUNT_KEY);
  if (!existing) {
    write(ACCOUNT_KEY, seed);
    return seed;
  }
  return existing;
}

export function getAuthRecord() {
  return read(AUTH_KEY);
}

export function setAuthRecord(record) {
  write(AUTH_KEY, record);
}

export function getAccountState() {
  return read(ACCOUNT_KEY) || {};
}

export function setAccountState(state) {
  write(ACCOUNT_KEY, state);
}
