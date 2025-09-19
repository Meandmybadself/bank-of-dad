import {LitElement, html, css} from 'https://cdn.jsdelivr.net/npm/lit@3.1.2/+esm';

export class LoginPage extends LitElement {
  static properties = {
    error: {type: String}
  };

  constructor() {
    super();
    this.error = '';
  }

  static styles = css`
    :host {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 2rem 1.5rem;
      background: linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(22, 163, 74, 0.12));
    }

    .panel {
      width: min(420px, 100%);
      background: var(--color-surface, #fff);
      border-radius: 20px;
      box-shadow: var(--shadow-sm, 0 10px 30px rgba(15, 23, 42, 0.12));
      padding: 2.5rem 2rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    h1 {
      margin: 0;
      font-size: 2rem;
    }

    .error {
      border-radius: var(--radius-md);
      padding: 0.9rem 1rem;
      background: rgba(220, 38, 38, 0.12);
      color: var(--color-danger, #dc2626);
    }

    label {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      font-weight: 500;
    }

    .field-label {
      font-size: 0.95rem;
      color: rgba(30, 41, 59, 0.85);
    }
  `;

  #handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = String(formData.get('username') || '').trim();
    const password = String(formData.get('password') || '').trim();

    if (!username || !password) {
      this.error = 'Enter both username and password.';
      return;
    }

    this.dispatchEvent(
      new CustomEvent('login-attempt', {
        detail: {username, password},
        bubbles: true,
        composed: true
      })
    );
  }

  render() {
    return html`
      <div class="panel">
        <h1>Bank of Dad 🏦</h1>
        ${this.error
          ? html`<div class="error" role="alert">${this.error}</div>`
          : null}
        <form @submit=${this.#handleSubmit} autocomplete="off">
          <label>
            <span class="field-label">Username</span>
            <input name="username" type="text" placeholder="dad" required />
          </label>
          <label>
            <span class="field-label">Password</span>
            <input name="password" type="password" required />
          </label>
          <button type="submit">Sign In 🔐</button>
        </form>
      </div>
    `;
  }
}

customElements.define('login-page', LoginPage);
