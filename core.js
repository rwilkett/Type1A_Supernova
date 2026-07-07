/* ============================================================
   core.js — shared constants, state, math & drawing helpers
   ============================================================ */
'use strict';

const TAU = Math.PI * 2;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = t => t * t * (3 - 2 * t);           // smoothstep
const easeOut = t => 1 - Math.pow(1 - t, 3);

/* ---------- shared physical constants ------------------------ */
const CONSTANTS = {
  CHANDRASEKHAR_MASS: 1.44,  // M☉
  WD_INITIAL_MASS: 0.85,     // M☉, post-planetary-nebula white dwarf
  NI56_MEAN_LIFE: 8.77,      // days
  CO56_MEAN_LIFE: 111.4,     // days
};
const NI56_HALF_LIFE = CONSTANTS.NI56_MEAN_LIFE * Math.LN2;  // ≈ 6.1 d
const CO56_HALF_LIFE = CONSTANTS.CO56_MEAN_LIFE * Math.LN2;  // ≈ 77.2 d

/* ---------- light-curve tunable parameters -------------------- */
const LC_PARAMS = {
  peakDay: 19,
  peakMag: -19.3,
  riseCurvature: 4.8,
  tailTimescale: 20,
  tailLinearRate: 0.011,
};

/* ---------- phase definitions -------------------------------
   dur = seconds of wall-clock playback at 1× speed            */
const PHASES = [
  { key: 'ms',  name: 'Main sequence',        dur: 14 },
  { key: 'agb', name: 'Red giant / AGB',      dur: 18 },
  { key: 'pn',  name: 'Planetary nebula',     dur: 10 },
  { key: 'acc', name: 'Accretion',            dur: 16 },
  { key: 'ign', name: 'Ignition',             dur: 12 },
  { key: 'exp', name: 'Explosion',            dur: 12 },
  { key: 'lc',  name: 'Light curve',          dur: 24 },
];
const PH = {};                                  // key -> index
PHASES.forEach((p, i) => PH[p.key] = i);

/* ---------- global simulation state ------------------------ */
const state = {
  ph: 0,        // current phase index
  pt: 0,        // progress within phase, 0..1
  playing: true,
  speed: 1,     // playback multiplier (0.1× .. 20×)
  ended: false,
  clock: 0,     // accumulated scaled time, drives small animations
};

function setPhase(i, t = 0) {
  state.ph = clamp(i, 0, PHASES.length - 1);
  state.pt = clamp(t, 0, 1);
  state.ended = false;
}

function stepState(dt) {
  if (!state.playing) return;
  state.clock += dt * state.speed;
  state.pt += dt * state.speed / PHASES[state.ph].dur;
  while (state.pt >= 1) {
    if (state.ph < PHASES.length - 1) {
      state.pt -= 1;
      state.ph++;
    } else {
      state.pt = 1;
      state.playing = false;
      state.ended = true;
    }
  }
}

/* ---------- simulated-time readout per phase --------------- */
function simTimeLabel() {
  const t = state.pt;
  switch (PHASES[state.ph].key) {
    case 'ms':  return `Stellar age: ${(t * 350).toFixed(0)} Myr — core H burning`;
    case 'agb': return `Age ≈ 350 Myr + ${(t * 30).toFixed(1)} Myr — giant phases`;
    case 'pn':  return `Envelope ejection: ${(t * 50).toFixed(0)} kyr`;
    case 'acc': return `Accretion: ${(t * 5).toFixed(2)} Myr elapsed`;
    case 'ign': return t < 0.55
        ? `Carbon simmering: ~${(t / 0.55 * 100).toFixed(0)} yr of convective burning`
        : `Runaway! t = ${((t - 0.55) / 0.45 * 1.5).toFixed(2)} s`;
    case 'exp': return `t = ${(t * 10).toFixed(1)} s after detonation`;
    case 'lc':  return `Day ${(t * 250).toFixed(0)} after explosion`;
  }
  return '';
}

/* ---------- canvas helpers ---------------------------------- */
const DPR = Math.min(window.devicePixelRatio || 1, 2);

function fitCanvas(cv) {
  const w = cv.clientWidth, h = cv.clientHeight;
  if (cv.width !== Math.round(w * DPR) || cv.height !== Math.round(h * DPR)) {
    cv.width = Math.round(w * DPR);
    cv.height = Math.round(h * DPR);
  }
  const g = cv.getContext('2d');
  if (!g) { console.error('[fitCanvas] getContext(\'2d\') returned null'); return null; }
  g.setTransform(DPR, 0, 0, DPR, 0, 0);
  return g;
}

/* Fixed-size side panels: scale once for DPR */
function panelCtx(cv) {
  const w = +cv.getAttribute('width'), h = +cv.getAttribute('height');
  if (cv.width !== w * DPR) { cv.width = w * DPR; cv.height = h * DPR; }
  const g = cv.getContext('2d');
  g.setTransform(DPR, 0, 0, DPR, 0, 0);
  return { g, w, h };
}

/* ---------- starfield --------------------------------------- */
const STARS = Array.from({ length: 260 }, () => ({
  x: Math.random(), y: Math.random(),
  r: Math.random() * 1.3 + 0.3,
  tw: Math.random() * TAU,
}));

