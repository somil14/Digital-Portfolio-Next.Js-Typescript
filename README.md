# Somil Athole — portfolio (SIGNAL)

Personal portfolio for Somil Athole: a static Next.js site styled as an API security console, deployed on Netlify.

Live: https://somil-athole.netlify.app

## Develop

Requires Node 20.9 or later. The PDF and site-check scripts also need Google Chrome installed.

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
| `npm run verify` | Contrast, lint, typecheck, build and bundle-size check |
| `npm run check:site` | Against `out/`: axe on every page in both themes, overflow at four widths, no-JS, reduced motion, keyboard |
| `npm run check:contrast` | WCAG AA on every colour token pair in both themes |
| `npm run measure` | First-load JS per page against the 200 KB budget |
| `npm run resume:pdf` | Build, then print `/resume` to `public/resume/Somil_Athole_Resume.pdf` |
| `npm run lint` / `typecheck` / `format` | ESLint, TypeScript, Prettier |

## Where things live

- `content/` — every fact on the site. Sections, metadata, `/tldr`, `/resume` and the PDF all read from here. Open questions are marked `TODO(somil)`.
- `content/syntheticData.ts` — invented data for the demos. Nothing in it describes a real system.
- `app/globals.css` — colour tokens for both themes, type scale, and every motion state.
- `components/sections/` — one folder or file per page section.
- `components/three/` — the two WebGL scenes. Loaded lazily, and only on devices that will render them.
- `components/layout/` — nav, section menu, command palette, theme toggle, page-wide interactions.
- `public/__forms.html` — static definition of the contact form for Netlify Forms.

## Editing content

Change the files in `content/`, then run `npm run resume:pdf` so the downloadable resume matches, and commit both.

## Behaviour worth knowing

- **Device tiers.** Touch, low-power, reduced-motion and no-WebGL devices get static SVG versions of the 3D scenes and never download three.js.
- **No JavaScript.** All content renders in its final state; hidden "before" animation states only apply once the inline head script has run.
- **Fonts** use `display: optional`, so text never reflows when a font arrives late.
- **`?mode=tldr`** redirects to `/tldr/`, a one-column summary for recruiters.
