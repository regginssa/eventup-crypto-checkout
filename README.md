# Mini Crypto Checkout Based On Charlie Unicorn AI (Frontend)

A lightweight React/Vite frontend for the Mini Charlie Crypto Checkout dApp. It lets users select a cryptocurrency, enter an amount, view a QR code, and follow a transaction status – all using on-chain data via the app’s API.

---

## 🚀 Project Overview

This repository contains the **frontend** for Charlie’s checkout experience.

- **Purpose**: provide a clean, mobile-friendly UI that connects to the backend APIs for addresses, transactions, and web3 interactions.
- **How it works**:
  1. User picks a token and amount.
  2. App requests a payment address from the backend.
  3. A QR is shown; user pays from their wallet.
  4. The frontend polls transaction status until confirmation.
  5. Status updates (pending, success, failure) are displayed in real time.

> The backend lives in a separate repo; this repo only handles the client-side portion.

---

## 🗂️ Repository Structure

```
├── public/              Static assets (icons, robots.txt)
└── src/
    ├── abis/             Contract ABIs (ERC20, etc.)
    ├── api/              REST clients for address, tx, web3, shared client
    ├── assets/           Images & styles
    ├── components/       Re-usable UI/blocks (+ shadcn-ui wrappers)
    │   ├── providers/    Context providers (Appkit, etc.)
    │   └── ui/           shadcn-ui components (button, input, etc.)
    ├── hooks/            Custom hooks (use-ether, use-solana, etc.)
    ├── lib/              Utility functions
    ├── pages/            Route components (Index, 404)
    ├── test/             Vitest setup & example tests
    └── types/            Shared TypeScript interfaces
```

---

## 🛠️ Getting Started

### Prerequisites

- Node.js (>=16) and npm/yarn/pnpm
- Git

### Installation

```bash
git clone <YOUR_GIT_URL>
cd frontend
npm install      # or yarn / pnpm
```

### Development

```bash
npm run dev       # starts Vite dev server at http://localhost:5173
```

The app auto-reloads on file changes.

### Testing

```bash
npm run test      # runs Vitest unit tests
```

### Build & Preview

```bash
npm run build     # produces optimized `dist/`
npm run preview   # serve the production build locally
```

---

## 🧩 Key Technologies

- **Vite** – fast build and dev experience
- **React + TypeScript** – UI & type safety
- **Tailwind CSS** – utility-first styling
- **shadcn-ui** – design system components
- **Vitest** – unit testing framework

---

## 🔗 Deployment

Deploy by building the project and hosting the `dist` folder on any static-file server or through your chosen platform (Netlify, Vercel, static S3, etc.).  
If you’re using Lovable, simply publish from the dashboard.

---

## 📜 Notes

- API base URL is configured in `src/api/client.ts` (can be swapped for staging/production).
- Wallet support currently includes Ethereum (EVM) and Solana via custom hooks.
- Add or update tokens by editing `src/abis` and adjusting the selectors/hooks accordingly.

---

Feel free to expand this README with additional sections (e.g. Contributing, FAQ) as the project grows.

Happy coding! 🎉
