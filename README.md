# É-MISHTO — Editorial Marketplace

Static website. Deploy this folder as the root of a GitHub Pages repository
(Settings → Pages → Deploy from branch → root), or open `index.html` directly.

## Structure

    index.html          the entire site — markup, CSS, JS, routes, product data
    three-d-stage.js    3D object viewer, loaded by index.html
    assets/             every image, video, logo, font and brand file (305 files)
    HANDOFF.md          full project record: decisions, systems, open items
    .nojekyll           tells GitHub Pages to serve every file as-is

All paths are relative. External libraries (GSAP, three.js) and Google Fonts load
from public CDNs.

## Routes

Hash-based: `#/` home · `#/world/<arts|fashion|body|home|food|vintage|newin>` ·
`#/object` · `#/artists` · `#/creator` · `#/journal` · `#/archive` · `#/about` ·
`#/apply` · `#/account` · `#/bag` · `#/checkout` · `#/faq` · `#/contact` · `#/legal`

## Status

Final approved version, 7 October 2026. Desktop, tablet, phone and browser-zoom
behaviour are complete — see the end of HANDOFF.md before making any change.
