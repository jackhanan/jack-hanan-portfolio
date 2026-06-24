# Jack Hanan — Architecture Portfolio

A minimal, editorial portfolio site with a password-protected admin CMS. Built with Next.js 14 (App Router), Tailwind CSS, and file-based JSON persistence.

## Running Locally

### Prerequisites
- Node.js 18+
- npm 9+

### Setup

```bash
# 1. Clone and install
cd jack-hanan-portfolio
npm install

# 2. Configure environment
cp .env.local.example .env.local
# Edit .env.local and set ADMIN_PASSWORD to something secure

# 3. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Admin Access

Visit `/admin` and enter your `ADMIN_PASSWORD` from `.env.local`.

The admin panel lets you:
- Add, edit, reorder, and hide projects
- Upload hero images and gallery images per project
- Edit your bio, skills, and profile photo

## Data Storage

Project data is stored in `data/projects.json`. Images are stored in `public/uploads/[project-slug]/`.

> **Note:** This file-based approach works perfectly for local development and self-hosted deployments (Railway, Fly.io, a VPS). If deploying to **Vercel**, the filesystem is read-only after deployment — you'll need to swap the JSON store for a persistent layer like [Vercel KV](https://vercel.com/storage/kv) or [Supabase](https://supabase.com). The API routes are already structured to make this swap straightforward.

## Deploying to Vercel

1. Push your repository to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Add environment variable: `ADMIN_PASSWORD = your-password`
4. Deploy

> Remember the filesystem caveat above — for persistent project edits on Vercel, replace the JSON helpers in `src/lib/projects.ts` and `src/lib/about.ts` with a cloud store.

## Adding a Custom Domain

In Vercel dashboard → your project → **Settings → Domains** → add your domain and follow the DNS instructions.

## Project Structure

```
src/
├── app/                  Next.js App Router pages & API routes
├── components/           Reusable UI components
├── lib/                  Data helpers (read/write JSON)
└── types/                TypeScript interfaces

data/
├── projects.json         All project data
└── about.json            Bio, skills, education

public/uploads/           Uploaded project images
```

## Customising

- **Colors / fonts:** Edit `tailwind.config.js` and `src/app/globals.css`
- **Your name / details:** Edit `data/about.json` and the hero in `src/components/home/Hero.tsx`
- **Resume:** Replace `public/resume.pdf` with your actual resume
