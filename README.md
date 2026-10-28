# Stefan Flikweert — website

The portfolio website for Stefan Flikweert, furniture and object designer.

**Every change saved to the `main` branch goes live on the public site automatically**, usually within a minute or two. There is nothing to install or build.

---

## How to make a change

You don't need to write code. Ask your AI assistant (connected to this GitHub repository) in plain language, for example:

- *"Change the tagline 'Construction becomes character.' to 'Steel, folded and left honest.'"*
- *"Replace the photo captioned 'In use' with the new photo I uploaded."*
- *"Add a new step to the Process section called 'Finishing'."*
- *"Change the contact email address to …"*
- *"The Process section has 'Photo to come' placeholders — put my workshop photos there."*

The assistant edits the files and saves the change to `main`. A minute or two later the change is visible on the site.

### Checking that it went live

1. Open the repository on GitHub and click the **Actions** tab.
2. The top row is the latest publish:
   - **Green tick** — published. Refresh the website (hard refresh: `Ctrl+Shift+R` on Windows, `Cmd+Shift+R` on Mac).
   - **Yellow dot** — still publishing, wait a moment.
   - **Red cross** — something went wrong. The live site stays as it was. Ask your assistant to look at the failed run and fix it.

### Undoing a change

Every change is kept in the history. If something looks wrong, ask your assistant: *"Undo the last change to the website."*

---

## What's where

| What you want to change | File |
| --- | --- |
| All text on the page (headings, paragraphs, captions, email address) | `index.html` |
| Colours, fonts, spacing, layout | `css/style.css` |
| Turntable, light/dark switch, manifesto button | `js/main.js` |
| Photos in the gallery | `img/photos/` |
| Large image at the top of the page | `img/hero-img-light.png` and `img/hero-img-dark.png` |
| 360° turntable images | `img/turntable/light/` and `img/turntable/dark/` |
| Browser-tab icon | `favicon.svg` |
| Automatic publishing (normally never needs changing) | `.github/workflows/deploy.yml` |

The site has a **light** and a **dark** version. Visitors get the one that matches their device setting, and can switch with the button at the top right. The large image at the top and the turntable each have a separate set of images for light and dark.

### Images: tips

- Photos: JPEG, about 1500–2000 pixels on the longest side, ideally under 500 KB each. Large files make the site slow on phones.
- Gallery photos are shown in portrait format (3:4). Other shapes are cropped to fit.
- File names: lowercase, no spaces (e.g. `workshop-bending.jpeg`).

---

## One-time setup (only when the repository is first created)

1. In the repository on GitHub: **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Optional — own domain name: on the same page, fill in **Custom domain** and follow GitHub's instructions for your domain provider.

The site address is shown at the top of that Settings → Pages screen.

---

## Notes for AI assistants editing this repository

- **Plain static site.** Hand-written HTML, CSS and vanilla JavaScript. No framework, no build step, no package manager. Do not introduce one (no npm, Tailwind, React, bundlers) unless the owner explicitly asks.
- **Publishing.** Pushing to `main` triggers `.github/workflows/deploy.yml`, which copies `index.html`, `favicon.svg`, `css/`, `js/` and `img/` into the Pages artifact. **Anything outside those paths is not published.** If you add a new top-level file or folder the site needs, add it to the `cp` line in the workflow.
- **Paths must be relative** (`img/photos/x.jpeg`, not `/img/photos/x.jpeg`). The site may be served from a sub-path like `https://<user>.github.io/<repo>/`.
- **Structure of `index.html`.** Sections in order: hero, `#work` (01), project (02), `#process` (03), `#philosophy` (04, full-width dark band), `#about` (05), direction (06), `#contact` (07). Section numbers in the `section-head` blocks are typed by hand — renumber them if you add, remove or reorder sections. Header navigation links point at the section `id`s.
- **Styling.** Design tokens (colours, fonts) are CSS custom properties at the top of `css/style.css`: `:root` for light, `:root[data-theme="dark"]` for dark. Change colours there, and always check both themes. Mobile styles are the default; desktop overrides live in the single `@media (min-width: 48rem)` block near the end. The gallery layout uses `.gallery__1` … `.gallery__5` placements in that block — a new gallery photo needs its own placement rule.
- **Theme-specific images.** Use the `show-light` / `show-dark` classes on a pair of `<img>` elements (see the hero). Keep `loading="lazy"` on both so the hidden one is not downloaded.
- **Turntable.** `js/main.js` expects 19 frames per theme named `00.png`, `05.png` … `90.png` (5° steps) in `img/turntable/light/` and `img/turntable/dark/`. Frames are 1080×1080 PNGs with transparent backgrounds. Light-theme frames show dark steel, dark-theme frames show light/silver steel.
- **Placeholders.** `<div class="placeholder"><span class="label">Photo to come — …</span></div>` marks images still to be supplied. Replace the whole `div` with an `<img>` (keep the aspect-ratio class or set one) when a photo arrives.
- **Accessibility.** Every content image needs a meaningful `alt` text describing what is shown; purely decorative images use `alt=""`.
- **Keep edits small and focused**, and describe what changed in the commit message in plain language — the owner reads the history.
- **Checking a change.** Before committing, open `index.html` in a browser, or serve the folder (`python -m http.server`) and check desktop, mobile width, and both light and dark themes.
