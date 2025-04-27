## Secure Password Vault

This is a React application built using [Vite](https://vitejs.dev/). Vite offers a rapid development experience and optimized builds for production.

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (version 14 or higher is recommended)
* npm or yarn or pnpm

### Installation

1.  **Clone the repository:**
    ```sh
    git clone <repository-url>
    ```
2.  **Install dependencies:**

    Using npm:
    ```sh
    npm install
    ```

    Using yarn:
    ```sh
    yarn install
    ```

    Using pnpm:
    ```sh
    pnpm install
    ```

### Environment Setup

Create a `.env` file in the root directory and configure your Firebase project variables:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```
**Remember to replace the placeholder values with your actual Firebase project credentials.**

## Development Server

To start the development server, run one of the following commands in your terminal:

### Using npm:

```bash
npm run dev
```
### Using pnpm:

```bash
pnpm run dev
```
### Using yarn:

```bash
yarn run dev
```

### Project Structure
```
project-root/
├── node_modules/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── App.jsx
│   └── main.jsx
├── .env
├── .gitignore
├── index.html
├── package.json
├── pnpm-lock.yaml   # If using pnpm
├── yarn.lock       # If using yarn
├── vite.config.js
└── README.md
```
