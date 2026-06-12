/* ============================================================
   stage.js — main-canvas renderers, one per phase
   Each receives (g, W, H, t) with t = phase progress 0..1
   ============================================================ */
'use strict';

/* ---------- 1. main sequence -------------------------------- */
function drawMS(g, W, H, t) {
  const cx = W * 0.42, cy = H * 0.52;
  const R = Math.min(W, H) * 0.21;
  const flick = 1 + 0.03 * Math.sin(state.clock * 6);

  // companion orbit
  const orbR = Math.min(W, H) * 0.40;
  g.strokeStyle = 'rgba(138,146,168,0.25)';
  g.setLineDash([4, 6]);
  g.beginPath(); g.ellipse(cx, cy, orbR, orbR * 0.38, 0, 0, TAU); g.stroke();
  g.setLineDash([]);
  const oa = state.clock * 0.5;
  const ox = cx + Math.cos(oa) * orbR, oy = cy + Math.sin(oa) * orbR * 0.38;
  glow(g, ox, oy, 26, '#ffe9b8', 0.9);
  g.fillStyle = '#fff4d6';
  g.beginPath(); g.arc(ox, oy, 9, 0, TAU); g.fill();
  stageText(g, ox, oy - 18, 'companion · 2.0 M☉', 11, '#8a92a8', 'center');

  // primary, cutaway
  const layers = [
    { f: 1.00, c0: '#ffce7a', c1: '#e8943c', label: 'Convective envelope (H, He)' },
    { f: 0.68, c0: '#ffe2a8', c1: '#ffc06a', label: 'Radiative zone' },
    { f: 0.24 * flick, c0: '#ffffff', c1: '#ffd76a', label: 'Core: H → He (CNO cycle)' },
  ];
  cutStar(g, cx, cy, R, layers);
  layerLabels(g, cx, cy, R, layers, 1);
  stageText(g, cx, cy + R + 30, 'primary · 3.0 M☉ — cutaway view', 12, '#8a92a8', 'center');
  stageText(g, 20, 34, 'A binary system, quietly fusing hydrogen for ~350 million years', 14, '#ffb454');
}

/* ---------- 2. red giant / AGB ------------------------------ */
function drawAGB(g, W, H, t) {
  const cx = W * 0.32, cy = H * 0.52;
  const grow = smooth(clamp(t * 2.2, 0, 1));
  const R = Math.min(W, H) * lerp(0.19, 0.30, grow);
  // thermal pulses late in the phase
  const pulse = t > 0.45 ? 0.5 + 0.5 * Math.sin(state.clock * 5) : 0;

  const layers = [
    { f: 1.00, c0: '#ff9d5c', c1: '#b8421f', label: 'Convective envelope' },
    { f: 0.30, c0: '#ffe2a8', c1: '#ff8c4a', label: 'H-burning shell' },
    { f: 0.22 + 0.02 * pulse, c0: '#fff6d8', c1: '#ffd76a', label: 'He shell — s-process!' },
    { f: 0.13, c0: '#e8ecff', c1: '#9aa6c8', label: 'C/O core (degenerate)' },
  ];
  cutStar(g, cx, cy, R, layers);
  layerLabels(g, cx, cy, R, layers, 1);

  // dredge-up arrows during pulses
  if (pulse > 0.4) {
    g.strokeStyle = `rgba(255,240,180,${pulse * 0.8})`;
    g.lineWidth = 2;
    for (let i = 0; i < 3; i++) {
      const a = -0.9 - i * 0.5;
      const r0 = R * 0.24, r1 = R * 0.7;
      g.beginPath();
      g.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0);
      g.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1);
      g.stroke();
    }
    stageText(g, cx - R * 0.9, cy - R * 0.8, 'thermal pulse → dredge-up', 11, '#ffe9b8');
  }
  stageText(g, 20, 34, 'Core H spent → the star swells into a red giant, then an AGB star', 14, '#ffb454');
  stageText(g, 20, 54, 'He-shell flashes release free neutrons → slow neutron capture (s-process)', 12, '#8a92a8');
}

