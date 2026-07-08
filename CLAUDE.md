# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A self-contained, dependency-free browser simulation (vanilla HTML/CSS/JS, no
framework, no build step, no package.json) of a Type Ia supernova's full life
cycle, from main sequence through the radioactive-decay-powered light curve.

## Running it

Open `index.html` directly, or serve it locally (recommended over `file://`
to avoid stricter canvas/CORS policies in some browsers):

```bash
npx http-server
```

A VS Code launch config already does this on port 8741 — see `.claude/launch.json`.

There is **no test suite, linter, or build step**. The only verification
method is loading the page and visually scrubbing the timeline through the
affected phase(s) — via a browser, or the Playwright MCP server if available.

## Architecture: a phase machine across four files

The simulation is driven by a single `PHASES` array (`core.js`) that fans out
into four parallel, position/key-matched structures. Adding, removing, or
reordering a phase means touching **all** of these, and a mismatch fails
*silently* (blank/frozen stage or stale info text), not with an error:

| File | Role | Keyed by |
|------|------|----------|
| `core.js` | `PHASES` array (key, name, duration), global `state`, phase-advance logic (`stepState`), physics/math helpers | — (source of truth) |
| `stage.js` | One `drawXxx(g, W, H, t)` canvas renderer per phase | **positional** — `STAGE_DRAW` array, index must match `PHASES` index |
| `panels.js` | Info-panel text per phase (`INFO` object), plus the nucleosynthesis chart-of-nuclides and light-curve canvas renderers (`renderNuc`, `renderLC`) | `PHASES[i].key` |
| `main.js` | DOM wiring, render loop, timeline segments (built automatically from `PHASES`) | `PHASES[i].key` for `INFO` lookup |

`main.js` calls `validatePhaseSystem()` on load, which checks `STAGE_DRAW`
length/type against `PHASES` and that every phase key has an `INFO` entry —
check the console for `[phase-system]` errors after any phase edit.

To add a new phase, use the `new-phase` skill (`.claude/skills/new-phase/`)
rather than improvising — it encodes the exact multi-file checklist,
including updating the README's phase list and file table.

## Physics accuracy

The simulation dramatizes real (simplified) astrophysics with specific
numeric ground truth already baked into the code: Chandrasekhar limit
(1.44 M☉), the Ni-56→Co-56→Fe-56 decay chain (half-lives 6.1 d / 77.2 d,
implemented via mean-life in `core.js`'s `decayFractions`), and the B-band
light curve (`lcMag`, peak M_B ≈ −19.3 at day 19, Δm₁₅ ≈ 1.1). The
`astrophysics-accuracy` skill (`.claude/skills/astrophysics-accuracy/`)
documents these values and the s-process/r-process/NSE distinctions used
across phases — consult it before changing any numeric constant, decay
formula, or physics claim in `core.js`, `glossary.js`, or `panels.js`, since
inconsistencies between files (e.g. a light-curve tweak that no longer peaks
at day 19) are easy to introduce silently.

Editing `glossary.js` triggers a confirmation hook
(`.claude/hooks/glossary-confirm.ps1`) reminding you to keep glossary
definitions consistent with `core.js`/`panels.js`.

## Custom interactive controls

The timeline scrubber (`.seg` divs in `main.js`) and glossary term popups
(`.term` spans in `glossary.js`) are hand-rolled DOM interactions, not native
form controls — there's no framework accessibility layer backing them. The
`ui-reviewer` agent checks these for keyboard reachability, ARIA state, and
focus handling; use it after touching `index.html`, `main.js`, or
`glossary.js`'s interaction code.

## Render loop

`main.js`'s `frame()` runs on `requestAnimationFrame`, advances `state` via
`stepState(dt)`, and redraws the stage canvas every frame — but DOM updates
(timeline fill, play button label, sim-time readout, info panel) are gated
behind change checks (`lastPh`, `lastPtBucket`, `lastPlaying`, etc.) so they
only touch the DOM when their underlying value actually changed.
