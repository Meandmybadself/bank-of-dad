import {ensureAuthSeed, getAuthRecord, setAuthRecord} from './storage-service.js';

const SESSION_KEY = 'bankOfDad_session';
const DEFAULT_USERNAME = 'dad';
const DEFAULT_PASSWORD = 'bank-of-dad';

function simpleHash(value) {
  return btoa(unescape(encodeURIComponent(value)));
}

export function initializeAuth() {
  return ensureAuthSeed({
    username: DEFAULT_USERNAME,
    passwordHash: simpleHash(DEFAULT_PASSWORD)
  });
}

export function verifyCredentials(username, password) {
  const auth = getAuthRecord();
  if (!auth) {
    return false;
  }
  return auth.username === username && auth.passwordHash === simpleHash(password);
}

export function getCredentials() {
  return getAuthRecord();
}

export function updateCredentials({username, password}) {
  const next = {
    username: username.trim() || DEFAULT_USERNAME,
    passwordHash: simpleHash(password)
  };
  setAuthRecord(next);
  return next;
}

export function openSession(username) {
  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify({username, startedAt: new Date().toISOString()})
  );
}

export function isSessionActive() {
  return Boolean(sessionStorage.getItem(SESSION_KEY));
}

export function getSessionDetails() {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn('Failed to parse session data', error);
    return null;
  }
}

export function closeSession() {
  sessionStorage.removeItem(SESSION_KEY);
}
