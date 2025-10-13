# Portfolio UX decisions

This site aims to be fast, accessible, and responsive with no framework.

## Key choices
- Theme toggle with OS preference + localStorage
- Glass surfaces and subtle gradients (teal/violet) with good contrast
- Parallax and micro-trail effects honoring prefers-reduced-motion
- GitHub repos section with caching, filters, and sorting
- Mobile navigation as a glass panel + backdrop
- Contact form uses mailto (no backend), with clipboard copy and WeChat QR

## Accessibility
- Landmarks, skip link, focus-visible, ARIA live regions
- Keyboard-friendly nav and buttons
- Reduced motion respected in scroll, parallax, and micro-trail

## Performance
- Minimal JS, lazy assets, preconnect to GitHub API
- Caching for repos, minimal DOM updates
- CSS container queries for responsive grids

## Future
- Pin featured repos and apps with logos
- Add more case studies and notes
- Keep docs clean and reproducible