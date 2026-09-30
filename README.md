# Somil Athole — portfolio (SIGNAL)

Personal portfolio for Somil Athole, built as a static Next.js site and deployed on Netlify.

- Live: https://somil-athole.netlify.app

## Develop

Requires Node 20.9 or later.

```bash
npm install
npm run dev
```

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Dev server on http://localhost:3000 |
| `npm run build` | Static export to `out/` |
| `npm run start` | Serve the exported `out/` folder |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, no emit |
| `npm run check:contrast` | WCAG AA check on every colour token pair in both themes |
| `npm run verify` | Contrast, lint, typecheck and build together |
| `npm run format` | Prettier |

## Where things live

- `content/` — every fact on the site. Sections, metadata and the resume read from here.
- `content/syntheticData.ts` — invented data for the demos. Nothing in it is real.
- `app/globals.css` — colour tokens for both themes, typography scale, background.
- `components/layout/` — nav, section menu, theme toggle, status bar.
- `lib/` — reduced-motion and device-tier hooks.
