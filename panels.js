/* ============================================================
   panels.js — info text, nucleosynthesis panel, light-curve plot
   ============================================================ */
'use strict';

/* ---------- per-phase info HTML ------------------------------ */
const T = (key, text) => `<span class="term" data-term="${key}">${text}</span>`;

const INFO = {
  ms: {
    title: '1 · Main sequence — a binary is born',
    body: `<p>Two stars orbit each other in a ${T('binary', 'binary system')}. Their
      masses are measured in ${T('solar-mass', 'solar masses (M☉)')} — multiples of
      our Sun's mass. The primary (≈3&nbsp;M☉, three times the Sun's mass) fuses
      hydrogen to helium in its core via the ${T('cno-cycle', 'CNO cycle')} for
      roughly <b>350 million years</b> on the ${T('main-sequence', 'main sequence')}.</p>
      <ul><li><b>Core</b> — H → He fusion, ~25 million K</li>
      <li><b>Radiative zone</b> — energy diffuses out as photons</li>
      <li><b>Convective envelope</b> — boiling outer layers</li></ul>
      <p class="note">The more massive star evolves first — that head start is what
      eventually makes a Type Ia possible.</p>`,
  },
  agb: {
    title: '2 · Red giant → AGB — the s-process',
    body: `<p>With core hydrogen spent, the star swells enormously. Helium burns to
      carbon and oxygen (${T('triple-alpha', 'triple-α')}); eventually burning
      continues only in two thin shells around a degenerate <b>C/O core</b> — the
      ${T('agb', 'AGB')} stage.</p>
      <p><b>${T('s-process', 's-process')}:</b> during He-shell
      ${T('thermal-pulse', 'thermal pulses')}, reactions like ¹³C(α,n)¹⁶O release
      free neutrons. Iron-seed nuclei capture them <i>slowly</i> — one
      ${T('neutron-capture', 'neutron capture')} at a time,
      ${T('beta-decay', 'β-decaying')} between captures — building elements like
      Sr, Zr, Ba and Pb along the ${T('valley', 'valley of stability')}
      (watch the panel below).</p>`,
  },
  pn: {
    title: '3 · Planetary nebula → white dwarf',
    body: `<p>Pulsations and winds eject the envelope as a glowing
      ${T('planetary-nebula', 'planetary nebula')}. Left behind: a
      <b>~${CONSTANTS.WD_INITIAL_MASS}&nbsp;${T('solar-mass', 'M☉')} carbon–oxygen
      ${T('white-dwarf', 'white dwarf')}</b>, about the size of Earth, supported
      not by fusion but by ${T('degeneracy', 'electron degeneracy pressure')}.</p>
      <p class="note">On its own it would simply cool forever. But it is not on its own…</p>`,
  },
  acc: {
    title: '4 · Accretion — feeding the white dwarf',
    body: `<p>The companion evolves, swells, and overflows its
      ${T('roche-lobe', 'Roche lobe')}. Gas streams through the ${T('l1', 'L1 point')}
      into an ${T('accretion-disk', 'accretion disk')} and settles onto the white
      dwarf, pushing its mass toward the
      <b>${T('chandrasekhar', 'Chandrasekhar limit')} ≈ ${CONSTANTS.CHANDRASEKHAR_MASS}&nbsp;${T('solar-mass', 'M☉')}</b>
      — the maximum that ${T('degeneracy', 'electron degeneracy pressure')} can
      support.</p>
      <p class="note">Alternative channel: two white dwarfs spiraling together and
      merging (the ${T('double-degenerate', '"double-degenerate" scenario')}).</p>`,
  },
  ign: {
    title: '5 · Ignition — thermonuclear runaway',
    body: `<p>Near 1.4&nbsp;${T('solar-mass', 'M☉')}, the core gets hot and dense
      enough for <b>carbon fusion</b>. In a normal star, heating → expansion →
      cooling: a thermostat. In ${T('degeneracy', 'degenerate matter')}, pressure
      barely depends on temperature — <b>there is no thermostat</b>.</p>
      <p>A century of convective "simmering" ends when a flame bubble ignites
      off-centre: a turbulent subsonic ${T('deflagration', 'deflagration')} that
      transitions to a supersonic ${T('detonation', 'detonation')}, incinerating
      the star.</p>`,
  },
  exp: {
    title: '6 · Explosion — explosive nucleosynthesis',
    body: `<p>The white dwarf is completely unbound in about two seconds, releasing
      ~10⁴⁴&nbsp;J. Burning conditions set the ejecta's onion-like composition:</p>
      <ul><li><b>Inner ~0.6 ${T('solar-mass', 'M☉')}</b> —
      ${T('nse', 'nuclear statistical equilibrium')} → radioactive ${T('ni56', '⁵⁶Ni')}</li>
      <li><b>Middle</b> — incomplete burning → Si, S, Ar, Ca</li>
      <li><b>Outer</b> — unburned C/O, flung out fastest</li></ul>
      <p>The panel below contrasts the ${T('r-process', 'r-process')} (rapid
      ${T('neutron-capture', 'neutron capture')}) with the
      ${T('s-process', 's-process')} seen earlier.</p>`,
  },
  lc: {
    title: '7 · The light curve — a radioactive lantern',
    body: `<p>The fireball itself would fade in minutes. What shines for months is
      the decay chain <b>${T('ni56', '⁵⁶Ni')} → ⁵⁶Co → ⁵⁶Fe</b>:
      ${T('gamma-rays', 'γ-rays')} and positrons heat the expanding ejecta, tracing
      out the ${T('light-curve', 'light curve')} below.</p>
      <ul><li>Peak ${T('abs-mag', 'absolute magnitude')} <b>M<sub>B</sub> ≈ −19.3</b>
      about 19 days after explosion</li>
      <li>Decline <b>${T('phillips', 'Δm₁₅')} ≈ 1.1 mag</b> in the next 15 days</li>
      <li>Late tail ≈ 1 mag / 100 days — the ⁵⁶Co half-life (77 d)</li></ul>
      <p class="note">Brighter Ia's decline more slowly (the
      ${T('phillips', 'Phillips relation')}) — that makes them
      ${T('standard-candle', 'standardizable candles')} used to measure cosmic
      acceleration.</p>`,
  },
};

