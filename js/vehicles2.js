// Phase 2 vehicles: track medical car, hovercraft, rotator tow truck and helitack helicopter.
// Each one has an explore mode (tap parts) and a 999 mission, built on the shared toolkit in app.js.
(function () {
  const A = window.App;
  const { OL, S, S3 } = Art;
  const rad = d => d * Math.PI / 180;

  // ---------- Shared drawing helpers ----------
  const sceneSvg = (label, inner) => `
    <svg class="scene-svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-label="${label}">
      ${Art.defs()}<rect width="1600" height="900" fill="url(#sky)"/>${inner}
    </svg>`;

  const wheel = (cx, cy, r) => `
    <g class="whl" data-cx="${cx}" data-cy="${cy}">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="#30364a" ${S}/>
      <circle cx="${cx}" cy="${cy}" r="${r * 0.52}" fill="#c7cfdb" ${S3}/>
      <g class="spokes"><path d="M${cx - r * 0.4} ${cy} H${cx + r * 0.4} M${cx} ${cy - r * 0.4} V${cy + r * 0.4}" stroke="${OL}" stroke-width="4"/></g>
      <circle cx="${cx}" cy="${cy}" r="5" fill="${OL}"/>
    </g>`;
  const turnWheels = (root, deg) => root.querySelectorAll('.whl').forEach(w =>
    w.querySelector('.spokes').setAttribute('transform', `rotate(${deg} ${w.dataset.cx} ${w.dataset.cy})`));

  // A crew member, drawn the same way as Sam the firefighter.
  const person = ({ id, suit = '#29324a', band = '#ffd21f', helmet = '#ffd21f', skin = '#a8704f', item = '', hat = 'helmet', hair = '#2a2f45' }) => `
    <g class="person">
      <ellipse cx="0" cy="2" rx="40" ry="8" fill="rgba(0,0,0,.18)"/>
      <rect x="-24" y="-16" width="20" height="16" rx="4" fill="${OL}"/><rect x="4" y="-16" width="20" height="16" rx="4" fill="${OL}"/>
      <rect x="-22" y="-72" width="44" height="58" rx="8" fill="${suit}" ${S3}/>
      <rect x="-22" y="-40" width="44" height="7" fill="${band}"/>
      <path d="M0 -70 V-16" stroke="${OL}" stroke-width="3"/>
      <rect x="-28" y="-128" width="56" height="62" rx="14" fill="${suit}" ${S3}/>
      <rect x="-28" y="-92" width="56" height="8" fill="${band}"/>
      <g id="${id}-arm"><path d="M-24 -118 Q-52 -120 -60 -150" fill="none" stroke="${suit}" stroke-width="16" stroke-linecap="round"/>
        <circle cx="-61" cy="-156" r="9" fill="${skin}" ${S3}/></g>
      <path d="M22 -116 Q40 -100 40 -84" fill="none" stroke="${suit}" stroke-width="16" stroke-linecap="round"/>
      <g id="${id}-item" opacity="0">${item}</g>
      <circle cx="40" cy="-80" r="9" fill="${skin}" ${S3}/>
      <circle cx="0" cy="-148" r="22" fill="${skin}" ${S3}/>
      <circle cx="-8" cy="-148" r="3" fill="${OL}"/><circle cx="8" cy="-148" r="3" fill="${OL}"/>
      <path d="M-8 -138 Q0 -132 8 -138" fill="none" stroke="${OL}" stroke-width="3"/>
      ${hat === 'helmet' ? `<path d="M-28 -152 Q-28 -184 0 -184 Q28 -184 28 -152 Z" fill="${helmet}" ${S3}/>
      <path d="M-30 -152 H30" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>`
      : hat === 'custodian' ? `<path d="M-22 -154 Q-24 -204 0 -208 Q24 -204 22 -154 Z" fill="${helmet}" ${S3}/>
      <path d="M-26 -154 H26" stroke="${OL}" stroke-width="5" stroke-linecap="round"/><circle cx="0" cy="-178" r="7" fill="#d8dee8" ${S3}/>`
      : `<path d="M-23 -150 Q-24 -176 0 -176 Q24 -176 23 -150 Q12 -162 0 -160 Q-12 -162 -23 -150 Z" fill="${hair}" ${S3}/>`}
      <rect x="-66" y="-210" width="112" height="220" fill="transparent"/>
    </g>`;
  const wave = (node) => A.tween(1400, (p, raw) => node.setAttribute('transform', `rotate(${Math.sin(raw * Math.PI * 6) * 12} -24 -118)`));
  const flashFor = (node, ms) => { node.classList.add('flashing'); A.later(() => node.classList.remove('flashing'), ms); };
  const bagArt = `<g transform="translate(40 -66)"><rect x="-22" y="-16" width="44" height="32" rx="6" fill="#8a5a3c" ${S3}/>
    <path d="M-10 -16 V-24 H10 V-16" fill="none" ${S3}/><path d="M0 -8 V8 M-8 0 H8" stroke="#fff" stroke-width="5"/></g>`;

  // ---------- Screen runner: explore first, then the phone rings and the mission starts ----------
  function run(def) {
    return (arg, alive) => {
      document.getElementById('scene').innerHTML = def.svg();
      A.ui({ home: true });
      const svg = document.querySelector('#scene svg');
      const el = id => svg.querySelector('#' + id);
      const st = { mode: 'arrive', step: null, explored: 0, busy: false };
      const phone = A.alivePhone();
      let ringer = null;
      const c = {
        svg, el, st, alive,
        // Tap handler: mission steps first, then explore facts.
        part(node, exploreFn, steps = {}) {
          node.addEventListener('click', e => {
            if (st.step) {
              if (steps[st.step]) { e.stopPropagation(); steps[st.step](e); }
              return;
            }
            e.stopPropagation();
            if (st.mode === 'explore' && !st.busy) {
              st.explored++;
              if (exploreFn) exploreFn(e);
              if (st.explored === 4) A.later(c.showPhone, 2500);
            } else if (st.mode === 'mission') Sfx.tap();
          });
        },
        async busy(fn) { st.busy = true; try { await fn(); } finally { st.busy = false; } },
        step(name, targets, lineId) { st.step = name; A.Hint.set(targets, lineId, true); return A.say(lineId); },
        endStep() { st.step = null; A.Hint.clear(); },
        async learn(word) { if (alive() && !A.progress.words.includes(word)) await A.wordCard(word); },
        showPhone() {
          if (!alive() || st.mode !== 'explore' || !phone.hidden) return;
          if (A.isModalOpen() || st.busy) return A.later(c.showPhone, 3000);
          A.ui({ home: true, phone: true });
          Sfx.ring(); ringer = A.every(() => Sfx.ring(), 3500);
          A.Hint.set([phone], 'common.phone', true);
          if (!A.isTalking()) A.say('common.phone');
        },
        ready(lineId, hints) {
          st.mode = 'explore';
          A.say(lineId);
          A.Hint.set(hints, lineId);
          A.later(c.showPhone, 16000);
        },
        finish() { st.mode = 'done'; A.reward(def.id, () => A.go(def.id)); }
      };
      phone.onclick = async () => {
        if (A.current() !== def.id || st.mode !== 'explore') return;
        clearInterval(ringer); A.Hint.clear(); A.ui({ home: true });
        st.mode = 'mission';
        await def.mission(c);
      };
      el('sun') && c.part(el('sun'), () => Sfx.boing());
      def.setup(c);
    };
  }

  // =====================================================================
  // Track medical car — race circuit
  // =====================================================================
  const medCar = () => `
    <g class="medcar">
      <ellipse cx="215" cy="2" rx="215" ry="10" fill="rgba(0,0,0,.18)"/>
      <path d="M12 -40 V-118 Q14 -160 50 -165 H322 L390 -112 Q426 -106 428 -80 V-40 Z" fill="#f4f6fa"/>
      <path d="M60 -152 H196 V-118 H60 Z" fill="#bfe6ff" ${S3}/>
      <path d="M208 -152 H316 L358 -118 H208 Z" fill="#bfe6ff" ${S3}/>
      <rect x="12" y="-102" width="416" height="24" fill="#e53935"/>
      ${Array.from({ length: 26 }, (_, i) => `<rect x="${12 + i * 16}" y="-78" width="16" height="12" fill="${i % 2 ? '#1e5bd6' : '#ffd21f'}"/>`).join('')}
      <text x="230" y="-84" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="18" fill="#fff" letter-spacing="2">MEDICAL</text>
      <path d="M12 -40 V-118 Q14 -160 50 -165 H322 L390 -112 Q426 -106 428 -80 V-40 Z" fill="none" ${S}/>
      <path d="M57 -40 A40 40 0 0 1 137 -40 Z M305 -40 A40 40 0 0 1 385 -40 Z" fill="#30364a"/>
      ${wheel(97, -34, 34)}${wheel(345, -34, 34)}
      <g id="mc-boot" class="tappable">
        <g id="mc-bag" opacity="0" transform="translate(-26 -70)"><rect x="-24" y="-18" width="48" height="34" rx="6" fill="#8a5a3c" ${S3}/><path d="M0 -10 V8 M-9 -1 H9" stroke="#fff" stroke-width="5"/></g>
        <g id="mc-tailgate"><rect x="4" y="-160" width="22" height="114" rx="6" fill="#e9edf3" ${S3}/></g>
        <rect x="-20" y="-170" width="90" height="130" fill="transparent"/>
      </g>
      <g id="mc-bonnet" class="tappable">
        <circle cx="416" cy="-92" r="8" fill="#fff3a6" ${S3}/>
        <path d="M424 -66 H432 M424 -58 H432" stroke="${OL}" stroke-width="3"/>
        <rect x="340" y="-118" width="100" height="78" fill="transparent"/>
      </g>
      <g id="mc-lights" class="tappable">
        <rect x="150" y="-182" width="120" height="16" rx="7" fill="#9fb1c7" ${S3}/>
        <ellipse class="beacon" cx="172" cy="-186" rx="15" ry="11" fill="#3b82f6" ${S3}/>
        <ellipse class="beacon amber b2" cx="248" cy="-186" rx="15" ry="11" fill="#f59e0b" ${S3}/>
        <rect x="140" y="-208" width="140" height="46" fill="transparent"/>
      </g>
    </g>`;

  const raceCar = () => `
    <g class="racecar-art">
      <ellipse cx="0" cy="2" rx="170" ry="10" fill="rgba(0,0,0,.18)"/>
      <rect x="-168" y="-98" width="36" height="40" rx="4" fill="#1e5bd6" ${S3}/>
      <path d="M-150 -40 L-124 -64 H-20 L8 -84 H40 L60 -60 L168 -48 Q186 -42 170 -30 H-150 Z" fill="#1e5bd6" ${S}/>
      <rect x="150" y="-38" width="40" height="12" rx="3" fill="#ffd21f" ${S3}/>
      <circle cx="-60" cy="-50" r="14" fill="#fff" ${S3}/>
      <text x="-60" y="-44" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="17" fill="${OL}">7</text>
      <circle cx="22" cy="-86" r="17" fill="#ffd21f" ${S3}/><path d="M24 -92 H38 V-82 H24 Z" fill="${OL}"/>
      ${wheel(-108, -30, 30)}${wheel(112, -26, 26)}
      <g id="dizzy" opacity="0"><g transform="translate(22 -140)">
        ${[0, 120, 240].map(a => `<path transform="rotate(${a}) translate(34 0)" d="M0 -10 L3 -3 L10 -3 L4 2 L6 10 L0 5 L-6 10 L-4 2 L-10 -3 L-3 -3 Z" fill="#ffd21f" ${S3}/>`).join('')}
      </g></g>
      <g id="ok" opacity="0" transform="translate(22 -150)"><circle r="30" fill="#2e9e4f" ${S3}/><path d="M-13 0 L-3 10 L14 -10" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g>
      <rect x="-180" y="-110" width="380" height="120" fill="transparent"/>
    </g>`;

  const crowdColours = ['#e53935', '#1e5bd6', '#ffd21f', '#2e9e4f', '#8e5bd6', '#f07a1a'];
  A.screens.medical = run({
    id: 'medical',
    svg: () => sceneSvg('Race circuit', `
      ${Art.sun(1290, 250)}
      <g class="clouds">${Art.cloud(150, 90, 1)}${Art.cloud(1050, 60, .8)}</g>
      <path d="M0 600 Q300 540 700 580 T1600 560 V900 H0 Z" fill="#9fd88d"/>
      <g id="crowd" class="tappable">
        <path d="M280 500 H1320 L1296 462 H304 Z" fill="#e53935" ${S}/>
        <rect x="300" y="500" width="1000" height="190" fill="#d8dee8" ${S}/>
        ${[0, 1, 2].map(r => Array.from({ length: 28 }, (_, i) =>
          `<circle class="fan" cx="${330 + i * 35 + (r % 2) * 17}" cy="${545 + r * 44}" r="13" fill="${crowdColours[(i * 7 + r * 3) % 6]}"/>`).join('') +
          `<path d="M300 ${566 + r * 44} H1300" stroke="#9fb1c7" stroke-width="6"/>`).join('')}
      </g>
      <rect x="0" y="690" width="1600" height="210" fill="#4a4f5a"/>
      ${Array.from({ length: 27 }, (_, i) => `<rect x="${i * 60}" y="684" width="60" height="16" fill="${i % 2 ? '#fff' : '#e53935'}"/>`).join('')}
      <rect id="track" x="0" y="700" width="1600" height="200" fill="transparent"/>
      <path d="M0 880 H1600" stroke="#fff" stroke-width="6" stroke-dasharray="70 50" pointer-events="none"/>
      <g id="racecar" class="tappable" transform="translate(1110 850)">${raceCar()}</g>
      <g id="mcar" class="tappable" transform="translate(260 846)">${medCar()}</g>
      <g id="doc" class="tappable" transform="translate(215 852)">${person({ id: 'doc', suit: '#c62828', band: '#fff', helmet: '#f4f6fa', skin: '#c68a62', item: bagArt })}</g>
    `),
    setup(c) {
      const { el, alive } = c, car = el('mcar');
      const setCar = x => { car.setAttribute('transform', `translate(${x} 846)`); turnWheels(car, (x - 260) / 34 * 57.3); };
      c.carX = 260; c.setCar = setCar;
      setCar(-500); el('doc').setAttribute('opacity', 0);
      car.classList.add('flashing'); Sfx.engine(2.2);
      A.tween(2200, p => setCar(-500 + p * 760), A.easeOut).then(() => {
        if (!alive()) return;
        car.classList.remove('flashing');
        A.tween(400, p => el('doc').setAttribute('opacity', p));
        c.ready('medical.arrive', [el('mc-lights'), el('doc'), el('mc-boot')]);
      });
      c.part(el('mc-lights'), () => { Sfx.chime(); flashFor(car, 3000); A.say('medical.lights'); });
      c.part(el('mc-bonnet'), () => c.busy(async () => {
        Sfx.engine(); A.say('medical.bonnet');
        await A.tween(900, (p, raw) => setCar(260 + Math.sin(raw * Math.PI * 8) * 4));
      }));
      c.part(el('mc-boot'), () => c.busy(async () => {
        Sfx.pop(); A.say('medical.boot');
        await openBoot(c, true);
        await A.wait(2500);
        await openBoot(c, false);
      }), { bag: () => missionBag(c) });
      c.part(el('doc'), () => { A.say('medical.doctor'); wave(el('doc-arm')); });
      c.part(el('racecar'), () => { Sfx.engine(1.2); A.say('medical.racecar'); }, { check: () => missionCheck(c) });
      c.part(el('crowd'), () => {
        Sfx.cheer(); A.say('medical.crowd');
        const fans = [...el('crowd').querySelectorAll('.fan')];
        A.tween(1200, (p, raw) => fans.forEach((f, i) => f.setAttribute('transform', `translate(0 ${-Math.abs(Math.sin(raw * Math.PI * 4 + i)) * 10})`)));
      });
      c.part(el('track'), async () => { Sfx.screech(); await A.say('medical.track'); c.learn('circuit'); });
      c.part(car, null, { drive: () => missionDrive(c) });
    },
    async mission(c) {
      const { el, alive } = c, rc = el('racecar');
      c.st.busy = true;
      Sfx.screech();
      await A.tween(1300, p => rc.setAttribute('transform', `translate(${1110 - p * 40} 850) rotate(${-p * 372})`), A.easeOut);
      el('dizzy').setAttribute('opacity', 1);
      await A.say('medical.m.call');
      if (!alive()) return;
      c.st.busy = false;
      c.step('drive', [el('mcar')], 'medical.m.drive');
    }
  });

  function openBoot(c, open) {
    const tg = c.el('mc-tailgate'), bag = c.el('mc-bag');
    return A.tween(450, p => {
      const k = open ? p : 1 - p;
      tg.setAttribute('transform', `rotate(${-80 * k} 15 -160)`);
      bag.setAttribute('opacity', k);
    }, A.easeOut);
  }
  async function missionDrive(c) {
    const { el, alive } = c, car = el('mcar'), doc = el('doc');
    c.endStep();
    doc.setAttribute('opacity', 0);
    car.classList.add('flashing'); Sfx.siren(2.2); Sfx.engine(2);
    await A.tween(2000, p => c.setCar(260 + p * 210));
    if (!alive()) return;
    doc.setAttribute('transform', 'translate(920 852)');
    await A.tween(300, p => doc.setAttribute('opacity', p));
    await c.learn('circuit');
    if (!alive()) return;
    c.step('bag', [el('mc-boot')], 'medical.m.bag');
  }
  async function missionBag(c) {
    const { el, alive } = c;
    c.endStep();
    Sfx.pop();
    await openBoot(c, true);
    await A.wait(400);
    el('mc-bag').setAttribute('opacity', 0);
    el('doc-item').setAttribute('opacity', 1);
    Sfx.sparkle();
    if (!alive()) return;
    c.step('check', [el('racecar')], 'medical.m.check');
  }
  async function missionCheck(c) {
    const { el, alive } = c;
    c.endStep();
    const doc = el('doc');
    await A.tween(500, p => doc.setAttribute('transform', `translate(${920 + p * 40} 852)`));
    el('dizzy').setAttribute('opacity', 0);
    el('ok').setAttribute('opacity', 1);
    Sfx.chime(); Sfx.cheer(); A.confetti();
    wave(el('doc-arm'));
    await A.say('medical.m.ok');
    if (!alive()) return;
    c.finish();
  }

  // =====================================================================
  // Hovercraft — muddy beach
  // =====================================================================
  const hoverArt = () => `
    <g class="hovercraft">
      <ellipse cx="230" cy="4" rx="230" ry="10" fill="rgba(0,0,0,.18)"/>
      <g id="hv-skirt" class="tappable"><path d="M18 -8 Q0 -30 20 -52 H440 Q460 -30 442 -8 Q434 0 414 0 H46 Q26 0 18 -8 Z" fill="#2f3447" ${S3}/></g>
      <g id="hv-body">
        <path d="M60 -96 L80 -140 M104 -96 L80 -140" stroke="${OL}" stroke-width="8"/>
        <rect x="10" y="-100" width="440" height="52" rx="14" fill="#f07a1a" ${S}/>
        <rect x="12" y="-82" width="436" height="10" fill="#ffd21f"/>
        <text x="300" y="-54" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="15" fill="#fff" letter-spacing="2">RESCUE</text>
        <path d="M150 -100 V-165 Q152 -180 170 -180 H320 Q350 -178 370 -150 L392 -100 Z" fill="#fff" ${S}/>
        <rect x="172" y="-162" width="56" height="34" rx="5" fill="#bfe6ff" ${S3}/><rect x="240" y="-162" width="56" height="34" rx="5" fill="#bfe6ff" ${S3}/>
        <path d="M308 -165 H325 Q345 -160 360 -132 L366 -128 H308 Z" fill="#bfe6ff" ${S3}/>
        <g id="hv-pilot" class="tappable">
          <circle cx="334" cy="-142" r="12" fill="#e0ac85" ${S3}/><path d="M321 -144 Q334 -164 347 -144 Z" fill="#f07a1a" ${S3}/>
          <rect x="300" y="-180" width="76" height="60" fill="transparent"/>
        </g>
        <g id="hv-horn" class="tappable">
          <path d="M240 -180 V-194 H252 L272 -204 V-180 L252 -186 Z" fill="#ffd21f" ${S3}/>
          <rect x="226" y="-216" width="60" height="40" fill="transparent"/>
        </g>
        <g id="hv-ring" class="tappable">
          <circle cx="422" cy="-126" r="18" fill="none" stroke="${OL}" stroke-width="16"/>
          <circle cx="422" cy="-126" r="18" fill="none" stroke="#fff" stroke-width="10"/>
          <circle cx="422" cy="-126" r="18" fill="none" stroke="#e53935" stroke-width="10" stroke-dasharray="14.1 14.1"/>
          <circle cx="422" cy="-126" r="32" fill="transparent"/>
        </g>
        <g id="hv-fan-g" class="tappable">
          <circle cx="80" cy="-170" r="64" fill="#3a4157" ${S}/>
          <circle cx="80" cy="-170" r="52" fill="#596178"/>
          <g id="hv-fan">${[0, 60, 120].map(a => `<ellipse cx="80" cy="-170" rx="46" ry="11" fill="#c7cfdb" ${S3} transform="rotate(${a} 80 -170)"/>`).join('')}
            <circle cx="80" cy="-170" r="10" fill="${OL}"/></g>
          <circle cx="80" cy="-170" r="72" fill="transparent"/>
        </g>
      </g>
    </g>`;

  const jo = () => `
    <clipPath id="jo-clip"><rect id="jo-cliprect" x="-120" y="-300" width="240" height="304"/></clipPath>
    <g clip-path="url(#jo-clip)"><g id="jo-body">${person({ id: 'jo', suit: '#2e9e4f', band: '#ffd21f', helmet: '#e53935', skin: '#f1c27d' })}</g></g>
    <ellipse id="jo-mud" cx="0" cy="-2" rx="58" ry="14" fill="#6e4f33" ${S3} opacity="0"/>`;

  A.screens.hover = run({
    id: 'hover',
    svg: () => sceneSvg('Muddy beach', `
      ${Art.sun(1290, 250)}
      <g class="clouds">${Art.cloud(140, 100, 1)}${Art.cloud(1000, 70, .8)}</g>
      <rect x="0" y="500" width="1600" height="150" fill="url(#water)"/>
      <path class="waves" d="M0 540 q25 -12 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0" fill="none" stroke="#bfe6ff" stroke-width="5" opacity=".8"/>
      <g transform="translate(1380 520)"><rect x="-22" y="-120" width="44" height="120" fill="#fff" ${S3}/><rect x="-22" y="-90" width="44" height="22" fill="#e53935"/><rect x="-22" y="-40" width="44" height="22" fill="#e53935"/><path d="M-30 -120 H30 L0 -150 Z" fill="#e53935" ${S3}/></g>
      <g id="mud">
        <path d="M0 620 Q400 596 800 624 T1600 612 V900 H0 Z" fill="#8a6a4a" ${S3}/>
        <ellipse cx="520" cy="700" rx="90" ry="14" fill="#9fc6e0" opacity=".7"/>
        <ellipse cx="1000" cy="860" rx="120" ry="16" fill="#9fc6e0" opacity=".7"/>
        <ellipse cx="300" cy="880" rx="70" ry="10" fill="#9fc6e0" opacity=".7"/>
        <path d="M720 760 q10 -14 20 0 Z M1300 840 q10 -14 20 0 Z" fill="#f6e3b4" ${S3}/>
      </g>
      <g id="hv-go" class="tappable" opacity="0" transform="translate(760 700)">
        <path d="M0 -24 H70 V-50 L120 0 L70 50 V24 H0 Z" fill="#ffd21f" ${S}/>
      </g>
      <g id="jo" class="tappable" transform="translate(1180 780)">${jo()}</g>
      <g id="hc" class="tappable" transform="translate(230 800)">${hoverArt()}</g>
      <path id="hv-rope" d="" fill="none" stroke="#f6e3b4" stroke-width="5"/>
      <g id="ring-fly" opacity="0"><circle r="18" fill="none" stroke="#fff" stroke-width="10"/><circle r="18" fill="none" stroke="#e53935" stroke-width="10" stroke-dasharray="14.1 14.1"/></g>
      <g id="splash"></g>
    `),
    setup(c) {
      const { el, alive } = c, hc = el('hc');
      c.lift = 0;
      c.setHc = (x, lift = c.lift) => {
        hc.setAttribute('transform', `translate(${x} 800)`);
        el('hv-skirt').setAttribute('transform', `scale(1 ${1 + 0.45 * lift})`);
        el('hv-body').setAttribute('transform', `translate(0 ${-23 * lift})`);
      };
      c.inflate = up => A.tween(700, p => { c.lift = up ? p : 1 - p; c.setHc(c.hx); });
      c.hx = 230;
      c.setHc(-500, 1); c.lift = 1;
      el('hv-fan').classList.add('spin-fast'); Sfx.whoosh();
      A.tween(2200, p => { c.hx = -500 + p * 730; c.setHc(c.hx); }, A.easeOut).then(async () => {
        if (!alive()) return;
        await c.inflate(false);
        el('hv-fan').classList.remove('spin-fast');
        c.ready('hover.arrive', [el('hv-fan-g'), el('hv-pilot'), el('hv-ring')]);
      });
      c.part(el('hv-fan-g'), () => {
        Sfx.whoosh(); A.later(() => Sfx.whoosh(), 600); A.say('hover.fan');
        el('hv-fan').classList.add('spin-fast'); A.later(() => el('hv-fan').classList.remove('spin-fast'), 2500);
      }, { fan: () => hoverStart(c) });
      c.part(el('hv-skirt'), () => c.busy(async () => {
        Sfx.hiss(); A.say('hover.skirt');
        await c.inflate(true); await A.wait(1600); await c.inflate(false);
        await c.learn('hovercraft');
      }));
      c.part(el('hv-pilot'), () => A.say('hover.pilot'));
      c.part(el('hv-horn'), () => { Sfx.horn(); A.say('hover.horn'); });
      c.part(el('hv-ring'), () => {
        Sfx.boing(); A.say('hover.ring');
        const r = el('hv-ring');
        A.tween(800, (p, raw) => r.setAttribute('transform', `rotate(${Math.sin(raw * Math.PI * 4) * 12} 422 -150)`));
      }, { ring: () => hoverRing(c) });
      c.part(el('jo'), () => { A.say('hover.jo'); wave(el('jo-arm')); });
      c.part(el('mud'), () => { Sfx.splash(); A.say('hover.mud'); }, { go: () => hoverGo(c) });
      c.part(el('hv-go'), null, { go: () => hoverGo(c) });
    },
    async mission(c) {
      const { el, alive } = c, body = el('jo-body'), mud = el('jo-mud');
      c.st.busy = true;
      Sfx.splash();
      mud.setAttribute('opacity', 1);
      await A.tween(1200, p => body.setAttribute('transform', `translate(0 ${p * 70})`));
      wave(el('jo-arm'));
      await A.say('hover.m.call');
      if (!alive()) return;
      c.st.busy = false;
      c.step('fan', [el('hv-fan-g')], 'hover.m.fan');
    }
  });

  async function hoverStart(c) {
    const { el, alive } = c;
    c.endStep();
    el('hv-fan').classList.add('spin-fast');
    Sfx.whoosh(); Sfx.engine(1.4);
    await c.inflate(true);
    await c.learn('hovercraft');
    if (!alive()) return;
    el('hv-go').setAttribute('opacity', 1);
    c.step('go', [el('hv-go')], 'hover.m.go');
  }
  async function hoverGo(c) {
    const { el, alive } = c;
    c.endStep();
    el('hv-go').setAttribute('opacity', 0);
    Sfx.whoosh(); A.later(() => Sfx.whoosh(), 900); A.later(() => Sfx.splash(), 1500);
    await A.tween(2400, p => { c.hx = 230 + p * 420; c.setHc(c.hx); });
    if (!alive()) return;
    c.step('ring', [el('hv-ring')], 'hover.m.ring');
  }
  async function hoverRing(c) {
    const { el, alive } = c;
    c.endStep();
    const fly = el('ring-fly'), rope = el('hv-rope'), body = el('jo-body');
    const sx = c.hx + 422, sy = 800 - 23 - 126, ex = 1240, ey = 690;
    el('hv-ring').setAttribute('opacity', 0);
    fly.setAttribute('opacity', 1);
    Sfx.whoosh();
    await A.tween(800, (p, raw) => {
      const x = sx + (ex - sx) * p, y = sy + (ey - sy) * p - Math.sin(raw * Math.PI) * 140;
      fly.setAttribute('transform', `translate(${x} ${y})`);
      rope.setAttribute('d', `M${sx} ${sy} Q${(sx + x) / 2} ${Math.max(sy, y) + 30} ${x} ${y}`);
    }, p => p);
    Sfx.pop();
    await A.tween(1300, p => body.setAttribute('transform', `translate(0 ${70 - p * 70})`));
    if (!alive()) return;
    el('jo-mud').setAttribute('opacity', 0);
    Sfx.chime(); A.confetti(); wave(el('jo-arm'));
    await A.say('hover.m.saved');
    if (!alive()) return;
    c.finish();
  }

  // =====================================================================
  // Rotator tow truck — motorway
  // =====================================================================
  const TRUCK = { x: 190, y: 790, s: 0.95, px: 80, py: -240, reach: 520 };
  const towArt = () => `
    <g class="towtruck">
      <ellipse cx="310" cy="2" rx="310" ry="12" fill="rgba(0,0,0,.18)"/>
      <g id="tw-legs" class="tappable">
        <g id="tw-legs-inner">
          ${[170, 420].map(x => `<rect x="${x - 9}" y="-96" width="18" height="62" fill="#596178" ${S3}/><rect x="${x - 24}" y="-40" width="48" height="10" rx="3" fill="#3a4157" ${S3}/>`).join('')}
        </g>
        <rect x="130" y="-100" width="330" height="100" fill="transparent"/>
      </g>
      <rect x="20" y="-102" width="592" height="28" rx="4" fill="#3a4157" ${S3}/>
      <rect x="20" y="-162" width="448" height="66" rx="6" fill="#f2b705" ${S}/>
      ${[0, 1, 2, 3].map(i => `<rect x="${22 + i * 11}" y="-160" width="11" height="62" fill="${i % 2 ? '#f2b705' : OL}"/>`).join('')}
      <g id="tw-winch" class="tappable">
        <circle cx="260" cy="-130" r="26" fill="#c7cfdb" ${S3}/>
        <g class="spokes"><path d="M240 -130 H280 M260 -150 V-110" stroke="${OL}" stroke-width="5"/></g>
        <circle cx="260" cy="-130" r="16" fill="none" stroke="${OL}" stroke-width="5"/>
        <rect x="224" y="-164" width="72" height="66" fill="transparent"/>
      </g>
      <path d="M470 -96 V-232 H556 Q588 -230 598 -192 L612 -124 V-96 Z" fill="#f2b705" ${S}/>
      <path d="M488 -216 H552 Q576 -213 584 -186 L590 -152 H488 Z" fill="#bfe6ff" ${S3}/>
      <g id="tw-cab" class="tappable">
        <circle cx="530" cy="-178" r="14" fill="#7a4a2e" ${S3}/><path d="M514 -184 Q530 -200 546 -184 Z" fill="#1e5bd6" ${S3}/>
        <rect x="596" y="-134" width="20" height="32" rx="4" fill="#d8dee8" ${S3}/>
        <rect x="470" y="-220" width="150" height="124" fill="transparent"/>
      </g>
      <g id="tw-lights" class="tappable">
        <rect x="490" y="-250" width="92" height="16" rx="7" fill="#9fb1c7" ${S3}/>
        <ellipse class="beacon amber" cx="506" cy="-254" rx="14" ry="10" fill="#f59e0b" ${S3}/>
        <ellipse class="beacon amber b2" cx="566" cy="-254" rx="14" ry="10" fill="#f59e0b" ${S3}/>
        <rect x="480" y="-276" width="112" height="44" fill="transparent"/>
      </g>
      <rect x="48" y="-252" width="70" height="92" rx="6" fill="#3a4157" ${S3}/>
      <g id="tw-boom" class="tappable">
        <g id="tw-ext"><rect x="100" y="-251" width="500" height="18" rx="4" fill="#ffd21f" ${S3}/></g>
        <rect x="68" y="-256" width="532" height="30" rx="8" fill="#e53935" ${S3}/>
        <path d="M110 -241 H580" stroke="#fff" stroke-width="5" stroke-dasharray="30 24"/>
        <circle cx="${TRUCK.px}" cy="${TRUCK.py}" r="10" fill="${OL}"/>
        <rect x="60" y="-276" width="560" height="64" fill="transparent"/>
      </g>
      <path d="M68 -74 A44 44 0 0 1 156 -74 Z M156 -74 A44 44 0 0 1 244 -74 Z M496 -74 A44 44 0 0 1 584 -74 Z" fill="#30364a"/>
      ${wheel(112, -38, 38)}${wheel(200, -38, 38)}${wheel(540, -38, 38)}
    </g>`;

  const lorryArt = () => `
    <g class="lorry-art">
      <ellipse cx="200" cy="2" rx="200" ry="10" fill="rgba(0,0,0,.18)"/>
      <rect x="0" y="-36" width="400" height="14" fill="#3a4157"/>
      <rect x="0" y="-162" width="290" height="128" rx="6" fill="#1e5bd6" ${S}/>
      <circle cx="145" cy="-98" r="32" fill="#e53935" ${S3}/><path d="M145 -128 Q150 -142 164 -142 Q160 -130 145 -128 Z" fill="#2e9e4f" ${S3}/>
      <path d="M296 -34 V-150 H360 Q392 -148 400 -110 V-34 Z" fill="#2e9e4f" ${S}/>
      <path d="M310 -138 H356 Q380 -134 386 -110 H310 Z" fill="#bfe6ff" ${S3}/>
      ${wheel(60, -28, 28)}${wheel(124, -28, 28)}${wheel(352, -28, 28)}
    </g>`;

  // Lorry position: in the ditch (k = 0) to back on the road (k = 1).
  const lorryPose = k => ({ x: 860 - 10 * k, y: 866 - 76 * k, r: 16 * (1 - k) });
  const attachPoint = ({ x, y, r }) => {
    const a = rad(r);
    return { x: x + 200 * Math.cos(a) + 162 * Math.sin(a), y: y + 200 * Math.sin(a) - 162 * Math.cos(a) };
  };
  const tipWorld = (angle, ext) => {
    const a = rad(angle), L = TRUCK.reach + ext;
    return {
      x: TRUCK.x + TRUCK.s * (TRUCK.px + L * Math.cos(a)),
      y: TRUCK.y + TRUCK.s * (TRUCK.py + L * Math.sin(a))
    };
  };

  A.screens.tow = run({
    id: 'tow',
    svg: () => sceneSvg('Motorway', `
      ${Art.sun(1290, 250)}
      <g class="clouds">${Art.cloud(150, 100, 1)}${Art.cloud(1050, 60, .8)}</g>
      <path d="M0 610 Q400 560 800 600 T1600 590 V900 H0 Z" fill="#9fd88d"/>
      <path d="M0 640 Q300 620 600 640 T1200 630 T1600 640" fill="none" stroke="#6fae5a" stroke-width="14"/>
      <g>${Array.from({ length: 17 }, (_, i) => `<rect x="${i * 100 + 20}" y="660" width="10" height="40" fill="#9fb1c7" ${S3}/>`).join('')}
        <rect x="0" y="664" width="1600" height="14" fill="#d8dee8" ${S3}/></g>
      <rect x="0" y="700" width="1600" height="100" fill="#5a606b"/>
      <path d="M0 750 H1600" stroke="#fff" stroke-width="7" stroke-dasharray="60 40"/>
      <path d="M0 800 H1600 V900 H0 Z" fill="#7cbf68"/>
      <path d="M0 800 H1600" stroke="${OL}" stroke-width="4"/>
      <ellipse cx="1060" cy="905" rx="300" ry="40" fill="#7a5a3c"/>
      <g transform="translate(790 800)"><path d="M-16 0 L-8 -40 H8 L16 0 Z" fill="#ff8a1f" ${S3}/><path d="M-12 -18 H12" stroke="#fff" stroke-width="6"/></g>
      <g id="lorry" class="tappable">${lorryArt()}</g>
      <g id="truck" transform="translate(${TRUCK.x} ${TRUCK.y}) scale(${TRUCK.s})">${towArt()}</g>
      <path id="tw-cable" d="" fill="none" stroke="${OL}" stroke-width="5"/>
      <g id="tw-hook" opacity="0"><path d="M0 -6 V10 Q0 26 -14 22 Q-22 18 -18 10" fill="none" stroke="${OL}" stroke-width="7" stroke-linecap="round"/></g>
    `),
    setup(c) {
      const { el, alive } = c, truck = el('truck');
      c.boom = { a: 0, e: 0, hook: 0 };
      c.drawBoom = (target = null) => {
        el('tw-boom').setAttribute('transform', `rotate(${c.boom.a} ${TRUCK.px} ${TRUCK.py})`);
        el('tw-ext').setAttribute('transform', `translate(${c.boom.e} 0)`);
        const tip = tipWorld(c.boom.a, c.boom.e), cable = el('tw-cable'), hook = el('tw-hook');
        const end = target || { x: tip.x, y: tip.y + c.boom.hook };
        if (target || c.boom.hook > 4) {
          cable.setAttribute('d', `M${tip.x} ${tip.y} L${end.x} ${end.y}`);
          hook.setAttribute('transform', `translate(${end.x} ${end.y})`);
          hook.setAttribute('opacity', 1);
        } else { cable.setAttribute('d', ''); hook.setAttribute('opacity', 0); }
      };
      c.setLorry = k => {
        const p = lorryPose(k);
        el('lorry').setAttribute('transform', `translate(${p.x} ${p.y}) rotate(${p.r})`);
        return p;
      };
      c.setLorry(0);
      c.setTruck = x => { truck.setAttribute('transform', `translate(${x} ${TRUCK.y}) scale(${TRUCK.s})`); turnWheels(truck, (x - TRUCK.x) / 36 * 57.3); };
      c.setTruck(-700); c.drawBoom();
      truck.classList.add('flashing'); Sfx.engine(2.4); Sfx.horn();
      A.tween(2400, p => c.setTruck(-700 + p * (700 + TRUCK.x)), A.easeOut).then(() => {
        if (!alive()) return;
        truck.classList.remove('flashing');
        c.ready('tow.arrive', [el('tw-boom'), el('tw-legs'), el('tw-winch')]);
      });
      c.legs = 0;
      const moveLegs = to => { Sfx.clank(5); Sfx.hiss(); const from = c.legs; return A.tween(800, p => { c.legs = from + (to - from) * p; el('tw-legs-inner').setAttribute('transform', `translate(0 ${c.legs * 30})`); }); };
      c.moveLegs = moveLegs;
      let boomUp = false;
      c.part(el('tw-lights'), () => { Sfx.chime(); flashFor(truck, 3000); A.say('tow.lights'); });
      c.part(el('tw-legs'), () => c.busy(async () => {
        const down = c.legs < 0.5;
        A.say(down ? 'tow.legs' : 'tow.legsUp');
        await moveLegs(down ? 1 : 0);
      }), { legs: () => towLegs(c) });
      c.part(el('tw-boom'), () => c.busy(async () => {
        boomUp = !boomUp;
        Sfx.clank(8); A.say(boomUp ? 'tow.boom' : 'tow.boomDown');
        const from = { ...c.boom }, to = boomUp ? { a: -28, e: 120, hook: 110 } : { a: 0, e: 0, hook: 0 };
        await A.tween(1300, p => { ['a', 'e', 'hook'].forEach(k => { c.boom[k] = from[k] + (to[k] - from[k]) * p; }); c.drawBoom(); });
        if (boomUp) await c.learn('crane');
      }), { boom: () => towBoom(c) });
      c.part(el('tw-winch'), () => {
        Sfx.clank(10); A.say('tow.winch');
        const sp = el('tw-winch').querySelector('.spokes');
        A.tween(1200, p => sp.setAttribute('transform', `rotate(${p * 720} 260 -130)`));
      }, { winch: () => towWinch(c) });
      c.part(el('tw-cab'), () => { Sfx.horn(); A.say('tow.cab'); });
      c.part(el('lorry'), () => { Sfx.horn(); A.say('tow.lorry'); });
    },
    async mission(c) {
      const { el, alive } = c, truck = el('truck');
      c.st.busy = true;
      flashFor(truck, 6000);
      if (c.boom.a !== 0) {
        const from = { ...c.boom };
        await A.tween(700, p => { ['a', 'e', 'hook'].forEach(k => { c.boom[k] = from[k] * (1 - p); }); c.drawBoom(); });
      }
      if (c.legs > 0) await c.moveLegs(0);
      await A.say('tow.m.call');
      if (!alive()) return;
      c.st.busy = false;
      c.step('legs', [el('tw-legs')], 'tow.m.legs');
    }
  });

  async function towLegs(c) {
    const { el, alive } = c;
    c.endStep();
    await c.moveLegs(1);
    if (!alive()) return;
    c.step('boom', [el('tw-boom')], 'tow.m.boom');
  }
  async function towBoom(c) {
    const { el, alive } = c;
    c.endStep();
    Sfx.clank(12);
    const target = { a: -8, e: 292 };
    await A.tween(1600, p => { c.boom.a = target.a * p; c.boom.e = target.e * p; c.boom.hook = 60 * p; c.drawBoom(); });
    const tip = tipWorld(c.boom.a, c.boom.e), att = attachPoint(lorryPose(0));
    await A.tween(900, p => c.drawBoom({ x: tip.x + (att.x - tip.x) * p, y: tip.y + 60 + (att.y - tip.y - 60) * p }));
    Sfx.clank(2);
    await A.say('tow.m.hooked');
    await c.learn('winch');
    if (!alive()) return;
    c.step('winch', [el('tw-winch')], 'tow.m.winch');
  }
  async function towWinch(c) {
    const { el, alive } = c;
    c.endStep();
    const sp = el('tw-winch').querySelector('.spokes');
    Sfx.clank(16); A.later(() => Sfx.clank(10), 1800);
    await A.tween(2800, p => {
      const pose = c.setLorry(p);
      c.drawBoom(attachPoint(pose));
      sp.setAttribute('transform', `rotate(${p * 1440} 260 -130)`);
    });
    if (!alive()) return;
    Sfx.horn(); Sfx.chime(); A.confetti();
    await A.say('tow.m.saved');
    if (!alive()) return;
    c.finish();
  }

  // =====================================================================
  // Helitack helicopter — forest fire
  // =====================================================================
  const heliArt = (body = '#e53935', doorCol = '#c62828') => `
    <g class="helicopter">
      <ellipse id="hl-shadow" cx="20" cy="4" rx="150" ry="10" fill="rgba(0,0,0,.18)"/>
      <g id="hl-bucket-g" opacity="0">
        <path d="M20 -40 V110" stroke="${OL}" stroke-width="4"/>
        <g transform="translate(20 110)">
          <path d="M-28 0 H28 L19 44 H-19 Z" fill="#f07a1a" ${S3}/>
          <ellipse id="hl-bwater" cx="0" cy="4" rx="24" ry="6" fill="#5cc3ff" opacity="0"/>
        </g>
      </g>
      <path d="M-182 -96 L-30 -114 V-78 L-182 -86 Z" fill="${body}" ${S3}/>
      <path d="M-200 -140 L-174 -140 L-160 -88 L-192 -88 Z" fill="${body}" ${S3}/>
      <g id="hl-tail"><path class="tail-blades" d="M-182 -136 V-92" stroke="${OL}" stroke-width="6" stroke-linecap="round"/></g>
      <path d="M-70 0 H122 Q138 0 140 -12 M-40 0 L-30 -42 M84 0 L74 -42" fill="none" stroke="${OL}" stroke-width="7" stroke-linecap="round"/>
      <path d="M-70 -44 Q-92 -44 -92 -74 Q-92 -136 -24 -146 H60 Q132 -144 154 -96 Q162 -54 124 -44 Z" fill="${body}"/>
      <rect x="-91" y="-88" width="250" height="14" fill="#fff"/>
      <path d="M-70 -44 Q-92 -44 -92 -74 Q-92 -136 -24 -146 H60 Q132 -144 154 -96 Q162 -54 124 -44 Z" fill="none" ${S}/>
      <path d="M74 -134 Q122 -128 142 -96 H74 Z" fill="#bfe6ff" ${S3}/>
      <g id="hl-pilot" class="tappable">
        <circle cx="104" cy="-110" r="13" fill="#f1c27d" ${S3}/><path d="M90 -112 Q104 -136 118 -112 Z" fill="#fff" ${S3}/>
        <rect x="70" y="-140" width="84" height="50" fill="transparent"/>
      </g>
      <g id="hl-door" class="tappable">
        <g id="hl-doorpanel"><rect x="-40" y="-134" width="62" height="76" rx="6" fill="${doorCol}" ${S3}/><rect x="-30" y="-124" width="42" height="24" rx="4" fill="#bfe6ff" ${S3}/></g>
        <rect x="-50" y="-140" width="82" height="96" fill="transparent"/>
      </g>
      <rect x="12" y="-168" width="16" height="22" fill="#596178" ${S3}/>
      <g id="hl-rotor" class="tappable">
        <g class="rotor-blades"><rect x="-180" y="-176" width="400" height="10" rx="5" fill="#3a4157"/></g>
        <circle cx="20" cy="-171" r="9" fill="${OL}"/>
        <rect x="-190" y="-196" width="420" height="44" fill="transparent"/>
      </g>
    </g>`;

  const pine = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-6" y="-20" width="12" height="22" fill="#8a5a3c"/><path d="M0 -110 L34 -50 H18 L42 -20 H-42 L-18 -50 H-34 Z" fill="#2f8f4e" ${S3}/></g>`;
  const FIRES = [{ id: 'wf1', x: 940, y: 650 }, { id: 'wf2', x: 1120, y: 610 }, { id: 'wf3', x: 1300, y: 640 }];

  A.screens.helitack = run({
    id: 'helitack',
    svg: () => sceneSvg('Forest hills', `
      ${Art.sun(330, 270)}
      <g class="clouds">${Art.cloud(700, 70, .8)}${Art.cloud(1150, 110, 1)}</g>
      <path d="M0 600 Q300 470 650 560 T1300 470 T1600 520 V900 H0 Z" fill="#7cc47a"/>
      <g id="trees" class="tappable">
        ${[[760, 610, .9], [830, 640, 1], [900, 600, .8], [990, 620, 1.1], [1060, 580, .9], [1150, 600, 1], [1230, 570, .85], [1320, 610, 1.05], [1400, 590, .9], [1210, 660, 1], [1030, 680, 1], [880, 690, 1]].map(t => pine(...t)).join('')}
      </g>
      <g id="smoke">${FIRES.map((f, i) => `<circle class="puff p${i}" cx="${f.x}" cy="${f.y - 90}" r="${30 + (i % 2) * 10}" fill="#8a8f9c"/><circle class="puff p${i + 2}" cx="${f.x + 20}" cy="${f.y - 100}" r="26" fill="#8a8f9c"/>`).join('')}</g>
      ${FIRES.map(f => Art.flame(f.x, f.y, .8, f.id)).join('')}
      <path d="M0 760 Q400 740 800 760 T1600 750 V900 H0 Z" fill="#9fd88d"/>
      <g id="lake" class="tappable">
        <ellipse cx="360" cy="822" rx="170" ry="46" fill="url(#water)" ${S3}/>
        <path d="M280 820 q15 -8 30 0 t30 0 M380 836 q15 -8 30 0 t30 0" fill="none" stroke="#bfe6ff" stroke-width="4"/>
      </g>
      <g transform="translate(780 802)"><ellipse rx="130" ry="20" fill="#5a606b" ${S3}/><text y="8" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="24" fill="#ffd84a">H</text></g>
      <g id="hl-groundbucket" class="tappable" transform="translate(960 800)"><path d="M-28 -44 H28 L19 0 H-19 Z" fill="#f07a1a" ${S3}/><rect x="-40" y="-60" width="80" height="70" fill="transparent"/></g>
      <path id="hl-water" d="" fill="none" stroke="#5cc3ff" stroke-width="22" stroke-linecap="round" opacity="0"/>
      <g id="heli" transform="translate(760 796)">${heliArt()}</g>
      <g id="splash"></g>
    `),
    setup(c) {
      const { el, alive } = c, heli = el('heli');
      c.pos = { x: 760, y: 796, t: 0 };
      c.setHeli = (x, y, t = 0) => {
        c.pos = { x, y, t };
        heli.setAttribute('transform', `translate(${x} ${y}) rotate(${t})`);
        el('hl-shadow').setAttribute('opacity', y > 780 ? 1 : 0);
      };
      c.fly = (x, y, ms = 1600) => {
        const from = { ...c.pos }, dir = x > from.x ? 8 : x < from.x ? -8 : 0;
        return A.tween(ms, (p, raw) => c.setHeli(from.x + (x - from.x) * p, from.y + (y - from.y) * p, dir * Math.sin(raw * Math.PI)));
      };
      c.rotor = on => {
        heli.classList.toggle('spinning', on);
        clearInterval(c.chopper);
        if (on) { Sfx.chop(); c.chopper = A.every(() => Sfx.chop(), 1050); }
      };
      // arrive from the sky and land
      el('hl-bucket-g').setAttribute('opacity', 0);
      c.setHeli(1700, 300);
      c.rotor(true);
      c.fly(760, 796, 2600).then(() => {
        if (!alive()) return;
        A.later(() => c.rotor(false), 600);
        c.ready('helitack.arrive', [el('hl-rotor'), el('hl-pilot'), el('lake')]);
      });
      c.part(el('hl-rotor'), () => { c.rotor(true); A.say('helitack.rotor'); A.later(() => c.rotor(false), 2600); }, { rotor: () => heliTakeOff(c) });
      c.part(el('hl-pilot'), () => A.say('helitack.pilot'));
      c.part(el('hl-door'), () => c.busy(async () => {
        const d = el('hl-doorpanel');
        A.say('helitack.door');
        await A.tween(400, p => d.setAttribute('transform', `translate(${-40 * p} 0)`));
        await A.wait(2500);
        await A.tween(400, p => d.setAttribute('transform', `translate(${-40 * (1 - p)} 0)`));
      }));
      c.part(el('hl-groundbucket'), () => { Sfx.boing(); A.say('helitack.bucket'); });
      c.part(el('lake'), () => { Sfx.splash(); A.say('helitack.lake'); }, { lake: () => heliFill(c) });
      c.part(el('trees'), async () => { Sfx.whoosh(); await A.say('helitack.trees'); c.learn('wildfire'); });
      FIRES.forEach(f => c.part(el(f.id), null, { fires: () => heliDrop(c, f) }));
    },
    async mission(c) {
      const { el, svg, alive } = c;
      c.st.busy = true;
      FIRES.forEach(f => { el(f.id).classList.add('lit'); });
      svg.classList.add('burning');
      Sfx.siren(1.6);
      await A.say('helitack.m.call');
      await c.learn('helitack');
      if (!alive()) return;
      c.st.busy = false;
      c.step('rotor', [el('hl-rotor')], 'helitack.m.rotor');
    }
  });

  async function heliTakeOff(c) {
    const { el, alive } = c;
    c.endStep();
    c.rotor(true);
    el('hl-groundbucket').setAttribute('opacity', 0);
    el('hl-bucket-g').setAttribute('opacity', 1);
    await A.wait(600);
    await c.fly(760, 420, 1800);
    if (!alive()) return;
    c.step('lake', [el('lake')], 'helitack.m.lake');
  }
  async function heliFill(c) {
    const { el, alive } = c;
    c.endStep();
    await c.fly(340, 420, 1400);
    await c.fly(340, 650, 1000);
    Sfx.splash(); splashAt(c, 360, 805);
    el('hl-bwater').setAttribute('opacity', 1);
    await A.wait(500);
    await c.fly(340, 420, 1000);
    if (!alive()) return;
    c.step('fires', FIRES.map(f => el(f.id)), 'helitack.m.fires');
  }
  async function heliDrop(c, f) {
    const { el, svg, alive } = c, flame = el(f.id);
    if (!flame.classList.contains('lit') || c.dropping) return;
    c.dropping = true;
    const t = c.st.step; c.st.step = null;
    await c.fly(f.x - 20, 420, 1100);
    const w = el('hl-water'), bx = f.x, by = 420 + 154;
    w.setAttribute('d', `M${bx} ${by} L${bx} ${f.y - 30}`);
    w.setAttribute('opacity', .85);
    Sfx.splash();
    await A.tween(500, p => flame.querySelector('.flame-scale').setAttribute('transform', `scale(${1 - p})`));
    w.setAttribute('opacity', 0);
    flame.classList.remove('lit'); flame.classList.remove('target', 'hint');
    Sfx.hiss(); splashAt(c, f.x, f.y - 20);
    c.dropping = false;
    if (!alive()) return;
    const left = FIRES.filter(x => el(x.id).classList.contains('lit'));
    if (left.length) { c.st.step = t; return; }
    c.endStep();
    svg.classList.remove('burning'); svg.classList.add('steam');
    el('hl-bwater').setAttribute('opacity', 0);
    Sfx.chime(); A.confetti();
    await A.say('helitack.m.saved');
    if (!alive()) return;
    A.later(() => svg.classList.remove('steam'), 1500);
    c.finish();
  }
  // Pictures for the red word cards (ids stripped so they don't clash with the scene).
  const pic = (vb, inner) => () => `<svg viewBox="${vb}">${inner.replace(/ id="[^"]*"/g, '')}</svg>`;
  Object.assign(Art.wordPicture, {
    circuit: pic('-130 -90 260 180', `<ellipse rx="110" ry="70" fill="#4a4f5a" ${S3}/><ellipse rx="70" ry="34" fill="#9fd88d" ${S3}/>
      <ellipse rx="110" ry="70" fill="none" stroke="#fff" stroke-width="6" stroke-dasharray="14 14"/>
      <g transform="translate(-20 64) scale(.35)">${raceCar()}</g>`),
    hovercraft: pic('-10 -250 480 270', hoverArt()),
    winch: pic('-70 -70 140 150', `<circle r="44" fill="#c7cfdb" ${S3}/><circle r="28" fill="none" stroke="${OL}" stroke-width="10"/>
      <path d="M-30 0 H30 M0 -30 V30" stroke="${OL}" stroke-width="6"/><path d="M44 0 V58" stroke="${OL}" stroke-width="5"/>
      <path d="M44 56 V66 Q44 80 32 76 Q26 72 28 66" fill="none" stroke="${OL}" stroke-width="6" stroke-linecap="round"/>`),
    crane: pic('-20 -200 300 240', `<rect x="0" y="0" width="60" height="30" fill="#3a4157" ${S3}/>
      <g transform="rotate(-30 30 0)"><rect x="20" y="-14" width="250" height="26" rx="6" fill="#e53935" ${S3}/></g>
      <path d="M244 -126 V-30" stroke="${OL}" stroke-width="5"/><path d="M244 -32 V-20 Q244 -4 230 -8 Q222 -12 226 -20" fill="none" stroke="${OL}" stroke-width="7" stroke-linecap="round"/>`),
    helitack: pic('-220 -210 400 340', heliArt().replace('id="hl-bucket-g" opacity="0"', '').replace('<ellipse id="hl-shadow"', '<ellipse opacity="0"')),
    wildfire: pic('-130 -150 260 170', `${pine(-80, 0, .9)}${pine(70, 0, 1)}${pine(0, 10, 1.1)}
      <g transform="translate(-30 4)"><path d="M0 0 C-36 -8 -34 -54 -6 -96 C0 -64 22 -70 18 -42 C34 -56 36 -18 0 0 Z" fill="#ff8a1f" ${S3}/></g>
      <g transform="translate(40 8) scale(.7)"><path d="M0 0 C-36 -8 -34 -54 -6 -96 C0 -64 22 -70 18 -42 C34 -56 36 -18 0 0 Z" fill="#ff8a1f" ${S3}/></g>`)
  });

  function splashAt(c, x, y) {
    const g = c.el('splash');
    for (let i = 0; i < 8; i++) {
      const d = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      d.setAttribute('cx', x); d.setAttribute('cy', y); d.setAttribute('r', 6 + Math.random() * 6);
      d.setAttribute('fill', '#bfe6ff'); d.setAttribute('class', 'drop');
      const a = Math.random() * Math.PI * 2;
      d.style.setProperty('--dx', Math.cos(a) * 60 + 'px'); d.style.setProperty('--dy', Math.sin(a) * 40 - 20 + 'px');
      g.appendChild(d); setTimeout(() => d.remove(), 650);
    }
  }

  // Shared with later vehicle files.
  window.Kit = { art: { medical: medCar, hover: hoverArt, tow: towArt, helitack: () => heliArt() }, run, sceneSvg, wheel, turnWheels, person, wave, flashFor, heliArt, pine, splashAt, bagArt };
})();
