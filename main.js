/* ============================================================
   main.js — DOM wiring, controls, render loop
   ============================================================ */
'use strict';

const stageCv = document.getElementById('stage');
const nucCv = document.getElementById('nuc');
const lcCv = document.getElementById('lc');
const nucCaption = document.getElementById('nuc-caption');
const infoTitle = document.getElementById('info-title');
const infoBody = document.getElementById('info-body');
const simTimeEl = document.getElementById('sim-time');
const playBtn = document.getElementById('play');
const restartBtn = document.getElementById('restart');
const speedInput = document.getElementById('speed');
const speedVal = document.getElementById('speed-val');
const timeline = document.getElementById('timeline');

/* ---------- timeline segments -------------------------------- */
const segs = PHASES.map((p, i) => {
  const seg = document.createElement('div');
  seg.className = 'seg';
  seg.style.flexGrow = p.dur;
  seg.dataset.index = i;
  seg.tabIndex = 0;
  seg.setAttribute('role', 'button');
  seg.setAttribute('aria-label', `Jump to phase: ${p.name}`);
  seg.innerHTML = `<div class="fill"></div><span class="lab">${p.name}</span>`;
  timeline.appendChild(seg);
  return seg;
});

timeline.addEventListener('click', e => {
  const seg = e.target.closest('.seg');
  if (!seg) return;
  const r = seg.getBoundingClientRect();
  setPhase(+seg.dataset.index, (e.clientX - r.left) / r.width);
  state.playing = true;
  updatePlayBtn();
});

timeline.addEventListener('keydown', e => {
  const seg = e.target.closest('.seg');
  if (!seg) return;
  if (e.code === 'Enter' || e.code === 'Space') {
    e.preventDefault();
    setPhase(+seg.dataset.index, 0);
    state.playing = true;
    updatePlayBtn();
  } else if (e.code === 'ArrowRight' || e.code === 'ArrowLeft') {
    e.preventDefault();
    const dir = e.code === 'ArrowRight' ? 1 : -1;
    segs[clamp(+seg.dataset.index + dir, 0, segs.length - 1)].focus();
  }
});

function updateTimeline() {
  segs.forEach((seg, i) => {
    seg.classList.toggle('active', i === state.ph);
    seg.setAttribute('aria-current', i === state.ph ? 'step' : 'false');
    seg.querySelector('.fill').style.width =
      i < state.ph ? '100%' : i === state.ph ? `${state.pt * 100}%` : '0%';
  });
}

/* ---------- controls ------------------------------------------ */
function updatePlayBtn() {
  playBtn.textContent = state.playing ? 'Pause' : (state.ended ? 'Replay' : 'Play');
}

playBtn.addEventListener('click', () => {
  if (state.ended) { setPhase(0); state.playing = true; }
  else state.playing = !state.playing;
  updatePlayBtn();
});

restartBtn.addEventListener('click', () => {
  setPhase(0);
  state.playing = true;
  updatePlayBtn();
});

speedInput.addEventListener('input', () => {
  state.speed = Math.pow(10, +speedInput.value);
  speedVal.textContent =
    state.speed >= 10 ? `${state.speed.toFixed(0)}×`
    : state.speed >= 1 ? `${state.speed.toFixed(1)}×`
    : `${state.speed.toFixed(2)}×`;
});

document.addEventListener('keydown', e => {
  if (e.code === 'Space' && e.target.tagName !== 'INPUT' && !e.target.closest('.seg')) {
    e.preventDefault();
    playBtn.click();
  }
});

/* ---------- info panel ---------------------------------------- */
let lastInfoKey = '';
function updateInfo() {
  const key = PHASES[state.ph].key;
  if (key === lastInfoKey) return;
  lastInfoKey = key;
  infoTitle.textContent = INFO[key].title;
  infoBody.innerHTML = INFO[key].body;
}

/* ---------- render loop ---------------------------------------- */
let lastTs = performance.now();
let lastPh = -1, lastPtBucket = -1, lastPlaying = null, lastEnded = null, lastSimLabel = '';
function frame(ts) {
  const dt = Math.min((ts - lastTs) / 1000, 0.1);
  lastTs = ts;
  stepState(dt);

  const g = fitCanvas(stageCv);
  if (!g) { requestAnimationFrame(frame); return; }
  const W = stageCv.clientWidth, H = stageCv.clientHeight;
  g.fillStyle = '#07090f';
  g.fillRect(0, 0, W, H);
  drawStars(g, W, H);
  STAGE_DRAW[state.ph](g, W, H, state.pt);

  // phase name watermark
  g.font = '600 12px "Segoe UI", sans-serif';
  g.fillStyle = 'rgba(138,146,168,0.8)';
  g.textAlign = 'right';
  g.fillText(`phase ${state.ph + 1}/7 · ${PHASES[state.ph].name}`, W - 16, H - 14);
  g.textAlign = 'left';

  renderNuc(nucCv, nucCaption);
  renderLC(lcCv);
  updateInfo();

  const ptBucket = Math.floor(state.pt * 1000);
  if (state.ph !== lastPh || ptBucket !== lastPtBucket) {
    lastPh = state.ph;
    lastPtBucket = ptBucket;
    updateTimeline();
  }
  if (state.playing !== lastPlaying || state.ended !== lastEnded) {
    lastPlaying = state.playing;
    lastEnded = state.ended;
    updatePlayBtn();
  }
  const simLabel = simTimeLabel();
  if (simLabel !== lastSimLabel) {
    lastSimLabel = simLabel;
    simTimeEl.textContent = simLabel;
  }

  requestAnimationFrame(frame);
}

function validatePhaseSystem() {
  const errors = [];
  if (STAGE_DRAW.length !== PHASES.length) {
    errors.push(`STAGE_DRAW.length (${STAGE_DRAW.length}) !== PHASES.length (${PHASES.length})`);
  }
  PHASES.forEach((p, i) => {
    if (!INFO[p.key]) errors.push(`PHASES[${i}].key "${p.key}" has no matching INFO entry`);
    if (typeof STAGE_DRAW[i] !== 'function') errors.push(`STAGE_DRAW[${i}] is not a function (phase "${p.key}")`);
  });
  if (errors.length) console.error('[phase-system] consistency check failed:\n' + errors.join('\n'));
}
validatePhaseSystem();

requestAnimationFrame(frame);
