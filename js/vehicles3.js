// Phase 3 vehicles: ambulance, police car, air ambulance and lifeboat.
(function () {
  const A = window.App;
  const { OL, S, S3 } = Art;
  const { run, sceneSvg, wheel, turnWheels, person, wave, flashFor, heliArt, splashAt, bagArt } = window.Kit;

  const show = (node, on = true) => node.setAttribute('opacity', on ? 1 : 0);
  const fadeIn = (node, ms = 300) => A.tween(ms, p => node.setAttribute('opacity', p));
  const moveTo = (node, from, to, ms, lift = 0) => A.tween(ms, (p, raw) =>
    node.setAttribute('transform', `translate(${from.x + (to.x - from.x) * p} ${from.y + (to.y - from.y) * p - Math.sin(raw * Math.PI) * lift})`));
  const battenburg = (x0, x1, y, size, a, b) => {
    let r = '';
    for (let x = x0, i = 0; x < x1; x += size, i++) {
      const w = Math.min(size, x1 - x);
      r += `<rect x="${x}" y="${y}" width="${w}" height="${size}" fill="${i % 2 ? b : a}"/><rect x="${x}" y="${y + size}" width="${w}" height="${size}" fill="${i % 2 ? a : b}"/>`;
    }
    return r;
  };

  // Someone sitting on the ground (hurt), with a sad and a happy face.
  const sitter = ({ id, top, legs, skin, hair, helmet = null, extra = '' }) => `
    <g id="${id}-sit">
      <ellipse cx="18" cy="2" rx="56" ry="8" fill="rgba(0,0,0,.18)"/>
      <path d="M-10 -14 H58" stroke="${OL}" stroke-width="24" stroke-linecap="round"/>
      <path d="M-10 -14 H58" stroke="${legs}" stroke-width="16" stroke-linecap="round"/>
      <circle cx="66" cy="-16" r="11" fill="${OL}"/>
      <circle id="${id}-graze" cx="34" cy="-18" r="6" fill="#e5533c"/>
      <rect id="${id}-plaster" x="25" y="-24" width="20" height="11" rx="4" fill="#f6d7b0" ${S3} opacity="0"/>
      <rect x="-30" y="-80" width="42" height="64" rx="14" fill="${top}" ${S3}/>
      <path d="M-4 -64 Q16 -44 30 -24" fill="none" stroke="${OL}" stroke-width="18" stroke-linecap="round"/>
      <path d="M-4 -64 Q16 -44 30 -24" fill="none" stroke="${top}" stroke-width="11" stroke-linecap="round"/>
      ${extra}
      <circle cx="-9" cy="-102" r="21" fill="${skin}" ${S3}/>
      ${helmet ? `<path d="M-32 -106 Q-30 -132 -9 -132 Q12 -132 14 -106 Z" fill="${helmet}" ${S3}/>`
        : `<path d="M-31 -104 Q-32 -128 -9 -128 Q14 -128 13 -104 Q2 -116 -9 -114 Q-20 -116 -31 -104 Z" fill="${hair}" ${S3}/>`}
      <circle cx="-16" cy="-100" r="2.8" fill="${OL}"/><circle cx="-2" cy="-100" r="2.8" fill="${OL}"/>
      <path id="${id}-sad" d="M-16 -88 Q-9 -94 -2 -88" fill="none" stroke="${OL}" stroke-width="3"/>
      <path id="${id}-happy" d="M-16 -92 Q-9 -84 -2 -92" fill="none" stroke="${OL}" stroke-width="3" opacity="0"/>
      <ellipse id="${id}-tear" cx="-22" cy="-92" rx="3" ry="5" fill="#5cc3ff"/>
      <rect x="-50" y="-140" width="130" height="150" fill="transparent"/>
    </g>`;
  const cheerUp = (c, id) => { show(c.el(`${id}-sad`), false); show(c.el(`${id}-happy`)); show(c.el(`${id}-tear`), false); };

  // =====================================================================
  // Ambulance — the park
  // =====================================================================
  const ambArt = () => `
    <g class="ambulance">
      <ellipse cx="240" cy="2" rx="240" ry="10" fill="rgba(0,0,0,.18)"/>
      <g id="am-stretcher" opacity="0">
        <path d="M-140 -48 L-128 -10 M-34 -48 L-46 -10" stroke="${OL}" stroke-width="5"/>
        <circle cx="-128" cy="-8" r="7" fill="${OL}"/><circle cx="-46" cy="-8" r="7" fill="${OL}"/>
        <rect x="-152" y="-58" width="134" height="10" fill="#596178"/>
        <rect x="-152" y="-74" width="134" height="18" rx="7" fill="#fff" ${S3}/>
      </g>
      <rect x="10" y="-232" width="332" height="182" rx="12" fill="#ffe14d"/>
      ${battenburg(10, 342, -112, 20, '#2e9e4f', '#ffe14d')}
      <text x="176" y="-150" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="30" fill="#1f6f3a" letter-spacing="2">AMBULANCE</text>
      <g transform="translate(300 -196)"><circle r="20" fill="#fff" ${S3}/><path d="M0 -12 V12 M-12 0 H12" stroke="#2e9e4f" stroke-width="8"/></g>
      <rect x="10" y="-232" width="332" height="182" rx="12" fill="none" ${S}/>
      <path d="M342 -50 V-196 H398 Q440 -190 456 -132 L470 -92 V-50 Z" fill="#ffe14d"/>
      ${battenburg(342, 468, -112, 20, '#2e9e4f', '#ffe14d')}
      <path d="M342 -50 V-196 H398 Q440 -190 456 -132 L470 -92 V-50 Z" fill="none" ${S}/>
      <path d="M354 -182 H396 Q428 -178 442 -136 H354 Z" fill="#bfe6ff" ${S3}/>
      <g id="am-cab" class="tappable"><rect x="352" y="-188" width="96" height="58" fill="transparent"/></g>
      <g id="am-doors" class="tappable">
        <rect x="6" y="-224" width="22" height="168" fill="${OL}"/>
        <g id="am-doorpanel"><rect x="2" y="-226" width="26" height="172" rx="6" fill="#f2cf2a" ${S3}/><rect x="7" y="-210" width="16" height="40" rx="4" fill="#bfe6ff"/></g>
        <rect x="-20" y="-236" width="90" height="190" fill="transparent"/>
      </g>
      <g id="am-lights" class="tappable">
        <rect x="356" y="-214" width="84" height="16" rx="7" fill="#9fb1c7" ${S3}/>
        <ellipse class="beacon" cx="372" cy="-218" rx="14" ry="10" fill="#3b82f6" ${S3}/>
        <ellipse class="beacon b2" cx="424" cy="-218" rx="14" ry="10" fill="#3b82f6" ${S3}/>
        <ellipse class="beacon b2" cx="28" cy="-238" rx="12" ry="9" fill="#3b82f6" ${S3}/>
        <rect x="346" y="-240" width="104" height="46" fill="transparent"/>
      </g>
      <g id="am-siren" class="tappable">
        <rect x="458" y="-102" width="22" height="40" rx="5" fill="#d8dee8" ${S3}/>
        <path d="M462 -92 H476 M462 -82 H476 M462 -72 H476" stroke="${OL}" stroke-width="3"/>
        <rect x="440" y="-112" width="52" height="64" fill="transparent"/>
      </g>
      <path d="M50 -50 A42 42 0 0 1 134 -50 Z M352 -50 A42 42 0 0 1 436 -50 Z" fill="#30364a"/>
      ${wheel(92, -38, 36)}${wheel(394, -38, 36)}
    </g>`;

  const bike = () => `
    <g class="bike-art">
      <circle cx="-40" cy="-24" r="24" fill="none" stroke="${OL}" stroke-width="6"/>
      <circle cx="40" cy="-24" r="24" fill="none" stroke="${OL}" stroke-width="6"/>
      <path d="M-40 -24 L-8 -24 L14 -56 L-22 -56 Z M14 -56 L40 -24 M-22 -56 L-26 -66 M14 -56 L10 -74" fill="none" stroke="#e53935" stroke-width="6" stroke-linejoin="round"/>
      <path d="M-34 -68 H-16 M2 -76 H20" stroke="${OL}" stroke-width="6" stroke-linecap="round"/>
    </g>`;

  A.screens.ambulance = run({
    id: 'ambulance',
    svg: () => sceneSvg('The park', `
      ${Art.sun(1290, 250)}
      <g class="clouds">${Art.cloud(150, 100, 1)}${Art.cloud(1000, 60, .8)}</g>
      <path d="M0 610 Q400 560 800 590 T1600 580 V900 H0 Z" fill="#9fd88d"/>
      ${Art.tree(640, 700, .7)}${Art.tree(1470, 770, .9)}
      <g id="swings" class="tappable">
        <path d="M820 760 L850 520 L880 760 M1000 760 L1030 520 L1060 760 M840 524 H1040" fill="none" stroke="#e53935" stroke-width="10" stroke-linecap="round"/>
        <g id="swing1"><path d="M900 524 V680 M940 524 V680" stroke="${OL}" stroke-width="3"/><rect x="890" y="678" width="60" height="10" rx="4" fill="#1e5bd6" ${S3}/></g>
        <g id="swing2"><path d="M960 524 V680 M1000 524 V680" stroke="${OL}" stroke-width="3"/><rect x="950" y="678" width="60" height="10" rx="4" fill="#ffd21f" ${S3}/></g>
        <rect x="810" y="500" width="260" height="270" fill="transparent"/>
      </g>
      ${Art.bush(1150, 790, .7)}
      <rect x="0" y="800" width="1600" height="100" fill="#d9c7a3"/>
      <path d="M0 800 H1600" stroke="${OL}" stroke-width="3"/>
      <g id="bike" class="tappable" transform="translate(1330 798)">${bike()}<rect x="-70" y="-90" width="140" height="90" fill="transparent"/></g>
      <g id="mia" class="tappable" transform="translate(1250 798)">
        <g id="mia-stand" transform="scale(.72)">${person({ id: 'miaS', suit: '#e86aa6', band: '#e86aa6', hat: 'helmet', helmet: '#2e9e4f', skin: '#8d5524' })}</g>
        <g id="mia-sitwrap" opacity="0">${sitter({ id: 'mia', top: '#e86aa6', legs: '#1e5bd6', skin: '#8d5524', helmet: '#2e9e4f' })}</g>
      </g>
      <g id="amb" class="tappable" transform="translate(330 846)">${ambArt()}</g>
      <g id="kai" class="tappable" transform="translate(262 852)">${person({ id: 'kai', suit: '#1f6f3a', band: '#ffd21f', hat: 'hair', hair: '#2a2f45', skin: '#e0ac85', item: bagArt })}</g>
    `),
    setup(c) {
      const { el, alive } = c, amb = el('amb');
      c.setAmb = x => { c.ax = x; amb.setAttribute('transform', `translate(${x} 846)`); turnWheels(amb, (x - 250) / 36 * 57.3); };
      c.setAmb(-560); show(el('kai'), false);
      amb.classList.add('flashing'); Sfx.wail(2.2); Sfx.engine(2);
      A.tween(2200, p => c.setAmb(-560 + p * 890), A.easeOut).then(() => {
        if (!alive()) return;
        amb.classList.remove('flashing');
        fadeIn(el('kai'));
        c.ready('ambulance.arrive', [el('am-lights'), el('am-doors'), el('kai')]);
      });
      c.doors = open => {
        const panel = el('am-doorpanel'), st = el('am-stretcher');
        if (open) show(st);
        return A.tween(600, p => {
          const k = open ? p : 1 - p;
          panel.setAttribute('transform', `translate(${-34 * k} 0)`);
          st.setAttribute('transform', `translate(${150 * (1 - k)} 0)`);
        }, A.easeOut).then(() => { if (!open) show(st, false); });
      };
      c.part(el('am-lights'), () => { Sfx.chime(); flashFor(amb, 3000); A.say('ambulance.lights'); });
      c.part(el('am-siren'), () => { Sfx.wail(); flashFor(amb, 2400); A.say('ambulance.siren'); });
      c.part(el('am-cab'), () => { Sfx.tap(); A.say('ambulance.cab'); });
      c.part(el('am-doors'), () => c.busy(async () => {
        Sfx.pop(); A.say('ambulance.doors');
        await c.doors(true);
        await c.learn('stretcher');
        await A.wait(1500);
        await c.doors(false);
      }), { doors: () => ambDoors(c) });
      c.part(el('kai'), () => { A.say('ambulance.kai'); wave(el('kai-arm')); });
      c.part(el('swings'), () => {
        Sfx.whoosh(); A.say('ambulance.swings');
        A.tween(2000, (p, raw) => {
          const a = Math.sin(raw * Math.PI * 4) * 18 * (1 - p);
          el('swing1').setAttribute('transform', `rotate(${a} 920 524)`);
          el('swing2').setAttribute('transform', `rotate(${-a} 980 524)`);
        }, q => q);
      });
      c.part(el('mia'), () => { A.say('ambulance.mia'); wave(el('miaS-arm')); }, { mia: () => ambMia(c) });
      c.part(el('bike'), () => { Sfx.beep(2); });
      c.part(amb, null, { drive: () => ambDrive(c) });
    },
    async mission(c) {
      const { el, alive } = c;
      c.st.busy = true;
      Sfx.boing();
      show(el('mia-stand'), false); show(el('mia-sitwrap'));
      el('bike').setAttribute('transform', 'translate(1340 798) rotate(-28)');
      await A.say('ambulance.m.call');
      if (!alive()) return;
      c.st.busy = false;
      c.step('drive', [el('amb')], 'ambulance.m.drive');
    }
  });

  async function ambDrive(c) {
    const { el, alive } = c, amb = el('amb'), kai = el('kai');
    c.endStep();
    show(kai, false);
    amb.classList.add('flashing'); Sfx.wail(2.4); Sfx.engine(2.2);
    await A.tween(2200, p => c.setAmb(330 + p * 250));
    if (!alive()) return;
    amb.classList.remove('flashing');
    kai.setAttribute('transform', 'translate(1110 852)');
    await fadeIn(kai);
    await c.learn('paramedic');
    if (!alive()) return;
    c.step('doors', [el('am-doors')], 'ambulance.m.doors');
  }
  async function ambDoors(c) {
    const { el, alive } = c;
    c.endStep();
    Sfx.pop();
    await c.doors(true);
    show(el('kai-item')); Sfx.sparkle();
    if (!alive()) return;
    c.step('mia', [el('mia')], 'ambulance.m.mia');
  }
  async function ambMia(c) {
    const { el, alive } = c;
    c.endStep();
    await moveTo(el('kai'), { x: 1110, y: 852 }, { x: 1150, y: 852 }, 500);
    show(el('mia-graze'), false); show(el('mia-plaster'));
    Sfx.sparkle();
    await A.wait(500);
    cheerUp(c, 'mia');
    await A.wait(700);
    show(el('mia-sitwrap'), false); show(el('mia-stand'));
    Sfx.chime(); A.confetti(); wave(el('miaS-arm'));
    await A.say('ambulance.m.saved');
    if (!alive()) return;
    c.finish();
  }

  // =====================================================================
  // Police car — the fair
  // =====================================================================
  const policeArt = () => `
    <g class="policecar">
      <ellipse cx="212" cy="2" rx="212" ry="10" fill="rgba(0,0,0,.18)"/>
      <path d="M10 -40 V-92 Q12 -112 40 -114 L118 -118 L168 -162 H306 L368 -116 Q414 -110 416 -82 V-40 Z" fill="#f4f6fa"/>
      ${battenburg(10, 416, -94, 16, '#1e5bd6', '#ffd21f')}
      <text x="214" y="-99" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="17" fill="#1e5bd6" letter-spacing="3">POLICE</text>
      <path d="M10 -40 V-92 Q12 -112 40 -114 L118 -118 L168 -162 H306 L368 -116 Q414 -110 416 -82 V-40 Z" fill="none" ${S}/>
      <path d="M132 -118 L172 -152 H232 V-118 Z" fill="#bfe6ff" ${S3}/>
      <path d="M244 -152 H302 L350 -118 H244 Z" fill="#bfe6ff" ${S3}/>
      <g id="pc-radio" class="tappable">
        <rect x="258" y="-142" width="26" height="18" rx="3" fill="#3a4157" ${S3}/><path d="M262 -142 V-150" stroke="${OL}" stroke-width="3"/>
        <circle cx="277" cy="-133" r="3" fill="#5fd394"/>
        <rect x="244" y="-158" width="108" height="42" fill="transparent"/>
      </g>
      <g id="pc-lights" class="tappable">
        <rect x="196" y="-178" width="90" height="16" rx="7" fill="#9fb1c7" ${S3}/>
        <ellipse class="beacon" cx="212" cy="-182" rx="14" ry="10" fill="#3b82f6" ${S3}/>
        <ellipse class="beacon b2" cx="270" cy="-182" rx="14" ry="10" fill="#3b82f6" ${S3}/>
        <rect x="186" y="-204" width="110" height="46" fill="transparent"/>
      </g>
      <g id="pc-siren" class="tappable">
        <rect x="404" y="-80" width="22" height="32" rx="5" fill="#d8dee8" ${S3}/>
        <path d="M408 -72 H422 M408 -64 H422 M408 -56 H422" stroke="${OL}" stroke-width="3"/>
        <rect x="390" y="-94" width="50" height="56" fill="transparent"/>
      </g>
      <path d="M50 -40 A42 42 0 0 1 134 -40 Z M292 -40 A42 42 0 0 1 376 -40 Z" fill="#30364a"/>
      ${wheel(92, -34, 34)}${wheel(334, -34, 34)}
    </g>`;

  const teddyArt = () => `
    <g class="teddy-art">
      <circle cx="-18" cy="-62" r="10" fill="#a0673a" ${S3}/><circle cx="18" cy="-62" r="10" fill="#a0673a" ${S3}/>
      <ellipse cx="0" cy="-18" rx="24" ry="20" fill="#a0673a" ${S3}/>
      <circle cx="0" cy="-50" r="20" fill="#a0673a" ${S3}/>
      <ellipse cx="0" cy="-44" rx="9" ry="7" fill="#e7c49a"/><circle cx="0" cy="-47" r="3" fill="${OL}"/>
      <circle cx="-7" cy="-54" r="2.5" fill="${OL}"/><circle cx="7" cy="-54" r="2.5" fill="${OL}"/>
      <path d="M-8 -30 L8 -30 L0 -24 Z" fill="#e53935"/>
    </g>`;
  const SPOTS = {
    van: { at: { x: 860, y: 600 }, from: { x: 860, y: 690 }, line: 'police.van',
      decoy: `<g><path d="M-16 0 L0 40 L16 0 Z" fill="#e7b46a" ${S3}/><circle cx="0" cy="-8" r="18" fill="#ff9fc4" ${S3}/></g>` },
    cart: { at: { x: 1080, y: 650 }, from: { x: 1080, y: 740 }, line: 'police.cart',
      decoy: `<g><circle r="22" fill="#1e5bd6" ${S3}/><path d="M-22 0 H22 M0 -22 V22" stroke="#ffd21f" stroke-width="5"/></g>` },
    hedge: { at: { x: 1290, y: 660 }, from: { x: 1290, y: 740 }, line: 'police.hedge',
      decoy: `<g><ellipse cx="0" cy="0" rx="30" ry="18" fill="#9fb1c7" ${S3}/><circle cx="-24" cy="-14" r="14" fill="#9fb1c7" ${S3}/><path d="M-34 -22 L-34 -36 L-26 -26 Z M-14 -22 L-14 -36 L-22 -26 Z" fill="#9fb1c7" ${S3}/><path d="M-30 -14 H-26 M-22 -14 H-18" stroke="${OL}" stroke-width="2"/></g>` }
  };

  A.screens.police = run({
    id: 'police',
    svg: () => sceneSvg('The fair', `
      <g class="clouds">${Art.cloud(150, 100, 1)}${Art.cloud(800, 60, .8)}</g>
      <path d="M0 610 Q400 570 800 600 T1600 590 V900 H0 Z" fill="#9fd88d"/>
      <g id="bigwheel" class="tappable">
        <path d="M1060 760 L1180 480 L1300 760" fill="none" stroke="#7f93ad" stroke-width="14" stroke-linecap="round"/>
        <g id="bw-spin" class="slow-spin">
          <circle cx="1180" cy="480" r="200" fill="none" stroke="#7f93ad" stroke-width="10"/>
          ${Array.from({ length: 8 }, (_, i) => { const a = i * Math.PI / 4, x = 1180 + Math.cos(a) * 200, y = 480 + Math.sin(a) * 200;
            return `<path d="M1180 480 L${x} ${y}" stroke="#9fb1c7" stroke-width="5"/><rect x="${x - 22}" y="${y - 16}" width="44" height="32" rx="8" fill="${['#e53935', '#1e5bd6', '#ffd21f', '#2e9e4f'][i % 4]}" ${S3}/>`; }).join('')}
          <circle cx="1180" cy="480" r="16" fill="#ffd21f" ${S3}/>
        </g>
        <rect x="970" y="270" width="420" height="490" fill="transparent"/>
      </g>
      <path d="M0 236 Q200 270 400 236 T800 236 T1200 236 T1600 236" fill="none" stroke="${OL}" stroke-width="3"/>
      ${Array.from({ length: 20 }, (_, i) => `<path d="M${i * 80 + 20} ${244 + (i % 5 === 2 ? 14 : 4)} l20 0 l-10 26 Z" fill="${['#e53935', '#ffd21f', '#1e5bd6', '#2e9e4f'][i % 4]}"/>`).join('')}
      <g id="carousel" class="tappable">
        <path d="M370 560 L510 470 L650 560 Z" fill="#e53935" ${S}/>
        <path d="M440 516 L510 470 L580 516" fill="none" stroke="#fff" stroke-width="10"/>
        <rect x="380" y="560" width="260" height="18" fill="#ffd21f" ${S3}/>
        ${[400, 460, 520, 580, 620].map((x, i) => `<path d="M${x} 578 V760" stroke="#d8dee8" stroke-width="6"/><g class="horse" data-i="${i}"><ellipse cx="${x}" cy="${660 + (i % 2) * 30}" rx="22" ry="14" fill="#fff" ${S3}/><circle cx="${x + 18}" cy="${648 + (i % 2) * 30}" r="9" fill="#fff" ${S3}/></g>`).join('')}
        <rect x="370" y="760" width="280" height="20" fill="#9fb1c7" ${S3}/>
        <rect x="360" y="460" width="300" height="320" fill="transparent"/>
      </g>
      <!-- hiding places: the hidden things sit behind each one -->
      ${Object.entries(SPOTS).map(([k, s]) => `<g id="reveal-${k}" opacity="0" transform="translate(${s.from.x} ${s.from.y})">${s.decoy}</g>`).join('')}
      <g id="teddy" opacity="0" transform="translate(860 690)">${teddyArt()}</g>
      <g id="spot-van" class="tappable">
        <path d="M740 800 V660 Q742 640 762 640 H930 Q960 642 975 690 L990 730 V800 Z" fill="#fff" ${S}/>
        <rect x="740" y="740" width="250" height="24" fill="#ff9fc4"/>
        <path d="M740 800 V660 Q742 640 762 640 H930 Q960 642 975 690 L990 730 V800 Z" fill="none" ${S}/>
        <rect x="770" y="664" width="110" height="56" rx="6" fill="#bfe6ff" ${S3}/>
        <path d="M850 640 L860 600 L870 640 Z" fill="#e7b46a" ${S3}/><circle cx="860" cy="596" r="14" fill="#ff9fc4" ${S3}/>
        <circle cx="790" cy="800" r="24" fill="#30364a" ${S3}/><circle cx="940" cy="800" r="24" fill="#30364a" ${S3}/>
      </g>
      <g id="spot-cart" class="tappable">
        ${[['#e53935', 1050, 610], ['#ffd21f', 1085, 590], ['#1e5bd6', 1115, 615], ['#2e9e4f', 1075, 630]].map(([col, x, y]) => `<path d="M${x} ${y + 26} L1080 740" stroke="${OL}" stroke-width="2"/><ellipse cx="${x}" cy="${y}" rx="20" ry="25" fill="${col}" ${S3}/>`).join('')}
        <rect x="1030" y="730" width="100" height="56" rx="6" fill="#8e5bd6" ${S3}/>
        <circle cx="1048" cy="790" r="12" fill="#30364a" ${S3}/><circle cx="1112" cy="790" r="12" fill="#30364a" ${S3}/>
      </g>
      <g id="spot-hedge" class="tappable">
        <path d="M1190 800 V720 Q1200 690 1230 700 Q1250 670 1280 690 Q1310 665 1340 692 Q1375 690 1380 730 V800 Z" fill="#3f9a4f" ${S}/>
        <circle cx="1240" cy="740" r="5" fill="#e94b3c"/><circle cx="1320" cy="730" r="5" fill="#e94b3c"/><circle cx="1290" cy="770" r="5" fill="#e94b3c"/>
      </g>
      <rect x="0" y="800" width="1600" height="100" fill="#e8d3a8"/>
      <path d="M0 800 H1600" stroke="${OL}" stroke-width="3"/>
      <g id="leo" class="tappable" transform="translate(800 800)">
        <g transform="scale(.72)">${person({ id: 'leo', suit: '#f07a1a', band: '#f07a1a', hat: 'hair', hair: '#c97b2a', skin: '#f1c27d' })}</g>
        <ellipse id="leo-tear" cx="-10" cy="-104" rx="3" ry="5" fill="#5cc3ff" opacity="0"/>
      </g>
      <g id="pcar" class="tappable" transform="translate(300 846)">${policeArt()}</g>
      <g id="priya" class="tappable" transform="translate(234 852)">${person({ id: 'priya', suit: '#1b2433', band: '#ffd21f', hat: 'custodian', helmet: '#1b2433', skin: '#b07b52' })}</g>
    `),
    setup(c) {
      const { el, alive } = c, car = el('pcar');
      c.setCar = x => { car.setAttribute('transform', `translate(${x} 846)`); turnWheels(car, (x - 200) / 34 * 57.3); };
      c.setCar(-520); show(el('priya'), false);
      car.classList.add('flashing'); Sfx.yelp(1.6); Sfx.engine(2);
      A.tween(2200, p => c.setCar(-520 + p * 820), A.easeOut).then(() => {
        if (!alive()) return;
        car.classList.remove('flashing');
        fadeIn(el('priya'));
        c.ready('police.arrive', [el('pc-lights'), el('priya'), el('pc-radio')]);
      });
      c.part(el('pc-lights'), () => { Sfx.chime(); flashFor(car, 3000); A.say('police.lights'); });
      c.part(el('pc-siren'), () => { Sfx.yelp(); flashFor(car, 2000); A.say('police.siren'); });
      c.part(el('pc-radio'), () => { Sfx.crackle(); A.say('police.radio'); }, { radio: () => policeRadio(c) });
      c.part(car, async () => { Sfx.tap(); c.learn('patrol'); });
      c.part(el('priya'), () => { A.say('police.officer'); wave(el('priya-arm')); });
      c.part(el('leo'), () => { A.say('police.leo'); wave(el('leo-arm')); }, { leo: () => policeLeo(c) });
      c.part(el('bigwheel'), () => { Sfx.tune(); A.say('police.wheel'); });
      c.part(el('carousel'), () => {
        Sfx.tune(); A.say('police.carousel');
        const horses = [...el('carousel').querySelectorAll('.horse')];
        A.tween(1800, (p, raw) => horses.forEach((h, i) => h.setAttribute('transform', `translate(0 ${Math.sin(raw * Math.PI * 6 + i) * 10})`)), q => q);
      });
      Object.keys(SPOTS).forEach(k => c.part(el('spot-' + k), () => { Sfx.tap(); A.say(SPOTS[k].line); }, { search: () => policeSearch(c, k) }));
    },
    async mission(c) {
      const { el, alive } = c;
      c.st.busy = true;
      show(el('leo-tear'));
      c.teddyAt = Object.keys(SPOTS)[Math.floor(Math.random() * 3)];
      c.searched = [];
      await A.say('police.m.call');
      if (!alive()) return;
      c.st.busy = false;
      c.step('radio', [el('pc-radio')], 'police.m.radio');
    }
  });

  async function policeRadio(c) {
    const { el, alive } = c;
    c.endStep();
    Sfx.crackle(); Sfx.beep(2);
    await A.sayText('Calling all officers. Please look out for a brown teddy bear. Over!');
    await c.learn('radio');
    if (!alive()) return;
    c.step('search', Object.keys(SPOTS).map(k => el('spot-' + k)), 'police.m.search');
  }
  async function policeSearch(c, k) {
    const { el, alive } = c, s = SPOTS[k];
    if (c.searched.includes(k)) return;
    c.searched.push(k);
    const spot = el('spot-' + k);
    spot.classList.remove('target', 'hint');
    A.Hint.targets = A.Hint.targets.filter(t => t !== spot);
    if (k === c.teddyAt) {
      c.endStep();
      const t = el('teddy');
      show(t);
      await moveTo(t, s.from, s.at, 600);
      Sfx.chime(); Sfx.sparkle();
      await A.say('police.m.found');
      if (!alive()) return;
      c.step('leo', [el('leo')], 'police.m.leo');
    } else {
      const r = el('reveal-' + k);
      show(r);
      Sfx.boing();
      await moveTo(r, s.from, s.at, 500);
      A.say('police.m.notHere');
    }
  }
  async function policeLeo(c) {
    const { el, alive } = c;
    c.endStep();
    const t = el('teddy'), from = SPOTS[c.teddyAt].at;
    await moveTo(t, from, { x: 840, y: 744 }, 900, 120);
    show(el('leo-tear'), false);
    Sfx.chime(); A.confetti();
    const leo = el('leo');
    A.tween(900, (p, raw) => leo.setAttribute('transform', `translate(800 ${800 - Math.abs(Math.sin(raw * Math.PI * 3)) * 30})`));
    await A.say('police.m.saved');
    if (!alive()) return;
    c.finish();
  }

  // =====================================================================
  // Air ambulance — hillside to hospital
  // =====================================================================
  const ROOF = { x: 380, y: 432 }, FIELD = { x: 1010, y: 640 }, CRUISE = 380;

  A.screens.airamb = run({
    id: 'airamb',
    svg: () => sceneSvg('Hills and hospital', `
      ${Art.sun(900, 270)}
      <g class="clouds">${Art.cloud(560, 80, .8)}${Art.cloud(1200, 120, 1)}</g>
      <path d="M0 640 Q300 560 600 620 T1200 560 T1600 600 V900 H0 Z" fill="#9fd88d"/>
      <g id="hills" class="tappable"><path d="M640 900 Q880 590 1180 600 Q1460 610 1600 720 V900 Z" fill="#6fbe63" ${S3}/></g>
      <g id="landing" opacity="0"><ellipse cx="${FIELD.x}" cy="${FIELD.y}" rx="110" ry="22" fill="none" stroke="#ffd21f" stroke-width="8" stroke-dasharray="20 14"/><rect x="${FIELD.x - 120}" y="${FIELD.y - 60}" width="240" height="90" fill="transparent"/></g>
      <g id="jim" class="tappable" transform="translate(1250 604)">
        <g id="jim-stand">${person({ id: 'jimS', suit: '#2e9e4f', band: '#2e9e4f', hat: 'hair', hair: '#c7cfdb', skin: '#f1c27d' })}</g>
        <g id="jim-sitwrap" opacity="0">${sitter({ id: 'jim', top: '#2e9e4f', legs: '#8a5a3c', skin: '#f1c27d', hair: '#c7cfdb' })}</g>
      </g>
      <g id="hospital" class="tappable">
        <rect x="190" y="440" width="380" height="420" fill="#f4f6fa" ${S}/>
        ${[0, 1, 2, 3].map(r => [0, 1, 2, 3].map(col => `<rect x="${222 + col * 88}" y="${500 + r * 70}" width="54" height="40" rx="4" fill="#bfe6ff" ${S3}/>`).join('')).join('')}
        <rect x="330" y="780" width="100" height="80" fill="#9fb1c7" ${S3}/>
        <g transform="translate(380 470)"><rect x="-70" y="-18" width="140" height="36" rx="8" fill="#e53935" ${S3}/><path d="M-50 0 H-30 M-40 -10 V10" stroke="#fff" stroke-width="6"/><text x="12" y="8" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="20" fill="#fff">HOSPITAL</text></g>
      </g>
      <g id="roofpad" class="tappable"><ellipse cx="${ROOF.x}" cy="${ROOF.y + 2}" rx="130" ry="16" fill="#5a606b" ${S3}/><text x="${ROOF.x}" y="${ROOF.y + 9}" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="20" fill="#ffd84a">H</text><rect x="${ROOF.x - 140}" y="${ROOF.y - 30}" width="280" height="56" fill="transparent"/></g>
      <g id="windsock" class="tappable">
        <path d="M545 440 V350" stroke="${OL}" stroke-width="6"/>
        <g class="sock"><path d="M548 352 L610 360 L610 380 L548 384 Z" fill="#f07a1a" ${S3}/><path d="M568 354 V382 M590 358 V380" stroke="#fff" stroke-width="7"/></g>
        <rect x="530" y="340" width="90" height="100" fill="transparent"/>
      </g>
      <path d="M0 860 H1600 V900 H0 Z" fill="#5a606b"/>
      <g id="heli" transform="translate(${ROOF.x} ${ROOF.y})">${heliArt('#ffd21f', '#2e9e4f')}</g>
    `),
    setup(c) {
      const { el, alive } = c, heli = el('heli');
      c.pos = { x: ROOF.x, y: ROOF.y };
      c.setHeli = (x, y, t = 0) => { c.pos = { x, y }; heli.setAttribute('transform', `translate(${x} ${y}) rotate(${t})`); };
      c.fly = (x, y, ms = 1600) => {
        const from = { ...c.pos }, dir = x > from.x ? 8 : x < from.x ? -8 : 0;
        return A.tween(ms, (p, raw) => c.setHeli(from.x + (x - from.x) * p, from.y + (y - from.y) * p, dir * Math.sin(raw * Math.PI)));
      };
      c.rotor = on => {
        heli.classList.toggle('spinning', on);
        clearInterval(c.chopper);
        if (on) { Sfx.chop(); c.chopper = A.every(() => Sfx.chop(), 1050); }
      };
      el('hl-shadow').setAttribute('opacity', 0);
      c.setHeli(1700, CRUISE); c.rotor(true);
      c.fly(ROOF.x, CRUISE, 2000).then(() => c.fly(ROOF.x, ROOF.y, 900)).then(() => {
        if (!alive()) return;
        A.later(() => c.rotor(false), 500);
        c.ready('airamb.arrive', [el('hl-rotor'), el('hl-pilot'), el('roofpad')]);
      });
      c.part(el('hl-rotor'), () => { c.rotor(true); A.say('airamb.rotor'); A.later(() => c.rotor(false), 2600); }, { rotor: () => airTakeOff(c) });
      c.part(el('hl-pilot'), () => A.say('airamb.pilot'));
      c.part(el('hl-door'), () => c.busy(async () => {
        const d = el('hl-doorpanel');
        A.say('airamb.door');
        await A.tween(400, p => d.setAttribute('transform', `translate(${-40 * p} 0)`));
        await A.wait(2200);
        await A.tween(400, p => d.setAttribute('transform', `translate(${-40 * (1 - p)} 0)`));
      }));
      c.part(el('hospital'), () => { Sfx.tap(); A.say('airamb.hospital'); });
      c.part(el('roofpad'), async () => { Sfx.pop(); await A.say('airamb.hospital'); c.learn('helipad'); }, { back: () => airBack(c) });
      c.part(el('windsock'), () => {
        Sfx.whoosh(); A.say('airamb.windsock');
        const s = el('windsock').querySelector('.sock');
        A.tween(1500, (p, raw) => s.setAttribute('transform', `rotate(${Math.sin(raw * Math.PI * 5) * 12} 548 368)`));
      });
      c.part(el('hills'), () => { Sfx.whoosh(); A.say('airamb.hills'); }, { land: () => airLand(c) });
      c.part(el('landing'), null, { land: () => airLand(c) });
      c.part(el('jim'), () => { A.say('airamb.hills'); wave(el('jimS-arm')); }, { jim: () => airJim(c) });
    },
    async mission(c) {
      const { el, alive } = c;
      c.st.busy = true;
      Sfx.boing();
      show(el('jim-stand'), false); show(el('jim-sitwrap'));
      await A.say('airamb.m.call');
      if (!alive()) return;
      c.st.busy = false;
      c.step('rotor', [el('hl-rotor')], 'airamb.m.rotor');
    }
  });

  async function airTakeOff(c) {
    const { el, alive } = c;
    c.endStep();
    c.rotor(true);
    await A.wait(500);
    await c.fly(ROOF.x, CRUISE, 1000);
    if (!alive()) return;
    show(el('landing'));
    c.step('land', [el('landing')], 'airamb.m.land');
  }
  async function airLand(c) {
    const { el, alive } = c;
    c.endStep();
    show(el('landing'), false);
    await c.fly(FIELD.x, CRUISE, 1800);
    await c.fly(FIELD.x, FIELD.y, 1100);
    if (!alive()) return;
    c.step('jim', [el('jim')], 'airamb.m.jim');
  }
  async function airJim(c) {
    const { el, alive } = c;
    c.endStep();
    const d = el('hl-doorpanel');
    await A.tween(400, p => d.setAttribute('transform', `translate(${-40 * p} 0)`));
    cheerUp(c, 'jim');
    Sfx.pop();
    await A.tween(600, p => el('jim').setAttribute('opacity', 1 - p));
    await A.tween(400, p => d.setAttribute('transform', `translate(${-40 * (1 - p)} 0)`));
    await c.learn('medevac');
    if (!alive()) return;
    c.step('back', [el('roofpad')], 'airamb.m.back');
  }
  async function airBack(c) {
    const { el, alive } = c;
    c.endStep();
    await c.fly(FIELD.x, CRUISE, 900);
    await c.fly(ROOF.x, CRUISE, 1800);
    await c.fly(ROOF.x, ROOF.y, 900);
    if (!alive()) return;
    A.later(() => c.rotor(false), 400);
    const jim = el('jim');
    show(el('jim-sitwrap'), false); show(el('jim-stand'));
    jim.setAttribute('transform', 'translate(470 860)');
    await fadeIn(jim, 400);
    wave(el('jimS-arm'));
    Sfx.chime(); A.confetti();
    await A.say('airamb.m.saved');
    if (!alive()) return;
    c.finish();
  }

  // =====================================================================
  // Lifeboat — slipway and sea
  // =====================================================================
  const lifeboatArt = () => `
    <g class="lifeboat-art">
      <path d="M0 -70 H470 L444 26 Q434 40 412 40 H58 Q30 40 20 20 Z" fill="#1b3f8f" ${S}/>
      <rect x="2" y="-72" width="466" height="12" fill="#f07a1a" ${S3}/>
      <text x="270" y="-18" text-anchor="middle" font-family="Fredoka, sans-serif" font-weight="700" font-size="24" fill="#fff" letter-spacing="3">LIFEBOAT</text>
      <path d="M10 -72 V-98 H120 M34 -72 V-98 M60 -72 V-98 M90 -72 V-98" fill="none" stroke="${OL}" stroke-width="4"/>
      <g id="lb-jackets" class="tappable">
        <rect x="40" y="-104" width="64" height="32" rx="5" fill="#ffd21f" ${S3}/>
        <path d="M60 -96 L66 -80 H78 L84 -96" fill="#f07a1a" ${S3}/>
        <rect x="30" y="-116" width="84" height="56" fill="transparent"/>
      </g>
      <path d="M130 -70 V-160 Q132 -176 150 -176 H320 Q352 -172 372 -130 L386 -70 Z" fill="#f07a1a" ${S}/>
      ${[150, 206, 262].map(x => `<rect x="${x}" y="-160" width="46" height="32" rx="5" fill="#bfe6ff" ${S3}/>`).join('')}
      <path d="M318 -164 H330 Q352 -158 364 -130 H318 Z" fill="#bfe6ff" ${S3}/>
      <g id="lb-crew" class="tappable">
        <circle cx="338" cy="-142" r="12" fill="#c68a62" ${S3}/><path d="M325 -146 Q338 -164 351 -146 Z" fill="#ffd21f" ${S3}/>
        <rect x="312" y="-172" width="62" height="50" fill="transparent"/>
      </g>
      <g id="lb-saved" opacity="0">
        ${[408, 444].map(x => `<rect x="${x - 13}" y="-104" width="26" height="30" rx="8" fill="#f07a1a" ${S3}/><circle cx="${x}" cy="-114" r="12" fill="#f1c27d" ${S3}/>`).join('')}
      </g>
      <rect x="236" y="-250" width="10" height="76" fill="#d8dee8" ${S3}/>
      <g id="lb-radar" class="tappable">
        <rect x="236" y="-226" width="10" height="10" fill="${OL}"/>
        <g class="radar-bar"><rect x="196" y="-236" width="90" height="10" rx="4" fill="#3a4157"/></g>
        <rect x="186" y="-246" width="110" height="34" fill="transparent"/>
      </g>
      <g id="lb-light" class="tappable">
        <ellipse class="beacon" cx="241" cy="-258" rx="12" ry="10" fill="#3b82f6" ${S3}/>
        <rect x="222" y="-276" width="40" height="34" fill="transparent"/>
      </g>
      <g id="lb-horn" class="tappable">
        <path d="M150 -176 V-190 H162 L182 -200 V-176 L162 -182 Z" fill="#d8dee8" ${S3}/>
        <rect x="140" y="-210" width="54" height="36" fill="transparent"/>
      </g>
    </g>`;

  const RAMP = { x0: 170, y0: 560, x1: 600, y1: 790 };
  const rampAngle = Math.atan2(RAMP.y1 - RAMP.y0, RAMP.x1 - RAMP.x0) * 180 / Math.PI;
  const SEA = 772;

  A.screens.lifeboat = run({
    id: 'lifeboat',
    svg: () => sceneSvg('The harbour', `
      ${Art.sun(1290, 250)}
      <g class="clouds">${Art.cloud(560, 80, .8)}${Art.cloud(1000, 120, 1)}</g>
      <rect x="0" y="600" width="1600" height="300" fill="url(#water)"/>
      <path class="waves" d="M300 660 q25 -12 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0" fill="none" stroke="#bfe6ff" stroke-width="5" opacity=".7"/>
      <path d="M0 420 H300 Q360 440 400 560 L520 900 H0 Z" fill="#b89b6e" ${S}/>
      <path d="M0 420 H300 Q330 424 350 440 H0 Z" fill="#7cbf68"/>
      <g transform="translate(60 300)"><rect x="0" y="40" width="220" height="140" fill="#f4f6fa" ${S}/><path d="M-14 46 L110 -10 L234 46 Z" fill="#e53935" ${S}/><rect x="120" y="80" width="90" height="100" fill="#3a4157" ${S3}/></g>
      <path d="M${RAMP.x0} ${RAMP.y0 + 6} L${RAMP.x1 + 120} ${RAMP.y1 + 66}" stroke="#7f93ad" stroke-width="26" stroke-linecap="round"/>
      <path d="M${RAMP.x0} ${RAMP.y0 + 6} L${RAMP.x1 + 120} ${RAMP.y1 + 66}" stroke="#596178" stroke-width="4" stroke-dasharray="20 20"/>
      <g id="gull" class="tappable" transform="translate(900 360)">
        <path class="wing" d="M-40 0 Q-20 -24 0 0 Q20 -24 40 0" fill="none" stroke="${OL}" stroke-width="6" stroke-linecap="round"/>
        <rect x="-50" y="-30" width="100" height="40" fill="transparent"/>
      </g>
      <g id="dinghy-up" transform="translate(1250 ${SEA})">
        <path d="M-80 -20 H80 L60 10 H-60 Z" fill="#fff" ${S3}/><path d="M0 -20 V-170" stroke="${OL}" stroke-width="5"/><path d="M4 -166 L70 -34 H4 Z" fill="#ffd21f" ${S3}/>
        <circle cx="-30" cy="-36" r="12" fill="#f1c27d" ${S3}/><circle cx="-56" cy="-34" r="12" fill="#8d5524" ${S3}/>
      </g>
      <g id="dinghy-down" opacity="0" transform="translate(1250 ${SEA})">
        <path d="M-80 -6 Q0 -40 80 -6 Z" fill="#fff" ${S3}/>
        <g id="sailor1" class="tappable"><circle cx="-96" cy="-14" r="14" fill="#f1c27d" ${S3}/><path d="M-110 -2 Q-96 -26 -80 -12" stroke="#f1c27d" stroke-width="8" fill="none" stroke-linecap="round"/>
          <g id="sj1" opacity="0"><path d="M-112 0 H-80 V12 H-112 Z" fill="#f07a1a" ${S3}/></g><rect x="-130" y="-40" width="60" height="60" fill="transparent"/></g>
        <g id="sailor2" class="tappable"><circle cx="98" cy="-14" r="14" fill="#8d5524" ${S3}/><path d="M112 -2 Q98 -26 82 -12" stroke="#8d5524" stroke-width="8" fill="none" stroke-linecap="round"/>
          <g id="sj2" opacity="0"><path d="M82 0 H114 V12 H82 Z" fill="#f07a1a" ${S3}/></g><rect x="70" y="-40" width="60" height="60" fill="transparent"/></g>
      </g>
      <g id="lb" class="tappable"><g class="bob-wrap">${lifeboatArt()}</g></g>
      <g id="jacket-fly" opacity="0"><path d="M-16 -16 L-6 -16 L0 -6 L6 -16 L16 -16 L16 16 L-16 16 Z" fill="#f07a1a" ${S3}/></g>
      <rect x="0" y="${SEA + 2}" width="1600" height="${900 - SEA}" fill="#2c86cf" opacity=".85" pointer-events="none"/>
      <path class="waves" d="M0 ${SEA + 4} q25 -10 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0" fill="none" stroke="#bfe6ff" stroke-width="5" pointer-events="none"/>
      <g id="splash"></g>
    `),
    setup(c) {
      const { el, alive } = c, lb = el('lb');
      // On the slipway (t from 0 to 1), then afloat.
      c.onRamp = t => {
        const x = RAMP.x0 + (RAMP.x1 - RAMP.x0) * t, y = RAMP.y0 + (RAMP.y1 - RAMP.y0) * t;
        lb.setAttribute('transform', `translate(${x} ${y}) rotate(${rampAngle}) translate(0 -40)`);
      };
      c.afloat = (x, tilt = 0) => { c.bx = x; lb.setAttribute('transform', `translate(${x} ${SEA}) rotate(${tilt})`); };
      c.onRamp(0);
      c.part(el('lb-horn'), () => { Sfx.foghorn(); A.say('lifeboat.horn'); });
      c.part(el('lb-light'), () => { Sfx.chime(); flashFor(lb, 3000); A.say('lifeboat.light'); });
      c.part(el('lb-radar'), () => {
        Sfx.beep(3); A.say('lifeboat.radar');
        const bar = el('lb-radar').querySelector('.radar-bar');
        bar.classList.add('spinning-radar'); A.later(() => bar.classList.remove('spinning-radar'), 2500);
      });
      c.part(el('lb-crew'), async () => { await A.say('lifeboat.crew'); c.learn('lifeboat'); });
      c.part(el('lb-jackets'), async () => { Sfx.pop(); await A.say('lifeboat.jackets'); c.learn('lifejacket'); });
      c.part(el('gull'), () => {
        Sfx.meow(); A.say('lifeboat.gull');
        const g = el('gull');
        A.tween(1600, (p, raw) => g.setAttribute('transform', `translate(${900 + p * 120} ${360 - Math.sin(raw * Math.PI) * 40}) scale(1 ${0.6 + Math.abs(Math.sin(raw * Math.PI * 6)) * 0.4})`));
      });
      c.part(lb, null, { launch: () => boatLaunch(c), pull: () => boatPull(c) });
      ['sailor1', 'sailor2'].forEach((s, i) => c.part(el(s), null, { jackets: () => boatJacket(c, i + 1) }));
      c.ready('lifeboat.arrive', [el('lb-horn'), el('lb-crew'), el('lb-radar')]);
    },
    async mission(c) {
      const { el, alive } = c;
      c.st.busy = true;
      Sfx.splash();
      await A.tween(700, p => el('dinghy-up').setAttribute('opacity', 1 - p));
      await fadeIn(el('dinghy-down'), 400);
      await A.say('lifeboat.m.call');
      await c.learn('lifeboat');
      if (!alive()) return;
      c.st.busy = false;
      c.step('launch', [el('lb')], 'lifeboat.m.launch');
    }
  });

  async function boatLaunch(c) {
    const { el, alive } = c, lb = el('lb');
    c.endStep();
    flashFor(lb, 4000); Sfx.foghorn();
    await A.tween(1400, p => c.onRamp(p), p => p * p);
    // splash down and level out
    Sfx.splash(); splashAt(c, RAMP.x1 + 200, SEA);
    const startTilt = rampAngle;
    await A.tween(600, p => c.afloat(RAMP.x1 - 40 + p * 40, startTilt * (1 - p)));
    lb.querySelector('.bob-wrap').classList.add('bob');
    c.jackets = 0;
    if (!alive()) return;
    c.step('jackets', [el('sailor1'), el('sailor2')], 'lifeboat.m.jackets');
  }
  async function boatJacket(c, n) {
    const { el, alive } = c, sj = el('sj' + n), sailor = el('sailor' + n);
    if (+sj.getAttribute('opacity') === 1 || c.throwing) return;
    c.throwing = true;
    sailor.classList.remove('target', 'hint');
    const fly = el('jacket-fly'), from = { x: c.bx + 72, y: SEA - 100 }, to = { x: n === 1 ? 1154 : 1348, y: SEA - 6 };
    show(fly); Sfx.whoosh();
    await moveTo(fly, from, to, 800, 160);
    show(fly, false); show(sj); Sfx.splash();
    c.throwing = false;
    c.jackets++;
    if (c.jackets === 1) { await c.learn('lifejacket'); }
    if (!alive()) return;
    if (c.jackets === 2) {
      c.endStep();
      c.step('pull', [el('lb')], 'lifeboat.m.pull');
    }
  }
  async function boatPull(c) {
    const { el, alive } = c;
    c.endStep();
    Sfx.engine(2); Sfx.whoosh();
    const x0 = c.bx;
    await A.tween(2000, p => c.afloat(x0 + (690 - x0) * p));
    await A.tween(500, p => { el('sailor1').setAttribute('opacity', 1 - p); el('sailor2').setAttribute('opacity', 1 - p); });
    await fadeIn(el('lb-saved'), 400);
    if (!alive()) return;
    Sfx.foghorn(); Sfx.chime(); A.confetti();
    await A.say('lifeboat.m.saved');
    if (!alive()) return;
    c.finish();
  }

  Object.assign(window.Kit.art, { ambulance: ambArt, police: policeArt, airamb: () => heliArt('#ffd21f', '#2e9e4f'), lifeboat: lifeboatArt, fire: () => Art.fireEngine() });
  window.Kit.sitter = sitter;
  window.Kit.teddyArt = teddyArt;
})();
