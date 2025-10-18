# Portfolio (Next.js 14 + Tailwind + Framer Motion)

Modern, minimal, animated portfolio for Muhammad Farid Masood Khan.
- Tech: Next.js 14 (App Router), TypeScript, TailwindCSS, Framer Motion, lucide-react.
- UX: dark theme by default, glassmorphism, neon accents, responsive, accessible (WCAG AA).
- SEO: next/metadata, canonical, OG, robots, sitemap, JSON-LD.
- API: all dynamic features call `${process.env.NEXT_PUBLIC_API_BASE}` (default http://localhost:8000). No secrets in client.

## Quickstart

1. Copy `.env.example` to `.env.local` and adjust API base:
   ```
   NEXT_PUBLIC_API_BASE=http://localhost:8000
   ```

2. Install and run:
   ```
   npm install
   npm run dev
   ```

3. Build static export (optional):
   ```
   npm run build
   ```

## Pages

- `/` Home (Hero, CTA)
- `/about` Skills, timeline, badges
- `/projects` GitHub repos (unauthenticated), README preview modal
- `/blog` List from `GET {API_BASE}/api/blog`, detail at `/blog/[slug]`
- `/cv` PDF viewer with download
- `/hire` Smart contact form → `POST {API_BASE}/api/contact`
- `/admin-login` Login form (email/password) → `POST {API_BASE}/api/auth/login`
- Secret admin route (hidden):
  - Path: `/admin/admin/123/rrr/poi/@#@#/admin` (rewritten via middleware to `/admin-secret`)
  - Shows 404 if not authenticated
  - Admin Dashboard tabs:
    - Content (CRUD Blog & Projects)
    - Chatbot (profile context)
    - Site Meta (titles, descriptions, OG, schema)

## Notes

- GitHub API has rate limits; fallback data is shown automatically when limits are hit.
- CV: place your PDF at `public/cv/Farid_Masood_CV.pdf`.
- Admin auth:
  - If backend sets httpOnly cookies, they are used automatically.
  - Otherwise, a JWT token is stored in-memory only and sent in `Authorization: Bearer <token>` header.
- The floating AI Chat widget calls `POST {API_BASE}/api/chat` and streams the reply (SSE or chunked). Falls back to local demo replies if the backend is offline.

## Configure API

All API endpoints are controlled by `NEXT_PUBLIC_API_BASE`:
- Blog: `GET {API_BASE}/api/blog`, `GET {API_BASE}/api/blog/[slug]`
- Contact: `POST {API_BASE}/api/contact`
- Admin: `POST {API_BASE}/api/auth/login`, protected CRUD under `{API_BASE}/api/admin/*`
- Chat: `POST {API_BASE}/api/chat` (streaming)