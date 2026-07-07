# Type Ia Supernova — Interactive Simulation

A self-contained, dependency-free browser simulation of the full life cycle of a
Type Ia supernova progenitor, from the main sequence through the radioactive-decay
powered light curve.

## Run it

Open `index.html` in any modern browser. No build step, no server required
(a static server works too, e.g. `npx http-server`).

> Opening via `file://` works fine for this simulation (everything is inline
> canvas drawing, no `fetch`/module loading), but some browsers apply stricter
> CORS and canvas security policies to `file://` pages than to pages served
> over HTTP. If you ever see a blank canvas or a console security error,
> serve the directory locally instead (e.g. `npx http-server`) rather than
> double-clicking `index.html`.

## What it shows

Seven phases, scrubbable via the timeline at the bottom:

1. **Main sequence** — a 3 M☉ + 2 M☉ binary; cutaway of the primary's core,
   radiative zone, and convective envelope (CNO-cycle fusion).
2. **Red giant / AGB** — shell burning around a degenerate C/O core; thermal
   pulses drive dredge-up and the **s-process** (animated on the chart of
   nuclides in the side panel).
3. **Planetary nebula** — envelope ejection exposes a ~0.85 M☉ C/O white dwarf.
4. **Accretion** — Roche-lobe overflow, accretion disk, and a live mass gauge
   climbing toward the Chandrasekhar limit (≈1.44 M☉).
5. **Ignition** — carbon simmering, then off-center deflagration → detonation.
6. **Explosion** — onion-shell explosive nucleosynthesis (⁵⁶Ni / Si-group /
   unburned C/O); the side panel animates the **r-process** for contrast, with a
   note that Type Ia ejecta are actually iron-peak NSE products (the r-process
   mainly occurs in neutron-star mergers and some core-collapse supernovae).
7. **Light curve** — B-band curve with peak M_B ≈ −19.3 at day 19, Δm₁₅ ≈ 1.1,
   and the ⁵⁶Ni → ⁵⁶Co → ⁵⁶Fe decay chain with live isotope fractions.

## Controls

- **Speed slider** — 0.1× to 20× playback
- **Timeline** — click any phase segment to jump (click position sets progress)
- **Space / Pause button** — pause and resume
- **Restart** — replay from the main sequence

## Files

| File | Purpose |
|------|---------|
| `index.html` | layout and panels |
| `styles.css` | dark-theme styling |
| `core.js` | phase machine, state, math/physics helpers |
| `stage.js` | main-canvas renderer per phase |
| `panels.js` | info text, nucleosynthesis panel, light-curve plot |
| `main.js` | controls, timeline, render loop |
