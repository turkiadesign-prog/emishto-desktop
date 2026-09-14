# É-MISHTO — Session Handoff

> ## \u26a0 PROJECT STATE: EXPORT SNAPSHOT \u2014 MOBILE REFINEMENT **IN PROGRESS**
>
> This repository is a **snapshot taken mid-way through the mobile design pass.**
> Desktop and tablet are approved and LOCKED. The phone layout is **NOT finished** \u2014
> several phone sections have been rebuilt, several have not been reviewed on a real
> device yet, and a planned "Mobile Pass 2" was never started.
>
> **A future session must not assume the phone design is complete.** See
> `## MOBILE \u2014 WHAT IS DONE vs IN PROGRESS` and `## EXPORT AUDIT (recorded at snapshot time)

Every local `src`, `href`, `poster`, `url()` and quoted asset path in `index.html` was
extracted and resolved against the real file tree.

- **215 local references found \u2192 211 resolved.**
- 4 apparent misses (`three/addons/…`) are **import-map keys**, not files \u2014 they map to
  unpkg CDN URLs in the `<script type="importmap">` block. Not an error.
- **1 genuine dead reference found and removed:** the hero `<video>` carried
  `poster="assets/img/hero-landing-poster.jpg"` and that file has never existed (no
  `assets/img/` directory). It was 404ing on every load, so removing the attribute
  changed **nothing visually** and eliminated the only broken local reference. If a
  poster frame is wanted later, add the file and restore the attribute.
- **0 root-relative paths**, no `<base>` tag, no service worker, no manifest \u2014 safe for
  a GitHub Pages project subpath.
- **0 environment-specific paths**: scanned for `blob:`, `file://`, `localhost`,
  `/projects/`, `uploads/`, `.bundles`, `/tmp/`, sandbox and vendor names \u2014 all zero.
- **External runtime dependencies (4):** Google Fonts CSS + `fonts.gstatic.com`,
  GSAP 3.12.5 and ScrollTrigger (cdnjs), three.js 0.184.0 (unpkg). Plus three social
  links (Instagram, Facebook, Pinterest). The site is **not** fully offline-capable.

**Deliberately excluded from the export** (not referenced by the site; they would
mislead a future session): `debug-*.json` and `debug2.txt` (throwaway probe dumps),
`screenshots/`, `uploads/` (the raw monogram upload \u2014 already copied to
`assets/brand/`), `.bundles/`, `.thumbnail`, and three **stale generated bundles**
(`emishto-offline.html`, `emishto-review.html`, `index-standalone.html`) which are
snapshots of an OLDER state of the site. `index.html` is the only source of truth.

**All of `assets/` was included (273 files), including imagery not currently
referenced** \u2014 alternate angle shots and hover frames belong to the product
photography set and were not pruned.

**Functional verification of the exported copy** (run against `emishto-site/index.html`,
not the working file): home renders (17 route templates, `EMCard` present, 7 worlds,
SVG wordmark injected, GSAP loaded, hero video path resolves); **0 broken images across
every route tested** \u2014 front (51 imgs), object (24, 4 gallery thumbs), artists (17),
creator (23, 6 works), journal (15), archive (26, "9 works"), bag (9), account (13),
food (14), spotlight (26), checkout (8). Filters: 4 groups in desktop order, 15 \u2192 7 \u2192
15 objects on filter/reset with `available` restored as default, at BOTH 1200px and
390px. Search returns 2 hits for "vera" and the zero-result state reads
`No objects match “zzzz”.`. Mobile bottom nav renders É-MISHTO Home / Account / Bag with
the monogram image loading. Product grid 3 columns at 1200px, 1 column at 390px.
No horizontal overflow anywhere. Console: only the two pre-existing GSAP
"target not found" warnings (`.hero-object` and an empty selector) \u2014 harmless, present
before the export.

**Routing note (pre-existing, not introduced):** every route that is actually linked
resolves correctly. Two templates are not reachable: `story` exists but is **not in the
router whitelist and is never linked**, so `#/story` silently falls back to `front`;
`legal` is whitelisted and linked from the desktop footer only (its phone links were
hidden in the footer restructure). Left as-is \u2014 development is stopped.

## NEXT TASKS / DO NOT LOSE`.
>
> **Export contents:** `index.html` (the entire site \u2014 all routes, CSS and JS are
> inline in this single file), `assets/` (all imagery, video, brand marks),
> `three-d-stage.js` + `support.js` + the two `.dc.html` files (the separate Aster
> Vessel 3D component), `HANDOFF.md`, `README.md`, `.nojekyll`.
>
> **Serving:** open `index.html`, or serve the repo root with GitHub Pages. Every local
> path is relative \u2014 no root-relative (`/assets/…`) references \u2014 so it works from a
> project subpath (`user.github.io/repo/`) as well as a domain root. Three external
> CDNs are required at runtime: Google Fonts, GSAP 3.12.5 (cdnjs), three.js 0.184.0
> (unpkg). **The site needs a network connection for fonts and scroll animation.**


Single-file editorial marketplace, `index.html` (~450KB). Hash-router SPA, all pages inlined.
Assets live in `assets/` (must be uploaded alongside index.html).

**Deploy:** GitHub Pages → repo `emishto-site`, user `turkiadesign-prog` →
https://turkiadesign-prog.github.io/emishto-site/
Replace `index.html` + upload `assets/` to publish. I cannot push to GitHub — only read.

**Gotcha:** the bundled file stores `/` as `\u002F` and double-escapes quotes.
Edit via `run_script` accounting for encoding, or use `str_replace_edit` on plain regions.

---

## Brand tokens

**Colours**
```
--white      #FBFAF8   dominant surface
--cream      #F1EBDE   text on dark grounds
--cream-deep #EAE2D1   accent bands only
--aubergine  #401020   burgundy — accent, italics, active states
--driftwood  #A88754   script signatures
--coffee     #755940
--lavender   #D4BAD1   newsletter band
--ink        #1C1C1C   headings, body, price
--ink-read   #3A3A3A   secondary reading copy
--ink-60     #5A595A   eyebrows, nav resting, form labels
--ink-38     #767676   captions, breadcrumbs, availability
```
Proportion target: 75–85% white · 10–15% beige · 5–8% burgundy.

**Fonts:** Cormorant Garamond (serif) · Gantari (sans) · Meie Script (script) · mono micro-labels

**Motion:** `--ease cubic-bezier(0.33,1,0.68,1)`, `--t 300ms`, GSAP + ScrollTrigger (CDN).

---

## Routes

front · world/{arts,fashion,body,home,vintage,newin,food} · object · spotlight ·
journal (Stories) · bag · checkout · artists (Creators) · apply · creator (Workspace) ·
account · about · faq · contact · legal

---

## Architecture

**`EMCard` (`src-card`)** — the single product-card renderer. All cards everywhere go through it.
- `EMCard.html(product, variant)` — source of card markup
- `EMCard.build(p, variant)` · `EMCard.read(el)` · `EMCard.hydrate(root)`
- `EMCard.statusOf(p)` · `EMCard.resolve(p)` · `EMCard.action(p)`
- Variants: `full` (image · name · creator · price · action) and `compact` (no creator line)
- Category pages call `EMCard.html()` from two grid builders; authored shelves
  (home, spotlight, object, workspace) are hydrated in place via `hydrate()`

**Card field contract** — every card shows: Image · Name · Creator · Category · Price · Availability · one Quick Action.

**Status system** — explicit data, no name hashing:
- `productType: "unique" | "repeatable"`
- `availability: "available" | "sold" | "private" | "out_of_stock"`
- Vocabularies can't cross: unique never `out_of_stock`; repeatable never `sold`/`private`
- Current demo data: 43 unique · 21 repeatable — 53 available · 5 sold · 3 private · 5 out of stock
- Actions: available → Take it home · out_of_stock → Notify me (prototype, in-place "We'll write ✓")
  · sold/private → inert reserved slot (keeps footer geometry; needs placeholder text for its line box)

**Creator resolution** — `EMCard.resolve()` is the single source. Provenance strings
("Vienna, c. 1910") and specs ("2024 · 55 × 70 cm") are rejected as creators and fall
through to a `DATA` table of placeholder creators (Andra Kovács, Vera Lune, Grádina,
Oda Ceramics, Templ Studio, Hällwyl Archive, Laurence Leenaert). The Creator **filter**
uses the same resolver, so labels/slugs/dataset all match.

**Sparse category state** — `applyFilters()` toggles `body.is-sparse-shelf` when
`shown > 0 && shown <= 3`. Holds the 3-track grid down to 700px (no 2+1 orphan),
then 1 column. Left-anchored, never centred or enlarged. 0 results → `.filter-empty`.

---

## Typography system (implemented)

| Role | Font | Size | Wt | Tracking | Colour |
|---|---|---|---|---|---|
| Functional H1 `.page-title` | serif | `clamp(40px,4.6vw,72px)` | 300 | 0 | `--ink` |
| Dashboard H1 `.dash-head h1` | serif | `clamp(34px,4.4vw,62px)` | 300 | 0 | `--ink` |
| Structural H2 | serif | `clamp(30px,3.2vw,46px)` | 300 | 0 | `--ink` |
| H3 | serif | `clamp(22px,2vw,28px)` | 400 | 0 | `--ink` |
| Lead | serif | `clamp(19px,1.7vw,23px)` | 300 | — | `--ink` |
| Body | sans | 16px | 400 | — | `--ink`/`--ink-read` |
| Small body | sans | 14px | 400 | — | `--ink-read` |
| Micro / eyebrow `.micro` | mono | 13px | — | 0.20em | `--ink-60` |
| Caption | mono | 12px | — | 0.16em | `--ink-38` |
| Breadcrumb `.crumbs` | mono | 12px | — | 0.14em | `--ink-38` |
| Product name `.piece-name` | serif italic | 24px (20 compact) | 400 | 0 | `--aubergine` |
| Product meta `.piece-maker` | sans | 14px | 400 | — | `--ink-read` |
| Price `.piece-price` | mono | 15px | — | 0.12em | `--ink` |
| Availability `.piece-status` | mono | 12px | — | 0.16em | `--ink-38`* |
| Primary action | mono | 13px | — | 0.18em | — |
| Secondary action | mono | 12px | — | 0.16em | — |
| Primary nav `.head-cats a` | mono | 13px | — | 0.16em | `--ink-60` → `--ink` |
| Utility nav | mono | 12px | — | 0.16em | `--ink-60` |
| Filter control | mono | 12px | — | 0.16em | `--ink`/`--ink-38` |
| Filter option | mono | 12px | — | 0.04em | inherit |
| Form label | mono | 12px | — | 0.16em | `--ink-60` |
| Standard input | sans | 16px | 400 | — | `--ink` |
| Compact input | sans | 13px | — | 0.04em | `--ink` |

\* Sold/private → `--aubergine`; out_of_stock → `--ink-60`

**Structural H2 selectors:** `.beat-title`, `.sec-head h2`, `.about-maker h2`, `.co-sec-title`, `.ws-head h2`

**Two parallel systems** — *functional* typography is standardised; *editorial/display*
is deliberately exempt. 17 named display exceptions: `.hero-title`, `.script-name`,
`.spotlight-name`, `#edit .beat-title` (76px), `#journal .beat-title`, `.subscribe-line`,
`.feature-title`, `.spotlight-quote`, `.profile-quote`, `.q-prompt`, `.object-name`,
`.maker-quote`, `.head-search-box input`, `.world-name`, `.hbc-wordmark`, `.seal`, loader tagline.

Component exceptions: account `.btn-ghost-sm` (12px), workspace title/price inputs
(display-scale), newsletter/footer inputs (13px compact).

Italic italics run in three deliberate tiers (display · product-name · body emphasis),
with a global rule sending italics to `--aubergine` on light grounds.

---

## Responsive grid rules (verified by cascade replay)

| Width | Category main | Sparse | Home `#edit` |
|---|---|---|---|
| >920px | 3 | 3 | 4 |
| 701–920px | 2 | 3 | 2 |
| 561–700px | 2 | 1 | 2 |
| ≤560px | **1** | 1 | 1 |

Phone rule needs `body` prefix `(0,4,1)` to out-rank the ≤920px rule — order alone
is not enough, and it must sit **after** that rule in the sheet.

Mobile header ≤760px: logo + hamburger/search only; ≤1340px collapses nav to hamburger.

---

## Entrance / navigation motion

- **Burgundy `.em-loader`** — the only entrance. ~4.9s, click-to-skip, 6s failsafe,
  skipped under `prefers-reduced-motion`. Gated on `sessionStorage em_seen` so it plays
  **once per session** — not on refresh, not on returning home.
- `lift()` dispatches `em:lift`; the hero composes beneath the rising curtain via
  `revealHero()`. Guarded so inner routes / repeat visits reveal immediately.
- **`#em-transition` removed** — no overlay between click and content.
- `location.reload()` on `hashchange` **retained** (routing architecture untouched).
- The old `.curtain` layer and the hidden INDEX nav (`.index-trigger` / `.nav-veil`,
  ~29KB across 16 templates) were both removed. Floating chat widget also removed.

---

## Product photography system (confirmed against implementation)

**Product system only.** Stories, Creators, homepage/editorial imagery and category
heroes will have their own specifications — do not generalise these ratios.

| Group | Ratio | Recommended upload | Implementation |
|---|---|---|---|
| Product card | 3:4 | 1500 × 2000 | `.piece .ph` — primary catalogue image |
| Object page · main gallery | 3:4 | 1500 × 2000 | `.object-stage .ph` + `.object-thumbs .ph`, both 3:4 |
| Object page · editorial image | flexible / editorial | ≥1400px short edge | `.about-maker .ph` — `aspect-ratio:auto`, height from the text column |
| Object page · detail gallery | 1:1 | 1500 × 1500 | `.about-gallery .ph`, four images |