/* ---------- 3. planetary nebula → white dwarf ---------------- */
function drawPN(g, W, H, t) {
  const cx = W * 0.46, cy = H * 0.5;
  const maxR = Math.min(W, H) * 0.45;

  // expanding shells
  for (let i = 0; i < 4; i++) {
    const p = clamp(t * 1.3 - i * 0.12, 0, 1);
    if (p <= 0) continue;
    const r = lerp(maxR * 0.12, maxR, easeOut(p));
    const a = (1 - p) * 0.5;
    g.strokeStyle = `rgba(120,220,200,${a})`;
    g.lineWidth = 10 * (1 - p) + 2;
    g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.stroke();
    g.strokeStyle = `rgba(255,150,120,${a * 0.7})`;
    g.lineWidth = 3;
    g.beginPath(); g.ellipse(cx, cy, r * 1.05, r * 0.92, i, 0, TAU); g.stroke();
  }

  // emerging white dwarf
  const wdR = Math.min(W, H) * 0.06;
  const layers = [
    { f: 1.00, c0: '#ffffff', c1: '#bcd2ff', label: 'Thin H/He atmosphere' },
    { f: 0.85, c0: '#eef2ff', c1: '#c8d4f8', label: 'Carbon–oxygen interior' },
  ];
  cutStar(g, cx, cy, wdR, layers);
  if (t > 0.5) layerLabels(g, cx, cy, wdR, layers, 1);
  glow(g, cx, cy, wdR * 4, '#bcd9ff', 0.5);

  stageText(g, 20, 34, 'The envelope drifts away as a planetary nebula…', 14, '#ffb454');
  stageText(g, 20, 54, '…exposing a ~0.85 M☉ carbon–oxygen white dwarf — Earth-sized,', 12, '#8a92a8');
  stageText(g, 20, 70, 'held up by electron degeneracy pressure. No fusion. It just cools.', 12, '#8a92a8');
}

