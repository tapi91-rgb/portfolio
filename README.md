# Farid Masood Khan — Researcher • Developer • Builder

A fast, accessible, single-page portfolio built with HTML, CSS, and vanilla JavaScript. Dark/light theme, glass layers, smooth gradients, magnetic buttons, and a lightweight cursor trail.

## Local Development

No build step is required.

- Option 1: Open `index.html` directly in a modern browser.
- Option 2: Serve locally (recommended for some APIs/features):

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

1. Create a new repository on GitHub and push these files to the `main` branch.
2. In your repository:
   - Go to Settings → Pages.
   - Under "Build and deployment", set:
     - Source: Deploy from a branch
     - Branch: `main` and folder: `/root`
   - Save. GitHub Pages will publish your site at:
     - `https://<username>.github.io/` for a special user site named `<username>.github.io`, or
     - `https://<username>.github.io/<repo>` for a regular project repository.

3. Update the canonical URL and any absolute links if needed:
   - In `index.html`, `<link rel="canonical" href="...">` points to `https://farid-masood-khan.github.io/`. Change it if you deploy to a project URL.

## Configuration

- Theme is persisted via `localStorage` (`theme` key) and defaults to OS preference.
- GitHub projects are fetched from:  
  `https://api.github.com/users/Farid-Masood-Khan/repos`
- If the API fails (rate limit / offline), a small fallback list is shown.
- The "Download CV" button links to `/assets/cv/Farid_Masood_CV.pdf`. Add your real CV file at that path.
- Highlights & Apps pins: edit `assets/data/pinned.json` to set exact repo links, titles, and descriptions.
- Notes: add `.md` files in `assets/notes/` and list them in `assets/notes/index.json`.
- WeChat QR: place an image at `assets/img/wechat_qr.png`. The \"Show WeChat QR\" button hides automatically if the image is not present.

## Features

- Theme & UX
  - Dark/light theme toggle (persisted) with OS preference detection.
  - Animated hero with subtle parallax blobs and magnetic CTAs.
  - Back-to-top button, active nav highlighting on scroll, smooth scrolling (respects motion preferences).
  - Teal/violet accent balance tuned for contrast (light/dark variants).

- Projects
  - Fetches public repos via the GitHub REST API.
  - Client-side cache (5 min) to reduce rate limits.
  - Language filter chips and sort toggles (Updated / Stars).
  - Graceful fallback list when offline or rate limited.

- Highlights & Apps (Pinned)
  - Highlights and Apps are driven by `assets/data/pinned.json`.
  - Cards render with icons/logos and external links.
  - Update this JSON to pin precise repos as needed.

- Notes (Markdown loader)
  - Renders local `.md` files listed in `assets/notes/index.json`.
  - Minimal Markdown parser (headings, code fences, paragraphs, lists).
  - Each note shows an excerpt and toggles full content inline.

- Research
  - Research cards highlighting baselines and small, reproducible experiments.

- Stack
  - Languages: Python, JavaScript, SQL, Dart.
  - ML: scikit-learn, PyTorch, TF-IDF, Linear SVM, OpenCV, YOLO.
  - App Dev: Flutter, Firebase, REST, JSON.
  - Ops: Git, CI, Docker, Linux.

- Services
  - Flutter app development, data science/ML, and research support.

- Contact
  - Email and WeChat details.
  - Simple contact form that composes a mailto message.
  - Copy WeChat ID button.
  - WeChat QR overlay panel (place your image at `assets/img/wechat_qr.png`).

- Social
  - Hero icons for GitHub, LinkedIn, and X (Twitter).

- Accessibility & Performance
  - Skip link, focus-visible, ARIA live regions.
  - Preconnect to GitHub API, lazy-loaded images, deferred JS.

## Structure

- `index.html`: Single page with semantic landmarks and accessibility features.
- `assets/css/style.css`: Variables, layout, components, and animations (prefers-reduced-motion respected).
- `assets/js/app.js`: Theme toggle, repo fetch + filters/sort, caching, cursor trail, magnetic buttons, hero parallax, nav highlighting, contact form, back-to-top.
- `assets/img/`: Abstract blob SVGs and social preview image (og.png).
- `assets/cv/Farid_Masood_CV.pdf`: Placeholder link (add your CV file here).

## Notes

- Performance: preconnects to GitHub API, lazy-loads images, and defers noncritical JS.
- Accessibility: skip link, focus-visible, ARIA updates, keyboard-friendly navigation.
- No frameworks or large libraries are used.