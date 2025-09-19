import {LitElement, html, css} from 'https://cdn.jsdelivr.net/npm/lit@3.1.2/+esm';
import {buttonStyles, formStyles} from '../styles/shared-styles.js';

export class InterestDialog extends LitElement {
  static properties = {
    open: {type: Boolean, reflect: true},
    accounts: {type: Array},
    error: {type: String}
  };

  constructor() {
    super();
    this.open = false;
    this.accounts = [];
    this.error = '';
  }

  static styles = [buttonStyles, formStyles, css`
    dialog {
      border: none;
      border-radius: 16px;
      padding: 0;
      box-shadow: var(--shadow-sm, 0 16px 40px rgba(15, 23, 42, 0.22));
      width: min(520px, 92vw);
      overflow: hidden;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      padding: 2rem;
      background: var(--color-surface, #fff);
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .error {
      border-radius: var(--radius-md);
      background: rgba(220, 38, 38, 0.12);
      color: var(--color-danger, #dc2626);
      padding: 0.75rem 1rem;
    }

    footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }
  `];

  updated(changes) {
    if (changes.has('open')) {
      const dialog = this.shadowRoot.querySelector('dialog');
      if (!dialog) {
        return;
      }
      if (this.open && !dialog.open) {
        this.error = '';
        const form = this.shadowRoot.querySelector('form');
        if (form) {
          form.reset();
        }
        dialog.showModal();
      } else if (!this.open && dialog.open) {
        dialog.close();
      }
    }
  }

  #handleDialogClose(event) {
    if (this.open) {
      this.dispatchEvent(new CustomEvent('dialog-closed', {bubbles: true, composed: true}));
    }
  }

  #handleCancel(event) {
    event.preventDefault();
    this.dispatchEvent(new CustomEvent('dialog-closed', {bubbles: true, composed: true}));
  }

  #handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const percentageValue = formData.get('percentage');
    const percentage = Number.parseFloat(percentageValue);
    if (!Number.isFinite(percentage) || percentage <= 0) {
      this.error = 'Enter an interest percentage greater than zero.';
      return;
    }
    const memo = String(formData.get('memo') || '');
    this.error = '';
    this.dispatchEvent(
      new CustomEvent('interest-confirmed', {
        detail: {percentage, memo},
        bubbles: true,
        composed: true
      })
    );
  }

  render() {
    return html`
      <dialog @close=${this.#handleDialogClose}>
        <form @submit=${this.#handleSubmit}>
          <header>
            <h2>Pay interest 💰</h2>
            <button type="button" class="secondary" @click=${this.#handleCancel}>
              Cancel
            </button>
          </header>
          <p>
            Apply a percentage-based boost 📈 to all
            ${this.accounts.length} ${this.accounts.length === 1 ? 'account' : 'accounts'} using
            their current balances.
          </p>
          <label>
            Interest rate (%)
            <input
              type="number"
              name="percentage"
              min="0.01"
              step="0.01"
              placeholder="e.g. 2.5"
              required
            />
          </label>
          <label>
            Memo (optional)
            <input type="text" name="memo" maxlength="80" placeholder="Interest for September" />
          </label>
          ${this.error ? html`<div class="error" role="alert">${this.error}</div>` : null}
          <footer>
            <button type="submit" class="success">Confirm interest 💸</button>
          </footer>
        </form>
      </dialog>
    `;
  }
}

customElements.define('interest-dialog', InterestDialog);