/* ---------- nucleosynthesis panel ---------------------------- */
const NUC_CAPTION = {
  fusion: `Stellar fusion: 4 ¹H → ⁴He + 2e⁺ + 2ν + γ (the
    ${T('cno-cycle', 'CNO cycle')} in the core).`,
  sproc: `${T('s-process', 's-process')}: SLOW ${T('neutron-capture', 'neutron capture')}
    in the AGB He-shell. Neutrons arrive rarely, so unstable nuclei
    ${T('beta-decay', 'β-decay')} (↑) before the next capture (→). The path hugs
    the ${T('valley', 'valley of stability')} → Sr, Ba, Pb.`,
  rproc: `${T('r-process', 'r-process')}: RAPID capture — many neutrons before any
    ${T('beta-decay', 'β-decay')}, racing far into neutron-rich territory, then
    decaying back to stability → Au, Pt, U. Needs extreme neutron flux
    (neutron-star mergers, some core-collapse SNe). A Type Ia instead burns to
    iron-peak nuclei via ${T('nse', 'NSE')} — shown for contrast.`,
  decay: `${T('ni56', '⁵⁶Ni')} → ⁵⁶Co → ⁵⁶Fe. Each decay emits
    ${T('gamma-rays', 'γ-rays')} that thermalize in the ejecta and power the
    ${T('light-curve', 'light curve')}.`,
};

function nucMode() {
  switch (PHASES[state.ph].key) {
    case 'agb': return 'sproc';
    case 'ign': case 'exp': return 'rproc';
    case 'lc': return 'decay';
    default: return 'fusion';
  }
}