**Main gallery** is an ordered set: image 1 is the primary/front view and is the first
thumbnail; the rest are alternate product views. Thumbnails switch the large image,
set a quiet active state, and rewrite the hero `alt` + wrapper `data-label` from the
thumbnail's own `data-label`. The card's primary image can eventually be wired to
gallery image 1 (`p.img`) and its hover frame to image 2 (`p.img2`) — both frames are
3:4 `cover`, so no visual translation is needed.

**Gallery functional audit (verified):**
- Thumbnails are **real `<button type="button">` controls** — keyboard focusable
  (`tabIndex 0`), activated by Enter/Space through native button semantics, each with
  an `aria-label` ("Show front view", "Show three-quarter view", "Show neck and rim
  detail", "Show surface detail"). The selected thumb carries `aria-current="true"`,
  moved in step with the `is-active` class, so the current image is exposed to
  assistive tech. Native chrome is reset (`appearance:none`, zero padding/border/margin,
  `font/color:inherit`, `box-sizing:border-box`) so they are visually identical to the
  former `<div>`s — 72×96, 3:4, 12px gap, `cover` crop, gallery height all unchanged.
  `:focus-visible` shows a subtle 1px `--aubergine` outline at 3px offset, distinct
  from the `--ink-38` selected outline.
- All four switch the hero, move `is-active` + `aria-current`, and update the hero
  `alt` and wrapper `data-label`. Verified by mouse click, focus and keyboard
  activation at 1200 / 768 / 430 / 390px — identical behaviour at every width, strip
  fits its container everywhere (332px at 390px), no overflow.
- The script is count-agnostic (`querySelectorAll('.object-thumbs .ph[data-thumb-src]')`),
  so any number of thumbs works. But the strip is a fixed-72px flex row with a 12px
  gap: 4 thumbs = 324px and fit inside 332px at 390px. **5+ thumbs would overflow at
  phone width** (5 × 72 + 4 × 12 = 408px). Deferred — the approved gallery uses four.
- The whole object page is **hardcoded and single-product** — ids like `#aster-hero-shot`,
  `#obj-hero-img`, paths under `assets/aster/`. It has no connection to `EM_WORLDS`, so
  card and gallery images are maintained separately today.

**Editorial image is independent** — do not force it to 3:4 or 1:1. `.about-maker .ph`
is explicitly `aspect-ratio: auto; height: 100%` inside a
`minmax(0,1fr) / minmax(0,1.4fr)` grid with `align-items: stretch`, so its rendered
ratio follows the adjacent text column and viewport. This already matches the approved
rule — the design intends it as its own slot; no change needed.

**Third image mechanism to reconcile later:** `bindHoverAngles()` cycles a card's
`data-angles` list every 550ms on hover. That is a separate image set from both
`card_image_hover` and `gallery[]`. When the CMS fields land, decide whether `angles`
survives or is folded into `gallery[]` — three parallel sources for "other views of the
same object" is one too many.

**Eventual CMS fields:** product → `card_image`, `card_image_hover`, `gallery[]`
(ordered, `[0]` primary, each with `alt` + optional caption), `angles[]`;
object editorial → `editorial_image`, `detail_images[]` (exactly 4).

**Known inconsistencies, not defects:**
- Current square (1024×1024) catalogue prototype assets do not follow the 3:4 upload
  guideline. Prototype-data inconsistency — they are centre-cropped into the 3:4 box.
- The home-shelf `contain` + 8% padding treatment (`[data-route="front"] .ph.has-img`)
  is an **intentional existing exception**, kept for now. A 3:4 upload there produces a
  padded fit rather than a crop — the one place the strict card guideline does not
  yield a strict crop.
- Object-page assets are already 3:4 (e.g. `aster-01-front.png` 896×1200), i.e. below
  the recommended 1500×2000 but correctly proportioned.
- Prototype image weight is ~1.2–1.3MB per PNG — fine for a prototype, too heavy to ship.
- **Card dimensions are swap-proof.** Every `.ph` has a fixed `aspect-ratio` and its
  images are `position:absolute; inset:0`, so no image can change card height — only
  what gets cropped. No intrinsic dimensions are stored in product data.
- **Per-product overrides that exist today** (escape hatches, no CSS change needed):
  `p.imgStyle` / `p.img2Style` inject inline styles on the two card images, `p.tone`
  sets the placeholder ground, `p.clip` adds overflow clipping, `p.speed` adds the
  parallaxed `.ph-inner` (`inset:-12% 0`). Already in use — e.g. `transform:scale(1.4)`
  on the home small shelf and `width:124%; object-fit:contain` on the spotlight
  portrait, both compensating for images with too much negative space. Once uploads
  follow the 3:4 spec these should become unnecessary; treat surviving ones as a signal
  the source image was mis-cropped.
- `object-position` is never set anywhere — every crop is centred. With the strict
  upload rule this is correct (the client crops before upload) and no per-product
  position field is needed.
- **Object gallery height is deliberately untouched.** There is a separate collected
  page-review note about aligning the main-image + thumbnail block with the Returns
  row; that belongs to the later visual-corrections pass.

---

## MOBILE CATEGORY PAGE (\u2264560px) \u2014 LAYOUT CORRECTED / UNDER VISUAL REVIEW

**Not approved.** Phone-scoped; desktop verified unchanged. Four filters only
(`01 CATEGORY`, `02 PRICE`, `03 CREATOR`, `04 AVAILABILITY`) on the existing
`fstate` / `FDEF` / `applyFilters()` / `resetFilters()`. No Colour, no Sort.
Cards: one full-width per row (`is-wide` fully removed).

### TWO ROOT CAUSES FOUND (both were inherited base rules)
The phone sheet reuses `#chip-band`, so every base `.chip-band` / `.filter-*`
declaration still applies unless the phone rule resets it. Two caused visible faults:

1. **Clipping + the empty middle gap.** `.chip-band` base is
   `display: flex; flex-wrap: wrap; align-items: baseline`. `flex-wrap: wrap` on a
   height-capped column container wrapped the sheet into a **second flex column** \u2014
   `.filter-bar` rendered at x=145 extending to x=525 on a 380px sheet (that gap WAS
   the first column). `align-items: baseline` additionally stopped children stretching,
   so the header and apply button shrank to content width. Fixed with
   `flex-wrap: nowrap` + `align-items: stretch` + `gap: 0`. **No `overflow: hidden`
   was used to mask it.** Base `.filter-option`'s `padding-right: 20px` was also
   clearing the option column and is now reset.
2. **Empty left column.** Base `.filter-label { display: none }` \u2014 on desktop the
   group name lives on the `.filter-trigger`, which the sheet hides. The phone rule
   set `grid-column` but never `display`, so all four labels were 0\u00d70. Fixed with
   `display: block`.

**Lesson for future phone work on this sheet:** always check the base rule before
assuming a phone declaration is enough \u2014 `#chip-band` carries a full desktop
cascade.

### Geometry
- Sheet padding 20px; `.filter-bar` aligned exactly to the sheet.
- Groups `grid-template-columns: 40% minmax(0, 1fr)` \u2014 measured **40 / 60**
  (129.6/194.4px at 390, 145.6/218.4px at 430).
- **Left column visible in all four groups:** `01 | CATEGORY`, `02 | PRICE`,
  `03 | CREATOR`, `04 | AVAILABILITY` \u2014 mono 11.5px `--ink`, numeral in `--ink-38`,
  `align-self: start` so it holds its position for the whole section.
- Options mono 13px / 1.45, 42px rows, `padding: 4px 0 4px 26px`, left-aligned.
- **Square selection control:** `::before` 11\u00d711px, 1px `--ink-38` outline,
  `border-radius: 0`, filling `--aubergine` on `:has(input:checked)` with the label
  text going burgundy. Radios use the same square language; single-select logic
  unchanged. The whole 42px row stays the tap target.
- **No per-group dividers** \u2014 36px of white space instead.
- Header: `FILTERS` at the gutter, \u2715 in a 44px box flush right, 1px divider.
- Foot: quiet `RESET` above a full-width outlined `VIEW N OBJECTS` (89% of sheet, 54px).

### Verified
**390 / 430:** all four left labels visible and identical in width (130px / 146px);
columns 40/60; every option box left-aligned at a single x (150 / 166); square 11\u00d711
with 1px `rgb(118,118,118)` outline unselected and `rgb(64,16,32)` filled when
selected; **the square reflects real input state** \u2014 toggling the input drives
transparent \u2192 burgundy \u2192 transparent and the count follows 15 \u2192 8 \u2192 15
(measured with the transition disabled, since a synchronous read otherwise returns the
transition's start value); radio group still single-select (exactly 1 checked); Reset
restores `available` + 0 categories + 15 objects; **nothing clipped** (longest ink
“In private collection” ends at 342 of 380 and 358 of 420); no horizontal scroll in the
bar; doc overflow \u221210px.

**1200 unchanged:** `.filter-label` `display: none` with no numeral, groups `block`,
options 12px with the original `20px / 20px` padding, **no `::before` square**
(`content: none`), native 14px inputs visible at opacity 1, triggers `flex`, sheet head
and Filters trigger `display: none`, band `relative` / `wrap` / `baseline`, count
unstyled with no border, 3-column product grid.

**Screenshot still not capturable:** the capture tool cannot render iframe content and
the preview viewport cannot be resized to 390px, so phone verification is measured
geometry only. On-device review needed.

## PHONE TYPOGRAPHY SYSTEM \u2014 IMPLEMENTED / UNDER VISUAL REVIEW

**Not approved. Awaiting on-device review.** One isolated block marked
`PHONE TYPOGRAPHY SYSTEM`, sitting just above the global italic rule. Revert =
delete that block. Typography only \u2014 no fonts, colours, layouts, card or menu
architecture touched.

**Breakpoint `@media (max-width: 700px)`** \u2014 a deliberate phone-only threshold,
separate from the \u22641340px hamburger/utility-bar architecture. Tablet and desktop
keep the approved scale.

**Display (Cormorant, weights/italics/burgundy unchanged):** page title 38/1.02 \u00b7
object name 34/1.02 \u00b7 feature title + spotlight quote 30/1.08 \u00b7 subscribe line
28/1.12 \u00b7 world name + about heading 27/1.05 \u00b7 shelf title 26/**1.15** (was 28/1.6)
\u00b7 story title 20/1.2 \u00b7 story tabs 18/1.25 \u00b7 product name 20/1.15 (was 24/1.6) \u00b7
lead 18/1.45 \u00b7 object quote 17 unchanged \u00b7 byline 15.

**Functional (Gantari):** body stays **16px**, leading 1.6 \u2192 1.5 (client explicitly
declined 15.5px) \u00b7 story dek + about copy 16/1.5 \u00b7 object price 16 \u00b7 product maker,
maker line, spec dd 13 \u00b7 footer links 13 unchanged.

**Micro \u2014 contextual selectors only, base `.micro` never overridden.** Reduced only
the oversized mono roles: product price 15\u219212, world meta 15\u219212, spec dt 14\u219212.
The 13px hero/kicker/object micro went to 12, not 11 \u2014 the 12px functional floor is
held for everything read or tapped. Breadcrumbs, statuses, filter labels/count/reset
and bottom-bar Account/Bag stay 12. Menu labels and tile names stay 11. Close \u2715
14px visually, box still 44\u00d744.

**Menu:** destination links 24 \u2192 19px/1.25 with padding lifted 9\u219212px, so rows
measure **48px** \u2014 above the 44px minimum, not below it. Group rhythm
(`padding-top: 30px`) untouched, so the reclaimed height became white space rather
than density.

**Filters:** type unchanged. `.filter-option` gained `min-height: 44px` + flex
centring, so phone rows went **41 \u2192 44px** \u2014 larger, never smaller. Not a redesign.

**Verified.** 390/430/700 all on the new scale (page title 38, shelf 26, name 20,
maker 13, price 12, lead 18, filter row 44). **768 untouched:** title 40, shelf
28/44.8, name 24, maker 14, price 15, filter row 41. **1200 untouched:** name 24,
shelf 36, title 55.2, foot 102. Card feet uniform on every shared surface \u2014 category,
Archive (9 cards) and Creator Works (6 cards) all report a single foot height of 94px
and a single card height of 598px at 390px. No title wrapping in the menu (no link
exceeds one row), no horizontal overflow at any width, no new console errors.

## MOBILE HAMBURGER MENU \u2014 CONCEPT REVISION 02 UNDER REVIEW

**Not approved. Awaiting the client's on-device review.** Revert = delete the
`.mm` / `.mu-bar` CSS block (marked `MOBILE HAMBURGER MENU`, above the global italic
rule), the `.mu-bar { display:none }` base rule and `:root{--mu-h}`, then restore the
previous short `src-menu`. The old `.ham-menu` rules are still in place, unused.

**Breakpoint:** the existing `@media (max-width: 1340px)` \u2014 no new global breakpoint.
Chosen because that is exactly the range where the header already hides nav, Account
and Bag, so the bottom bar restores the utilities the header drops. **Flagged for the
client:** 1340px includes small laptops; say the word and it narrows to \u2264700px.

### Revision 02 changes
1. **Open-menu header is burgundy** `#401020` with `--cream` wordmark and close; the
   border-bottom was removed so it meets the white body cleanly. Height still 71px,
   close still 44\u00d744. The menu body stays `--white`.
2. **The utility bar is now permanent and singular.** It moved out of `.mm` into its own
   `.mu-bar` element appended to `<body>`, `position: fixed`, `z-index: 210` (above the
   menu's 200), so the open menu shares the one bar instead of owning a copy. Verified
   `document.querySelectorAll('.mu-bar').length === 1` and zero `.mm-utils` remaining.

**Bar:** `--white` ground, 1px hairline, three equal columns, items 127\u00d747 (390) /
140\u00d747 (430) in `#401020`, mono 12px / 0.16em, `env(safe-area-inset-bottom)` honoured,
`.bag::after` underline suppressed.

**Content clearance \u2014 one shared rule:** `body { padding-bottom: calc(var(--mu-h) +
env(safe-area-inset-bottom) + 12px) }` inside the breakpoint (60px computed). No page
was individually touched. Footer gap measured 11\u201312px on Home, Art, Object, Creators,
Stories and Archive.

**Functionality reuse:** Search is a `<button>` that closes the menu then clicks the
existing `.head-search-btn` one tick later (the same click otherwise bubbles to
src-search's "click outside closes" handler and shuts it). Account and Bag are links to
`#/account` and `#/bag`; clicking either drops the menu first, so two full-screen
surfaces never stack \u2014 verified `stacked: false`. Bag carries the `bag` class so
`src-cart`'s existing `.bag sup` update reaches it, plus a MutationObserver mirror:
header 5 \u2192 bar 5.

### Two bugs found and fixed during this revision
- `--mu-h` was 47px but the bar renders 48px with its hairline, so the footer sat flush
  at 430px. Now 48px plus a 12px cushion.
- **Desktop leak:** above 1340px `.mu-bar` had no CSS at all, so it rendered as a plain
  block at the end of every desktop page. Fixed with a base `.mu-bar { display: none }`
  outside the media query \u2014 the breakpoint is now the only place it turns on.

**Verified 390 / 430:** one bar, pinned to the viewport bottom, burgundy items, correct
on Home / Art / Object / Creators / Stories / Archive. Open menu: burgundy head
`rgb(64,16,32)`, cream wordmark and close `rgb(241,235,222)`, white body
`rgb(251,250,248)`, no head border, 7 tiles unchanged, `01 \u2014 Shop` at y=324 / 342,
Contact clears the bar when scrolled, body locked while open, no layout jump (head 71px
vs header 70px). Close \u2715, nav tap and Escape all reset with no leftover state.
Overflow 0 everywhere. **Desktop at 1400px:** bar `display:none`, body padding 0,
nav flex with 9 links, hamburger none, Bag block, header 70px \u2014 unchanged.
No new console errors.

## PAGE-REVIEW COMMENTS PASS \u2014 DONE

All ten corrections implemented and verified at runtime across 1200 / 768 / 430 / 390px.
The outstanding creator-filter runtime check from the interrupted pass is now closed.

**Creator filter (was outstanding):** Arts offers Andra Kov\u00e1cs \u00b7 \u00c9-MISHTO Atelier \u00b7
Iris Calloway \u00b7 Laurence Leenaert \u00b7 Lena Marash \u00b7 Mihail Vlasov \u2014 all genuine
people/studios, zero descriptive strings. Selecting \u00c9-MISHTO Atelier filters to
1 object (Standing Form, Bronze Study); Andra Kov\u00e1cs to 7; deselect returns 15.
The `Period` spec row still reads \u201cContemporary archival study\u201d, correct as
descriptive metadata.

**Responsive sweep, all four widths:** spotlight 5px top / 5px bottom; intro holds three
lines (225 / 212 / 190px) with no overflow; Bag and its count share one colour in base
and scrolled states; bylines 500 / 16px italic burgundy; filter empty reads
\u201cNo objects match these filters.\u201d; the three search actions all compute 13px /
`rgb(90,89,90)` with tags BUTTON, A, A and stay inside the viewport; footer reads
Art \u00b7 Fashion \u00b7 Body & Beauty \u00b7 Home & Objects \u00b7 Food \u00b7 Vintage \u00b7 Archive;
zero visible \u201croom\u201d words; overflow \u221210px on every page and width.

**Object gallery (`max-width: 675px`, unchanged as instructed):** hero ratio computes
exactly 0.750 at all widths \u2014 534\u00d7712 at 1200, 675\u00d7900 at 768 (cap engages),
372\u00d7496 at 430, 332\u00d7443 at 390. Thumbnails stay 4 \u00d7 72px at 3:4 and the strip
fits its container everywhere. Mouse click, focus and keyboard activation all switch the
hero and move `aria-current` correctly at every width. Detail gallery 4 columns on
desktop/tablet, 2 on phone.

**Regression:** Archive resolves, 9 works, 6 Sold + 3 In private collection, no purchase
or notify actions, nothing else admitted. Creator profile still one `Works` band of 6
cards, no Sold section, `See the Archive \u2192` link intact. Search returns results and
both the 1-character hint and zero-result state behave. No new console errors \u2014 GSAP
target warnings and one THREE.js shadow-map deprecation notice, both pre-existing.

## Desktop / shared polish pass (visual review corrections)

All ten approved corrections implemented. Text edits verified by exact-match
replacement counts; CSS and layout verified live at 1200px unless noted.

1. **Spotlight spacing** \u2014 `.spotlight` measured 6px top / 14px bottom. Bottom now
   matches top: `padding: clamp(4px,0.6vh,8px) var(--gutter)`. Verified 4px / 4px,
   burgundy, grid and portrait ratio untouched.
2. **Home intro line break** \u2014 was one `<br>` after \u201cfor\u00A0creators\u201d, leaving
   \u201cand composes / like a gallery\u201d to wrap awkwardly. Added a second `<br>` before
   \u201cand composes\u201d plus `text-wrap:balance`. Copy unchanged (note: there is a
   **non-breaking space** in \u201cfor\u00A0creators\u201d \u2014 any future find/replace must include it).
   Verified three clean lines: 225 / 212 / 190px in a 280px column.
3. **Bag count colour** \u2014 root cause: `.site-head.scrolled .bag` went cream but no rule
   touched `.bag sup`, which kept its own `--ink-60`, so the count stayed dark on the
   burgundy scrolled header. `.bag sup` is now `color: inherit` (and the inverse
   override too), so label and count are one unit in every state. Verified identical
   `rgb(241,235,222)` in base, scrolled and inverse.
4. **Story bylines** \u2014 `.entry-sign` gains `font-weight: 500; font-size: 16px`. Italic,
   burgundy (`rgb(64,16,32)`) and hierarchy preserved; not bold.
5. **Creator filter \u2014 real names only.** \u201cContemporary archival study\u201d was in **three**
   places, not one: `EMCard.DATA`, the object page maker line, and \u2014 the actual filter
   source \u2014 **six `maker:` fields in `EM_WORLDS`** (Aster Vessel, Cassian Keepsake Box,
   Standing Form Bronze Study, each duplicated across worlds). All now
   **\u00c9-MISHTO Atelier**, consistent with the object copy that calls it an in-house
   archive piece \u201cnot attributed to any real maker\u201d. The `Period` spec row still reads
   \u201cContemporary archival study\u201d \u2014 correct there, it is a period, not a creator.
6. **Filter empty state** \u2014 now \u201cNo objects match these filters.\u201d Actions and styling
   unchanged.
7. **Object gallery height \u2014 partially addressed; read this before signing off.**
   The imbalance reverses with viewport width. Measured: at 1200px the gallery block
   ends at 982px against the Returns row at 1262px (**280px short**); at the narrower
   preview width it is 458px short. The gallery is only *taller* than the info column
   above roughly 1700px, because the left track is ~53.5% of content width so a 3:4
   hero grows without limit (\u22481177px tall at 1920). Fix applied: `.object-stage > .ph
   { max-width: 675px }` \u2014 caps the hero at 675\u00d7900 by **width**, so 3:4 stays exact and
   nothing is cropped or distorted; hero + 14px + the 96px thumb row then lands \u22481170px,
   approximately level with Returns on large displays. Below ~1700px the gallery is
   naturally shorter than the info column; making it level there would require widening
   the left grid track, which changes the right column's width and reflows the specs \u2014
   out of the approved scope, so **not done**. Needs a decision if levelling at 1200px
   and below matters.
8. **Search empty actions** \u2014 `.head-search-results a` (0,1,1) plus its `!important`
   colour was beating `.head-search-acts > *` (0,1,0), rendering the two links at the
   17px result size. Added a container-scoped rule so all three match at mono 13px /
   0.18em / uppercase / `--ink-60`. Button stays a `<button>`, links stay `<a>`;
   focus behaviour untouched.
9. **Footer Food** \u2014 added before Vintage in all **16** footer copies, Archive still
   last: Art \u00b7 Fashion \u00b7 Body & Beauty \u00b7 Home & Objects \u00b7 Food \u00b7 Vintage \u00b7 Archive.
10. **Old \u201cRoom\u201d terminology** \u2014 replaced in visible copy: \u201cour vintage room\u201d \u2192 \u201cour
    vintage collection\u201d; \u201cWhy we chose this room\u2019s edit\u201d \u2192 \u201cWhy we chose this edit\u201d;
    \u201cFilter by room\u201d \u2192 \u201cFilter by category\u201d. **Deliberately left** (reported, not
    changed): the `.room-filter` / `.room-chip` / `data-room` internal names, the
    `data-screen-label="From the same room"` (authoring label, not user-facing), two
    source comments, and one \u201cthe room\u201d in a colour note.

**Verification:** COMPLETE \u2014 see the PAGE-REVIEW COMMENTS PASS section above.
One behaviour note from that sweep: the 675px hero cap now also engages at 768px
(675\u00d7900 instead of 681\u00d7908) \u2014 a 6px difference, ratio still exact.

## Creator works + global Archive

### Pass 1 \u2014 Creator profile complete body of work: DONE, verified
The profile's two bands are merged into **one `Works` grid** holding all three unique
states. Implemented as markup only \u2014 no `EMCard` change, no CSS change.
- Removed the second `shelf-band`, the `Sold works` heading and the \u201cKept visible,\n  like a gallery archive\u201d caption. The `shelf-foot` (\u201cRead more in Stories\u201d) moved into\n  the single band, so spacing is unchanged apart from the removed band's own padding.
- Heading is now `Works` / *Each one of one* \u2014 no hardcoded count, so it stays accurate
  as works are added. The one-of-one framing is still literally true: all six pieces
  are `[unique, \u2026]` in `STATUS`.
- **Indy added** (`[unique, private]`) using existing status data \u2014 no duplicate
  product, no new status. Authored as a plain placeholder `.ph tone-ink` to match the
  page's other cards, priced \u20ac3200 as on the spotlight page.
- Card order is chronological (2025 available \u00d7 3, then 2024: two sold, then Indy),
  not grouped by status.
- Sold/private cards are authored with **price only, no button** \u2014 `EMCard.hydrate()`
  supplies the status row and withholds the action from `statusOf().purchasable === false`.
  Confirmed working, which is why no `EMCard` edit was needed.

**Note for whoever opens this page next:** the public profile lives inside
`section.view-panel.public-frame`, which is `display:none` until the
`Public Profile Preview` toggle is clicked (the default view is `Creator Workspace`).
Measuring it without clicking that toggle returns zero heights for everything \u2014 not a
bug.

**Verified** at 1200 / 768 / 390px: one band, 6 cards, 3 / 2 / 1 columns; statuses read
Available \u00b7 Available \u00b7 Available \u00b7 Sold \u00b7 Sold \u00b7 In private collection; only the three
available cards carry `data-quickadd`; **every card's `.piece-foot` is 102px and every
card height is identical** (518 desktop, 614 tablet, 615 phone), so the reserved action
space and row alignment EMCard establishes are preserved. No overflow, no new console
errors. Hero, portrait, quote, biography and typography untouched.

### Pass 2 \u2014 global Archive: DONE, verified
Route `#/archive`, added to the existing hash-router whitelist and rendered by a new
`src-archive` script (run only on that route, after `src-world-data` so `EM_WORLDS`
exists). **No `EMCard` change, no CSS change, no new card component, no second
availability model.**

- **Membership** is a pure query over `EMCard.statusOf()`:
  `type === "unique" && (key === "sold" || key === "private")`. Everything else is
  excluded by construction \u2014 `statusOf()` already maps repeatable sold/private to
  `out_of_stock`, so no repeatable product can qualify.
- **Framing** is not \u201csold products\u201d. Title `Archive.`, intro *\u201cOne-of-a-kind works that
  have found their place, kept here as part of the \u00c9-MISHTO story.\u201d*, plus a quiet
  \u201c9 works\u201d count. Sold and private coexist in one grid with their own labels \u2014 no
  sub-sections.
- **Grid** is the stock `.shelf-band > .shelf`, so it inherits the category 3 / 2 / 1
  responsive rules and every card style with zero new selectors.
- Cards are built with `action: false`; `EMCard` still reserves the action slot, so
  every foot is 102px and rows align exactly as on category pages.
- **New In is skipped** in the scan \u2014 it re-lists other rooms' objects, so including it
  would duplicate cards.
- **Two works are listed explicitly** in `src-archive`: `The Empty Room, Morning` and
  `Dawn Fragment`. Both are authored directly into the creator/spotlight templates and
  have never existed in `EM_WORLDS`, so the data scan cannot see them \u2014 but they carry
  real `[unique, sold]` STATUS rows and appear in Laurence's Works grid, so omitting
  them would make the Archive contradict her profile. Statuses still resolve through
  `statusOf()`. **Delete that block once real catalogue data covers every product.**
- **Empty state** reuses `.filter-empty` / `.fe-msg` / `.fe-acts`: *\u201cNothing has entered
  the Archive yet.\u201d* with `Explore New In \u00b7 Explore Creators`. No new empty-state
  system, and the word \u201croom\u201d is not used.
- **Access:** `Archive` added to the footer `Shop` column in **all 15 footers**; a quiet
  `See the Archive \u2192` link added to the creator profile's existing `.shelf-foot` using
  the established `.world-view-all` language. **Not** added to the header nav. Food
  deliberately **not** added to the footer.

**Verified** at 1200 / 768 / 430 / 390px: direct navigation to `#/archive` resolves
(no fall-through to `front`); 9 cards, 3 / 2 / 1 columns; 6 Sold + 3 In private
collection; membership cross-checked against the whole STATUS model \u2014 0 wrongly
included, 0 missing, 0 duplicates, and none of the 28 available-unique or 5
out-of-stock-repeatable products leaked in; no card carries `data-quickadd` or
`data-notify`; foot height 102px and card heights uniform at every width; no
horizontal overflow. Footer link reads `Archive` with Food absent; creator profile
still shows **one** `Works` band of 6 cards with no `Sold works` section and the
`See the Archive \u2192` link present. No new console errors (GSAP target warnings only).

**Approved intent:** a Creator profile is a permanent record of that creator's body of
work \u2014 available, sold and in-private-collection unique pieces together in ONE Works
grid, with status visible and no purchase action on the unavailable ones. No separate
Archive section inside a profile. Separately, a global Archive across all creators for
historical one-of-a-kind work.

**Creator profile today \u2014 close, but split in two.** The profile is hardcoded markup
(not data-filtered), so there is **no availability default to remove** \u2014 it never
behaved like the Shop's available-only default. It already keeps sold work visible,
which is the right instinct, but as a **second shelf-band**: `Six works, one of one`
(3 available cards with `Take it home`) followed by `Sold works` with the caption
*\u201cKept visible, like a gallery archive\u201d* (2 `.piece.is-sold` cards, no action, with a
`.sold-label`). Changes needed: merge the two bands into one Works grid; retire the\n\u201cKept visible, like a gallery archive\u201d caption (it reads as the separate archive we\nno longer want); add the creator's in-private-collection piece, which is currently\nmissing from the profile entirely (`Indy` is `[unique, private]` for Laurence but only\nappears on the spotlight page). Also note the heading says \u201cSix works\u201d over 5 cards \u2014
a copy/count mismatch to fix in the same pass.

**Global Archive does not exist.** No route, page or section \u2014 confirmed by searching
the whole file. The only hits are the caption above, the creator name \u201cH\u00e4llwyl Archive\u201d,
and the phrase \u201carchive collection\u201d in the object-page copy. Nothing to reuse or
rename.

**EMCard already powers this with zero modification.** `STATUS` stores every product as
`[type, key]` where type is `unique | repeatable` and key is
`available | sold | private | out_of_stock`; `LABEL` maps them to \u201cAvailable\u201d, \u201cSold\u201d,
\u201cIn private collection\u201d, \u201cOut of stock\u201d; and `statusOf()` returns
`purchasable: key === "available"`, so sold and private already render the status row
with **no purchase action**. Critically, `statusOf()` also guards the two vocabularies
from crossing: `unique + out_of_stock \u2192 sold` and `repeatable + sold|private \u2192
out_of_stock`. That means **the approved Archive logic is already enforced by the data
model** \u2014 a repeatable product can never be sold/private, and `notifyHTML()` gives
out-of-stock repeatables a notify action, confirming they are treated as returning to
stock. The Archive is therefore a pure query, no new component:
`statusOf(p).type === "unique" && (key === "sold" || key === "private")`.

**Current Archive population:** 6 unique+sold (Low Tide Tryptich, The Empty Room
Morning, Dawn Fragment, Dusk Lamp, Silk Opera Gloves, Mantel Clock Walnut) + 3
unique+private (The Empty Chair, Indy, Travel Chess Set) = **9 objects** \u2014 enough to
fill a grid without looking sparse.

**Recommendation on In Private Collection: include it.** Both states are permanently
unavailable unique works and `statusOf()` already treats them identically
(`purchasable: false`). Excluding private would leave holes in the historical record
the Archive exists to keep. Caveat: private is about ownership and discretion, not a
completed sale, so the Archive's framing should be neutral (\u201cno longer available\u201d),
never \u201csold\u201d, and each card keeps its own distinct label.

**Recommended entry point: the footer, not the main nav.** The footer's `Shop` column
(Art / Fashion / Body & Beauty / Home & Objects / Vintage) is the natural home \u2014 it is
already the site's full browsing index, and adding `Archive` there keeps the approved
main navigation (New In / Art / Fashion / Body / Home / Vintage) untouched. A second
quiet entry from the Creators ecosystem would suit the content, using the existing
`.shelf-foot` \u201cView more \u2192\u201d idiom at the end of a creator's Works grid. Explicitly not
recommended: the footer's `For creators` column, which is creator-facing (Why sell,
Apply), not collector-facing.

## MOBILE \u2014 WHAT IS DONE vs IN PROGRESS

**Breakpoints in play.** There is no single "mobile" breakpoint:
- `\u22641340px` \u2014 pre-existing: hamburger trigger, mobile utility bar, condensed header.
- `\u2264700px` \u2014 phone typography system.
- `\u2264560px` \u2014 phone layout work (category page, footer, spotlight, grids).
- `\u2264720px` / `\u2264760px` \u2014 a few older section rules.
A future pass should treat `\u2264560px` as the phone layout breakpoint and `\u2264700px` as
the phone type breakpoint. **Do not add a new global breakpoint.**

### Phone work COMPLETE and measured (still wants on-device review)
- **Hamburger menu** (rev 02): full-screen, burgundy head with the real SVG wordmark
  aligned to `var(--gutter)` exactly as the closed header, image rail, SHOP / DISCOVER /
  ABOUT groups at 17px in 46px rows, body-scroll lock.
- **Permanent bottom utility bar** (`.mu-bar`): monogram = Home (`assets/brand/em-monogram-aubergine.png`,
  `aria-label="É-MISHTO Home"`), Account, Bag with live count. Search stays in the top header.
- **Phone typography system** (`\u2264700px`, pass 2): tiers 34 \u2192 23 \u2192 18 \u2192 15 \u2192 11/12.
- **Category page** (`\u2264560px`): sticky control area, subcategory rail, filter bottom
  sheet, one full-width product card per row on BOTH shelves.
- **Footer** (`\u2264560px`): logo full-width, Shop in 2 columns, Customer care | For
  creators, Follow | Settings, credit-only bottom row at 11.5px.
- **Artist Spotlight** (`\u2264560px`): single-column flow via `display: contents` on the
  text wrapper + explicit `order`; image fills a 3:4 frame with `object-fit: cover`.
- **Newsletter rhythm**, **maker's-note row**, **home category list hierarchy**,
  **Stories 3/2/1 grid**, **object detail gallery 4/2**, **search Close 44px target**.

### Phone work NOT DONE
- **Mobile Pass 2 was never started.** The B-level items from the mobile audit remain
  open: filter bar wrapping AND scrolling at 430px, a ~9px phantom horizontal scroll in
  the filter bar, Creators role grid density, newsletter input/button sizing.
- **Four deferred responsive rules** from the deleted malformed `\u2264920px` block were
  judged potentially useful and NOT reintroduced: `.hero-core`, `.hero-object`,
  `.spotlight-grid`, `.spotlight-portrait`.
- **No phone screenshot was ever captured.** The capture tool cannot render iframe
  content and the preview viewport cannot be resized, so ALL phone verification in this
  file is **measured geometry** (computed styles + `getBoundingClientRect`), not pixels.
  Treat every "verified" phone claim as geometrically correct but visually unreviewed.
- Object page: 5+ gallery thumbnails would overflow on phone; gallery/Returns vertical
  alignment left to visual judgement (`max-width: 675px` is the current hero cap).

### Measurement gotchas that cost time \u2014 read before verifying
1. `.fade-up` and `.rv-line` scroll-reveal transforms offset boxes. Neutralise them
   before measuring positions, but read `documentElement.scrollWidth` for overflow
   **before** injecting the neutraliser (it inflates it by ~45px).
2. A synchronous `getComputedStyle` right after `.click()` returns the **transition's
   start value**. Disable transitions to assert a state change.
3. `#chip-band` carries a full desktop cascade. Two phone bugs came from inherited base
   rules (`flex-wrap: wrap` wrapping the sheet into a second column;
   `.filter-label { display: none }` blanking the sheet's left column). **Always read
   the base rule before assuming a phone declaration is enough.**
4. `[data-route="front"] .ph.has-img img { width:84%; contain }` (the intentional Home
   shelf exception) has specificity 0,3,2 and beats `!important` on a lower-specificity
   selector. The spotlight override is scoped above it; the Home exception is intact.

## Known open items

1. **`--ink-60` and `--ink-38`** are now distinct (`#5A595A` / `#767676`) — done, but
   several consumers were audited only at the token level.
2. **`.entry-sign` and body-emphasis italics** compute to burgundy, not `--coffee` —
   the global burgundy-italic rule wins on order. Sizes now inherit (16px) correctly.
   Needs an explicit exception if a distinct colour is wanted.
3. **Component headings unnormalised** (deferred): `.shelf-title` 42px,
   `.dash-panel h2` 40px, `.path-card h2` 58px, `.q-result h2`.
4. **Object-page price** `.object-price` is sans 18px/300, not the mono price role.
5. **Bag + checkout metadata** still weight 300, outside the product/small-body roles.
6. **Old micro scale persists** in `.q-kicker`, `.quiz-step`, `.co-step`, `.view-tab`,
   `.view-note`, `.q-result .flag-note` (mono 14–15px).
7. **Footer sub-captions** below the caption scale: `.foot-trust-item p`,
   `.foot-news-band > p` (serif 13px), `.foot-newsletter-note` (mono 11px).
8. **`.vis` at 7.5px** (workspace public/private tags) — far below any role.
9. **`.opt-note` mobile override** conflicts with the 14px small-body role.
10. **Creator resolution lets one provenance string through on Arts** — the Creator
    filter lists `contemporary-archival-study` as if it were a person. One product.
    Known issue, deliberately not fixed in the option-relevance pass; needs a look at
    `EMCard.resolve()`'s rejection rules.
11. **Availability filter** has up to 5 options (All + 4 statuses) reading
    `dataset.status`; only statuses present in the world are rendered.
    Legacy `dataset.avail` still written but unread.
12. **Sparse styling covers the main shelf only** — small shelf keeps its own grid.
13. **Client copy pending** — Returns, Shipping/Delivery, Payment, Commission wording
    was deliberately emptied (containers kept, `.price-note:empty` hidden). Legal/Privacy
    shipping+payment sentences flagged, left intact.

---

## Verification lessons (important)

- **Never verify a cascade question with injected `!important`** — it bypasses the
  cascade and can only prove a value *renders*, never that a rule *wins*. This produced
  two false positives. Verify by replaying the real rule set in document order inside
  sized iframes and reading the winning declaration.
- **`.filter-option` is a `<label>` wrapping an `<input>`** — click the `input`, not the
  label; label clicks double-fire and net to no change.
- I cannot resize the preview viewport; responsive checks are done by cascade replay.
  A real device pass at 390 / 430 / 560 / 768 / 900px is still worth doing.

---

## Completed work (this session, newest first)

**All items below are DONE and verified. Do not reopen without a verified regression.**

### Mobile fix pass 1 — A-level defects only
- **Stories grid — 3 / 2 / 1.** `.journal-grid` was locked at 3 columns at every
  width (97px entry cards at 390px). Now `repeat(2,1fr)` ≤920px and `1fr` ≤560px
  (with the `body` prefix, same cascade reason as the category phone rule).
  Verified: 1 col at 390/430, 2 at 768, 3 at desktop; entry `.ph` 332×249 at 390px,
  4:3 ratio and the `clamp(20px,2.6vw,40px)` gap untouched.
- **Object detail gallery — 4 / 2.** `.about-gallery` held 4 columns at phone width
  (~75px squares). Now `repeat(2,1fr)` ≤700px. Verified: 2 cols at 390 (161×161) and
  430 (181×181), 4 at 768 (163×163) and desktop (140×140); 1:1 and the 10px gap
  unchanged. Deliberately never 1 column.
- **Search Close ✕ touch target.** A `::after` pseudo-element gives the label a
  66×44px hit area centred on the text — no change to font size, tracking, colour,
  position, the overlay box (380×311 at 390px) or the input (332×58). Escape, scrim
  and label click all still close and clear.
- No horizontal overflow at 390 / 430 / 768 / 1200 on either route after the change.
  No new console errors.

### ⚠ Discovered while fixing: a dropped media block — NOW RESOLVED
A stray closing brace after `.foot-social a:hover` caused the entire following
`@media (max-width: 920px)` block to be dropped from the CSSOM: error recovery
consumed the brace as the start of a qualified rule and swallowed the block as its
body, so none of its nine declarations ever applied.

**Cleaned up safely.** The stray brace and the dead block were removed *together*
in one edit — a verified no-op: parsing the region in isolation before and after
yields an identical rule list (`@media 560 .shelf.shelf-small`, `@media 920 #edit
.shelf`, `@media 560 #edit .shelf`). Only that one block was ever affected; the
560px and both `#edit` blocks were always live, which is why the home-shelf fix
worked. Brace depth across all six style blocks now returns to 0.

**Removing the brace alone was deliberately NOT done** — it would have reactivated
all nine rules at once, three of them regressions: `.shelf` / `.shelf.shelf-small`
would fight the verified 1-col phone grids and the sparse rules, `.foot-cols` would
coarsen the fluid 6/3/2 footer to a fixed 2 columns at tablet, and `.world-meta`
would hide world-row meta on tablet and phone. `.journal-grid` was already
superseded by the approved 2-col@920 + 1-col@560.

**Four rules deferred to the later mobile pass, deliberately not reintroduced:**
`.hero-core` (`1fr` + `padding-top:16vh`), `.hero-object` (`max-width:320px`),
`.spotlight-grid` (`1fr`), `.spotlight-portrait` (`max-width:340px`). Nothing else
handles these, so the hero and spotlight do not currently stack at ≤920px — no
overflow results, but they are worth a look when mobile work resumes. The other
five selectors are intentionally gone for good.

### Filter option relevance
- **A filter group renders only when it offers a real choice.** `ROOM` (built once per
  world from `w.shelf` + `w.small`) records which option values can actually match a
  product there; `groupHTML()` drops non-matching options and returns `""` when fewer
  than 2 discriminating choices remain. `"All"` and the Availability default are
  control states and never count. Price membership mirrors `inPrice()`'s half-open
  `[lo, hi)` test rather than reimplementing it — `inPrice()` untouched.
- **Colour filter no longer rendered.** `data-color` derives from `p.tone`, a legacy
  placeholder-background token, not product colour metadata — and `.has-img` forces the
  ground to white, so the swatch never corresponded to anything visible. The tone
  system, `COLORS`, `colorsInRoom` and `colorOpts` are all intact for when real CMS
  colour data arrives; the group is simply not composed into the bar.
- **The earlier "Colour renders zero options on Arts" note was wrong** — Arts rendered
  6 swatches with a real distribution. The defect was the data source, not the count.
- No reset or label changes were needed: `updateTriggerLabel()` already returns early
  on a missing group, and `resetFilters()` works through `querySelectorAll`, which is
  empty-safe. `atDefault("color")` stays true because `fstate.color` is never touched.
- `.filter-bar` separators stay correct — `border-right` per group with `:last-child`
  clearing it, so a group not rendering needs no CSS change.

**Verified filters per world** (meaningful options, excluding All/default):

| World | Category | Price | Creator | Availability | Colour |
|---|---|---|---|---|---|
| Arts | 4 | 4 | 6 | 3 | hidden |
| Fashion | 2 | 2 | 4 | 2 | hidden |
| Body & Beauty | 3 | — | 4 | 2 | hidden |
| Home & Objects | 3 | 2 | 5 | 3 | hidden |
| Vintage | 3 | 3 | 3 | 3 | hidden |
| New In | — | 4 | 5 | — | hidden |
| Food | — | — | — | 2 | hidden |

— = group not rendered. Food drops Category (0 subcategories), Creator (1 creator) and
Price (all 3 products under €100), leaving Availability alone. New In drops Category
(no subcategories) and Availability (only `available` exists). Body drops Price (single
band). Availability default stays `available` everywhere, including the worlds where
the group is hidden. Reset, Clear filters, the zero-result state and cross-filtering
all verified on Arts; no console errors beyond the known GSAP warnings.

### Object-page main gallery
- **Primary image added as thumbnail 1.** The strip held only the three alternate
  angles, so once a user clicked away there was no route back to the front view.
  Order is now front · three-quarter · neck and rim · surface.
- **Quiet active state** — `.object-thumbs .ph.is-active { opacity:1; outline:1px solid
  var(--ink-38); outline-offset:2px }`. Outline, not border, so the 72px × 3:4 geometry
  is untouched. Thumbnail 1 carries it on load.
- **Hero `alt` and `data-label` now follow the selection**, read from each thumbnail's
  own `data-label` (populated; `.object-thumbs .ph::after { content:"" }` keeps it
  invisible). Previously every swapped image stayed labelled "front view". No new
  caption system.
- Untouched: 3:4 ratios, image sizes, `object-fit`, object-page layout, `EMCard`,
  card hover behaviour, the home `contain` exception, editorial section, 1:1 gallery.

### Empty states
- **Filter zero-result state — designed.** `.filter-empty` is now a message + action
  row: *No objects in this room match these filters.* with `Clear filters` (a real
  `<button>` calling the existing `resetFilters()`, then focusing the Category trigger)
  and `Explore New In`. Left-aligned at the gutter; `clamp(120px,18vh,200px)` bottom
  padding replaces the breathing room the collapsed shelf bands used to give, so the
  newsletter band no longer crowds it. No extra body state, no kept-alive empty band.
  `aria-live="polite"` added to `#filter-count`; no `role="alert"`.
- **Search zero-result state — designed.** Burgundy serif italic 17px
  *No objects match “{query}”.* plus a centred mono action row: `Clear search`
  (`<button>`, empties the field, restores the blank state, refocuses the input, keeps
  the overlay open) · `Explore New In` · `Explore Creators`. `.is-msg` on the results
  container lifts the 42vh scroll cap so the actions can't be scrolled out of reach.
- **Short-query helper state** — exactly one character shows *Two letters to begin.*
  (mono 12px, `--ink-38`, no actions). Empty input stays visually empty.
- **Unsafe query interpolation removed.** The query reached `results.innerHTML` by
  string concatenation; it is now written with `textContent` inside DOM-constructed
  nodes, so markup-like input can only render as plain text. Verified with
  `<img src=x onerror=...>`. Query truncated at 40 chars.
- **Stale-result bug fixed.** `Close ✕` and the scrim were owned only by each
  template's inline script, which removes `.is-open` and nothing else. `src-search`
  now binds its own `close()` to Close ✕, the scrim and Escape, so every path clears
  query and results — no template edits, both handlers idempotent. The Escape handler
  carries **no `.is-open` guard**: the inline listener is bound first and has already
  removed the class, so guarding on it would skip the clear.
- Empty/helper messages carry their own `aria-live="polite"`; the results list has no
  `role="status"`, so ordinary result typing is not announced.

### Filter default state
- **Reset now restores the shop default, not "all".** Three paths disagreed with
  `groupHTML()`'s own `def`: the Reset handler set `avail="all"`, the `active` test
  compared against `"all"` (so Reset ✕ was visible on a fresh load), and
  `updateTriggerLabel()` didn't recognise `"available"` as a default (so the
  Availability trigger rendered active on load). Added `FDEF` as one source of truth
  plus `defOf()` / `atDefault()` (array-aware, which also fixes Reset staying visible
  after deselecting every price band), and extracted the named **`resetFilters()`**
  that the empty state's Clear filters action reuses.

### Filters
- **Price filter multi-select bug — FIXED.** `inPrice(v, sel)` now accepts `"all"`, a
  single range string, or an array; matches **ANY** selected band. Was throwing
  `TypeError: range.split is not a function`, which aborted `applyFilters()` mid-loop
  and silently froze the grid and count.
- **Price ranges use half-open `[lo, hi)` boundaries.** The old inclusive test made
  €100/€500/€1000 match two bands at once. Band labels and values unchanged; no product
  currently sits on a boundary (31 under €100 · 20 in €100–499 · 10 in €500–999 · 11 at €1000+).
- **Category, Creator, Availability and Price filters all verified** through the real UI
  (driving `<input>`, not the wrapping `<label>`). Union, deselect, clear, cross-filter
  combinations, and Reset all correct. No console errors.
- **`.filter-empty` owns the zero-result state** — `is-sparse-shelf` is guarded with
  `shown > 0` so it never activates at 0.
- Availability filter expanded to 5 options (All + 4 statuses), reading `dataset.status`.
- Creator filter routed through `EMCard.resolve()` so filter labels/slugs match card text.

### Layout / responsive
- **Sparse category state — `body.is-sparse-shelf`, toggled in `applyFilters()` when
  `shown > 0 && shown <= 3`.** Count-driven, never category-name-driven, so it also
  applies to any larger category filtered down.
- **Sparse layout — 3 columns above 700px, 1 column at ≤700px.** Avoids the 2+1 orphan
  row. Left-anchored at the gutter (46px), never centred or enlarged. 700px chosen from
  card width: ~199px at 3 tracks is the readable floor for a 24px serif name.
- **Category mobile grid — 3 desktop / 2 tablet / 1 mobile.** Phone rule needs the
  `body` prefix `(0,4,1)` **and** must sit after the ≤920px rule; equal specificity
  earlier in the sheet loses.
- **Home `#edit` shelves — 4 desktop / 2 tablet / 1 mobile.** They sit outside
  `.shelf-band` and previously had no responsive rule at all (4 columns at 390px → ~74px
  cards). Scoped to `#edit` so category/spotlight/related grids are untouched.

### Typography
- **Typography system — DONE.** Passes 1, 2A, 2B, 2C complete, plus a final cleanup pass
  and the full system sheet (table above). Client's two direct complaints addressed:
  titles reduced (page titles from up to 128px → 72px) and body copy strengthened
  (weight 300 → 400, grey reading copy `#5a595a` → `#3a3a3a`).
  Consolidations: 11 body sizes → 2 · 5 eyebrow sizes → 2 · 8 button sizes → 2 ·
  4 filter styles → 2 · 6 page-title sizes → 1 (+1 dashboard variant).
- **`--ink-38` updated to `#767676`.** Previously identical to `--ink-60` (`#5A595A`),
  which collapsed the intended hierarchy. Now four distinct tiers across 72 references.
  Token-only change; consumers were not individually recoloured. Verified: breadcrumbs,
  ONE OF ONE, Available status, sold label, object-price micro, filter supporting text,
  bag remove action — and all dark-ground cream/lavender overrides still win.
- **Header scrolled burgundy state menu-colour regression — FIXED.** Pass 2C replaced
  `.head-cats a`'s `currentColor` with an explicit `--ink-60`, breaking inheritance; on
  scroll the header swaps `.is-inverse` out for `.scrolled` but keeps the burgundy ground,
  so the nav alone rendered dark grey on burgundy. Added `.site-head.scrolled .head-cats a`
  to the cream override. State selector only — no typography touched.

### Product card system
- **`EMCard` consolidation** — one renderer for every card on the site.
- One-of-one classification (eyebrow above H1, unique products only) + Availability spec row.
- Quick Action system: Take it home / Notify me / inert reserved slot.
- Availability + `productType` data added; the character-code hash retired entirely.

### Structure / cleanup
- Burgundy reduced as a surface: spotlight body → warm white (hero band kept),
  FAQ → `#f5f2ed`, workspace preview → `#f5f2ed`.
- Removed: floating chat widget, hidden INDEX nav (`.index-trigger` / `.nav-veil`,
  ~29KB across 16 templates), `#em-transition` overlay, the invisible `.curtain` layer.
- Entrance gated to once per session via `sessionStorage em_seen`.
- New In + Food categories added to nav and as full category pages.
- Client policy copy (Returns / Shipping / Payment / Commission) emptied for
  client-supplied wording; containers kept, `.price-note:empty` hidden.

---

## NEXT TASKS / DO NOT LOSE

Remaining client-feedback tasks, in priority order:

1. **Mobile fix pass 2 — B-level refinements** (audited, not yet implemented):
   filter bar wraps to two rows *and* scrolls horizontally at 430px (`flex-wrap:wrap`
   + `overflow-x:auto` + `flex-shrink:0` all active); 9px phantom horizontal scroll in
   the filter bar at 768px; filter option rows 41px and search quick chips 33px (both
   under 44px); Creators role grid at 2 columns / ~154px cards at 390px; newsletter
   input 15px / button 19px — identical at 1200px, so a global control-size question
   for the client, not a mobile fix.
2. **The four deferred responsive rules** — `.hero-core`, `.hero-object`,
   `.spotlight-grid`, `.spotlight-portrait` (see the resolved dropped-block entry).
   Reintroduce individually, each verified, when mobile work resumes.
3. **Real-device mobile pass still worth doing.** Everything above was measured by
   loading the real page in sized iframes (390 / 430 / 768 / 1200) and reading
   computed styles and rects — reliable for layout, but the scrolled-header state
   could not be verified this way (the scroll-triggered class never engaged inside a
   nested iframe, likely a GSAP/ScrollTrigger artifact). Also note `Close ✕` and the
   Objects/Creators/Stories quick chips exist in only 5 of the ~16 header copies;
   the rest render the search overlay with input + results only.
4. **Handwriting font exploration — INTENTIONALLY POSTPONED.** Meie Script is currently
   used for `.script-name` and `.spotlight-name` only. Client wants to explore
   alternatives before it spreads further.
5. **Final full-site cleanup / audit** — resolve the deferred typography items in
   "Known open items" above, sweep remaining hardcoded colours, and do a last
   consistency pass across all routes.

### Ground rules for the next session

**Do not reopen or refactor completed systems unless a verified regression is found.**
The typography system, `EMCard`, the status/availability system, creator resolution,
the sparse-category state, the responsive grid rules, and the filter predicates are all
complete and verified. Treat them as settled. If something looks wrong, verify it against
the real cascade / real UI first — several apparent bugs this session turned out to be
faulty verification method, not faulty code.

**Caveats that still need checking** (carried forward, not blockers):
- No real-device responsive verification yet (see task 1).
- The Colour filter is hidden, not removed — `p.tone`, `COLORS`, `colorOpts` and
  `data-color` all still exist and are still written. Intentional: real product-colour
  filtering returns when CMS colour data does.
- `dataset.avail` is still written but no longer read; harmless, but it will confuse
  anyone reading the code.
- `.entry-sign` and body-emphasis italics compute burgundy rather than `--coffee`;
  the global italic rule wins on order. Needs an explicit exception if a distinct
  colour is wanted.
- Sparse styling covers the main category shelf only, by design. Extending it to the
  small shelf would be a deliberate decision, not a fix.
- Legal / Privacy shipping + payment sentences are flagged but intentionally intact —
  removing them would break the paragraphs. Awaiting client legal copy.

## PHONE PASS \u2014 SESSION OF 12\u201313 SEP (IN PROGRESS)

Mobile refinement is **NOT finished**. Desktop and tablet are locked; every change
below is scoped to a phone breakpoint (`max-width: 700px` or `max-width: 560px`).

**Header \u2014 burgundy on phone (`\u2264700px`).** A block mirroring the desktop
`min-width:1341px` rule: solid `var(--aubergine)` on every page and scroll state,
blur off, no hairline, cream wordmark/hamburger; transparent only on Home
(`body[data-route="front"] .site-head:not(.scrolled)`) over the hero video. Verified at
390/430 on Home, Art, Object, Stories. The 701\u20131340px tablet band is untouched, and
the open hamburger menu keeps its own burgundy header.

**Home category rows (`\u2264560px`).** `.world-row .num` dropped to 10px to match the
`.world-meta` subcategory line, plus `padding-left: 10px`.
`#edit .beat-head .micro` ("Selected for you") also to 10px, which frees enough width
for the title to hold two lines \u2014 "This week" / "we love." \u2014 neither wrapping.

**Artist Spotlight (`\u2264560px`).** The three authored `.rv-line` spans in
`.spotlight-quote` run `display: inline` (with a `::before` space between them) so the
sentence reflows onto two lines at the existing 30px. `.spotlight-portrait` is 88% wide,
centred via `margin: auto`, and its image switched from `cover` to `contain` so the
collage is no longer cropped at the edges. Text scale: bio 14px/1.5, signature 25px,
CTA 11px, kicker 11px. `.spotlight-bio br:last-of-type` is hidden \u2014 the desktop
break before "poetry" left "the quiet" stranded; the closing sentence now flows and the
paragraph is 7 lines instead of 8. The first break (after "artisans.") is kept.

**Newsletter reveal fix (all widths, real bug).** `applyFilters()` collapses shelf bands
with zero visible pieces, which shortens the document after GSAP measured its
ScrollTriggers \u2014 on Vintage the footer's `.fade-up` kicker and subscribe form then sat
past the shortened scroll range and never fired (stuck at `opacity: 0`). Fixed with a
guarded `ScrollTrigger.refresh()` on the next frame after the band-visibility pass.
Presentation-only; no predicates, state, defaults or counts touched.

**Hero video.** `playbackRate` 0.8 with `defaultPlaybackRate` and re-assertion on
`play`/`ratechange`/`seeked`. Unconditional \u2014 it applies on phone too. 0.8 is the floor
for this 24 fps source (~19 unique fps); below that frames repeat and judder shows. A
genuinely slower, calmer hero needs a **retimed re-export of hero-landing.mp4**, not a
browser-side rate change. The 54s scale-drift experiment was tried and reverted.

**Product cover images.** Many prototype covers were replaced with client-supplied
photography this session (Vintage: Cassian box, Aster Vessel + detail, Apothecary Jars,
Postage Tin, Glass Inkwell, Theatre Binoculars, Letter Opener, Silk Opera Gloves, Travel
Chess Set, Garnet ring, Mantel clock; Home: Dusk Lamp, Beeswax Tapers, plus the D\u00e9cor /
Furniture / Fragrance and Antiques / Jewelry / Collectibles panel tiles). New files land
as `*-cover.png` beside the originals; second/third images were left untouched
throughout, so hover reveals and object galleries are unchanged.

**Known open items (phone).** Not started: remaining Mobile Pass 2 B-level refinements,
handwriting-font exploration, photography upload guide. The Aster Vessel's main
catalogue record (New In / Home & Objects) still uses `aster-01-front.png` \u2014 only the
Vintage shelf record got the new cover. "Earrings" has no subcategory in the data; the
Home collage's earring tile points at Fashion \u203a Accessories as a substitute, pending a
decision.

## SESSION OF 13 SEP \u2014 ACCOUNT / APPLY / ABOUT POLISH (PHONE PASS CONTINUES)

Mobile refinement remains **IN PROGRESS**. Desktop is locked except where noted.

**Page rename.** "About" \u2192 **Why sell on \u00c9-MISHTO** in all 19 entry points: the header
link on every page (17), the mobile menu's 03 \u2014 About group, and the page's own
breadcrumb. Route stays `#/about`; the H1 ("A house for *objects with soul.*") is
unchanged.

**Footer link bug (real defect).** The footer's "Why sell on \u00c9-MISHTO" pointed at
`#/artists` (the Creators directory) in all 16 copies, so it opened a different page
than the header link. Repointed to `#/about`.

**Scroll restoration bug (real defect, all widths).** Routing is a real page reload per
hash change, so the browser restored the previous page's scroll offset and every
navigation landed mid-page. Fixed with `history.scrollRestoration = "manual"` + a
scroll-to-top, placed in `<head>` \u2014 a first attempt at the bottom of the document ran
after restoration and still landed at 2200px. Verified: Art@2200 \u2192 Archive opens at 0.

**"In good company" partner section (desktop + phone).** Inverted to burgundy like the
Artist Spotlight: `--aubergine` ground, cream title with driftwood italic, driftwood
partner names, cream-alpha roles/kicker/hairlines. Also fixed an orphaned grid row \u2014
`auto-fill minmax(250px,1fr)` produced 5 columns at some widths, stranding For\u00eat
with four empty cells; the grid now uses counts that divide 6 (6 / 3 / 2).

**Creator portraits.** All 11 cards in the Why-sell "Our creators" grid were empty tone
placeholders; each now reuses a portrait already in the project, cropped `cover` with
the focal point lifted.

**Creator card hierarchy (desktop + phone).** Both creator card types now match the
product card: name 24/20px Cormorant italic burgundy, discipline 12px mono `--ink-38`,
location 14/13px Gantari `--ink-read`. The Creators-directory cards needed
`!important` to beat their inline styles.

**Card language.** Account cards (order/wish/pay/addr) and the Apply quiz choices adopted
the Why-sell `.path-card` treatment: hairline box, roomier padding, `border-color` lift
on hover; quiz choices gained a burgundy edge when chosen (was an underlined-row list).

**Phone typography \u2014 Home tiers applied to Why sell, Account and Apply.** Home's
measured scale is the reference: **42** editorial heading \u00b7 **34** page title \u00b7 **24**
section \u00b7 **20** card/story title \u00b7 **14** body Gantari \u00b7 **13** maker line \u00b7
**12** CTA/status \u00b7 **11** micro label. Applied: page titles 38\u219234, section/panel
headings 30/26\u219224, quiz question 26\u219234 (it is each screen's title), option titles
20, body and form inputs 19/16\u219214 Gantari, all micro (kickers, tags, hints, labels,
crumbs, seg tabs, step counter, Exit) \u219211, buttons \u219212px / 13\u00d722 / 45px tall.
Reading copy switched from the display serif to Gantari 14/1.5.
Two values were initially guessed wrong (18px titles, 11px buttons) and corrected
against Home's real values \u2014 measure Home before extending this scale further.

**Inline styles removed.** Three `.btn-solid` and three `.btn-ghost-sm` buttons had
`font-size`/`padding` hardcoded in the markup, which no stylesheet rule could override.
Removed so they inherit the shared button size (their 30px top margins kept).

**Small fixes.** `.nb` no-break helper added so "\u00c9-MISHTO" never splits after the
hyphen (applied in the Archive intro). Category second shelf
(`#world-shelf-small`) dropped from 2 columns to 1 at \u2264560px so every category
listing is one card per row.

**Still open.** HANDOFF's earlier open items stand: Mobile Pass 2 B-level refinements,
handwriting fonts, photography upload guide, the Aster Vessel's catalogue record still
on its old cover, and no "Earrings" subcategory in the data (the Home collage tile
points at Fashion \u203a Accessories as a substitute). Account form *labels* are 14px
Gantari rather than 11px mono \u2014 deliberate, since they sit directly above their inputs.

## SESSION OF 13 SEP (LATE) \u2014 OBJECT PAGE + CARD RHYTHM (PHONE, IN PROGRESS)

Mobile refinement remains **IN PROGRESS**. All changes below are inside
`@media (max-width: 700px)`; desktop and tablet untouched.

### Object page \u2014 order and typography

**Reading order.** Crumbs and ONE OF ONE now sit above the gallery. The two lines live
inside the info column, so instead of moving markup the wrapper is dissolved into the
grid at phone width (`display: contents`) and its children ordered around the stage.
Reads: crumbs \u2192 ONE OF ONE \u2192 hero \u2192 thumbnails \u2192 title \u2192 maker \u2192 price.

**Typography, all on the Home tiers.** Title 34 \u00b7 editorial statement 30 \u00b7 section
headings 24 \u00b7 maker's note 18 (serif italic reads smaller than Gantari at the same
size) \u00b7 body/price 14 \u00b7 maker line + spec values 13 \u00b7 crumbs, ONE OF ONE, spec
labels 12 \u00b7 ship note + TAKE IT HOME 11.

**Editorial section (`.about-maker`).** Label 13\u219211, body 16\u219214. Heading stays
**30px** \u2014 that is the editorial-statement tier (same as the Spotlight quote and the
subscribe line), not the 24px section tier. Governed by `h2:has(#obj-about-h2)`.

**Dead space above the label.** The section's first child is the editorial image, which
collapses to 0px height on phone yet still held a grid row plus its 32px gap \u2014 66px of
nothing. Taken out of flow (`display: none`) since it renders nothing there.

**Optical centring.** `.about-maker` padding is deliberately uneven (34 top / 59 bottom):
the label carries 8px leading above and the gallery overhangs 17px below, so equal
padding read as 50/25. The compensated values give a true 42/42 ink-to-rule centre.
**Do not "fix" this to equal padding.**

**"View all Vintage" moved below the product list.** The band becomes a flex column at
phone width, `.shelf-head` is dissolved with `display: contents`, and the link is
ordered last (`order: 3`) with 26px above. Title gains 30px below it so "Selected for
you" no longer touches the first image. Desktop keeps title and link side by side.

### One card gap everywhere (`row-gap: 40px`)

Gaps ranged from 16px to 80px. Now a single rule covers `.shelf`, `.shelf-small`,
`#world-shelf`, `#world-shelf-small`, `#obj-related-shelf`, `#archive-shelf`,
`.creator-grid`, `.maker-grid`, `.journal-grid`, `#artist-role-grid`,
`.public-frame .shelf`, `.ws-grid` **and `.shelf-band .shelf:not(.shelf-small)`** \u2014
that last selector (line ~1200, `clamp(48px, 7vh, 80px)`) is more specific than the
plain class list and kept Creator Works at 80px until its specificity was matched.
Verified 40px measured on Home (both), category (both), Object, Archive, Creator Works.

### Cascade note \u2014 read this before changing phone type

Several values resisted change because **stale rules from the first phone pass sat later
in the stylesheet**. Removed rather than overridden: `.maker-quote` 17px,
`.about-maker h2` 27px, `.entry-dek, .about-maker p` 16px, and a dead
`.about-maker h2` 24px of my own. Two more needed matching specificity instead:
`#obj-ship-note` and `.shelf-band .shelf:not(.shelf-small)`. If a phone size will not
take, grep for a later duplicate before adding another override.

### Measurement caveat

Card grids sampled inside a tall iframe can read 50\u201368px instead of 40px \u2014 the
GSAP `.fade-up` reveal is mid-flight and its transform offsets the boxes. Let the
reveal settle, or ignore transform-affected readings.

### Open / unresolved

- The user reports "some issues" with card spacing that measurement cannot reproduce \u2014
  every grid reads 40px. Needs a screenshot to locate.
- Story-card ink-to-ink spacing is larger than product cards by structure (kicker +
  image margin), not by gap. Left as designed.
- Earlier open items all still stand: Mobile Pass 2 B-level refinements, handwriting
  fonts, photography upload guide, Aster Vessel catalogue cover, no Earrings subcategory.

## SESSION OF 13 SEP (LATE) \u2014 HOME RHYTHM, OBJECT PAGE, SPOTLIGHT, WHY-SELL

Phone refinement **still IN PROGRESS**. Desktop untouched except where noted.

**Card gaps \u2014 Home now fully even (real defect, twice).** All 9 cards in the `#edit`
section sit at exactly 40px. Two junctions were wide and neither showed up in the
earlier sweeps, because those only measured *within* each shelf: (1) the second Home
shelf (`.shelf-small`) carried its own top spacing \u2014 sensible beside a desktop
heading, ~200px of dead white once both stack into one column; (2) the "Selected for
you" band had the same problem. Both zeroed to a 40px margin. **When checking gaps,
measure across shelf boundaries, not just inside a shelf.**

**Hover dim removed site-wide.** A single global `.piece:hover .ph { opacity: 0.85 }`
dimmed every product image on hover; over the slide-to-second-image interaction it read
as a grey shadow overlay. Now `opacity: 1`.

**Object page.** Crumbs + ONE OF ONE moved above the gallery on phone (desktop keeps
them beside it). Typography brought onto the Home tiers: maker's note 17\u219214, price
16\u219214, TAKE IT HOME 13\u219211. The note's 17px came from a **stale rule left by the
first phone pass sitting later in the sheet** \u2014 deleted rather than overridden. Also
"View all vintage" moved to the bottom of its list, and the shelf band became a flex
column with explicit `order` values.

**Shelf foot regression + fix.** That flex-column change made `.shelf-foot` (no
`order`, so it defaults to 0) jump *above* the product cards on category pages \u2014 the
maker's-note line appeared mid-page. Fixed with `order: 4` + 34px top margin. A second
foot was then added under the main shelf so both shelves carry one. **Any new child of
`.shelf-band` needs an explicit `order` on phone.**

**Home Artist Spotlight spacing.** Quote\u2192collage 4px, collage\u2192bio \u22128px. The two
margins are deliberately asymmetric: the collage frame runs ~40px taller than its
visible imagery (the second photo is absolutely placed), so the negative value cancels
that overhang and makes the *pictures* read as evenly spaced.

**Spotlight PAGE (`#/spotlight`).** The hero kept its desktop padding on phone \u2014 a
**164px left indent**, leaving a 192px text column out of 390, which broke "É-MISHTO"
mid-word. Now one gutter each side (332px column, bio 13\u21928 lines). Portrait moved
below the quote via `display: contents` on the two wrappers, with explicit orders:
crumbs \u2192 signature \u2192 quote \u2192 portrait \u2192 bio \u2192 meta. Meta pairs restyled to the
Account page's `.info-k`/`.info-v` (11px mono label, 14px value). Note: an earlier
attempt at this reorder was reverted on request, then redone \u2014 dissolving a wrapper
also drops any padding it carried, so the parent must re-declare the gutter.

**Why sell on É-MISHTO.** "Come in." \u2192 **Two ways in.** at 30px, kicker removed, section
on the Account gate's `#F5F2ED` ground, and both cards now carry the Account page's copy
verbatim (Creator / Collector; the second button routes to `#/account`, previously
"Enter the house" \u2192 home). "In good company" also 30px; its kicker now reads
PARTNERS & FRIENDS OF É-MISHTO.

**Contact page.** ELSEWHERE block (Instagram, Stories) removed.

**Aster Vessel \u2014 open item now closed.** The object had two records and only the
Vintage one carried the new photography; the catalogue record (New In, Home & Objects)
still used `aster-01-front.png`. Both now point at
`assets/shelf/vintage/aster-vessel-cover.png` + `-detail.png`.

**Still open.** Mobile Pass 2 B-level refinements, handwriting fonts, photography upload
guide; no "Earrings" subcategory in the data (the Home collage tile points at
Fashion \u203a Accessories). The 0.8\u00d7 hero video rate remains the floor for a 24 fps
source \u2014 a genuinely calmer hero needs a retimed re-export, not a browser change.

## SESSION OF 13 SEP (NIGHT) \u2014 BAG + CHECKOUT PHONE PASS

Phone refinement **still IN PROGRESS**. Desktop untouched.

**Copy.** Bag summary heading "The quiet sum" \u2192 **Your order**; "Crating & insured
delivery" \u2192 **Packed & insured delivery**; bag CTA "Continue, gently" \u2192 **Continue**;
checkout nav **\u2190 Back to bag** / **Continue \u2192**; step 04 "A last look" \u2192
**Last look**. Contact page's ELSEWHERE block removed. Why-sell "Come in." \u2192
**Two ways in.** (30px, kicker removed, `#F5F2ED` ground, Account's card copy verbatim,
second button now routes to `#/account`). "In good company" 30px, kicker \u2192
PARTNERS & FRIENDS OF É-MISHTO.

**Optional creator's note (new behaviour).** Creator's notes is now a **€5 line, included
by default**, with an inline REMOVE / ADD · €5 action. Both the bag and the checkout
summary read the same `localStorage` key `em_bag_note`, so the state and totals never
diverge. Totals recalculate both ways (€1040 \u2194 €1045 on a one-object bag).

**Checkout order card now identical to the bag card.** Same rows in the same order:
Objects (n) \u00b7 Packed & insured delivery \u00b7 Creator's notes [toggle] \u00b7 Total. Checkout
previously showed a per-item line plus "Subtotal" and the old delivery wording, and had
no note line.

**Page titles unified.** Seven rules were at 34px on phone; all now **30px** \u2014 the same
tier as "This week we love". Covers bag, object, category, Why-sell, account dashboard,
Apply prompt and Apply result. The phone scale is now
**30 \u2192 24 \u2192 20 \u2192 14 \u2192 13 \u2192 12 \u2192 11 \u2192 10**.

**Checkout overflow (real defect).** Content ran under the right edge with the left
gutter intact \u2014 the phone rule used a plain `1fr` grid column, which takes an **auto
minimum**, so the nowrap identity tabs stretched the column 28px past the grid's content
box and every child inherited that width. Fixed with `grid-template-columns: minmax(0,
1fr)` + `min-width: 0` on the flex rows. Gutters now symmetric at 24px; zero overflow.
**A plain `1fr` track is not safe next to nowrap content \u2014 always `minmax(0,1fr)`.**

**Step bar.** Was a flex row whose four labels wrapped ("04 A LAST LOOK" over three lines
in a tall bordered cell). Now a **4-column grid of equal 83px cells** with each label
centred, numbers hidden on phone (`.n { display: none }`, kept in markup for desktop),
11px, nothing clipping. Bag's 3-step row uses `justify-content: space-between` so
"Last look" ends flush with the button edge, gaps equal at 30px.

**Form scale.** Labels, inputs and hints all **11px** while filling in details; identity
tabs 11px; `.co-sec-title` gained 30px of space above the first field (it sat flush
against FIRST NAME). Bag "Total" row raised to 20px. `\u2190 Back to bag` is now a bordered
41px control matching Continue's height, on one line.

**Cascade traps hit repeatedly this session (worth reading before editing phone CSS).**
Media queries add **no specificity**, and most base rules sit 500\u20131500 lines *later* in
the sheet, so an equal-specificity phone rule silently loses. Needed `div.steps span`,
`div.sum-line`, `h1#bag-title`, `p.co-sec-note`, `section.checkout-grid`. Two of my
selectors also named classes that don't exist (`.co-seg`, `.co-line` \u2014 the real ones
are `.seg`, `.sum-line`), and one stale 12px tab rule from an earlier pass sat two lines
after its replacement. **Verify the computed value after every phone type change.**

**Still open.** Mobile Pass 2 B-level refinements, handwriting fonts, photography upload
guide; no "Earrings" subcategory in the data. Hero video stays at 0.8\u00d7 \u2014 a calmer
hero needs a retimed re-export, not a browser change.

## SESSION OF 13 SEP (LATE) \u2014 CREATOR WORKSPACE PHONE PASS

Phone refinement **still IN PROGRESS**. Desktop untouched throughout.

**Typography.** Workspace mapped onto the established phone scale
(30 \u2192 24 \u2192 20 \u2192 16 \u2192 14 \u2192 13 \u2192 12 \u2192 11 \u2192 10):
step headings \u2192 24px on one line (`white-space: nowrap`) with the meta line moved
beneath them, both left-aligned to the 24px gutter (was heading and meta competing
horizontally); upload-slot labels 12 \u2192 **11px** to match the field labels above them;
the photo-guidance line ("A good-quality portrait\u2026") 14px/`#3A3A3A` \u2192
**13px / rgb(118,118,118) / weight 300**, identical to the field placeholders \u2014 its
inner `<b>` needed `font-weight: 300; color: inherit` or it kept its dark bold styling
and broke the line's uniformity.

**Step buttons.** "Next \u2014 Business & legal \u2192" and "Next \u2014 Objects \u2192" were
wrapping the arrow onto its own line; given `white-space: nowrap` (244px / 171px, both
inside the gutter) and then simplified to **BUSINESS & LEGAL \u2192** / **OBJECTS \u2192**
\u2014 the "Next \u2014" prefix dropped.

**Publish copy.** Approval state now reads **live on your spotlight**.

**Selector traps (same family as the checkout pass).** Two of my selectors named classes
that do not exist \u2014 `.ws-nav` / `.ws-foot` (the real scope is `.ws-section`), after
`.co-seg` / `.co-line` earlier. **Grep the class before writing a phone rule**, and
verify the computed value after: media queries add no specificity and most base rules sit
500\u20131500 lines later in the sheet, so an equal-specificity phone rule silently loses.
Tag/attribute prefixes (`body[data-route="creator"] span.us-label`, `p.photo-rules b`)
are what carry these.

**Backgrounds.** Base `body` is `#FFFFFF` (Home's white) sitewide; **Account and Apply
keep the cream `#f5f2ed`** via inline wrapper styles. Checkout, Bag, FAQ and Why-sell
follow the white.

**Open / unresolved.** One request was left unimplemented: "the small text in burgundy \u2014
make it a hint bigger". A scan of all three workspace steps found only two burgundy text
roles (`.us-info` at 12px and the `<em>` inside step headings at 24px), neither an
obvious match for "small text" \u2014 needs the user to point at the element before
changing anything. Also still open: Mobile Pass 2 B-level refinements, handwriting fonts,
photography upload guide, no "Earrings" subcategory in the data, and the hero video stays
at 0.8\u00d7 pending a retimed re-export.

## PHONE TYPOGRAPHY SYSTEM \u2014 \u2705 APPROVED AND LOCKED (14 SEP)

> **LOCKED.** These nine tiers are signed off and must stay untouched. Do not change a
> value, add a tier, or introduce a new size without an explicit instruction naming this
> system. New phone work **conforms** to the tiers; the tiers do not move to accommodate
> new work. If a piece of copy will not fit, change tracking, width or wrapping \u2014 never
> the tier. This has the same status as the approved desktop scale.

The phone type scale is now a **declared system**, not an accumulation of
per-request sizes. It lives in one place: the commented block above
`@media (max-width: 700px)` in index.html, which declares nine tokens on `:root`.

### The nine tiers

| token | px | family | role |
|---|---|---|---|
| `--ph-display` | 30 | serif | page + section display titles, hero statements |
| `--ph-heading` | 24 | serif | shelf + section headings |
| `--ph-title` | 20 | serif | card names, object names, option titles |
| `--ph-lead` | 14 | serif | signatures, bylines, script accents, taglines |
| `--ph-body` | 13 | sans | ALL reading copy, form inputs, placeholders |
| `--ph-action` | 12 | mono | buttons, CTAs, statuses, prices, crumbs |
| `--ph-label` | 11 | mono | micro labels, kickers, field labels, chips |
| `--ph-nano` | 10 | mono | subcategory names, row numbers |
| `--ph-nano-sm` | 9 | mono | tertiary in-panel links ("Explore \u2192") |

### Rules

1. **serif = display only**, never reading copy. **sans = reading copy only.**
   **mono = interface only** (uppercase, tracked).
2. Body copy never below 13px; interface text never above 12px.
3. A new size is never introduced to solve a fitting problem \u2014 reuse the nearest
   tier and adjust tracking, width or wrapping.
4. Reference the tokens, never raw px, in new phone rules.

### Declared exceptions (not text on the scale)

`.script-name` 25px Meie Script (handwritten signature, own family) \u00b7
`.us-plus` 22px (the \uff0b glyph, an icon) \u00b7 `.seal-star` 46px (the star mark, artwork).

### Off-tier values found and resolved in this pass

`.chip-band .filter-label` 11.5 \u2192 11 \u00b7 `.foot-base .micro` 11.5 \u2192 12 (its ink
measures ~319px against 332px, so the credit still holds one line) \u00b7
`.page-intro p` / `#world-intro` 18 \u2192 13 **and serif \u2192 sans** (it was reading copy in
the display face) \u00b7 `.co-sec-note` 16 \u2192 13 sans \u00b7 `.dash-sub` 16 \u2192 13 sans \u00b7
`.summary-note` serif \u2192 sans.

**Verified across eight routes** (home, category, object, Stories, account incl. revealed
dashboard/auth panels, bag, creator workspace, why-sell): every text value resolves to
one of the nine tiers, no serif reading copy remains, no overflow.

### Also in this session

Creator workspace: **submitted-for-review screen** after DONE (golden `.seal-star`,
"With *our editors.*", 48-hour review copy, IN REVIEW / WITHIN 48 HOURS chips, Back to
objects + Keep wandering) wired via `goStep(4)`; step buttons simplified to
**BUSINESS & LEGAL \u2192** / **OBJECTS \u2192**; the price field's hardcoded inline
`font-size` removed then set to 25px on request; three empty preview cards given imagery
via `FALLBACK_IMG` (The Empty Room, Dawn Fragment, Indy).

Stories: the feature kicker (**INTERVIEW \u00b7 № 25** / **06 MIN**) now sits **above** the
image on phone, matching the entry cards exactly (11px, 2.2px tracking, 18px clear \u2014 it
needs `margin-bottom: -14px` because the feature grid's own 32px row-gap stacks beneath
it). An overlay-on-photo version was built first and removed. "Recent entries" no longer
renders: the markup already carried `hidden`, but the phone rule
`.shelf-head { display: contents }` rendered its children anyway \u2014 `hidden` heads now
get `display: none`.

**Mobile refinement is still IN PROGRESS.** Open: Mobile Pass 2 B-level refinements,
handwriting fonts, photography upload guide, no "Earrings" subcategory in the data, hero
video at 0.8\u00d7 pending a retimed re-export.

## DESKTOP + TABLET TYPOGRAPHY SYSTEM \u2014 \u2705 APPROVED AND LOCKED (14 SEP)

> **LOCKED.** Signed off, same status as the phone system. Do not change a clamp, add a
> step, or introduce a size without an explicit instruction naming this system. New work
> above 700px **conforms** to these roles; the roles do not move. No value was altered
> when defining this \u2014 it documents the approved scale exactly as built.

### One scale, two ends \u2014 why there is no separate tablet stylesheet

Above 700px every display role is a `clamp(FLOOR, SLOPE, CEILING)`. The bands are the
two ends of that same clamp:

| band | width | where type sits |
|---|---|---|
| **Tablet** | 701\u20131000px | on the clamp **floor** (verified at 768px) |
| **Mid** | 1000\u20131560px | riding the **vw slope** (verified at 1440px) |
| **Desktop** | \u22651560px | on the clamp **ceiling** |

So **the floor column is the tablet scale and the ceiling column is the desktop scale.**
Nothing is duplicated per band \u2014 change a clamp and both ends move together, which is
why the two are locked as one system rather than two.

### Roles \u2014 floor \u2192 ceiling

**Brand / display \u00b7 Cormorant 300**

| role | floor \u2192 ceiling | slope |
|---|---|---|
| hero wordmark | 56 \u2192 136 | 8.4vw |
| signature (Meie Script) | 56 \u2192 110 | 7vw |
| editorial section title | 42 \u2192 76 | 5.6vw |
| page title | 40 \u2192 72 | 4.6vw |
| subscribe statement | 32 \u2192 64 | 4.6vw |
| world name / spotlight quote | 34 \u2192 62 | 4.2vw |
| dashboard h1 | 34 \u2192 62 | 4.4vw |
| object name | 32 \u2192 60 | 4.4vw |
| path-card h2 | 34 \u2192 58 | 4vw |
| section heading | 30 \u2192 46 | 3.2vw |
| shelf title | 28 \u2192 42 | 3vw |
| dash panel h2 | 26 \u2192 40 | 3vw |
| feature / empty quote | 20 \u2192 30 | 2.4vw |
| search world name | 20 \u2192 26 | 2.2vw |

**Editorial body \u00b7 Cormorant** \u2014 card/object name **24** fixed \u00b7 category tab **22**
fixed \u00b7 lede 19 \u2192 23 (1.7vw) \u00b7 maker quote 17 \u2192 21 (1.5vw) \u00b7 signature line
**16** fixed.

**Functional \u00b7 Gantari** \u2014 object price **18** \u00b7 hero tagline **16** \u00b7 maker line
**14** \u00b7 reading copy + footer links **13**. All fixed.

**Interface \u00b7 mono uppercase tracked** \u2014 hero cue **15** \u00b7 micro label **13** \u00b7
action/status **12** \u00b7 chevron **11**. All fixed.

### Rules

1. Cormorant = display + editorial. Gantari = reading copy and functional values.
   mono = interface only.
2. **Everything below 24px is fixed, not fluid** \u2014 the interface layer does not scale
   with the viewport, only the display layer does.
3. A new display role reuses an existing clamp; it does not get its own.

### Layout breakpoint ladder (separate from type \u2014 grids and spacing only)

560 \u00b7 600 \u00b7 700 \u00b7 720 \u00b7 760 \u00b7 820 \u00b7 880 \u00b7 920 \u00b7 1200 \u00b7 1340, plus
`min-width` 561 \u00b7 921 \u00b7 1341 (the desktop header band).

### Finding, logged not fixed

14 display roles share only about **9 distinct ceilings** \u2014 62/62/60/58 and 46/42/40 sit
within a few px at 1440px. Phone was reduced to nine tiers; this band carries more
display steps, by design and by history. Collapsing those clusters would visibly alter
approved pages (object, account, why-sell, path cards), so it needs an explicit decision.
The obvious merges would be 62\u219260 (four roles) and 46\u219242 (three roles).

## ACCOUNT + BAG \u2014 PHONE WORK CARRIED TO DESKTOP / TABLET (14 SEP)

Audit of what the phone pass left phone-only. **Most of it was already shared** \u2014 the
copy and data changes were markup, and the card treatment went into base CSS, so desktop
and tablet already had them. Only one genuine gap, now closed.

### Already shared (no action needed)

\u00b7 All copy: **Your order** (was "The quiet sum"), **Packed & insured delivery** (was
"Crating & insured"), **Continue**, **\u2190 Back to bag**, **Last look** \u2014 markup, so
every width had them. Verified: each string appears in both the bag and checkout markup.
\u00b7 The optional **Creator's notes \u20ac5** line and its REMOVE / ADD action \u2014 markup +
shared `localStorage` key `em_bag_note`, so bag and checkout never diverge at any width.
\u00b7 **Checkout order card = bag order card** (Objects / Packed & insured / Creator's notes
/ Total) \u2014 markup.
\u00b7 Account card treatment \u2014 `.order-card / .wish-card / .pay-card / .addr-card` carry
`padding: clamp(22px,2.6vw,34px)` + `border-color` hover in **base** CSS, so desktop got
the path-card language at the time it was applied.
\u00b7 Step bar \u2014 desktop `.co-step` was already `flex: 1` + `justify-content: center`,
i.e. equal cells with centred labels. The phone grid rewrite was solving a phone-only
wrapping problem, not a structural difference.
\u00b7 `.co-sec-title` 30px clearance above the first field \u2014 base.

### The one gap \u2014 fixed

**`\u2190 Back to bag` was a plain 15px text link on desktop** while phone had it as a
bordered control paired with Continue. Now bordered at every width, and sized to match
`.btn-solid` exactly: **13px mono / 0.18em / padding 18px 30px / 1px border**, against
Continue's identical 13px / 18px 30px \u2014 so the two controls are the same height, one
outlined and one filled. 15px \u2192 13px moves it onto the existing **button tier**, so it
conforms to the locked desktop scale rather than adding a value.

Cascade note: the phone override `.co-nav .link-back` sits at L1674, *earlier* than the
new base rule at L2289, but wins on phone by specificity (0,2,0 vs 0,1,0); the phone
`.link-back { 11px }` at L3891 sits later and wins on size. Phone keeps 11px / 11\u00d718.

### Left width-specific on purpose (not defects)

\u00b7 Step **numbers** (01\u201304) show on desktop, hidden on phone \u2014 the markup keeps them
at both widths for reading order; only the phone display is suppressed, for width.
\u00b7 `.co-nav`: desktop `space-between` (wide column, controls at the extremes) vs phone
`gap: 12px` (grouped).
\u00b7 `.seg` identity tabs: desktop inline-flex at natural width / 15px; phone full-width
equal columns / 11px.
\u00b7 `.bag-item` 72px thumb grid, `.field-grid` single column, `.ws-steps` wrapping \u2014
all phone layout accommodations.

**Desktop typography was not altered** beyond the Back control's move onto the button
tier. Both type systems remain locked.

## BAG + ACCOUNT \u2014 BROUGHT ONTO THE SITE TIERS (DESKTOP / TABLET)

The bag, account and checkout cluster had grown its own scale: **15px and 16px mono
throughout**, where the rest of the site's interface layer is **12\u201313px**. 15px mono
appears nowhere else except the hero "Scroll" cue. Nineteen values moved onto existing
tiers \u2014 **no tier was added or changed**, so both type systems stay locked.

**Interface \u2192 13px** (micro/button tier): `.co-step` + its `.n` (was 15/14),
`.co-subhead`, `.seg button`, `.dash-nav button`, `.card-mono` (was 16).
**Metadata \u2192 12px** (action/status tier, matching `.piece-status` and `.crumbs`):
`.order-meta` (was 15), `.order-status` (was 14), `.muted-act` (was 14),
`.sum-line .q` (was 14).
**Prices \u2192 15px / 0.12em** (the site's product-price treatment): `.order-total`
(was 16 / 0.1em), `.sum-line .pr` (tracking only).
**Sans metadata \u2192 14px** (matching `.piece-maker`): `.bag-item-meta`, `.opt-sub`,
`.wish-meta` \u2014 all were 15.
**Object lines \u2192 20px serif**: `.sum-line .nm` and `.order-objs` were 19px, one off
from `.bag-item-name`'s 20 \u2014 a near-duplicate with no purpose.
**`.dash-sub` 18px serif \u2192 16px sans**: it is reading copy, and the system's own rule
is serif for display, sans for reading. Now on the body tier, matching its phone
counterpart's role.

**Buttons were already correct** \u2014 every button in the cluster computes 13px mono /
0.18em (`.btn-solid`, `.btn-ghost`, `.btn-ghost-sm`, `.commerce .btn-solid`). Padding
varies by context (12\u00d720 to 18\u00d730), which is contextual sizing, not inconsistency.
The mismatch being seen was the surrounding interface text, not the buttons.

Phone is unaffected \u2014 its own tier block overrides all of these.

## DESKTOP + TABLET TYPOGRAPHY \u2014 REV. 14 SEP, LOCKED

The full spec now lives as a comment banner at the top of the stylesheet in
`index.html` (search "DESKTOP + TABLET TYPOGRAPHY SYSTEM"). That banner is the
source of truth; this section records what changed to reach it.

### The rule that now governs the display layer

**60px is the display ceiling.** Only two things sit above it, and neither is a title:
`h1.hero-title` 136px (the home collage brand mark) and `.script-name` 50px
(handwritten signature, Meie Script).

Brought down this session: page title 72\u219260 (`.page-title` \u2014 one rule behind
every H1 on the site), home + Stories section titles 76\u219260, world name 62\u219260,
object title 62\u219260, dashboard title 62\u219260, spotlight quote 62\u219260,
subscribe statement 64\u219260, path-card titles 58\u219250.

**Audit warning.** My first "everywhere is 60" sweep missed `.page-title` because I
excluded line ranges by guess to skip the phone blocks, and those guessed boundaries
cut out real base CSS. **Never audit by line range** \u2014 scan the whole file and filter
by selector. The client caught the miss.

### Bag / account / checkout \u2014 off its own scale

This cluster had grown a private scale of **15\u201316px mono** while the rest of the
site's interface layer is **12\u201313px** (15px mono appears nowhere else except the
hero "Scroll" cue). Twenty-six values moved onto existing tiers; **no tier was added
or changed.**

\u2192 13px: `.co-step` + `.n`, `.co-subhead`, `.seg button`, `.dash-nav button`,
`.card-mono` (16), `.info-k`, `.ws-meta`, `.view-note`, `.quiz-step`, `.quiz-exit`,
`.q-kicker`, `.q-option .tag`, `.quiz-hint`, `.flag-note`
\u2192 12px: `.order-meta`, `.order-status`, `.order-total` (price tier 15/0.12em),
`.muted-act`, `.sum-line .q`, `.room-chip` (filter-control role)
\u2192 14px sans: `.bag-item-meta`, `.opt-sub`, `.wish-meta`
\u2192 20px serif: `.sum-line .nm`, `.order-objs` (were 19 \u2014 one off `.bag-item-name`)
\u2192 16px sans: `.dash-sub` (was 18 serif), `.ws-review-note` (was 14),
`.path-card p` (was the 19\u219223 serif lede)
\u2192 11px: `.essence-note` \u2014 mono, uppercase, 0.18em, `--ink-38`, with
`!important` because a later shared rule forces burgundy on that class

**Buttons were already correct** \u2014 every one computes 13px mono / 0.18em. Padding
varies by context (12\u00d720 to 18\u00d730), which is contextual, not inconsistent. What
read as a button mismatch was the interface text around them sitting two sizes large.

### Other changes this session

\u00b7 `.link-back` (\u2190 Back to bag) was a plain 15px text link on desktop while phone
had it bordered. Now bordered at every width and sized to `.btn-solid` exactly
(13px / 18\u00d730 / 1px border), so Back and Continue are the same height.
\u00b7 `.room-chip` (ALL / ARTS / FASHION\u2026) now follows the category filter's control
language: 12px / 0.16em, ink at rest, **burgundy** fill when active (was near-black),
padding 13\u00d722.
\u00b7 `.nb { white-space: nowrap }` \u2014 **the helper had no CSS rule at all**; spans using
it were inert. Added, then used to keep "we will reach out." intact.
\u00b7 Creator portraits added to all 11 cards in the Why-sell "Our creators" grid.
\u00b7 "In good company" inverted to burgundy; its grid moved to 6/3/2 columns to stop an
orphaned cell (`auto-fill` gave 5+1, stranding For\u00eat).
\u00b7 Copy: "we will reach out" phrase protected; review notes at the result-copy tier.

### Editing this system safely

Media queries add **no specificity**, and most base rules sit 500\u20131500 lines *later*
in the sheet, so an equal-specificity phone rule silently loses. Several edits this
session needed a tag or id prefix (`div.steps span`, `h1#bag-title`, `p.co-sec-note`).
Two of my selectors also named classes that do not exist (`.co-seg`, `.co-line` \u2014 the
real ones are `.seg`, `.sum-line`), and one stale rule sat *after* its replacement.
**Verify the computed value after every type change.** Multi-line vs single-line rule
formatting also breaks exact-string edits \u2014 read the rule before replacing it.

## SIGNATURE FONT TRIAL \u2014 LIVE, AWAITING CLIENT PICK (14 Sep)

A **client-facing font chooser** on the home Artist Spotlight signature. Scoped to that
one element; nothing else on the site references these families.

**How it works.** The gold "Laurence Leenaert" is now a real
`<button id="sig-trial" class="spotlight-name">`. Each click advances `data-sig`
0\u21925\u21920, and a CSS attribute rule swaps only the family. A mono 11px label
(`#sig-label`) under it names the option so the client can say "04" instead of
describing it. The pick persists in `localStorage` under **`em_sig_font`**, so it
survives reloads and route re-renders.

**The six options**

| # | Family | File | Size |
|---|---|---|---|
| 01 | Meie Script *(current, Google)* | \u2014 | shared |
| 02 | Jane Austen | `assets/fonts/jane-austen.ttf` | `clamp(26px,3.2vw,44px)` |
| 03 | Vienna Romance | `assets/fonts/vienna-romance.ttf` | shared |
| 04 | Romento | `assets/fonts/romento.ttf` | shared |
| 05 | Garitson | `assets/fonts/garitson.otf` | shared |
| 06 | Lamar Pen | `assets/fonts/lamar-pen.ttf` | `40px` fixed |

Shared size = `clamp(30px, 3.6vw, 50px)`, 25px on phone. Options 02 and 06 carry their
own because they draw largest \u2014 measured widths for "Laurence Leenaert" at 33px:
Lamar Pen 312 \u00b7 Jane Austen 291 \u00b7 Garitson 270 \u00b7 Meie 260 \u00b7 Romento 233 \u00b7
Vienna Romance 183.

**Verified.** All six pass `document.fonts.check()` and render at their own widths (not
silently falling back). Colour, position and the 44px top margin never move between
options. Native button, so Enter/Space work; gold focus ring on `:focus-visible` only.

**Two notes.** Unused webfonts load lazily, so a `fonts.check()` on a fresh page returns
false for options not yet shown \u2014 that is correct behaviour, not a failure; call
`fonts.load()` first when testing. And these are **single-weight files**: CSS cannot
thin the letterforms, so "make it thinner" was handled optically by reducing size
(option 02). True thinning needs a Light cut as a separate file.

**To finalise once the client picks:** set that family on `.spotlight-name`, then delete
the `@font-face` block, the `button.spotlight-name` + `[data-sig]` + `.sig-label` rules,
the trial `<script>`, the `#sig-label` span, and the unused files in `assets/fonts/`.
Revert the button to `<span class="spotlight-name fade-up">`. Each piece is contiguous
and commented as the trial.

The creator profile signature (`.script-name`) is **not** part of the trial and stays on
Meie Script \u2014 it will need the same family applied by hand when the pick is made.
