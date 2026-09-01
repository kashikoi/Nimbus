# Nimbus Agent Context & Guidelines

## Architecture & Conventions
- Pure vanilla JS (`app.js`), semantic HTML (`index.html`), and CSS (`styles.css`).
- Runs directly via `file://` or any static HTTP server.
- Data storage keys:
  - `nimbus.theme` ("day" | "twilight" | "night" | "random")
  - `nimbus.tasks` (Array of task items)
  - `nimbus.lists` / `nimbus.categories`
- Atmosphere Modes:
  - **Day:** Light azure sky, gentle pastel sun, white-blue clouds, deep blue sea.
  - **Twilight:** Deep dusk indigo to warm sunset amber/rose horizon, sun dipping low into the sea, subtle emerging stars (`opacity: 0.35`), dusky purple clouds.
  - **Night:** Dark starry sky, silvery cratered moon, twinkling stars layer (`opacity: 1`), moonlit storm clouds.
  - **Random:** Dynamically picks between Day, Twilight, and Night on each page load/refresh.
- Scenic Background Elements:
  - Sky backdrop with celestial bodies (`.celestial-sun`, `.celestial-moon`) and twinkling night stars layer (`.stars-layer`, `.stars--sm`, `.stars--lg`)
  - Dynamic procedural volumetric nimbus clouds drifting continuously left-to-right (`.clouds-layer`, `.nimbus-cloud`, `.nimbus-lobe`, with randomized shapes, lobe counts, altitudes, and capped slow drift speeds)
  - Smooth deep ocean water layer (`.ocean-layer`, `.ocean-surface`)
  - Soft horizon atmospheric haze (`.horizon-haze`)
  - Coastline & Promontory SVG with Lighthouse, attached keeper's quarters, and coastal grassy knoll (`.coast-scene`, `.lighthouse-svg`)
  - Spherical glowing beacon light halo (`#f4b41a`) on the lighthouse lantern (`.beacon-halo-pulse`, `.beacon-core-pulse`)
- Theme implementation:
  - Toggled via `html.night` (alias `html.dark`) and `html.twilight`.
  - Head script in `index.html` resolves the active mode (including randomized selection for "random") synchronously before first paint to prevent FOUC.
  - Always keep `background-attachment: fixed` on body gradient overrides.
