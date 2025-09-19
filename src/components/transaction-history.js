import {LitElement, html, css} from 'https://cdn.jsdelivr.net/npm/lit@3.1.2/+esm';
import {formatCurrency} from '../services/account-service.js';

const TYPE_LABELS = {
  deposit: 'Deposit ➕',
  withdrawal: 'Withdrawal ➖',
  interest: 'Interest 💰'
};

export class TransactionHistory extends LitElement {
  static properties = {
    transactions: {type: Array}
  };

  constructor() {
    super();
    this.transactions = [];
  }

  static styles = css`
    :host {
      display: block;
    }

    ul {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-height: 420px;
      overflow-y: auto;
      padding-right: 0.25rem;
    }

    li {
      background: var(--color-surface, #fff);
      border-radius: 16px;
      padding: 1rem 1.25rem;
      box-shadow: var(--shadow-sm, 0 6px 18px rgba(15, 23, 42, 0.08));
      display: grid;
      gap: 0.25rem;
    }

    .heading {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.75rem;
      font-weight: 600;
    }

    .timestamp {
      font-size: 0.9rem;
      color: rgba(30, 41, 59, 0.65);
    }

    .memo {
      font-size: 0.9rem;
      color: rgba(30, 41, 59, 0.75);
    }

    .empty {
      padding: 2rem;
      text-align: center;
      color: rgba(30, 41, 59, 0.65);
      background: rgba(37, 99, 235, 0.08);
      border-radius: 16px;
    }
  `;

  render() {
    if (!this.transactions.length) {
      return html`<div class="empty">No transactions yet 🤷‍♂️. Record a deposit to get started.</div>`;
    }

    return html`
      <ul>
        ${this.transactions.map((txn) => {
          const amountSign = txn.type === 'withdrawal' ? '-' : '+';
          const amountColor = txn.type === 'withdrawal' ? 'var(--color-danger)' : 'var(--color-success)';
          return html`
            <li>
              <div class="heading">
                <span>${TYPE_LABELS[txn.type] || txn.type}</span>
                <span style="color: ${amountColor};">${amountSign}${formatCurrency(txn.amount)}</span>
              </div>
              <div class="timestamp">${new Date(txn.timestamp).toLocaleString()}</div>
              <div class="memo">Balance: ${formatCurrency(txn.balanceAfter)}${txn.memo ? ` · ${txn.memo}` : ''}</div>
            </li>
          `;
        })}
      </ul>
    `;
  }
}

customElements.define('transaction-history', TransactionHistory);
