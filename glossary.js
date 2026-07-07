/* ============================================================
   glossary.js — clickable term definitions
   Terms are marked in HTML as:
     <span class="term" data-term="key">displayed text</span>
   ============================================================ */
'use strict';

const GLOSSARY = {
  'solar-mass': {
    title: 'Solar mass (M☉)',
    def: 'The standard unit for weighing stars: the mass of our own Sun, about ' +
      '1.99 × 10³⁰ kg (≈ 333,000 Earths). So the "3.0 M☉ primary" in this ' +
      'simulation has three times the Sun\'s mass. Astronomers quote nearly all ' +
      'stellar masses this way because the numbers stay small and intuitive.',
  },
  'main-sequence': {
    title: 'Main sequence',
    def: 'The long, stable phase in which a star fuses hydrogen into helium in ' +
      'its core — about 90% of a star\'s life. Our Sun is a main-sequence star. ' +
      'More massive stars burn hotter and exhaust their fuel sooner.',
  },
  'binary': {
    title: 'Binary system',
    def: 'Two stars orbiting their common center of mass. Roughly half of all ' +
      'Sun-like and more massive stars have companions. A Type Ia supernova ' +
      'requires a binary — a lone white dwarf would simply cool forever.',
  },
  'cno-cycle': {
    title: 'CNO cycle',
    def: 'A way of fusing hydrogen into helium using carbon, nitrogen and oxygen ' +
      'nuclei as catalysts. It dominates over the simpler proton–proton chain in ' +
      'stars heavier than about 1.3 M☉. Net result is the same: 4 ¹H → ⁴He, ' +
      'converting 0.7% of the mass to energy.',
  },
  'agb': {
    title: 'Asymptotic giant branch (AGB)',
    def: 'A late evolutionary stage for stars below ~8 M☉: a bloated giant ' +
      'hundreds of times the Sun\'s radius, with a degenerate C/O core and ' +
      'hydrogen and helium burning in thin shells. AGB stars pulse, lose mass in ' +
      'strong winds, and are the main site of the s-process.',
  },
  'triple-alpha': {
    title: 'Triple-α process',
    def: 'Helium fusion: three ⁴He nuclei (α particles) combine into ¹²C at ' +
      'around 100 million K. Some carbon captures another α to make ¹⁶O — which ' +
      'is why the leftover core is a carbon–oxygen mix.',
  },
  's-process': {
    title: 's-process (slow neutron capture)',
    def: 'Builds heavy elements one neutron at a time. Captures are so infrequent ' +
      '(years to centuries apart) that unstable nuclei β-decay back toward ' +
      'stability before the next neutron arrives, so the path hugs the valley of ' +
      'stability. Source of much of the Sr, Zr, Ba and Pb in the universe. ' +
      'Happens in AGB stars, not in the explosion itself.',
  },
  'r-process': {
    title: 'r-process (rapid neutron capture)',
    def: 'Builds heavy elements in a neutron flood: nuclei capture dozens of ' +
      'neutrons in under a second — far faster than they can decay — racing deep ' +
      'into neutron-rich territory before β-decaying back to stability. Makes ' +
      'roughly half of all elements heavier than iron, including gold, platinum ' +
      'and uranium. Requires extreme environments: confirmed in neutron-star ' +
      'mergers (kilonova GW170817), suspected in some core-collapse supernovae.',
  },
  'neutron-capture': {
    title: 'Neutron capture',
    def: 'A nucleus absorbs a free neutron, becoming a heavier isotope of the ' +
      'same element (N + 1, same Z). Because neutrons feel no electric repulsion, ' +
      'this works even on heavy nuclei where charged-particle fusion is impossible ' +
      '— it is how nature builds almost everything heavier than iron.',
  },
  'beta-decay': {
    title: 'β⁻ decay',
    def: 'A neutron inside an unstable, neutron-rich nucleus turns into a proton, ' +
      'emitting an electron and an antineutrino. The mass number stays the same ' +
      'but the element changes (Z + 1) — one step up the periodic table, and one ' +
      'step back toward the valley of stability.',
  },
  'valley': {
    title: 'Valley of stability',
    def: 'On a chart of nuclides (neutrons vs. protons), the narrow band where ' +
      'stable isotopes live — light nuclei like equal numbers of each; heavy ' +
      'nuclei need a growing neutron surplus. Nuclei off the band are radioactive ' +
      'and decay back toward it.',
  },
  'thermal-pulse': {
    title: 'Thermal pulse & dredge-up',
    def: 'In an AGB star the helium shell burns in violent flashes every few ' +
      'thousand years. Each flash drives convection that "dredges up" freshly ' +
      'made carbon and s-process elements to the surface — and releases the free ' +
      'neutrons (via ¹³C(α,n)¹⁶O) that power the s-process.',
  },
  'planetary-nebula': {
    title: 'Planetary nebula',
    def: 'The glowing shell of gas an AGB star sheds at the end of its life, lit ' +
      'up by the hot exposed core. Nothing to do with planets — 18th-century ' +
      'astronomers thought the round disks looked planet-like through small ' +
      'telescopes, and the name stuck.',
  },
  'white-dwarf': {
    title: 'White dwarf',
    def: 'The leftover core of a low- or intermediate-mass star: roughly the mass ' +
      'of the Sun squeezed into a ball the size of Earth (a teaspoon weighs ' +
      '~5 tonnes). No fusion — it shines only by leaking stored heat, supported ' +
      'against gravity by electron degeneracy pressure.',
  },
  'degeneracy': {
    title: 'Electron degeneracy pressure',
    def: 'A quantum effect: the Pauli exclusion principle forbids electrons from ' +
      'being squeezed into the same state, producing pressure that depends on ' +
      'density but barely on temperature. That is what holds a white dwarf up — ' +
      'and why ignition is catastrophic: heating does not make it expand and ' +
      'cool, so burning runs away.',
  },
  'chandrasekhar': {
    title: 'Chandrasekhar limit',
    def: 'The maximum mass electron degeneracy pressure can support: about ' +
      '1.44 M☉ (derived by Subrahmanyan Chandrasekhar in 1930, age 19). Push a ' +
      'white dwarf toward it and the core compresses and heats until carbon ' +
      'ignites. This single universal number is why Type Ia supernovae are so ' +
      'uniform — every one explodes from nearly the same starting point.',
  },
  'roche-lobe': {
    title: 'Roche lobe',
    def: 'Around each star in a binary, the teardrop-shaped region inside which ' +
      'material is gravitationally bound to that star. If a star swells beyond ' +
      'its Roche lobe, the overflow spills through the L1 point toward its ' +
      'companion — "Roche-lobe overflow".',
  },
  'l1': {
    title: 'L1 (first Lagrange point)',
    def: 'The balance point on the line between two orbiting stars where their ' +
      'gravitational pulls (plus orbital motion) cancel. It is the gateway: gas ' +
      'overflowing one star\'s Roche lobe funnels through L1 to the other star.',
  },
  'accretion-disk': {
    title: 'Accretion disk',
    def: 'Infalling gas carries too much angular momentum to drop straight onto ' +
      'the white dwarf, so it spirals inward through a flat, friction-heated ' +
      'disk, glowing hot before settling onto the surface.',
  },
  'double-degenerate': {
    title: 'Double-degenerate channel',
    def: 'An alternative route to a Type Ia: two white dwarfs in a tight binary ' +
      'lose orbital energy to gravitational waves, spiral together, and merge — ' +
      'exceeding the Chandrasekhar mass without any accretion disk. Evidence ' +
      'suggests many (perhaps most) Type Ia events arise this way.',
  },
  'core-collapse': {
    title: 'Core-collapse supernova (Types II, Ib, Ic)',
    def: 'The death of a massive star (heavier than ~8 M☉): after fusing its way ' +
      'to an inert iron core, the star can extract no more energy, the core ' +
      'collapses to a neutron star or black hole in milliseconds, and the rebound ' +
      'shock (driven by a colossal neutrino burst) blows off the rest. ' +
      'A completely different mechanism from the thermonuclear Type Ia — gravity ' +
      'powers it, not runaway fusion.',
  },
  'neutron-star': {
    title: 'Neutron star',
    def: 'The collapsed core a core-collapse supernova leaves behind: roughly ' +
      '1.4 M☉ packed into a city-sized sphere ~20 km across, dense as an atomic ' +
      'nucleus. A Type Ia leaves no such remnant — the white dwarf is entirely ' +
      'blown apart.',
  },
  'distance-ladder': {
    title: 'Cosmic distance ladder',
    def: 'The chain of overlapping techniques astronomers use to measure ever ' +
      'larger distances: radar and parallax for nearby objects calibrate Cepheid ' +
      'variable stars, which calibrate Type Ia supernovae in the same galaxies, ' +
      'which then reach across billions of light-years. Each rung anchors the ' +
      'next.',
  },
  'redshift': {
    title: 'Redshift',
    def: 'The stretching of light to longer (redder) wavelengths as the universe ' +
      'expands during the light\'s journey. Redshift tells you how much the ' +
      'universe has grown since the light was emitted; combining it with a ' +
      'supernova\'s distance reveals the expansion history.',
  },
  'dark-energy': {
    title: 'Dark energy',
    def: 'The name for whatever is causing the expansion of the universe to ' +
      'accelerate — discovered in 1998 when two teams found distant Type Ia ' +
      'supernovae fainter (farther away) than any decelerating universe allows. ' +
      'It appears to make up ~68% of the universe\'s energy content, and its ' +
      'nature remains unknown.',
  },
  'deflagration': {
    title: 'Deflagration',
    def: 'Subsonic burning — a flame front that advances by heat conduction, like ' +
      'a fire, wrinkled and accelerated by turbulence. The Type Ia explosion is ' +
      'thought to begin this way, giving the star a moment to pre-expand.',
  },
  'detonation': {
    title: 'Detonation',
    def: 'Supersonic burning — a shock wave compresses and ignites the fuel as it ' +
      'passes, consuming the whole star in about a second. The widely-favored ' +
      '"delayed detonation" models have the initial deflagration transition into ' +
      'a detonation.',
  },
  'nse': {
    title: 'Nuclear statistical equilibrium (NSE)',
    def: 'Burning so hot (> 5 billion K) that nuclear reactions run in both ' +
      'directions and the composition settles into the most tightly-bound nuclei ' +
      'available — the iron-peak elements. With equal protons and neutrons in ' +
      'C/O fuel, the favored product is radioactive ⁵⁶Ni rather than stable ⁵⁶Fe.',
  },
  'ni56': {
    title: 'Nickel-56',
    def: 'The radioactive engine of the supernova: ~0.6 M☉ of it is forged in ' +
      'the explosion. It decays to ⁵⁶Co (half-life 6.1 days), which decays to ' +
      'stable ⁵⁶Fe (77.2 days). The γ-rays and positrons from this chain heat ' +
      'the ejecta and produce essentially all the light in the light curve.',
  },
  'gamma-rays': {
    title: 'γ-rays',
    def: 'Photons of extremely high energy released by radioactive decays in the ' +
      'ejecta. Early on they are trapped and thermalized — absorbed and re-emitted ' +
      'until they leak out as visible light. As the ejecta thin, more escape ' +
      'directly, steepening the decline.',
  },
  'light-curve': {
    title: 'Light curve',
    def: 'A graph of an object\'s brightness against time — the supernova ' +
      'astronomer\'s fingerprint. The shape of a Type Ia light curve (fast rise, ' +
      'peak near day 19, characteristic decline) identifies the explosion type ' +
      'and calibrates its true luminosity.',
  },
  'abs-mag': {
    title: 'Absolute magnitude',
    def: 'Brightness an object would have at a standard distance of 10 parsecs ' +
      '(32.6 light-years). The scale is logarithmic and runs backwards: each ' +
      'step of 5 magnitudes is 100× in brightness, and more negative = brighter. ' +
      'At M_B ≈ −19.3, a Type Ia briefly outshines ~5 billion Suns.',
  },
  'phillips': {
    title: 'Δm₁₅ & the Phillips relation',
    def: 'Δm₁₅ is how many magnitudes the light curve fades in the 15 days after ' +
      'peak. Mark Phillips showed (1993) that intrinsically brighter Type Ia ' +
      'supernovae decline more slowly — so measuring the decline rate reveals the ' +
      'true peak luminosity, turning these explosions into precision distance ' +
      'tools.',
  },
  'standard-candle': {
    title: 'Standardizable candle',
    def: 'An object whose intrinsic brightness can be determined, so its observed ' +
      'faintness gives its distance. Calibrated Type Ia supernovae are visible ' +
      'across billions of light-years; comparing their distances with redshifts ' +
      'revealed in 1998 that the universe\'s expansion is accelerating (the 2011 ' +
      'Nobel Prize in Physics).',
  },
};

