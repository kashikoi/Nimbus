# Nimbus Agent Context & Guidelines

## Architecture & Conventions
- Pure vanilla JS (`app.js`), semantic HTML (`index.html`), and CSS (`styles.css`).
- Runs directly via `file://` or any static HTTP server.
- Data storage keys:
  - `nimbus.theme` ("light" | "dark")
  - `nimbus.tasks` (Array of task items)
  - `nimbus.lists` / `nimbus.categories`
- Scenic Background Elements:
  - Sky gradient, soft celestial bodies (muted warm sun in light mode, serene silver/cratered moon in dark mode: `.celestial-body`, `.celestial-sun`, `.celestial-moon`), and twinkling night stars layer (`.stars-layer`, `.stars--sm`, `.stars--lg`)
  - Dynamic procedural volumetric nimbus clouds drifting continuously left-to-right (`.clouds-layer`, `.nimbus-cloud`, `.nimbus-lobe`, with randomized shapes, lobe counts, altitudes, and capped slow drift speeds)
  - Smooth deep ocean water layer (`.ocean-layer`, `.ocean-surface`)
  - Soft horizon atmospheric haze (`.horizon-haze`)
  - Coastline & Promontory SVG with Lighthouse, attached keeper's quarters, and coastal grassy knoll (`.coast-scene`, `.lighthouse-svg`)
  - Spherical glowing beacon light halo (`#f4b41a`) on the lighthouse lantern (`.beacon-halo-pulse`, `.beacon-core-pulse`)
- Dark mode:
  - Toggled via `html.dark` class.
  - Head script in `index.html` checks `localStorage.getItem("nimbus.theme") === "dark"` synchronously to prevent FOUC.
  - Always keep `background-attachment: fixed` on body gradient overrides.
