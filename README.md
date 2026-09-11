# ThreadBoss Web v5

Frontend shell for the ThreadBoss hackathon project.

## Stack
- Next.js App Router + TypeScript
- React Three Fiber / Three.js
- lucide-react
- qrcode.react

## Product surfaces
- Landing page with a 3D thread/context visualization
- Sign in / sign up shell
- Channel onboarding for WhatsApp, Telegram, and Slack
- Workspace dashboard with channel state, agent pulse, filters, and metrics
- Backend-ready API abstraction in `src/lib/api.ts`

## Backend boundary
The browser must not contain Gemini, Groq, Cloudflare, Slack bot, Telegram bot, or channel API secrets. The website talks to the central ThreadBoss backend only.

Set `NEXT_PUBLIC_API_URL` to the central backend base URL when your lead provides the API contract. Until then, the UI remains usable with demo connection state.

Expected future endpoints are documented in `src/lib/api.ts` and include `/api/me`, `/api/channels`, WhatsApp onboarding, Telegram/Slack connect, and channel disconnect.

## Run
```bash
npm install
npm run dev
```
Open `http://localhost:3000`.

## v6 frontend note
The auth screens include a demo-only browser session so the end-to-end UX can be explored before the real auth provider/API contract arrives. Replace the localStorage session in `src/components/auth/AuthShell.tsx` with the final provider integration; do not use this demo session for production authentication.