/* ---------- popup ------------------------------------------- */
const glossPop = document.createElement('div');
glossPop.id = 'gloss-pop';
glossPop.hidden = true;
glossPop.setAttribute('role', 'dialog');
glossPop.setAttribute('aria-modal', 'false');
glossPop.setAttribute('aria-labelledby', 'gp-title');
glossPop.innerHTML =
  '<button class="gp-close" aria-label="close">×</button>' +
  '<div class="gp-title" id="gp-title"></div><div class="gp-body"></div>';
document.body.appendChild(glossPop);
const gpTitle = glossPop.querySelector('.gp-title');
const gpBody = glossPop.querySelector('.gp-body');
const gpClose = glossPop.querySelector('.gp-close');

function showGloss(el) {
  const entry = GLOSSARY[el.dataset.term];
  if (!entry) return;
  gpTitle.textContent = entry.title;
  gpBody.textContent = entry.def;
  glossPop.hidden = false;
  glossPop._opener = el;
  // position near the clicked term, clamped to the viewport
  const r = el.getBoundingClientRect();
  const pw = 330;
  glossPop.style.left = `${clamp(r.left, 10, window.innerWidth - pw - 10)}px`;
  glossPop.style.top = '0px';
  const ph = glossPop.offsetHeight;
  const rawTop = r.bottom + ph + 18 < window.innerHeight ? r.bottom + 8 : r.top - ph - 8;
  glossPop.style.top = `${clamp(rawTop, 10, window.innerHeight - ph - 10)}px`;
  gpClose.focus();
}

function hideGloss() {
  if (glossPop.hidden) return;
  glossPop.hidden = true;
  const opener = glossPop._opener;
  glossPop._opener = null;
  if (opener) opener.focus();
}

document.addEventListener('click', e => {
  const term = e.target.closest('.term');
  if (term) { showGloss(term); return; }
  if (!e.target.closest('#gloss-pop') || e.target.closest('.gp-close'))
    hideGloss();
});
document.addEventListener('keydown', e => {
  if (e.code === 'Escape') hideGloss();
});