/* ---------- 4. accretion ------------------------------------- */
function drawACC(g, W, H, t) {
  const gx = W * 0.27, gy = H * 0.52;          // giant companion
  const wx = W * 0.68, wy = H * 0.52;          // white dwarf
  const gR = Math.min(W, H) * 0.17;

  // Roche lobes (dashed figure-eight approximation)
  g.strokeStyle = 'rgba(138,146,168,0.4)';
  g.setLineDash([5, 5]);
  g.lineWidth = 1;
  const L1 = (gx + wx) / 2 - W * 0.02;
  g.beginPath(); g.ellipse(gx, gy, L1 - gx, gR * 1.5, 0, 0, TAU); g.stroke();
  g.beginPath(); g.ellipse(wx, wy, wx - L1, gR * 1.1, 0, 0, TAU); g.stroke();
  g.setLineDash([]);
  stageText(g, L1, gy - gR * 1.6, 'L1', 11, '#8a92a8', 'center');

  // distorted giant (teardrop toward L1)
  const grd = g.createRadialGradient(gx, gy, gR * 0.1, gx, gy, gR);
  grd.addColorStop(0, '#ffb37a'); grd.addColorStop(1, '#a8431f');
  g.fillStyle = grd;
  g.beginPath();
  g.ellipse(gx + gR * 0.15, gy, gR * 1.18, gR, 0, 0, TAU);
  g.fill();
  g.beginPath();
  g.moveTo(gx + gR * 0.6, gy - gR * 0.5);
  g.quadraticCurveTo(L1 - 8, gy, gx + gR * 0.6, gy + gR * 0.5);
  g.fill();
  stageText(g, gx, gy + gR + 24, 'evolved companion overflows its Roche lobe', 11, '#8a92a8', 'center');

  // accretion stream + disk
  const diskR = gR * 0.85;
  g.strokeStyle = 'rgba(255,200,140,0.9)';
  g.lineWidth = 3;
  g.beginPath();
  g.moveTo(L1 - 6, gy);
  g.quadraticCurveTo(L1 + (wx - L1) * 0.5, gy - diskR * 0.55, wx - diskR * 0.7, wy - diskR * 0.28);
  g.stroke();
  for (let i = 4; i >= 1; i--) {
    const rr = diskR * i / 4;
    const dg = g.createRadialGradient(wx, wy, rr * 0.2, wx, wy, rr);
    dg.addColorStop(0, 'rgba(255,250,230,0.95)');
    dg.addColorStop(1, `rgba(255,${140 + i * 20},80,${0.25 + 0.1 * i})`);
    g.fillStyle = dg;
    g.beginPath(); g.ellipse(wx, wy, rr, rr * 0.32, 0, 0, TAU); g.fill();
  }
  // rotation streaks
  g.strokeStyle = 'rgba(255,255,255,0.35)';
  g.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const a = state.clock * 2 + i * TAU / 5;
    g.beginPath();
    g.ellipse(wx, wy, diskR * 0.7, diskR * 0.22, 0, a, a + 1.2);
    g.stroke();
  }
  g.fillStyle = '#ffffff';
  g.beginPath(); g.arc(wx, wy, 5, 0, TAU); g.fill();
  glow(g, wx, wy, 22, '#cfe2ff', 0.9);
  stageText(g, wx, wy + diskR * 0.5 + 22, 'accretion disk → white dwarf', 11, '#8a92a8', 'center');

  // mass gauge
  const mass = lerp(0.85, 1.44, smooth(t));
  const bx = W * 0.5 - 150, by = H - 56, bw = 300, bh = 14;
  g.fillStyle = '#1a2030';
  g.fillRect(bx, by, bw, bh);
  g.fillStyle = mass > 1.38 ? '#ff6a4a' : '#7fb4ff';
  g.fillRect(bx, by, bw * (mass - 0.5) / (1.5 - 0.5), bh);
  const chx = bx + bw * (1.44 - 0.5) / 1.0;
  g.strokeStyle = '#ffb454'; g.lineWidth = 2;
  g.beginPath(); g.moveTo(chx, by - 6); g.lineTo(chx, by + bh + 6); g.stroke();
  stageText(g, chx, by - 12, 'Chandrasekhar limit ≈ 1.44 M☉', 11, '#ffb454', 'center');
  stageText(g, bx, by + bh + 18, `white dwarf mass: ${mass.toFixed(3)} M☉`, 12, '#d8dce8');
  stageText(g, 20, 34, 'Stolen matter piles onto the white dwarf for millions of years', 14, '#ffb454');
}

/* ---------- 5. ignition --------------------------------------- */
function drawIGN(g, W, H, t) {
  const cx = W * 0.34, cy = H * 0.52;
  const R = Math.min(W, H) * 0.26;
  const simmer = t < 0.55;
  const rt = simmer ? 0 : (t - 0.55) / 0.45;     // runaway progress

  const layers = [
    { f: 1.00, c0: '#f4f7ff', c1: '#b8c8ee', label: 'Degenerate C/O — 1.4 M☉' },
    { f: 0.45, c0: '#fff2cf', c1: '#e8d8a8', label: simmer ? 'Core: C "simmering"' : 'Runaway burning!' },
  ];
  cutStar(g, cx, cy, R, layers);
  layerLabels(g, cx, cy, R, layers, 1);

  if (simmer) {
    // flickering convective plumes
    for (let i = 0; i < 14; i++) {
      const a = i * TAU / 14 + Math.sin(state.clock * 2 + i) * 0.3;
      const rr = R * 0.45 * (0.4 + 0.5 * Math.abs(Math.sin(state.clock * 3 + i * 2)));
      glow(g, cx + Math.cos(a) * rr * 0.6, cy + Math.sin(a) * rr * 0.6, R * 0.09, '#ffd76a', 0.5);
    }
    stageText(g, 20, 34, 'At ~1.4 M☉ carbon ignites — a century of convective simmering…', 14, '#ffb454');
  } else {
    // off-centre deflagration bubbles growing into a turbulent flame
    const fx = cx - R * 0.18, fy = cy - R * 0.12;
    const fr = R * lerp(0.06, 0.95, easeOut(rt));
    for (let i = 0; i < 10; i++) {
      const a = i * TAU / 10 + state.clock * 4;
      const wob = 1 + 0.25 * Math.sin(state.clock * 9 + i * 3);
      glow(g, fx + Math.cos(a) * fr * 0.5 * wob, fy + Math.sin(a) * fr * 0.5 * wob, fr * 0.55, '#ffffff', 0.85);
    }
    glow(g, fx, fy, fr, '#fff6d0', 0.95);
    if (rt > 0.7) {                              // detonation front
      g.strokeStyle = `rgba(255,255,255,${(rt - 0.7) * 3})`;
      g.lineWidth = 4;
      g.beginPath(); g.arc(fx, fy, fr * 1.1, 0, TAU); g.stroke();
      stageText(g, 20, 54, 'deflagration → DETONATION: the flame goes supersonic', 12, '#ff8a6a');
    }
    stageText(g, 20, 34, '…then runaway! Degenerate matter cannot expand to cool itself', 14, '#ffb454');
  }
}

