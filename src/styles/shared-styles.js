import {css} from 'https://cdn.jsdelivr.net/npm/lit@3.1.2/+esm';

export const buttonStyles = css`
  button {
    font: inherit;
    border: none;
    cursor: pointer;
    border-radius: 12px;
    padding: 0.65rem 1.2rem;
    background: #2563eb;
    color: #fff;
    transition: background 0.2s ease, transform 0.2s ease;
  }

  button:hover {
    background: #1d4ed8;
    transform: translateY(-1px);
  }

  button.secondary {
    background: #1e293b;
  }

  button.success {
    background: #16a34a;
  }

  button.danger {
    background: #dc2626;
  }

  @media (max-width: 768px) {
    button {
      width: 100%;
      padding: 1rem 1.5rem;
      min-height: 48px;
      font-size: 1.1rem;
    }
  }
`;

export const formStyles = css`
  input, select, textarea {
    font: inherit;
    width: 100%;
    padding: 0.7rem 0.8rem;
    border-radius: 12px;
    border: 1px solid rgba(15, 23, 42, 0.12);
    background: #fff;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
`;