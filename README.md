# É-MISHTO — Editorial Marketplace

Complete static prototype. Serve the repository root (GitHub Pages: Settings → Pages → deploy from branch, root) or open `index.html` directly.

## Structure

    index.html          entire site — markup, CSS, JS, routes, product data
    assets/             every image, video, logo and brand file (299 files)
    HANDOFF.md          full project state, decisions and open items
    support.js          runtime for the .dc.html design components
    three-d-stage.js    3D viewer used by the Aster Vessel component
    .nojekyll           stops GitHub Pages ignoring files

Everything the site needs is in `index.html` + `assets/`. The `.dc.html` files and
`.jsx` files are separate design explorations, not required by the site.

## Routes

Hash-based: `#/` home · `#/world/<arts|fashion|body|home|food|vintage|new>` categories ·
`#/object` product · `#/artists` creators · `#/creator` profile · `#/journal` stories ·
`#/archive` · `#/about` why sell · `#/apply` · `#/account` · `#/bag`

## Status

Desktop and tablet are approved and locked. **Mobile refinement is IN PROGRESS** —
see the phone-pass sections at the end of HANDOFF.md before making changes.

Last updated: 13 September 2026