/* ---------- 6. explosion --------------------------------------- */
function drawEXP(g, W, H, t) {
  const cx = W * 0.44, cy = H * 0.5;
  const maxR = Math.min(W, H) * 0.43;
  const R = maxR * easeOut(clamp(t * 1.15, 0, 1));

  // composition zones, outer first
  const zones = [
    { f: 1.00, c: '#d4502e', label: 'unburned C/O — fastest ejecta' },
    { f: 0.62, c: '#ffd54f', label: 'Si, S, Ar, Ca (incomplete burning)' },
    { f: 0.38, c: '#cfd8ff', label: '⁵⁶Ni & iron-peak (NSE)' },
  ];
  for (const z of zones) {
    const r = z.f * R;
    const gr = g.createRadialGradient(cx, cy, r * 0.2, cx, cy, r);
    gr.addColorStop(0, z.c);
    gr.addColorStop(1, z.c + '55');
    g.fillStyle = gr;
    g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.fill();
  }
  // shock front + radial velocity streaks
  g.strokeStyle = 'rgba(255,255,255,0.9)';
  g.lineWidth = 3;
  g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.stroke();
  g.strokeStyle = 'rgba(255,255,255,0.25)';
  g.lineWidth = 1.5;
  for (let i = 0; i < 24; i++) {
    const a = i * TAU / 24 + 0.1 * Math.sin(i * 7);
    g.beginPath();
    g.moveTo(cx + Math.cos(a) * R * 0.5, cy + Math.sin(a) * R * 0.5);
    g.lineTo(cx + Math.cos(a) * R * 1.08, cy + Math.sin(a) * R * 1.08);
    g.stroke();
  }

  // shocked companion
  const ox = cx + maxR * 1.15, oy = cy - maxR * 0.3;
  glow(g, ox, oy, 24, '#ffe9b8', 0.9);
  g.fillStyle = '#fff4d6';
  g.beginPath(); g.arc(ox, oy, 9, 0, TAU); g.fill();
  if (R > Math.hypot(ox - cx, oy - cy) * 0.8) {
    g.strokeStyle = 'rgba(255,220,160,0.8)';
    g.lineWidth = 2;
    g.beginPath(); g.arc(ox, oy, 16, Math.PI * 0.7, Math.PI * 1.6); g.stroke();
    stageText(g, ox, oy - 24, 'companion survives, shocked', 11, '#8a92a8', 'center');
  }

  // legend
  g.font = '12px "Segoe UI", sans-serif';
  zones.slice().reverse().forEach((z, i) => {
    const ly = H - 88 + i * 22;
    g.fillStyle = z.c;
    g.fillRect(20, ly - 10, 14, 14);
    g.fillStyle = '#d8dce8';
    g.fillText(z.label, 42, ly + 2);
  });

  // initial flash
  if (t < 0.12) {
    g.fillStyle = `rgba(255,255,255,${(0.12 - t) / 0.12})`;
    g.fillRect(0, 0, W, H);
  }
  stageText(g, 20, 34, 'The white dwarf is completely unbound in ~2 seconds — no remnant', 14, '#ffb454');
  stageText(g, 20, 54, 'Ejecta speed 10,000–20,000 km/s · kinetic energy ~10⁴⁴ J', 12, '#8a92a8');
}