/* ---------- fixed-capacity ring buffer for trail points ------ */
function makeRing(cap) {
  return { buf: new Array(cap), cap, head: 0, count: 0 };
}
function ringPush(ring, item) {
  ring.buf[ring.head] = item;
  ring.head = (ring.head + 1) % ring.cap;
  if (ring.count < ring.cap) ring.count++;
}
function ringClear(ring) {
  ring.head = 0;
  ring.count = 0;
}
function ringForEach(ring, fn) {
  const start = (ring.head - ring.count + ring.cap) % ring.cap;
  for (let i = 0; i < ring.count; i++) fn(ring.buf[(start + i) % ring.cap], i);
}

/* persistent animation state for the N–Z walkers */
const nuc = {
  mode: '', sTok: null, rTok: null, sAcc: 0, rAcc: 0, sTrail: makeRing(60), rTrail: makeRing(90), rStage: 0,
};

function nzToXY(N, Z, w, h) {
  const x = lerp(34, w - 10, (N - 25) / (150 - 25));
  const y = lerp(h - 26, 12, (Z - 20) / (100 - 20));
  return [x, y];
}

function drawNZChart(g, w, h, title) {
  g.strokeStyle = '#232838'; g.lineWidth = 1;
  g.strokeRect(34, 12, w - 44, h - 38);
  g.fillStyle = '#8a92a8'; g.font = '11px "Segoe UI", sans-serif';
  g.textAlign = 'center';
  g.fillText('neutron number N →', w / 2, h - 6);
  g.save();
  g.translate(12, h / 2); g.rotate(-Math.PI / 2);
  g.fillText('protons Z →', 0, 0);
  g.restore();
  // valley of stability band
  g.beginPath();
  VALLEY.forEach(([N, Z], i) => {
    const [x, y] = nzToXY(N, Z + 3, w, h);
    i ? g.lineTo(x, y) : g.moveTo(x, y);
  });
  for (let i = VALLEY.length - 1; i >= 0; i--) {
    const [x, y] = nzToXY(VALLEY[i][0], VALLEY[i][1] - 3, w, h);
    g.lineTo(x, y);
  }
  g.closePath();
  g.fillStyle = 'rgba(127,180,255,0.16)';
  g.fill();
  const [vx, vy] = nzToXY(52, 48, w, h);
  g.fillStyle = 'rgba(127,180,255,0.8)';
  g.fillText('valley of stability', vx, vy - 24);
  g.fillStyle = '#ffb454';
  g.textAlign = 'left';
  g.fillText(title, 40, 26);
  g.textAlign = 'center';
}

function drawTrail(g, trail, w, h, color) {
  g.globalAlpha = 1;
  ringForEach(trail, (p, i) => {
    g.globalAlpha = 0.15 + 0.85 * i / trail.count;
    const [x, y] = nzToXY(p[0], p[1], w, h);
    g.fillStyle = color;
    g.fillRect(x - 2, y - 2, 4, 4);
  });
  g.globalAlpha = 1;
}

