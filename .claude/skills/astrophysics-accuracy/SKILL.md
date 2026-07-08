---
name: astrophysics-accuracy
description: Background reference values for the Type Ia supernova physics encoded in this simulation (core.js, glossary.js, panels.js) — Chandrasekhar limit, light-curve shape, Ni-56/Co-56/Fe-56 decay chain, r-process vs. s-process vs. NSE. Consult this before changing any numeric constant, decay formula, or physics/nucleosynthesis explanation so edits stay scientifically consistent with the rest of the sim, and flag it to the user if a proposed change would contradict these values.
---

# Physics reference for this simulation

This project dramatizes real (simplified) Type Ia supernova physics. The
numbers below are the values already baked into the code — treat them as
the ground truth to check new edits against, not as a general astrophysics
tutorial. If a change would make one file disagree with another (e.g. a new
light-curve tweak that no longer peaks at day 19), point that out rather than
silently going along with it.

## Progenitor & ignition

- Binary: 3 M☉ + 2 M☉ (main sequence phase, `stage.js` `drawMS`).
- White dwarf after planetary nebula ejection: ~0.85 M☉ C/O.
- **Chandrasekhar limit ≈ 1.44 M☉** — the accretion phase's mass gauge climbs
  toward this; it's the trigger for ignition, not an arbitrary "full" bar.
- Ignition sequence: carbon simmering (convective, sub-ignition burning) →
  off-center deflagration → transition to detonation (the "delayed
  detonation" model — see `glossary.js` key `'detonation'`). This is the
  mainstream explanation; don't quietly replace it with a pure-deflagration
  or pure-detonation model without flagging the change.

## Explosion products

- **NSE (nuclear statistical equilibrium)**: burning above ~5×10⁹ K settles
  into the most tightly-bound nuclei reachable — the iron-peak elements.
  Type Ia ejecta are dominated by these iron-peak NSE products, layered
  onion-style: ⁵⁶Ni-rich core, Si-group middle, unburned C/O outer layer
  (see `stage.js` `drawEXP`).
- The **r-process** (rapid neutron capture) is shown in the side panel
  during the explosion phase *for contrast*, not because Type Ia SNe make
  r-process elements — the sim explicitly notes r-process nucleosynthesis
  happens in neutron-star mergers and some core-collapse supernovae. Don't
  let an edit accidentally imply Type Ia SNe are an r-process site.
- The **s-process** (slow neutron capture) belongs to the AGB/red-giant
  phase instead — thermal pulses and dredge-up expose the ¹³C(α,n)¹⁶O
  neutron source (`glossary.js` keys `'s-process'`, and the AGB stage
  narration). Keep s-process content on the AGB phase and r-process content
  on the explosion phase; swapping them is a real physics error, not a
  style choice.

## Radioactive decay chain (powers the light curve)

⁵⁶Ni → ⁵⁶Co → ⁵⁶Fe, ~0.6 M☉ of ⁵⁶Ni synthesized per explosion.

- Ni-56 half-life: **6.1 days** → mean life 8.77 d (`core.js` `decayFractions`
  uses `tNi = 8.77`).
- Co-56 half-life: **77.2 days** → mean life 111.4 d (`tCo = 111.4`).
- These feed `decayFractions(d)` in core.js, which computes the live
  Ni/Co/Fe fractions shown in the light-curve panel. If you touch the decay
  math, the half-life ↔ mean-life conversion is `mean_life = half_life / ln(2)`
  — don't hand-edit one constant without recomputing the other.
- The γ-rays and positrons from this decay chain are the light curve's
  actual power source — not residual heat from the explosion itself.

## Light curve shape (`core.js` `lcMag`)

- Peak **M_B ≈ −19.3** at **day 19** post-explosion.
- **Δm₁₅ ≈ 1.1** mag (decline in the 15 days after peak) — this is the
  standard Phillips-relation-style decline-rate parameter used to calibrate
  Type Ia SNe as standard candles; don't confuse it with the exponential
  decay tail parameter.
- Pre-peak rise and post-peak decline are modeled as two different curve
  shapes in `lcMag` (quadratic rise, then a saturating-exponential-plus-
  linear tail) — this asymmetry is physical (photosphere behavior differs
  before/after peak), not an implementation quirk to "simplify away."

## When this matters

Reach for this reference whenever a task touches: any numeric constant in
`core.js` (masses, `dur` timings tied to real timescales, `lcMag`,
`decayFractions`, `simTimeLabel`), any `glossary.js` definition, or any
`panels.js` `INFO` body text that makes a physics claim. If you're just
touching layout, color, or animation easing with no physics claim involved,
this reference isn't needed.