/* ---------- 7. light-curve phase (fading ejecta) ---------------- */
function drawLCStage(g, W, H, t) {
  const cx = W * 0.42, cy = H * 0.46;
  const day = t * 250;
  const maxR = Math.min(W, H) * 0.43;
  const R = maxR * (1 + t * 0.25);
  const lum = clamp(Math.pow(10, -0.4 * (lcMag(day) + 19.3)), 0, 1); // flux / peak flux
  const bright = clamp(1 - (lcMag(day) + 14) / -5.3, 0.05, 1);

  // diffusing, fading ejecta
  const zones = [
    { f: 1.00, c: '212,80,46' }, { f: 0.62, c: '255,213,79' }, { f: 0.38, c: '207,216,255' },
  ];
  for (const z of zones) {
    const r = z.f * R;
    const gr = g.createRadialGradient(cx, cy, r * 0.1, cx, cy, r);
    gr.addColorStop(0, `rgba(${z.c},${0.55 * bright + 0.08})`);
    gr.addColorStop(1, `rgba(${z.c},0.03)`);
    g.fillStyle = gr;
    g.beginPath(); g.arc(cx, cy, r, 0, TAU); g.fill();
  }
  glow(g, cx, cy, R * 0.5, '#ffffff', bright * 0.8);

  // decay-chain diagram with live fractions
  const fr = decayFractions(day);
  const dx = W * 0.5 - 220, dy = H - 96;
  const chain = [
    { sym: '⁵⁶Ni', t: 't½ = 6.1 d', f: fr.ni, c: '#cfd8ff' },
    { sym: '⁵⁶Co', t: 't½ = 77.2 d', f: fr.co, c: '#ffd54f' },
    { sym: '⁵⁶Fe', t: 'stable', f: fr.fe, c: '#ff8a6a' },
  ];
  chain.forEach((n, i) => {
    const x = dx + i * 170;
    g.fillStyle = '#11141d';
    g.strokeStyle = n.c; g.lineWidth = 2;
    g.beginPath(); g.arc(x, dy, 26, 0, TAU); g.fill(); g.stroke();
    stageText(g, x, dy - 2, n.sym, 14, n.c, 'center');
    stageText(g, x, dy + 14, `${(n.f * 100).toFixed(0)}%`, 11, '#d8dce8', 'center');
    stageText(g, x, dy + 44, n.t, 11, '#8a92a8', 'center');
    if (i < 2) {
      g.strokeStyle = '#8a92a8'; g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(x + 32, dy); g.lineTo(x + 132, dy); g.stroke();
      g.beginPath(); g.moveTo(x + 132, dy); g.lineTo(x + 124, dy - 5);
      g.moveTo(x + 132, dy); g.lineTo(x + 124, dy + 5); g.stroke();
      stageText(g, x + 82, dy - 8, 'β⁺ / EC, γ-rays', 10, '#8a92a8', 'center');
    }
  });

  stageText(g, 20, 34, 'Radioactive decay, not the explosion, powers the light we see', 14, '#ffb454');
  stageText(g, 20, 54, `luminosity ≈ ${(lum * 100).toFixed(0)}% of peak · ejecta thinning as they expand`, 12, '#8a92a8');
  if (state.ended) stageText(g, W / 2, H / 2, 'Simulation complete — press Restart to replay', 16, '#7fb4ff', 'center');
}

const STAGE_DRAW = [drawMS, drawAGB, drawPN, drawACC, drawIGN, drawEXP, drawLCStage];
