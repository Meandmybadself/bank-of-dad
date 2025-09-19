import {LitElement, html, css} from 'https://cdn.jsdelivr.net/npm/lit@3.1.2/+esm';
import './components/login-page.js';
import './components/home-dashboard.js';
import './components/child-account.js';
import './components/interest-dialog.js';
import './components/profile-panel.js';
import {
  initializeAuth,
  verifyCredentials,
  openSession,
  isSessionActive,
  closeSession,
  getSessionDetails,
  updateCredentials,
  getCredentials
} from './services/auth-service.js';
import {
  initializeAccounts,
  listAccounts,
  getAccount,
  deposit,
  withdraw,
  applyInterest,
  resetData,
  estimateInterestPayouts,
  formatCurrency
} from './services/account-service.js';

class BankOfDadApp extends LitElement {
  static properties = {
    loggedIn: {type: Boolean},
    view: {type: String},
    selectedChildId: {type: String},
    accounts: {type: Array},
    loginError: {type: String},
    childError: {type: String},
    interestOpen: {type: Boolean},
    profileOpen: {type: Boolean},
    profileMessage: {type: String},
    profileError: {type: String},
    sessionStartedAt: {type: String},
    authUsername: {type: String},
    interestError: {type: String}
  };

  constructor() {
    super();
    this.loggedIn = false;
    this.view = 'dashboard';
    this.selectedChildId = '';
    this.accounts = [];
    this.loginError = '';
    this.childError = '';
    this.interestOpen = false;
    this.profileOpen = false;
    this.profileMessage = '';
    this.profileError = '';
    this.sessionStartedAt = '';
    this.authUsername = 'dad';
    this.interestError = '';
  }

  static styles = css`
    :host {
      display: block;
      min-height: 100vh;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    initializeAuth();
    initializeAccounts();
    const credentials = getCredentials();
    if (credentials?.username) {
      this.authUsername = credentials.username;
    }
    this.accounts = this.#loadAccounts();

    const active = isSessionActive();
    if (active) {
      this.loggedIn = true;
      const session = getSessionDetails();
      this.sessionStartedAt = session?.startedAt
        ? new Date(session.startedAt).toLocaleString()
        : new Date().toLocaleString();
    }
  }

  #loadAccounts() {
    const accounts = listAccounts();
    return accounts.sort((a, b) => a.name.localeCompare(b.name));
  }

  #refreshAccounts() {
    this.accounts = this.#loadAccounts();
  }

  #handleLoginAttempt(event) {
    const {username, password} = event.detail;
    const valid = verifyCredentials(username, password);
    if (!valid) {
      this.loginError = 'Invalid credentials. Try again.';
      return;
    }
    openSession(username);
    const session = getSessionDetails();
    this.sessionStartedAt = session?.startedAt
      ? new Date(session.startedAt).toLocaleString()
      : new Date().toLocaleString();
    this.loggedIn = true;
    this.loginError = '';
    this.authUsername = username;
    this.view = 'dashboard';
  }

  #handleLogout() {
    closeSession();
    this.loggedIn = false;
    this.view = 'dashboard';
    this.selectedChildId = '';
  }

  #handleViewAccount(event) {
    this.selectedChildId = event.detail.childId;
    this.childError = '';
    this.view = 'account';
  }

  #handleBackHome() {
    this.view = 'dashboard';
    this.selectedChildId = '';
    this.childError = '';
  }

  #handleDeposit(event) {
    const {childId, amount, memo} = event.detail;
    try {
      deposit(childId, amount, memo);
      this.childError = '';
      this.#refreshAccounts();
    } catch (error) {
      this.childError = error.message;
    }
  }

  #handleWithdraw(event) {
    const {childId, amount, memo} = event.detail;
    try {
      withdraw(childId, amount, memo);
      this.childError = '';
      this.#refreshAccounts();
    } catch (error) {
      this.childError = error.message;
    }
  }

  #handleInterestOpen() {
    this.interestOpen = true;
    this.interestError = '';
  }

  #handleInterestConfirm(event) {
    const {percentage, memo} = event.detail;
    try {
      const {total} = estimateInterestPayouts(percentage);
      if (total <= 0) {
        this.interestError = 'No interest to apply. Balances are currently zero.';
        return;
      }
      const confirmed = window.confirm(
        `Pay ${formatCurrency(total)} at ${percentage}% interest across all accounts?`
      );
      if (!confirmed) {
        return;
      }
      applyInterest(percentage, memo || 'Interest payment');
      this.interestOpen = false;
      this.interestError = '';
      this.#refreshAccounts();
    } catch (error) {
      this.interestError = error.message;
    }
  }

  #handleInterestClose() {
    this.interestOpen = false;
    this.interestError = '';
  }

  #handleProfileOpen() {
    const credentials = getCredentials();
    this.profileError = '';
    this.profileMessage = '';
    this.profileOpen = true;
    if (credentials?.username) {
      this.authUsername = credentials.username;
    }
  }

  #handleProfileClosed() {
    this.profileOpen = false;
    this.profileMessage = '';
    this.profileError = '';
  }

  #handleCredentialUpdate(event) {
    try {
      const {username, password} = event.detail;
      updateCredentials({username, password});
      this.profileMessage = 'Credentials updated.';
      this.profileError = '';
      this.authUsername = username;
    } catch (error) {
      this.profileError = error.message;
      this.profileMessage = '';
    }
  }

  #handleResetAccounts() {
    if (!window.confirm('Reset all account balances and history?')) {
      return;
    }
    resetData();
    this.#refreshAccounts();
    this.profileMessage = 'Accounts reset to zero.';
    this.profileError = '';
  }

  renderContent() {
    if (!this.loggedIn) {
      return html`<login-page
        .error=${this.loginError}
        @login-attempt=${this.#handleLoginAttempt}
      ></login-page>`;
    }

    if (this.view === 'account' && this.selectedChildId) {
      const account = getAccount(this.selectedChildId);
      return html`<child-account
        .account=${account}
        .error=${this.childError}
        @back-home=${this.#handleBackHome}
        @deposit-requested=${this.#handleDeposit}
        @withdraw-requested=${this.#handleWithdraw}
      ></child-account>`;
    }

    return html`<home-dashboard
      .accounts=${this.accounts}
      .lastLogin=${this.sessionStartedAt}
      @view-account=${this.#handleViewAccount}
      @open-interest=${this.#handleInterestOpen}
      @logout-requested=${this.#handleLogout}
      @open-profile=${this.#handleProfileOpen}
    ></home-dashboard>`;
  }

  render() {
    return html`
      ${this.renderContent()}
      <interest-dialog
        .open=${this.interestOpen}
        .accounts=${this.accounts}
        .error=${this.interestError}
        @interest-confirmed=${this.#handleInterestConfirm}
        @dialog-closed=${this.#handleInterestClose}
      ></interest-dialog>
      <profile-panel
        .open=${this.profileOpen}
        .username=${this.authUsername}
        .message=${this.profileMessage}
        .error=${this.profileError}
        @profile-closed=${this.#handleProfileClosed}
        @credentials-updated=${this.#handleCredentialUpdate}
        @accounts-reset=${this.#handleResetAccounts}
      ></profile-panel>
    `;
  }
}

customElements.define('bank-of-dad-app', BankOfDadApp);
