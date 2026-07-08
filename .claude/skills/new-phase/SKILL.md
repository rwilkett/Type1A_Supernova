---
name: new-phase
description: Scaffold a new phase in the Type Ia Supernova simulation across all the files a phase touches (core.js, stage.js, panels.js, main.js, README.md). Use when the user wants to add, insert, or split a phase in the simulation timeline — e.g. "add a phase for the deflagration-to-detonation transition" or "split ignition into two phases." User-invoked only; do not run this on your own initiative.
disable-model-invocation: true
---

# Adding a phase to the supernova simulation

This simulation is a phase machine: one entry in `PHASES` (core.js) drives a
matching renderer (stage.js), info-panel content (panels.js), and timeline
segment (main.js, generated automatically from `PHASES`). Miss one of these
and the phase will play but render as a blank/frozen stage, or show the wrong
info text — the failure mode is silent, not a crash, so work through the
checklist in order rather than skipping around.

## 1. Register the phase in `core.js`

Add an entry to the `PHASES` array in the position where the phase should
play (order matters — it's playback order):

```js
const PHASES = [
  { key: 'ms',  name: 'Main sequence',        dur: 14 },
  { key: 'new', name: 'Your Phase Name',      dur: 12 },  // <-- insert here
  ...
];
```

- `key` — short lowercase id, used everywhere else to reference this phase.
- `name` — shown in the timeline segment label.
- `dur` — seconds of wall-clock playback at 1× speed. Look at neighboring
  phases for a sense of scale (10–24s is the current range).

If the phase needs a custom "simulated time" readout (like `ign`'s two-part
carbon-simmering/runaway label), add a `case` for its key in
`simTimeLabel()` in the same file. If it needs new physics/math helpers
(e.g. a new decay curve or gauge value), add them near the existing
`lcMag`/`decayFractions`-style helpers at the bottom of core.js so stage.js
and panels.js can both call them.

## 2. Add a renderer in `stage.js`

Write a `drawYourPhase(g, W, H, t)` function following the pattern of the
existing `drawMS`, `drawAGB`, etc. — `g` is the 2D canvas context, `W`/`H`
are the stage dimensions, `t` is progress within the phase (0..1).

Then add it to the `STAGE_DRAW` array **at the same index as the phase's
position in `PHASES`** — this array is positional, not keyed:

```js
const STAGE_DRAW = [drawMS, drawAGB, drawPN, drawYourPhase, drawACC, ...];
```

Reuse the shared helpers from core.js (`glow`, `cutStar`, `layerLabels`,
`stageText`, `drawStars`) rather than hand-rolling new drawing primitives —
they keep the visual style (glows, leader-line labels, drop-shadowed text)
consistent across phases.

## 3. Add info-panel content in `panels.js`

Add an entry to the `INFO` object keyed by the phase's `key`:

```js
const INFO = {
  ...
  new: {
    title: 'Your Phase Name',
    body: `<p>...</p>`,
  },
};
```

`body` is raw HTML injected via `innerHTML` — keep it short paragraphs like
the neighboring entries. If the phase should change what the nucleosynthesis
chart-of-nuclides panel or light-curve panel shows, check `renderNuc`/`renderLC`
in the same file for phase-conditional logic (e.g. `state.ph < PH.exp`) and
extend it if your phase needs to affect those panels too.

## 4. Verify the timeline picks it up automatically

`main.js` builds timeline segments straight from `PHASES`, so no manual
registration is needed there — but double check after your edit that:

- The segment appears in the right position with the right width
  (proportional to `dur`).
- Clicking the new segment jumps to it and plays correctly.
- `updateInfo()` picks up the new `INFO[key]` without a key mismatch (a
  typo'd `key` between `PHASES` and `INFO` fails silently — the panel just
  won't update).

## 5. Update `README.md`

Update the numbered phase list and, if you added/changed files, the file
table at the bottom of the README so both stay accurate.

## 6. Verify visually

There's no test suite for this project — the only real check is loading
`index.html` (or `npx http-server`, see `.claude/launch.json`) and scrubbing
the timeline through the new phase and its neighbors. If the Playwright MCP
server is available, use it to load the page, click the new phase's timeline
segment, and screenshot the stage canvas plus the info panel to confirm both
render as expected before considering the phase done.
