# Portfolio

Skeleton of a one-page portfolio: hero, 4-project gallery, about, contact form.
Plain HTML styled with Tailwind CSS v4, loaded from its CDN, so there's no build step.

## Structure
- `index.html`: home page (Projects, About, Contact sections)
- `projects/project-1.html` to `project-4.html`: one page per project
- `thanks.html`: shown after the contact form is sent
- `images/`: put thumbnails, photos and media here

## Contact form setup (sends to Gmail)
The form uses FormSubmit (formsubmit.co), free and no account needed.
1. In `index.html`, replace `YOUR_EMAIL@gmail.com` with your Gmail address.
2. Replace `YOUR-DOMAIN.com` in the `_next` field with your domain.
3. Once the site is live, submit the form once and click the activation link FormSubmit emails you.
4. Swap your email in the form's action URL for the random alias FormSubmit gives you, so your address isn't in the page source.

## Hosting on GitHub Pages
1. Push these files to the repo's main branch.
2. Repo Settings > Pages > Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
3. Add your domain under Settings > Pages > Custom domain, then add the DNS records GitHub shows you at your registrar.

## About the Tailwind setup
Each page loads Tailwind from `cdn.jsdelivr.net/npm/@tailwindcss/browser@4`, which builds styles in the browser.
That's great for prototyping. Before launch, consider switching to the Tailwind CLI so the site ships one small, pre-built CSS file.