function renderNuc(cv, captionEl) {
  const { g, w, h } = panelCtx(cv);
  g.clearRect(0, 0, w, h);
  g.fillStyle = '#0a0d14';
  g.fillRect(0, 0, w, h);
  const mode = nucMode();
  if (mode !== nuc.mode) {           // reset walkers on mode change
    nuc.mode = mode;
    nuc.sTok = { N: 30, Z: 26 }; ringClear(nuc.sTrail); nuc.sAcc = 0;
    nuc.rTok = { N: 56, Z: 40 }; ringClear(nuc.rTrail); nuc.rAcc = 0; nuc.rStage = 0;
    captionEl.innerHTML = NUC_CAPTION[mode] || 'No caption available for this mode.';
  }
  const dt = 1 / 60 * state.speed * (state.playing ? 1 : 0);

  if (mode === 'fusion') {
    const cx = w / 2, cy = h / 2 + 8;
    for (let i = 0; i < 4; i++) {                 // protons spiralling in
      const ph = state.clock * 1.2 + i * TAU / 4;
      const r = 30 + 45 * (0.5 + 0.5 * Math.sin(state.clock * 0.9 + i));
      g.fillStyle = '#ff8a6a';
      g.beginPath();
      g.arc(cx + Math.cos(ph) * r, cy + Math.sin(ph) * r * 0.6, 5, 0, TAU);
      g.fill();
    }
    glow(g, cx, cy, 26, '#ffe9b8', 0.9);
    g.fillStyle = '#ffd76a';
    g.beginPath(); g.arc(cx, cy, 11, 0, TAU); g.fill();
    g.fillStyle = '#d8dce8'; g.font = '13px "Segoe UI", sans-serif'; g.textAlign = 'center';
    g.fillText('4 ¹H  →  ⁴He + 2e⁺ + 2ν + γ', cx, 26);
    g.font = '11px "Segoe UI", sans-serif'; g.fillStyle = '#8a92a8';
    g.fillText('0.7% of the mass becomes energy', cx, h - 12);
  }

  if (mode === 'sproc') {
    drawNZChart(g, w, h, 's-process — one slow neutron at a time');
    nuc.sAcc += dt;
    while (nuc.sAcc > 0.55) {                     // slow steps
      nuc.sAcc -= 0.55;
      const tk = nuc.sTok;
      ringPush(nuc.sTrail, [tk.N, tk.Z]);
      if (valleyZ(tk.N) - tk.Z > 1.6) { tk.N -= 1; tk.Z += 1; }  // β⁻ decay
      else tk.N += 1;                                            // n capture
      if (tk.N > 140) { nuc.sTok = { N: 30, Z: 26 }; ringClear(nuc.sTrail); }
    }
    drawTrail(g, nuc.sTrail, w, h, '#7fb4ff');
    const [x, y] = nzToXY(nuc.sTok.N, nuc.sTok.Z, w, h);
    glow(g, x, y, 10, '#ffffff', 0.9);
    g.fillStyle = '#ffffff';
    g.fillRect(x - 3, y - 3, 6, 6);
  }

  if (mode === 'rproc') {
    drawNZChart(g, w, h, 'r-process — a flood of neutrons');
    nuc.rAcc += dt;
    const tk = nuc.rTok;
    const interval = nuc.rStage === 0 ? 0.045 : 0.12;
    while (nuc.rAcc > interval) {
      nuc.rAcc -= interval;
      ringPush(nuc.rTrail, [tk.N, tk.Z]);
      if (nuc.rStage === 0) {                     // rapid captures, neutron-rich
        if (valleyZ(tk.N) - tk.Z > 13) { tk.N -= 1; tk.Z += 1; }
        else tk.N += 1;
        if (tk.N > 142) nuc.rStage = 1;           // freeze-out
      } else {                                    // β-decay cascade to stability
        tk.N -= 1; tk.Z += 1;
        if (tk.Z >= valleyZ(tk.N)) {
          nuc.rTok = { N: 56, Z: 40 }; ringClear(nuc.rTrail); nuc.rStage = 0;
        }
      }
    }
    drawTrail(g, nuc.rTrail, w, h, '#ff8a6a');
    const [x, y] = nzToXY(tk.N, tk.Z, w, h);
    glow(g, x, y, 10, '#ffd0a8', 0.95);
    g.fillStyle = '#ffffff';
    g.fillRect(x - 3, y - 3, 6, 6);
    const [ax, ay] = nzToXY(130, 88, w, h);
    g.fillStyle = '#ffd54f';
    g.fillText('Au, Pt, U…', ax, ay);
  }

  if (mode === 'decay') {
    const d = currentDay() ?? 0;
    const fr = decayFractions(d);
    const bars = [
      { lab: '⁵⁶Ni', f: fr.ni, c: '#cfd8ff' },
      { lab: '⁵⁶Co', f: fr.co, c: '#ffd54f' },
      { lab: '⁵⁶Fe', f: fr.fe, c: '#ff8a6a' },
    ];
    g.font = '12px "Segoe UI", sans-serif';
    bars.forEach((b, i) => {
      const bx = 60, by = 40 + i * 56, bw = w - 120, bh = 26;
      g.fillStyle = '#1a2030';
      g.fillRect(bx, by, bw, bh);
      g.fillStyle = b.c;
      g.fillRect(bx, by, bw * b.f, bh);
      g.textAlign = 'right'; g.fillStyle = '#d8dce8';
      g.fillText(b.lab, bx - 8, by + 17);
      g.textAlign = 'left';
      g.fillText(`${(b.f * 100).toFixed(1)}%`, bx + bw + 8, by + 17);
    });
    g.textAlign = 'center'; g.fillStyle = '#8a92a8';
    g.fillText(`isotope mix at day ${d.toFixed(0)}`, w / 2, h - 12);
  }
  g.textAlign = 'left';
}

