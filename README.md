# FinSet Frontend

Personal and collaborative finance application built with Next.js 16, TypeScript, and Tailwind CSS.

- Git Repo: https://github.com/sophavattey/expense-tracking-frontend
- Deploy: https://finset-app.vercel.app

---

## Table of Contents

- [FinSet Frontend](#finset-frontend)
  - [Table of Contents](#table-of-contents)
  - [Prerequisites](#prerequisites)
  - [Local Development](#local-development)
  - [Environment Variables](#environment-variables)
  - [Project Structure](#project-structure)
  - [Features](#features)
  - [Available Scripts](#available-scripts)
  - [Caching](#caching)
  - [Deployment](#deployment)
    - [Vercel](#vercel)
    - [Build Command](#build-command)
    - [Output Directory](#output-directory)
  - [Google OAuth2 Setup](#google-oauth2-setup)
    - [localhost](#localhost)
    - [production](#production)

---

## Prerequisites

- Node.js 18 or higher
- npm 9 or higher

---

## Local Development

```bash
# Clone the repository
git clone https://github.com/sophavattey/expense-tracking-frontend

# go to the file
cd expense-tracking-frontend

# Install dependencies
npm install

# Create environment file
cp .env
# Edit .env with your values

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`.

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Backend API URL for local development
NEXT_PUBLIC_API_URL=http://localhost:8080

# Backend URL used by Next.js proxy rewrites (production only)
BACKEND_URL=https://your-app.onrender.com
```

> For production deployment on Vercel, set `BACKEND_URL` in the Vercel project settings under Settings > Environment Variables. `NEXT_PUBLIC_API_URL` is not required in production since all requests are proxied through Vercel.

---

## Project Structure

```
src/
  app/
    (auth)/             Login and signup pages
    dashboard/          Protected dashboard pages and layout
    join/               Group invite acceptance page
    offline/            PWA offline fallback page
  components/
    dashboard/          Sidebar, header, navigation items
    expenses/           Expense modal and form
  contexts/
    AuthContext.tsx     Authentication state and JWT management
    GroupContext.tsx     Active context switching (personal vs group)
  hooks/
    useBudgets.ts       Budget data fetching with caching
    useCategories.ts    Category data fetching with caching
    useExpenses.ts      Expense data fetching with caching
    useGroups.ts        Group data fetching with caching
    useNotifications.ts Notification polling
  lib/
    cache.ts            In-memory TTL cache for API responses
  services/
    api-client.ts       Base fetch wrapper with 401 refresh handling
    auth.service.ts     Authentication API calls
    budget.service.ts   Budget API calls
    expense.service.ts  Expense API calls
    group.service.ts    Group API calls
  types/                TypeScript type definitions
```

---

## Features

- Personal expense tracking with category and payment method classification
- Group finance management with shared budgets and member contribution tracking
- Budget progress monitoring with daily, weekly, and monthly periods
- Multi-currency support for USD and KHR
- Google OAuth2 and email/password authentication
- Real-time data synchronization via 10-second polling
- In-browser notification panel for budget alerts and group activity
- Progressive Web App with offline fallback page
- Context switching between personal and group financial views
- In-memory client-side caching to eliminate navigation reload flash

---

## Available Scripts

```bash
npm run dev       # Start development server (webpack, no Turbopack)
npm run build     # Create production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

> Do not use `--turbopack` with the dev script. Next.js rewrites required for the API proxy are not supported by Turbopack.

---

## Caching

The `src/lib/cache.ts` module provides an in-memory key-value store with TTL expiry. It prevents redundant API calls when navigating between pages that share the same data.

| Data        | TTL         |
|-------------|-------------|
| Expenses    | 25 seconds  |
| Budgets     | 25 seconds  |
| Groups      | 25 seconds  |
| Categories  | 120 seconds |

Cache entries are invalidated immediately on any mutation (create, update, delete).

---

## Deployment

### Vercel

1. Connect the repository to a Vercel project.
2. Set the following environment variable in Vercel project settings:

```
BACKEND_URL=https://your-app.onrender.com
```

3. Vercel will build and deploy automatically on each push to the main branch.

The `next.config.ts` rewrites proxy all `/api/*`, `/oauth2/*`, and `/login/oauth2/*` requests through Vercel to the backend. This ensures authentication cookies are treated as first-party by mobile browsers.

### Build Command

```bash
npm run build
```

### Output Directory

`.next`

---

## Google OAuth2 Setup

In [Google Cloud Console](https://console.cloud.google.com), add the following to your OAuth 2.0 client:

### localhost
- **Authorized JavaScript Origins:** `http://localhost:3000`
- **Authorized Redirect URIs:** `http://localhost:8080/oauth2/callback/google`
### production
- **Authorized JavaScript Origins:** `https://your-app.vercel.app`
- **Authorized Redirect URIs:** `https://your-app.onrender.com/oauth2/callback/google`