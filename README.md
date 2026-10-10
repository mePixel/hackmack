# Hackmack

A hackathon website built with Astro and adapted from the Parley template.

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

## Edit the website

Edit [`src/content/event.md`](src/content/event.md). The YAML settings between the `---` lines are the website's source of truth:

- **Name and text:** `name`, `edition`, `description`, section headings, FAQs, schedule, and navigation.
- **Brand colors:** `theme.accent`, `theme.background`, and `theme.ink`.
- **Images:** `heroImage`, `images`, and image paths in the section lists.
- **Partner logos:** `logos` and `logosLabel`.
- **Registration:** `registration.url` and `contactEmail`.
- **Visible sections:** `enabled` switches.

Put image files in `public/assets/`, then use paths such as `/assets/my-photo.jpg` in the Markdown settings. Keep YAML indentation and quote hex colors. Instructions below the settings are for editors and are not rendered on the website.

Save changes to see them in the local preview. Rebuild and deploy for published changes. `src/config/event.ts` only forwards the Markdown settings to the existing components.

For structural changes, edit `src/pages/index.astro` (section order), `src/components/sections/` (section layouts), and `src/styles/` (styles and typography). The navigation and footer wordmarks use the event name as text. Venue address, map links, photo credit, sponsoring prose, and Code of Conduct wording remain in their Astro components/pages; review these when changing events.

## Verification

```sh
npm run build
node scripts/check-event.mjs
node scripts/check-schedule.mjs
```

Check the desktop/mobile layout after changing artwork or long text.

## Deployment

Build for your deployment domain:

```sh
SITE_URL=https://your-event.example npm run build
```

Without `SITE_URL`, canonical tags are omitted and the sitemap is empty. Deploy `dist/` to your static host.

## Template reference

`design/legacy-pages/` contains the original SaaS pages for reference; these routes are not published. Some section names reflect that template: `Pricing.astro` displays the schedule, `Delegation.astro` displays challenges, and `Testimonials.astro` displays participant roles.

Original MIT license and attribution remain in `LICENSE`.