function drawStars(g, W, H) {
  for (const s of STARS) {
    const a = 0.35 + 0.3 * Math.sin(state.clock * 1.4 + s.tw);
    g.globalAlpha = a;
    g.fillStyle = '#cfd8ff';
    g.beginPath();
    g.arc(s.x * W, s.y * H, s.r, 0, TAU);
    g.fill();
  }
  g.globalAlpha = 1;
}

/* ---------- glow & cutaway star ----------------------------- */
const glowCache = new Map();
function glow(g, x, y, r, color, alpha = 1, cacheKey = null) {
  let gr;
  const cached = cacheKey && glowCache.get(cacheKey);
  if (cached && cached.x === x && cached.y === y && cached.r === r && cached.color === color) {
    gr = cached.gradient;
  } else {
    gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, color);
    gr.addColorStop(1, 'rgba(0,0,0,0)');
    if (cacheKey) glowCache.set(cacheKey, { x, y, r, color, gradient: gr });
  }
  g.globalAlpha = alpha;
  g.fillStyle = gr;
  g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
  g.globalAlpha = 1;
}

/* layers: outermost FIRST: { f, c0 (center), c1 (edge), label } */
function cutStar(g, x, y, R, layers) {
  glow(g, x, y, R * 1.6, layers[0].c1, 0.35);          // photosphere halo
  for (const L of layers) {
    const r = L.f * R;
    const gr = g.createRadialGradient(x, y, r * 0.1, x, y, r);
    gr.addColorStop(0, L.c0);
    gr.addColorStop(1, L.c1);
    g.fillStyle = gr;
    g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill();
    g.strokeStyle = 'rgba(0,0,0,0.35)';
    g.lineWidth = 1;
    g.stroke();
  }
}

/* leader-line labels down the right side of a cutaway star */
function layerLabels(g, x, y, R, layers, side = 1) {
  g.font = '12px "Segoe UI", sans-serif';
  g.textBaseline = 'middle';
  const n = layers.length;
  layers.forEach((L, i) => {
    if (!L.label) return;
    const inner = i < n - 1 ? layers[i + 1].f : 0;
    const rm = R * (L.f + inner) / 2;
    const ang = (-0.55 + 1.1 * i / Math.max(1, n - 1)) * (side > 0 ? 1 : -1);
    const sx = x + Math.cos(ang) * rm * side;
    const sy = y + Math.sin(ang) * rm;
    const tx = x + side * (R + 46);
    const ty = y + (i - (n - 1) / 2) * 26;
    g.strokeStyle = 'rgba(216,220,232,0.5)';
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(sx, sy); g.lineTo(tx - side * 6, ty); g.lineTo(tx, ty);
    g.stroke();
    g.fillStyle = '#d8dce8';
    g.textAlign = side > 0 ? 'left' : 'right';
    g.fillText(L.label, tx + side * 4, ty);
  });
  g.textAlign = 'left';
}

function stageText(g, x, y, txt, size = 13, color = '#d8dce8', align = 'left') {
  g.font = `${size}px "Segoe UI", sans-serif`;
  g.textAlign = align;
  g.textBaseline = 'alphabetic';
  g.fillStyle = 'rgba(0,0,0,0.55)';
  g.fillText(txt, x + 1, y + 1);
  g.fillStyle = color;
  g.fillText(txt, x, y);
  g.textAlign = 'left';
}

/* ---------- light-curve physics ------------------------------
   Peak M_B ≈ −19.3 at ~19 d; Δm15 ≈ 1.1; tail set by Co-56.   */
function lcMag(d) {
  const { peakDay: tp, peakMag: Mp, riseCurvature, tailTimescale, tailLinearRate } = LC_PARAMS;
  if (d <= 0) return -14.0;
  if (d < tp) return Mp + riseCurvature * Math.pow((tp - d) / tp, 2);
  const p = d - tp;
  return Mp + 1.9 * (1 - Math.exp(-p / tailTimescale)) + tailLinearRate * p;
}

/* current day after explosion, or null before it */
function currentDay() {
  if (state.ph < PH.exp) return null;
  if (state.ph === PH.exp) return state.pt * 1e-4;   // seconds ≈ day 0
  return state.pt * 250;
}

/* Ni-56 → Co-56 → Fe-56 decay fractions (mean lives in days) */
function decayFractions(d) {
  const tNi = CONSTANTS.NI56_MEAN_LIFE, tCo = CONSTANTS.CO56_MEAN_LIFE;
  const lNi = 1 / tNi, lCo = 1 / tCo;
  const ni = Math.exp(-lNi * d);
  const co = lNi / (lCo - lNi) * (Math.exp(-lNi * d) - Math.exp(-lCo * d));
  return { ni, co, fe: clamp(1 - ni - co, 0, 1) };
}

/* ---------- chart-of-nuclides valley of stability ------------ */
const VALLEY = [[30, 28], [50, 40], [70, 50], [90, 60], [110, 71], [126, 82], [142, 92]];
function valleyZ(N) {
  for (let i = 0; i < VALLEY.length - 1; i++) {
    const [n0, z0] = VALLEY[i], [n1, z1] = VALLEY[i + 1];
    if (N <= n1 || i === VALLEY.length - 2)
      return lerp(z0, z1, clamp((N - n0) / (n1 - n0), 0, 1));
  }
  return 92;
}
