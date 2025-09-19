import {LitElement, html, css} from 'https://cdn.jsdelivr.net/npm/lit@3.1.2/+esm';
import {formatCurrency} from '../services/account-service.js';
import './transaction-history.js';

export class ChildAccount extends LitElement {
  static properties = {
    account: {type: Object},
    error: {type: String}
  };

  constructor() {
    super();
    this.account = null;
    this.error = '';
  }

  static styles = css`
    :host {
      display: block;
      padding: 2rem clamp(1rem, 4vw, 4rem);
      max-width: 960px;
      margin: 0 auto;
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .balance-card {
      background: var(--color-surface, #fff);
      border-radius: 24px;
      padding: 2rem;
      box-shadow: var(--shadow-sm, 0 12px 28px rgba(15, 23, 42, 0.1));
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 2rem;
    }

    .balance {
      font-size: clamp(2rem, 4vw, 2.8rem);
      font-weight: 600;
    }

    .forms {
      display: grid;
      gap: 1.5rem;
      grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
      margin-bottom: 2rem;
    }

    .panel {
      background: var(--color-surface, #fff);
      border-radius: 20px;
      padding: 1.5rem;
      box-shadow: var(--shadow-sm, 0 8px 22px rgba(15, 23, 42, 0.08));
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .panel h3 {
      margin: 0;
    }

    .error {
      border-radius: var(--radius-md);
      background: rgba(220, 38, 38, 0.12);
      color: var(--color-danger, #dc2626);
      padding: 0.9rem 1rem;
      margin-bottom: 1.5rem;
    }
  `;

  #emitBack() {
    this.dispatchEvent(
      new CustomEvent('back-home', {bubbles: true, composed: true})
    );
  }

  #handleDeposit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const amount = formData.get('amount');
    const memo = formData.get('memo');
    this.dispatchEvent(
      new CustomEvent('deposit-requested', {
        detail: {childId: this.account.childId, amount, memo},
        bubbles: true,
        composed: true
      })
    );
    event.currentTarget.reset();
  }

  #handleWithdraw(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const amount = formData.get('amount');
    const memo = formData.get('memo');
    this.dispatchEvent(
      new CustomEvent('withdraw-requested', {
        detail: {childId: this.account.childId, amount, memo},
        bubbles: true,
        composed: true
      })
    );
    event.currentTarget.reset();
  }

  render() {
    if (!this.account) {
      return html`<p>Account not found.</p>`;
    }

    return html`
      <header>
        <button class="secondary" @click=${this.#emitBack}>← Back to dashboard</button>
        <h1>${this.account.name}'s account 💼</h1>
      </header>
      <section class="balance-card">
        <span>Current balance 💳</span>
        <span class="balance">${formatCurrency(this.account.balance)}</span>
        <span>${this.account.transactions.length} historical transactions 📜</span>
      </section>
      ${this.error ? html`<div class="error" role="alert">${this.error}</div>` : null}
      <section class="forms">
        <article class="panel">
          <h3>Deposit ➕</h3>
          <form @submit=${this.#handleDeposit}>
            <label>
              Amount
              <input type="number" name="amount" min="0.01" step="0.01" required />
            </label>
            <label>
              Memo (optional)
              <input type="text" name="memo" maxlength="80" />
            </label>
            <button type="submit" class="success">Deposit funds 💵</button>
          </form>
        </article>
        <article class="panel">
          <h3>Withdraw ➖</h3>
          <form @submit=${this.#handleWithdraw}>
            <label>
              Amount
              <input type="number" name="amount" min="0.01" step="0.01" required />
            </label>
            <label>
              Memo (optional)
              <input type="text" name="memo" maxlength="80" />
            </label>
            <button type="submit" class="danger">Withdraw funds 💸</button>
          </form>
        </article>
      </section>
      <section>
        <h2>Transaction history 🧾</h2>
        <transaction-history .transactions=${this.account.transactions}></transaction-history>
      </section>
    `;
  }
}

customElements.define('child-account', ChildAccount);
