# Financial Report AI

AI-powered financial report generator. Processes company/financial documents and produces structured equity research reports via a Node.js API.

## Getting Started

### Requirements

- Node.js 22.x LTS
- pnpm
- Git

```bash
node -v
pnpm -v
git --version
```

### Clone & Install

```bash
git clone https://github.com/guptadeepak8/financial-report-ai
cd financial-report-ai
pnpm install
```

### Environment Variables

Change `.env.example` to  `.env` in both Client & Server :

**Getting a Gemini API key:**

1. Go to [Google AI Studio](https://aistudio.google.com/apikey).
2. Sign in with a Google account.
3. Click **Create API key**, select or create a Google Cloud project.
4. Copy the generated key.
5. Paste it into `apps/server/.env` as `GEMINI_API_KEY=your-key-here`.

---

## Running the Project

The client and server are run **separately**, each from its own directory.

### Run the Backend

```bash
cd apps/server
pnpm install
```

### Playwright / Chromium Setup

Required once per server environment:

```bash
cd apps/server
pnpm exec playwright install --with-deps chromium
```

Verify install:

```bash
pnpm exec playwright install --list
pnpm exec playwright --version
```

Browser binaries are cached at `~/.cache/ms-playwright`. Only Chromium is needed for this project.

run:

```bash
pnpm run dev
```

Compiled output runs from `dist/index.js`.

Go to Health check: `http://localhost:5000/api/v1/health` → `{ "status": "ok" }`

### Run the Frontend

```bash
cd apps/client
pnpm install
pnpm dev
```

Runs on `http://localhost:3000` by default.

---

## Project Overview

Monorepo with two apps:

```
financial-report-ai/
├── apps/
│   ├── client/   # Next.js frontend
│   └── server/   # Express API backend
```

**Frontend:** React / Next.js, TypeScript, Tailwind CSS.

**Backend:** Node.js, Express, TypeScript, Zod for validation, Playwright + Chromium for PDF rendering.

**Deployment:** Ubuntu on AWS EC2, PM2 process manager, Nginx reverse proxy, GitHub Actions CI/CD.

### CORS

The API only accepts requests from the origin set in `CLIENT_URL`. In production, set this to the deployed frontend URL — not localhost.
