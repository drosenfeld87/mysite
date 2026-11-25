# Debbie Rosenfeld — portfolio

Personal portfolio site. Plain HTML styled with Tailwind CSS v4, hosted on GitHub Pages at debbierosenfeld.com.

## Design
Dark, type-led direction ("Nocturne"): near-black plum background with a low wine glow, a vignette and still grain.
Barlow Condensed in caps for headlines, Barlow (light) for body text. Raspberry (#DD5A8C) for accent phrases, numbers
and links; mauve (#C9A0B4) for the name label, role labels and the About heading. Projects are listed as a numbered set list.
Signature: a Now / Y2K switch in the header that turns the site into a 2002 personal homepage.

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
- Colours: `bg-bg`, `text-ink`, `text-muted`, `border-line`, `text-accent` (raspberry), `text-accent-2` (mauve), `bg-surface`
- Fonts: `font-display`, `font-sans`
- Sizes that scale with the screen: `text-hero`, `text-project`, `text-pull`, `text-bio`, `text-lead`
- Spacing: `px-gutter` (page side margin), `pt-section`, `pt-hero`
- Breakpoint: `lg:` means 900px and wider; `max-lg:` means narrower than 900px

Components, for pieces repeated on many pages: `display` (headline font), `meta` (small grey text), `tag`
(cyan role label), `sticker` (the name sticker), `chip` (tool tag), `btn`, `link-cta`, `field`, `setlist`/`track`, `page`,
`page-title`, `section-title`, `sub-title`. Utility classes override them, e.g. `class="meta text-accent"`.

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
npm run build    # one-off, minified build: run before committing
```
A class that isn't already used somewhere on the site won't work until you rebuild.

**Cache tip:** the pages load `css/site.css?v=…` and `js/site.js?v=…`. After rebuilding, bump that number in the
pages' `<link>` and `<script>` tags so browsers fetch the new files instead of an old cached copy.

## Images
Images are WebP. Most have three sizes: `name.webp` (full), `name-1200.webp` and `name-800.webp`, and the pages list them
in `srcset` so phones download a smaller file. To add an image, export the three sizes, then copy an existing `<img>` tag.

## Contact form (sends to Gmail)
Uses FormSubmit (formsubmit.co). To hide the email address from the page source, swap it in the form's
action URL for the random alias FormSubmit provides after activation.

## Launch checklist
1. Move the preview folder's contents to the repo root (replacing the holding page) and update the form's `_next` URL.
   Run `npm run build` once more from the root.
2. Remove `noindex` from the pages.
3. In Settings > Pages, confirm the custom domain and tick Enforce HTTPS.
