# Nimbus - Personal To-Do & Agenda Web App

## Overview
- **Name:** Nimbus
- **Purpose:** Personal, local-first to-do and agenda management web application.
- **Design Inspiration & Sister App:** Built to share the sky/cloud design language of the Cumulus personal finance app (drifting clouds, light & dark theme, frosted glass cards, no-build vanilla HTML/CSS/JS stack).

## Technology & Design Philosophy
- **Stack:** Plain vanilla HTML5, CSS3, ES6 JavaScript. No framework, no bundler, no build step.
- **Local-first:** All data persists in `localStorage` under `nimbus.*` keys. 100% private to the user's browser with import/export JSON backup support.
- **Visuals:** Sky gradient, 4 drifting clouds, night stars layer in dark mode, frosted cards (`backdrop-filter`), system font stack with tabular numbers for timestamps.
