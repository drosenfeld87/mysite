# Debbie Rosenfeld — portfolio

Personal portfolio site. Plain HTML and CSS, hosted on GitHub Pages at www.debbierosenfeld.com.

## Design
Editorial, type-led direction: flat near-black background, one coral accent (#FF7A59), still film grain,
Mona Sans (condensed) for display type, Satoshi for body text, JetBrains Mono for labels.

## Structure
- `index.html` (repo root): the public "Coming soon" holding page
- The full site lives in an unlisted preview folder until launch:
  - `index.html`: home page (work, about, contact)
  - `projects/project-1.html` to `project-4.html`: one page per project
  - `thanks.html`: shown after the contact form is sent
  - `css/site.css`: all shared styles; colours and fonts are variables at the top
  - `images/`: project images

Project pages also load Tailwind CSS v4 from its CDN for layout utilities, with colours set in each page's `@theme` block.
Before launch, consider replacing that with a pre-built stylesheet so pages load faster.

## Contact form (sends to Gmail)
Uses FormSubmit (formsubmit.co). To hide the email address from the page source, swap it in the form's
action URL for the random alias FormSubmit provides after activation.

## Launch checklist
1. Move the preview folder's contents to the repo root (replacing the holding page) and update the form's `_next` URL.
2. Remove `noindex` from the pages.
3. In Settings > Pages, confirm the custom domain and tick Enforce HTTPS.
