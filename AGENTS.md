# Nimbus Agent Context & Guidelines

## Architecture & Conventions
- Pure vanilla JS (`app.js`), semantic HTML (`index.html`), and CSS (`styles.css`).
- Runs directly via `file://` or any static HTTP server.
- Data storage keys:
  - `nimbus.theme` ("light" | "dark")
  - `nimbus.tasks` (Array of task items)
  - `nimbus.lists` / `nimbus.categories`
- Scenic Background Elements:
  - Sky gradient and twinkling night stars layer (`.stars-layer`, `.stars--sm`, `.stars--lg`)
  - Volumetric storm/nimbus cloud formations (`.clouds-layer`, `.nimbus-cloud`, `.nimbus-lobe`)
  - Multi-tier ocean swell with ripple textures (`.ocean-layer`, `.ocean-surface`, `.ocean-ripple-texture`, `.ocean-waves`)
  - Luminous atmospheric horizon mist (`.horizon-mist`)
  - Coastline & Promontory SVG with Lighthouse and keeper's cottage (`.coast-scene`, `.lighthouse-svg`)
  - Spherical glowing beacon light halo (`#f4b41a`) on the lighthouse lantern (`.beacon-beam-layer`, `.beacon-glow-halo`, `.beacon-core-pulse`)
- Dark mode:
  - Toggled via `html.dark` class.
  - Head script in `index.html` checks `localStorage.getItem("nimbus.theme") === "dark"` synchronously to prevent FOUC.
  - Always keep `background-attachment: fixed` on body gradient overrides.
