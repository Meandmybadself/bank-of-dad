import {LitElement, html, css} from 'https://cdn.jsdelivr.net/npm/lit@3.1.2/+esm';
import {formatCurrency} from '../services/account-service.js';
import {buttonStyles} from '../styles/shared-styles.js';

export class HomeDashboard extends LitElement {
  static properties = {
    accounts: {type: Array},
    lastLogin: {type: String}
  };

  constructor() {
    super();
    this.accounts = [];
    this.lastLogin = '';
  }

  static styles = [buttonStyles, css`
    :host {
      display: block;
      padding: 2.5rem clamp(1rem, 4vw, 4rem);
      max-width: 1100px;
      margin: 0 auto;
    }

    header {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .grid {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
    }

    .card {
      background: var(--color-surface, #fff);
      border-radius: 20px;
      padding: 1.75rem;
      box-shadow: var(--shadow-sm, 0 8px 24px rgba(15, 23, 42, 0.1));
      display: flex;
      flex-direction: column;
      gap: 1.1rem;
      transition: transform var(--transition-fast, 0.2s ease);
    }

    .card:hover {
      transform: translateY(-4px);
    }

    .balance {
      font-size: clamp(1.6rem, 3vw, 2.2rem);
      font-weight: 600;
      color: var(--color-text);
    }

    .meta {
      display: flex;
      justify-content: space-between;
      color: rgba(30, 41, 59, 0.7);
      font-size: 0.95rem;
    }

    .empty-state {
      background: rgba(37, 99, 235, 0.08);
      border-radius: 20px;
      padding: 2rem;
      text-align: center;
      color: rgba(30, 41, 59, 0.78);
    }
  `];

  #handleView(childId) {
    this.dispatchEvent(
      new CustomEvent('view-account', {
        detail: {childId},
        bubbles: true,
        composed: true
      })
    );
  }

  #handleInterest() {
    this.dispatchEvent(
      new CustomEvent('open-interest', {
        bubbles: true,
        composed: true
      })
    );
  }

  #handleLogout() {
    this.dispatchEvent(
      new CustomEvent('logout-requested', {
        bubbles: true,
        composed: true
      })
    );
  }

  #handleProfile() {
    this.dispatchEvent(
      new CustomEvent('open-profile', {
        bubbles: true,
        composed: true
      })
    );
  }

  renderCard(account) {
    const [latest] = account.transactions;
    return html`
      <article class="card">
        <div>
          <h2>${account.name}</h2>
          <div class="balance">${formatCurrency(account.balance)}</div>
        </div>
        <div class="meta">
          <span>${account.transactions.length} transactions</span>
          <span>
            ${latest
              ? html`Last: ${latest.type} · ${formatCurrency(latest.amount)}`
              : html`No activity yet`}
          </span>
        </div>
        <button class="secondary" @click=${() => this.#handleView(account.childId)}>
          View account 👀
        </button>
      </article>
    `;
  }

  render() {
    const total = this.accounts.reduce((sum, account) => sum + Number(account.balance || 0), 0);
    return html`
      <header>
        <div>
          <h1>Family Dashboard 👨‍👩‍👧‍👦</h1>
          ${this.lastLogin
            ? html`<p>Session started ${this.lastLogin}</p>`
            : null}
          <p>Total on deposit 💵: <strong>${formatCurrency(total)}</strong></p>
        </div>
        <div class="actions">
          <button class="secondary" @click=${this.#handleProfile}>Profile ⚙️</button>
          <button class="success" @click=${this.#handleInterest}>Pay Interest 💰</button>
          <button class="danger" @click=${this.#handleLogout}>Log out 🚪</button>
        </div>
      </header>
      ${this.accounts.length
        ? html`<section class="grid">${this.accounts.map((account) => this.renderCard(account))}</section>`
        : html`<div class="empty-state">
            No accounts yet. Add a child account from the profile panel to get started.
          </div>`}
    `;
  }
}

customElements.define('home-dashboard', HomeDashboard);
