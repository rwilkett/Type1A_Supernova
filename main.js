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
  seg.innerHTML = `<div class="fill"></div><span class="lab">${p.name}</span>`;
  seg.addEventListener('click', e => {
    const r = seg.getBoundingClientRect();
    setPhase(i, (e.clientX - r.left) / r.width);
    state.playing = true;
    updatePlayBtn();
  });
  timeline.appendChild(seg);
  return seg;
});

function updateTimeline() {
  segs.forEach((seg, i) => {
    seg.classList.toggle('active', i === state.ph);
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
  if (e.code === 'Space' && e.target.tagName !== 'INPUT') {
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
function frame(ts) {
  const dt = Math.min((ts - lastTs) / 1000, 0.1);
  lastTs = ts;
  stepState(dt);

  const g = fitCanvas(stageCv);
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
  updateTimeline();
  simTimeEl.textContent = simTimeLabel();
  updatePlayBtn();

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
