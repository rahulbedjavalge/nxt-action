# Nxt Action

**Keep every conversation moving. Never lose the next action.**

A personal follow-up management webapp that helps you track contacts, interactions, and next actions. All your data is stored securely in your own Google Drive.

## Features

- 📊 **Today Dashboard** - See who needs attention at a glance with overdue and due today views
- 💬 **Contact Timelines** - Track every interaction with full context and history
- 🔒 **Private Storage** - Data stored in your Google Drive's hidden app folder
- ⚡ **Quick Add** - Add contacts and log interactions in seconds (press `N`)
- 🌙 **Dark Mode** - Easy on the eyes, day or night
- 📱 **Mobile Friendly** - Responsive design works on any device

## Tech Stack

- Next.js 14+ with App Router
- TypeScript
- Tailwind CSS
- next-auth v5 (Auth.js) with Google provider
- Google Drive API for storage
- Zod for validation
- date-fns for date handling

## Prerequisites

Before you begin, you'll need:

1. Node.js 18+ installed
2. A Google Cloud Platform account
3. A Google OAuth application configured (see setup below)

## Google Cloud Console Setup

### 1. Create a Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Name it (e.g., "Nxt Action") and click "Create"

### 2. Enable Google Drive API

1. Go to "APIs & Services" → "Library"
2. Search for "Google Drive API"
3. Click on it and press "Enable"

### 3. Configure OAuth Consent Screen

1. Go to "APIs & Services" → "OAuth consent screen"
2. Select "External" and click "Create"
3. Fill in:
   - App name: `Nxt Action`
   - User support email: Your email
   - Developer contact email: Your email
4. Click "Save and Continue"
5. On "Scopes" page, click "Add or Remove Scopes" and add:
   - `https://www.googleapis.com/auth/drive.appdata`
   - `openid`
   - `email`
   - `profile`
6. Click "Save and Continue"
7. Add your test email addresses on "Test users" page
8. Click "Save and Continue"

### 4. Create OAuth Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Select "Web application"
4. Name it (e.g., "Nxt Action Web Client")
5. Add Authorized redirect URIs:
   - For local development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://nxt-action.com/api/auth/callback/google`
6. Click "Create"
7. Copy the **Client ID** and **Client Secret**

## Local Development Setup

### 1. Clone and Install

```bash
cd app
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the `app` directory:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# NextAuth
NEXTAUTH_SECRET=generate-a-secret-here
NEXTAUTH_URL=http://localhost:3000
```

To generate a secret, run:

```bash
openssl rand -base64 32
```

### 3. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Production Deployment (Vercel)

### 1. Deploy to Vercel

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com) and import your repository
3. Configure environment variables:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (e.g., `https://nxt-action.com`)

### 2. Update Google OAuth

Add your production redirect URI to Google Cloud Console:
- `https://your-domain.com/api/auth/callback/google`

## Common Issues & Troubleshooting

### "Missing refresh_token"

Google only returns a refresh token on the first authorization. If you're getting authentication errors:

1. Go to [Google Account Security](https://myaccount.google.com/permissions)
2. Find "Nxt Action" and remove access
3. Sign in again to the app

### "Access blocked" or "App not verified"

During development, your app is in testing mode. Either:
- Add your email to the test users in Google Cloud Console
- Or complete the OAuth verification process for production

### "Drive API not enabled"

Make sure you've enabled the Google Drive API in your Google Cloud project.

### "Redirect URI mismatch"

The redirect URI in your Google Cloud Console must exactly match:
- Local: `http://localhost:3000/api/auth/callback/google`
- Production: `https://your-domain.com/api/auth/callback/google`

### Session expires frequently

The app automatically refreshes tokens, but if you're having issues:
1. Revoke app access (see "Missing refresh_token" above)
2. Sign in again

## Project Structure

```
src/
├── app/
│   ├── (dashboard)/           # Protected routes
│   │   ├── dashboard/         # Main dashboard
│   │   ├── contacts/          # Contacts list & details
│   │   ├── tasks/             # Tasks management
│   │   └── about/             # About page
│   ├── api/                   # API routes
│   │   ├── auth/              # NextAuth handlers
│   │   ├── contacts/          # Contacts CRUD
│   │   ├── interactions/      # Interactions CRUD
│   │   └── tasks/             # Tasks CRUD
│   └── page.tsx               # Landing page
├── components/
│   ├── ui/                    # Reusable UI components
│   ├── Navbar.tsx             # Navigation bar
│   ├── QuickAddModal.tsx      # Quick add modal
│   └── Providers.tsx          # Context providers
├── lib/
│   ├── auth.ts                # NextAuth configuration
│   ├── driveStore.ts          # Google Drive storage
│   ├── schemas.ts             # Zod validation schemas
│   ├── dateUtils.ts           # Date utilities
│   └── nlpDateParser.ts       # Natural language date parsing
└── types/
    └── index.ts               # TypeScript types
```

## Data Model

All data is stored in a single JSON file (`nxt-action-db.json`) in your Google Drive's hidden app folder:

```json
{
  "version": 1,
  "contacts": [...],
  "interactions": [...],
  "tasks": [...]
}
```

### Contact

- id, name, linkedinUrl, email, company, role
- tags, priority (low/medium/high), status (active/waiting/closed)
- lastTouchedAt, nextFollowUpAt, notes, createdAt, updatedAt

### Interaction

- id, contactId, channel (linkedin/email/call/whatsapp/inperson)
- direction (outbound/inbound), occurredAt, summary
- link, outcome (none/positive/rejected/scheduled/needs_info), createdAt

### Task

- id, title, dueAt, priority, status (open/done)
- contactId (optional), notes, createdAt

## License

MIT