/* ---------- light-curve panel -------------------------------- */
function renderLC(cv) {
  const { g, w, h } = panelCtx(cv);
  g.clearRect(0, 0, w, h);
  g.fillStyle = '#0a0d14';
  g.fillRect(0, 0, w, h);

  const x0 = 44, y0 = 16, x1 = w - 14, y1 = h - 30;
  const dMax = 250, mTop = -20, mBot = -14;
  const X = d => lerp(x0, x1, d / dMax);
  const Y = m => lerp(y0, y1, (m - mTop) / (mBot - mTop));

  // axes + grid
  g.strokeStyle = '#232838'; g.lineWidth = 1;
  g.font = '10px "Segoe UI", sans-serif'; g.fillStyle = '#8a92a8';
  for (let m = -20; m <= -14; m++) {
    g.beginPath(); g.moveTo(x0, Y(m)); g.lineTo(x1, Y(m)); g.stroke();
    g.textAlign = 'right'; g.fillText(m, x0 - 5, Y(m) + 3);
  }
  for (let d = 0; d <= dMax; d += 50) {
    g.beginPath(); g.moveTo(X(d), y0); g.lineTo(X(d), y1); g.stroke();
    g.textAlign = 'center'; g.fillText(d, X(d), y1 + 13);
  }
  g.fillText('days since explosion', (x0 + x1) / 2, h - 4);

  const day = currentDay();
  if (day === null) {
    g.fillStyle = '#8a92a8'; g.font = '12px "Segoe UI", sans-serif';
    g.textAlign = 'center';
    g.fillText('Awaiting detonation…', (x0 + x1) / 2, (y0 + y1) / 2);
    g.textAlign = 'left';
    return;
  }

  // full curve, faint preview
  g.strokeStyle = 'rgba(127,180,255,0.25)';
  g.setLineDash([3, 4]);
  g.beginPath();
  for (let d = 0; d <= dMax; d += 2) {
    const p = [X(d), Y(lcMag(d))];
    d ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]);
  }
  g.stroke();
  g.setLineDash([]);

  // curve drawn up to the current day
  g.strokeStyle = '#7fb4ff'; g.lineWidth = 2;
  g.beginPath();
  for (let d = 0; d <= day; d += 1) {
    const p = [X(d), Y(lcMag(d))];
    d ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]);
  }
  g.stroke();
  g.lineWidth = 1;

  // marker
  const mx = X(day), my = Y(lcMag(Math.max(day, 0.01)));
  glow(g, mx, my, 10, '#ffffff', 0.9);
  g.fillStyle = '#ffffff';
  g.beginPath(); g.arc(mx, my, 3.5, 0, TAU); g.fill();

  // annotations
  g.fillStyle = '#ffb454'; g.font = '10.5px "Segoe UI", sans-serif';
  g.textAlign = 'left';
  g.fillText('peak: M_B ≈ −19.3 @ day 19', X(24), Y(-19.3) - 8);
  if (day > 34) {
    g.fillStyle = '#8a92a8';
    g.fillText('Δm₁₅ ≈ 1.1', X(36), Y(-18.2));
  }
  if (day > 110) {
    g.save();
    g.translate(X(150), Y(lcMag(150)) - 10);
    g.rotate(0.18);
    g.fillStyle = '#8a92a8';
    g.fillText('⁵⁶Co tail: ~1 mag / 100 d', 0, 0);
    g.restore();
  }
  g.textAlign = 'left';
}
