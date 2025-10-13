# Farid Masood Khan — Researcher • Developer • Engineer

A fast, accessible, single-page portfolio built with HTML, CSS, and vanilla JavaScript. Minimal, responsive UI with dark/light theme and clean sections inspired by 21st.dev.

## Local Development

No build step is required.

- Option 1: Open `index.html` directly in a modern browser.
- Option 2: Serve locally (recommended for API features):

  - Python:
    ```bash
    python3 -m http.server 8000
    ```
    Then visit http://localhost:8000

  - Node:
    ```bash
    npx serve .
    ```
    Then visit the printed local URL.

## Deploy to GitHub Pages

1. Push these files to the `main` branch of your repository.
2. In your repo: Settings → Pages → Build and deployment
   - Source: Deploy from a branch
   - Branch: `main`, folder: `/root`
3. The site will publish to:
   - `https://<username>.github.io/` for a user site named `<username>.github.io`, or
   - `https://<username>.github.io/<repo>` for a project site
4. Update the canonical URL in `index.html` if needed.

## Configuration

- Theme persists in `localStorage` and respects OS preference.
- GitHub projects are fetched from:
  `https://api.github.com/users/Farid-Masood-Khan/repos`
- If the API fails (rate limit/offline), a small fallback list is shown.
- Download CV button links to `Farid_Masood_CV.pdf` in the repo root.
- Highlights & Apps: edit `assets/data/pinned.json` to pin exact repos.
- WeChat QR: place an image at `assets/img/wechat_qr.png`. The overlay falls back to your WeChat ID if the image is missing.

## Features

- Theme & UX
  - Dark/light toggle with OS detection
  - Clean hero, subtle reveal animations, back-to-top button
  - Mobile: hamburger menu with glass panel and backdrop
  - Desktop: inline navbar always visible

- Projects
  - Fetches public repos via GitHub REST API
  - Client cache (5 min) to reduce API calls
  - Language filter chips, sort toggles (Updated/Stars)
  - Graceful fallback list

- Highlights & Apps (Pinned)
  - Driven by `assets/data/pinned.json`
  - Cards with concise titles, descriptions, and repo links

- Research, Skills, Services, About
  - Clear, minimal sections emphasizing practical work, baselines, and apps

- Contact
  - Email and WeChat details
  - Mailto form composer and copy WeChat ID button
  - WeChat QR overlay (optional image)

- Accessibility & Performance
  - Skip link, focus-visible, ARIA live regions
  - Preconnect to GitHub API and deferred JS

## Structure

- `index.html`: Semantic sections with accessible markup
- `assets/css/style.css`: Variables, layout, components, reveal animations
- `assets/js/app.js`: Theme toggle, nav (mobile/desktop), repo fetch + filters/sort, caching, pinned content, contact form, back-to-top
- `assets/data/pinned.json`: Pinned Highlights and Apps configuration
- `assets/img/`: Social preview image (og.png) and optional WeChat QR
- `Farid_Masood_CV.pdf`: CV in repo root

## Notes

- No frameworks or large libraries are used.
- Keep `pinned.json` and repo metadata updated as you ship new work.