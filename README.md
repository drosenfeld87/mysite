# Debbie Rosenfeld — portfolio

Personal portfolio site. Plain HTML styled with Tailwind CSS v4, hosted on GitHub Pages at www.debbierosenfeld.com.

## Design
Editorial, type-led direction: flat near-black background, one coral accent (#FF7A59), still film grain,
Mona Sans (condensed) for display type, Satoshi for body text, JetBrains Mono for labels.

## Structure
- `index.html` (repo root): the public "Coming soon" holding page
- The full site lives in an unlisted preview folder until launch:
  - `index.html`: home page (work, about, contact)
  - `projects/project-1.html` to `project-4.html`: one page per project
  - `thanks.html`: shown after the contact form is sent
  - `css/tailwind.css`: **the stylesheet you edit**: colours, fonts and type sizes (the `@theme` block), page defaults, and a few named components
  - `css/site.css`: built from `tailwind.css`; the pages load this file. Don't edit it by hand
  - `js/site.js`: sticky header, image viewer, prototype videos
  - `images/`, `video/`: project media

The holding page at the root has its own small inline styles, since it's replaced at launch.

## Editing styles (Tailwind)
Style pages with Tailwind classes in the HTML, as usual. Site-specific classes come from the tokens in `tailwind.css`:
- Colours: `bg-bg`, `text-ink`, `text-muted`, `border-line`, `text-accent`, `bg-surface`
- Fonts: `font-display`, `font-sans`, `font-mono`; weights `font-heavy` (750) and `font-strong` (650)
- Sizes that scale with the screen: `text-hero`, `text-contact`, `text-project`, `text-pull`, `text-lead`
- Spacing: `px-gutter` (page side margin), `pt-section`, `py-hero`
- Breakpoint: `lg:` means 900px and wider; `max-lg:` means narrower than 900px

Components, for pieces repeated on many pages: `display` (condensed headline font), `mono` (small uppercase label),
`sticker`, `label` (tilted coral tag), `chip` (grey tool tag), `btn`, `link-cta`, `field`, `page`, `page-title`,
`section-title`, `sub-title`. Utility classes override them, e.g. `class="mono text-accent"`.

**After changing classes or `tailwind.css`, rebuild `site.css`** (needs Node.js), from the preview folder:
```
npm install      # first time only
npm run dev      # rebuilds every time you save; stop with Ctrl+C
npm run build    # one-off, minified build: run before committing
```
A class that isn't already used somewhere on the site won't work until you rebuild.

## Contact form (sends to Gmail)
Uses FormSubmit (formsubmit.co). To hide the email address from the page source, swap it in the form's
action URL for the random alias FormSubmit provides after activation.

## Launch checklist
1. Move the preview folder's contents to the repo root (replacing the holding page) and update the form's `_next` URL.
   Run `npm run build` once more from the root.
2. Remove `noindex` from the pages.
3. In Settings > Pages, confirm the custom domain and tick Enforce HTTPS.
