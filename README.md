# Debbie Rosenfeld — portfolio

Personal portfolio site. Plain HTML styled with Tailwind CSS v4, hosted on GitHub Pages at debbierosenfeld.com.

## Design
Dark, type-led direction ("Nocturne"): almost-black plum background with magenta and violet glows, a vignette and still grain.
Barlow Condensed in caps for headlines, Barlow (light) for body text. Hot raspberry (#FF4D94) for accent phrases, numbers
and links; orchid (#E7A6D8) for the name label, role labels and the About heading. Projects are listed as a numbered set list.
Signature: a Now / Y2K switch in the header that turns the site into a 2002 personal homepage.

## Structure
- `index.html` (repo root): the public "Coming soon" holding page
- `404.html` (repo root): the error page GitHub Pages shows for any address that doesn't exist
- `favicon.svg`, `og-image.jpg` (repo root): the tab icon and the image shown when a link is shared
- The full site lives in an unlisted preview folder until launch:
  - `index.html`: home page (work, about, contact)
  - `projects/project-1.html` to `project-4.html`: one page per project
  - `thanks.html`: shown after the contact form is sent
  - `css/tailwind.css`: **the stylesheet you edit**: colours, fonts and type sizes (the `@theme` block), page defaults, and a few named components
  - `css/site.css`: built from `tailwind.css`; the pages load this file. Don't edit it by hand
  - `js/site.js`: sticky header, image viewer, prototype videos, the Now / Y2K switch
  - `scripts/bump-version.mjs`: updates the `?v=` cache numbers; `npm run build` runs it
  - `images/`, `video/`: project media

The holding page at the root has its own small inline styles, since it's replaced at launch.

## Editing styles (Tailwind)
Style pages with Tailwind classes in the HTML, as usual. Site-specific classes come from the tokens in `tailwind.css`:
- Colours: `bg-bg`, `text-ink`, `text-muted`, `border-line`, `text-accent` (raspberry), `text-accent-2` (orchid), `bg-surface`
- Fonts: `font-display`, `font-sans`
- Sizes that scale with the screen: `text-hero`, `text-project`, `text-pull`, `text-bio`, `text-lead`
- Spacing: `px-gutter` (page side margin), `pt-section`, `pt-hero`
- Breakpoint: `lg:` means 900px and wider; `max-lg:` means narrower than 900px

Components, for pieces repeated on many pages: `display` (headline font), `meta` (small grey text), `tag`
(role label), `sticker` (the name sticker), `btn`, `link-cta`, `field`, `setlist`/`track`, `page`,
`page-title`, `sub-title`. Utility classes override them, e.g. `class="meta text-accent"`.

Switch: the Now / Y2K buttons are `<button data-value="…">` inside `.era-switch`; js/site.js remembers the choice between pages.

Headline weight swap (home page): the `<h1 data-swap>` holds a hidden full sentence for screen readers and
`aria-hidden` parts with `data-weight`; letters near the pointer step between the loaded weights (300 / 500 / 800). Off for touch screens and reduced motion.

Y2K mode: the Now / Y2K switch turns the site into a 2002 personal homepage. Its styles are section 4 of
`tailwind.css`. Give a section `data-window="name.exe"` to make it a Windows 98 window in Y2K mode;
anything with class `y2k-only` shows only in Y2K mode.

**After changing classes or `tailwind.css`, rebuild `site.css`** (needs Node.js), from the preview folder:
```
npm install      # first time only
npm run dev      # rebuilds every time you save; stop with Ctrl+C
npm run build    # one-off, minified build, then new ?v= cache numbers: run before committing
```
The Tailwind versions are pinned in `package.json`. The first `npm install` creates `package-lock.json`: commit it.
A class that isn't already used somewhere on the site won't work until you rebuild.

**Cache numbers:** the pages load `css/site.css?v=…` and `js/site.js?v=…`. `npm run build` gives them a new number so
browsers fetch the new files instead of an old cached copy. After editing only `js/site.js`, run `node scripts/bump-version.mjs`.

## Images
Images are WebP. Most have three sizes: `name.webp` (full), `name-1200.webp` and `name-800.webp`, and the pages list them
in `srcset` so phones download a smaller file. To add an image, export the three sizes, then copy an existing `<img>` tag.

## Contact form
Uses FormSubmit (formsubmit.co). The form posts to FormSubmit's random alias for the inbox, so no email address
appears in the page source. After sending, visitors land on `thanks.html` (the form's `_next` field).

## Checks
`tests/check_site.py` opens every page in a real browser, in both Now and Y2K modes at phone, tablet and desktop widths,
and checks layout, accessibility (contrast, image descriptions, labels, headings), script errors and missing files.
GitHub runs it on every push (`.github/workflows/checks.yml`); a red ✗ next to a commit means something needs fixing.
To run it yourself: `pip install playwright && playwright install chromium`, then `python tests/check_site.py`.

## Launch checklist
1. Move the preview folder's contents to the repo root (replacing the holding page) and update the form's `_next` URL.
   Run `npm run build` once more from the root.
2. Remove `noindex` from the pages.
3. Rename `projects/project-1.html` … `project-4.html` to descriptive names (e.g. `cio-analytics.html`) and update the links.
4. In Settings > Pages, confirm the custom domain and tick Enforce HTTPS.
