# Hackmack — reusable hackathon content for the Parley template

The original Parley page layout, section order, typography, colors, hero image, cards, tabs, marquees, and footer are retained. The content is adapted for a sample Hackmack edition.

## Development

Requires Node 22.12+.

```sh
npm install
npm run dev -- --background
npx astro dev status
npx astro dev logs
npx astro dev stop
npm run build
node scripts/check-event.mjs
```

## Reuse for another hackathon

Edit **`src/config/event.ts`**. It contains the event name, edition, date, location, hero copy, section headings, benefits, challenge tracks, participant roles, schedule, FAQs, tools, logo assets, navigation, footer, registration, and theme colors.

- Set `registration.url` to your application form. Until then the closing panel displays “Applications opening soon”; no fake submission or registration backend is included.
- Set `contactEmail` to add an organizer contact button.
- Change `enabled` values to hide optional sections. Header and footer anchor links follow these switches.
- Replace the illustrative logos in `logos` and update `logosLabel`. Keep the label honest until you have confirmed partners.
- Update all sample dates, schedule times, timezone text, participation rules, and FAQs. Then set `demo: false`.
- For theme adjustments, edit `theme`. The defaults preserve the original palette. Check text contrast after changes.
- Replace `heroImage` and `public/favicon.svg` for another event's artwork.
- To reorder sections, move the existing components in `src/pages/index.astro`.

The section component names preserve the original template: `Delegation` now holds challenge tracks, `Testimonials` describes participant roles (not invented testimonials), `Pricing` holds the schedule, and `Integrations` shows example tools. Their existing layout classes and interactions are retained. The SaaS subscription toggle was removed because a schedule has no billing period. Baked-in SaaS screenshots and animations are replaced by editable event content inside the same panels.

Build for your deployment domain:

```sh
SITE_URL=https://your-event.example npm run build
```

Without `SITE_URL`, canonical tags are omitted and the sitemap is empty. Deploy `dist/` to your static host.

## Source locations

- `src/config/event.ts` — event content and optional section switches
- `src/pages/index.astro` — original page composition
- `src/components/sections/` — original section components with event copy
- `src/styles/global.css`, `tokens.css`, `nav.css`, `pages.css` — original visual system
- `src/styles/hackathon.css` — small additions for event content inside existing panels
- `design/legacy-pages/` — original SaaS route source retained for reference, not published

The old SaaS pricing, workflow, blog, and form pages are not linked or published. The optional `/admin/` editor still targets the original blog collection; event content is edited directly in the config file.

`npm run build` verifies compilation. `node scripts/check-event.mjs` verifies homepage branding, anchor targets, registration messaging, and that obsolete SaaS routes are not published. Check desktop/mobile layout and tab interactions when editing the template.

Original MIT license and attribution remain in `LICENSE`.
