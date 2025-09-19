import {LitElement, html, css} from 'https://cdn.jsdelivr.net/npm/lit@3.1.2/+esm';

export class ProfilePanel extends LitElement {
  static properties = {
    open: {type: Boolean, reflect: true},
    username: {type: String},
    message: {type: String},
    error: {type: String}
  };

  constructor() {
    super();
    this.open = false;
    this.username = '';
    this.message = '';
    this.error = '';
  }

  static styles = css`
    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.45);
      display: none;
      align-items: stretch;
      justify-content: flex-end;
      z-index: 20;
    }

    :host([open]) .overlay {
      display: flex;
    }

    aside {
      width: min(360px, 90vw);
      background: var(--color-surface, #fff);
      padding: 2rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      box-shadow: -8px 0 24px rgba(15, 23, 42, 0.18);
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .banner {
      border-radius: var(--radius-md);
      padding: 0.85rem 1rem;
      font-size: 0.95rem;
    }

    .banner.success {
      background: rgba(22, 163, 74, 0.14);
      color: var(--color-success, #16a34a);
    }

    .banner.error {
      background: rgba(220, 38, 38, 0.14);
      color: var(--color-danger, #dc2626);
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
  `;

  updated(changed) {
    if (changed.has('message') && this.message) {
      const form = this.shadowRoot.querySelector('form');
      if (form) {
        form.reset();
        const usernameInput = form.querySelector('input[name="username"]');
        if (usernameInput) {
          usernameInput.value = this.username;
        }
      }
    }
    if (changed.has('username') && this.username) {
      const input = this.shadowRoot.querySelector('input[name="username"]');
      if (input) {
        input.value = this.username;
      }
    }
  }

  #handleClose() {
    this.dispatchEvent(
      new CustomEvent('profile-closed', {
        bubbles: true,
        composed: true
      })
    );
  }

  #handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = String(formData.get('username') || '').trim();
    const password = String(formData.get('password') || '').trim();
    const confirm = String(formData.get('confirmPassword') || '').trim();

    if (!username || !password) {
      this.error = 'Username and password are required.';
      this.message = '';
      return;
    }

    if (password !== confirm) {
      this.error = 'Passwords do not match.';
      this.message = '';
      return;
    }

    this.error = '';
    this.dispatchEvent(
      new CustomEvent('credentials-updated', {
        detail: {username, password},
        bubbles: true,
        composed: true
      })
    );
  }

  #handleReset() {
    this.dispatchEvent(
      new CustomEvent('accounts-reset', {
        bubbles: true,
        composed: true
      })
    );
  }

  render() {
    return html`
      <div class="overlay" @click=${this.#handleClose}>
        <aside @click=${(event) => event.stopPropagation()}>
          <header>
            <h2>Profile &amp; Settings ⚙️</h2>
            <button type="button" class="secondary" @click=${this.#handleClose}>Close ✖️</button>
          </header>
          <p>Update credentials and manage account data for your household bank.</p>
          ${this.message
            ? html`<div class="banner success">${this.message}</div>`
            : null}
          ${this.error ? html`<div class="banner error">${this.error}</div>` : null}
          <section>
            <h3>Change credentials 🔑</h3>
            <form @submit=${this.#handleSubmit}>
              <label>
                Username
                <input type="text" name="username" .value=${this.username} required />
              </label>
              <label>
                New password
                <input type="password" name="password" required minlength="4" />
              </label>
              <label>
                Confirm password
                <input type="password" name="confirmPassword" required minlength="4" />
              </label>
              <button type="submit">Save changes 💾</button>
            </form>
          </section>
          <section>
            <h3>Housekeeping 🧹</h3>
            <p>Reset all balances and history back to zero. This cannot be undone.</p>
            <button type="button" class="danger" @click=${this.#handleReset}>Reset accounts ♻️</button>
          </section>
        </aside>
      </div>
    `;
  }
}

customElements.define('profile-panel', ProfilePanel);
