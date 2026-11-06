// The five dinosaurs for Dino Dig and the Dino Hall: Brachiosaurus (the museum's own skeleton, from MuseumArt), T. rex,
// Triceratops, Stegosaurus and Velociraptor. Each has a skeleton in six parts (so Dino Dig can bury them) and a living,
// coloured version drawn in the same place, for the moment the skeleton comes to life. All face left and stand with
// their feet on 0,0, inside about x -330 to 350 and y -420 to 0, so they share one board. The Velociraptor has feathers.
(function () {
  const { OL, S, S3 } = Art;
  const MA = window.MuseumArt;
  const BONE = '#f4ead2', BONED = '#d8c9a3';
  const SW = (w, c = OL) => `stroke="${c}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const bone = (x1, y1, x2, y2, w, c) => MA.bone(x1, y1, x2, y2, w, c);
  const vertebrae = (pts, r0, r1, c) => pts.map(([x, y], i) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${(r0 + (r1 - r0) * i / Math.max(1, pts.length - 1)).toFixed(1)}" fill="${c}" ${S3}/>`).join('');
  const along = (x1, y1, cx, cy, x2, y2, n) => Array.from({ length: n }, (_, i) => { const t = i / (n - 1), u = 1 - t;
    return [u * u * x1 + 2 * u * t * cx + t * t * x2, u * u * y1 + 2 * u * t * cy + t * t * y2]; });
  // Ribs hanging from points on the spine, bending outwards from the middle.
  const ribs = (pts, len, c, mid = 0) => pts.map(([x, y]) => { const d = `M${x.toFixed(1)} ${y.toFixed(1)} Q${(x + (x < mid ? -12 : 12)).toFixed(1)} ${(y + len * .55).toFixed(1)} ${x.toFixed(1)} ${(y + len).toFixed(1)}`;
    return `<path d="${d}" fill="none" stroke="${OL}" stroke-width="15" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="8" stroke-linecap="round"/>`; }).join('');
  const foot = (x, y, w, c) => `<path d="M${x - w} ${y} Q${x} ${y - w * .7} ${x + w} ${y} Z" fill="${c}" ${S3}/>`;
  const claw = (x, y, dx, dy, c = BONE) => `<path d="M${x} ${y} Q${x + dx * .7} ${y + dy * .2} ${x + dx} ${y + dy} Q${x + dx * .2} ${y + dy * .6} ${x} ${y + 6} Z" fill="${c}" ${S3}/>`;
  // A thick round limb along a path, outlined.
  const limb = (d, w, c) => `<path d="${d}" fill="none" stroke="${OL}" stroke-width="${w + 8}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const eye = (x, y, r = 7) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${S3}/><circle cx="${x - r * .25}" cy="${y}" r="${r * .55}" fill="${OL}"/><circle cx="${x - r * .4}" cy="${y - r * .25}" r="${r * .2}" fill="#fff"/>`;
  const cheek = (x, y, r = 8) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#ff8fa3" opacity=".5"/>`;
  const smileAt = (x1, y1, cx, cy, x2, y2) => `<path d="M${x1} ${y1} Q${cx} ${cy} ${x2} ${y2}" fill="none" ${SW(4)}/>`;
  const spots = (pts, c) => pts.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" opacity=".55"/>`).join('');
  const stand = (x0 = -300, x1 = 320, posts = []) => `<rect x="${x0}" y="-6" width="${x1 - x0}" height="16" rx="5" fill="#d9d2c3" ${S3}/>
    ${posts.map(([x, top]) => `<path d="M${x} ${top} V-6" stroke="#9aa3b5" stroke-width="6"/>`).join('')}`;

  // ---------- T. rex: a huge head with big teeth, two strong legs, tiny arms ----------
  const TREX = {
    tail:  { at: [200, -184], name: 'tail', art: c => vertebrae(along(-84, -22, 20, -14, 124, 44, 9), 14, 6, c) },
    legs:  { at: [64, -94], name: 'legs', art: c => `<g>
      <g>${bone(40, -66, 56, -4, 17, c)}${bone(56, -4, 46, 62, 14, c)}${foot(46, 82, 26, c)}</g>
      <ellipse cx="14" cy="-76" rx="54" ry="22" fill="${c}" ${S}/>
      ${bone(4, -70, -12, -6, 22, c)}${bone(-12, -6, 6, 64, 18, c)}${foot(2, 88, 32, c)}
      ${claw(-26, 82, -16, 6, c)}</g>` },
    body:  { at: [-24, -206], name: 'back and ribs', art: c => { const sp = along(-112, 14, 0, -30, 112, 8, 10);
      return `<g>${ribs(sp.slice(1, 7), 66, c, -40)}${vertebrae(sp, 14, 14, c)}</g>`; } },
    arm:   { at: [-98, -160], name: 'tiny arm', art: c => `<g>${bone(4, -12, -10, 10, 10, c)}${bone(-10, 10, -26, 8, 8, c)}${claw(-30, 6, -10, 10, c)}${claw(-30, 2, -14, 0, c)}</g>` },
    neck:  { at: [-152, -224], name: 'neck', art: c => vertebrae(along(30, 10, 2, -6, -28, -16, 4), 14, 13, c) },
    head:  { at: [-236, -252], name: 'head', art: c => `<g>
      <path d="M-58 22 Q0 38 50 22 L46 38 Q0 58 -50 36 Z" fill="${c}" ${S}/>
      <path d="M-64 -8 Q-66 -44 -22 -48 Q28 -52 54 -28 Q70 -6 58 20 Q0 30 -54 24 Q-66 18 -64 -8 Z" fill="${c}" ${S}/>
      ${[-48, -32, -16, 0, 16, 32].map(x => `<path d="M${x - 5} 22 L${x} 34 L${x + 5} 22 Z" fill="#fff" ${S3}/>`).join('')}
      <ellipse cx="20" cy="-18" rx="14" ry="13" fill="${BONED}" ${S3}/><circle cx="18" cy="-18" r="5" fill="${OL}"/>
      <ellipse cx="-14" cy="-8" rx="12" ry="9" fill="${BONED}" ${S3}/><circle cx="-50" cy="-14" r="4" fill="${OL}"/></g>` }
  };
  const trexLive = c => {
    const C = '#4caf6a', D = '#2f8a4c', B = '#bfe8a8';
    return `<g>
      <path d="M90 -232 Q230 -226 336 -136 Q220 -160 80 -166 Z" fill="${C}" ${S}/>
      ${limb('M104 -150 L114 -60 L104 -14', 30, D)}<ellipse cx="102" cy="-10" rx="30" ry="10" fill="${D}" ${S3}/>
      <ellipse cx="-14" cy="-200" rx="132" ry="62" fill="${C}" ${S}/><ellipse cx="-34" cy="-170" rx="84" ry="28" fill="${B}"/>
      ${[[-60, -246, 14], [0, -252, 12], [60, -244, 11], [140, -214, 9]].map(([x, y, r]) => `<path d="M${x - r} ${y + 6} L${x} ${y - r} L${x + r} ${y + 6} Z" fill="${D}"/>`).join('')}
      <ellipse cx="66" cy="-158" rx="48" ry="58" fill="${C}" ${S}/>${limb('M70 -120 L58 -50 L68 -14', 34, C)}<ellipse cx="62" cy="-10" rx="38" ry="12" fill="${C}" ${S3}/>
      ${limb('M-100 -176 L-118 -150 L-130 -152', 12, C)}
      ${limb('M-110 -214 L-180 -236', 66, C)}
      <path d="M-306 -246 Q-306 -292 -250 -296 Q-180 -300 -164 -264 Q-156 -232 -176 -214 Q-240 -204 -296 -216 Q-310 -224 -306 -246 Z" fill="${C}" ${S}/>
      <path d="M-298 -228 Q-240 -216 -180 -222" fill="none" ${SW(4)}/>${[-286, -268, -250, -232].map(x => `<path d="M${x - 5} -226 L${x} -216 L${x + 5} -225 Z" fill="#fff" ${S3}/>`).join('')}
      ${eye(-214, -268, 10)}${cheek(-190, -236)}<circle cx="-292" cy="-262" r="3.5" fill="${OL}"/></g>`;
  };

  // ---------- Triceratops: three horns and a big bony frill, four strong legs ----------
  const TRIKE = {
    tail:  { at: [204, -142], name: 'tail', art: c => vertebrae(along(-74, -22, 20, -10, 108, 42, 8), 14, 6, c) },
    back:  { at: [110, -86], name: 'back leg', art: c => `<g>${bone(0, -64, 12, -4, 22, c)}${bone(12, -4, 4, 56, 18, c)}${foot(6, 80, 26, c)}</g>` },
    body:  { at: [18, -176], name: 'back and ribs', art: c => { const sp = along(-124, 12, 0, -32, 124, 8, 11);
      return `<g>${ribs(sp.slice(1, 9), 62, c)}${vertebrae(sp, 15, 15, c)}</g>`; } },
    front: { at: [-92, -76], name: 'front leg', art: c => `<g>${bone(0, -56, -8, 0, 19, c)}${bone(-8, 0, 0, 50, 16, c)}${foot(-2, 70, 26, c)}</g>` },
    frill: { at: [-150, -196], name: 'frill', art: c => `<g>
      <path d="M-30 62 Q-84 0 -40 -66 Q0 -104 48 -64 Q88 -10 34 62 Z" fill="${c}" ${S}/>
      ${along(-40, 50, -84, -60, 6, -84, 5).concat(along(6, -84, 80, -60, 40, 50, 5).slice(1)).map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9" fill="${c}" ${S3}/>`).join('')}
      <ellipse cx="-14" cy="-22" rx="12" ry="18" fill="${BONED}" ${S3}/><ellipse cx="22" cy="-22" rx="12" ry="18" fill="${BONED}" ${S3}/></g>` },
    head:  { at: [-222, -156], name: 'horned head', art: c => `<g>
      <path d="M-4 -36 L-40 -104 L14 -42 Z" fill="${c}" ${S3}/><path d="M22 -36 L0 -100 L40 -38 Z" fill="${c}" ${S3}/>
      <path d="M-58 -22 L-70 -58 L-40 -30 Z" fill="${c}" ${S3}/>
      <path d="M-74 10 Q-84 -12 -62 -26 L-10 -42 Q32 -46 48 -20 Q58 6 32 26 L-40 34 Q-68 30 -74 10 Z" fill="${c}" ${S}/>
      <ellipse cx="12" cy="-16" rx="12" ry="11" fill="${BONED}" ${S3}/><circle cx="10" cy="-16" r="4.5" fill="${OL}"/>
      <path d="M-74 10 L-56 20 L-40 34" fill="none" ${SW(3)}/><path d="M-30 16 Q0 26 30 14" fill="none" ${SW(3)}/></g>` }
  };
  const trikeLive = () => {
    const C = '#f0a040', D = '#cf7d22', B = '#ffe0a8', F = '#e86a7a', H = '#fff6e0';
    return `<g>
      <path d="M150 -180 Q260 -170 318 -100 Q250 -112 150 -128 Z" fill="${C}" ${S}/>
      ${limb('M130 -120 L128 -14', 40, D)}${limb('M-60 -110 L-66 -14', 34, D)}
      <ellipse cx="18" cy="-152" rx="156" ry="74" fill="${C}" ${S}/><ellipse cx="0" cy="-114" rx="110" ry="26" fill="${B}"/>
      ${spots([[40, -190, 14], [90, -170, 10], [-10, -200, 11], [-50, -176, 8], [120, -200, 8]], D)}
      ${limb('M100 -130 L108 -12', 44, C)}${limb('M-90 -120 L-96 -12', 38, C)}
      <path d="M-180 -134 Q-238 -196 -190 -262 Q-150 -300 -102 -260 Q-62 -206 -116 -134 Z" fill="${F}" ${S}/>
      ${along(-190, -146, -234, -256, -144, -280, 5).concat(along(-144, -280, -70, -256, -110, -146, 5).slice(1)).map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="10" fill="${F}" ${S3}/>`).join('')}
      <path d="M-180 -134 Q-238 -196 -190 -262 Q-150 -300 -102 -260 Q-62 -206 -116 -134 Z" fill="${F}"/>
      ${spots([[-160, -230, 12], [-130, -240, 12], [-146, -200, 9]], '#fff')}
      <path d="M-226 -192 L-262 -260 L-208 -198 Z" fill="${H}" ${S3}/><path d="M-200 -192 L-222 -256 L-182 -194 Z" fill="${H}" ${S3}/>
      <path d="M-280 -178 L-292 -214 L-262 -186 Z" fill="${H}" ${S3}/>
      <path d="M-298 -146 Q-308 -170 -284 -182 L-232 -198 Q-188 -202 -172 -176 Q-162 -150 -190 -130 L-262 -122 Q-290 -126 -298 -146 Z" fill="${C}" ${S}/>
      <path d="M-298 -146 L-282 -136 L-262 -122" fill="none" ${SW(4)}/>
      ${eye(-212, -170, 9)}${cheek(-194, -146)}${smileAt(-262, -142, -236, -128, -210, -140)}</g>`;
  };

  // ---------- Stegosaurus: big plates along its back and four spikes on its tail ----------
  const STEGO = {
    tail:  { at: [218, -148], name: 'spiky tail', art: c => `<g>
      ${[[64, -6, 40, -58], [80, 4, 82, -52], [96, 14, 124, -30], [104, 22, 142, 4]].map(([x, y, tx, ty]) => `<path d="M${x - 8} ${y} L${tx} ${ty} L${x + 8} ${y + 4} Z" fill="${c}" ${S3}/>`).join('')}
      ${vertebrae(along(-66, -30, 30, -12, 104, 22, 8), 14, 8, c)}</g>` },
    back:  { at: [112, -100], name: 'back leg', art: c => `<g>${bone(0, -84, 14, -6, 22, c)}${bone(14, -6, 4, 72, 18, c)}${foot(6, 94, 26, c)}</g>` },
    plates: { at: [8, -224], name: 'back plates', art: c => `<g>${along(-170, 62, -10, -66, 160, 36, 9).map(([x, y], i) => { const h = [34, 46, 58, 66, 70, 64, 54, 42, 30][i], w = h * .62;
      return `<path d="M${(x - w).toFixed(1)} ${(y + 10).toFixed(1)} Q${(x - w * .8).toFixed(1)} ${(y - h * .6).toFixed(1)} ${x.toFixed(1)} ${(y - h).toFixed(1)} Q${(x + w * .8).toFixed(1)} ${(y - h * .6).toFixed(1)} ${(x + w).toFixed(1)} ${(y + 10).toFixed(1)} Z" fill="${c}" ${S3}/>`; }).join('')}</g>` },
    body:  { at: [-4, -196], name: 'back and ribs', art: c => { const sp = along(-196, 70, -20, -76, 156, 40, 13);
      return `<g>${ribs(sp.slice(4, 11), 60, c, -20)}${vertebrae(sp, 13, 14, c)}</g>`; } },
    front: { at: [-104, -70], name: 'front leg', art: c => `<g>${bone(0, -52, -6, 0, 18, c)}${bone(-6, 0, 0, 44, 15, c)}${foot(-2, 64, 24, c)}</g>` },
    head:  { at: [-258, -112], name: 'head', art: c => `<g>
      <path d="M-40 6 Q-42 -18 -10 -22 Q26 -24 38 -4 Q40 14 18 18 L-28 18 Q-42 16 -40 6 Z" fill="${c}" ${S}/>
      <ellipse cx="10" cy="-6" rx="9" ry="8" fill="${BONED}" ${S3}/><circle cx="9" cy="-6" r="3.5" fill="${OL}"/><path d="M-36 8 Q-10 14 16 8" fill="none" ${SW(3)}/></g>` }
  };
  const stegoLive = () => {
    const C = '#9b7bd4', D = '#7656b4', B = '#e0d2f7', P = '#ff9a6a';
    return `<g>
      ${along(-162, -220, -2, -348, 168, -246, 9).map(([x, y], i) => { const h = [38, 50, 62, 72, 76, 70, 58, 46, 34][i], w = h * .62;
        return `<path d="M${(x - w).toFixed(1)} ${(y + 14).toFixed(1)} Q${(x - w * .8).toFixed(1)} ${(y - h * .6).toFixed(1)} ${x.toFixed(1)} ${(y - h).toFixed(1)} Q${(x + w * .8).toFixed(1)} ${(y - h * .6).toFixed(1)} ${(x + w).toFixed(1)} ${(y + 14).toFixed(1)} Z" fill="${P}" ${S3}/>`; }).join('')}
      ${[[280, -150, 262, -212], [298, -140, 312, -204], [314, -128, 352, -176], [322, -118, 364, -138]].map(([x, y, tx, ty]) => `<path d="M${x - 8} ${y} L${tx} ${ty} L${x + 8} ${y + 6} Z" fill="#fff6e0" ${S3}/>`).join('')}
      <path d="M130 -220 Q260 -200 334 -120 Q250 -130 130 -150 Z" fill="${C}" ${S}/>
      ${limb('M140 -150 L134 -14', 40, D)}${limb('M-80 -110 L-86 -14', 30, D)}
      <path d="M-200 -130 Q-120 -290 30 -282 Q160 -270 176 -170 Q150 -110 0 -112 Q-120 -108 -200 -110 Z" fill="${C}" ${S}/>
      <path d="M-150 -122 Q0 -150 150 -140 Q130 -116 0 -116 Q-100 -114 -150 -122 Z" fill="${B}"/>
      ${spots([[-20, -230, 13], [40, -240, 10], [90, -210, 12], [-70, -190, 9]], D)}
      ${limb('M110 -170 L118 -12', 44, C)}${limb('M-110 -120 L-114 -12', 32, C)}
      ${limb('M-196 -126 L-250 -112', 34, C)}
      <path d="M-306 -106 Q-308 -132 -276 -136 Q-238 -138 -226 -116 Q-224 -96 -246 -92 L-292 -92 Q-306 -94 -306 -106 Z" fill="${C}" ${S}/>
      ${eye(-258, -118, 8)}${cheek(-244, -100, 6)}${smileAt(-300, -102, -280, -92, -258, -100)}</g>`;
  };

  // ---------- Velociraptor: as big as a turkey, fast, with feathers and a big curved claw on each foot ----------
  // The skeleton is drawn big, to fill the board; the size picture shows how small it really was.
  const RAPTOR = {
    tail:  { at: [196, -204], name: 'tail', art: c => vertebrae(along(-112, 12, 20, -6, 140, -18, 12), 12, 5, c) },
    legs:  { at: [44, -98], name: 'legs', art: c => `<g>
      <g>${bone(30, -64, 44, -6, 15, c)}${bone(44, -6, 56, 50, 12, c)}${bone(56, 50, 44, 78, 10, c)}${foot(40, 92, 22, c)}</g>
      <ellipse cx="6" cy="-72" rx="44" ry="18" fill="${c}" ${S}/>
      ${bone(0, -66, -12, -8, 18, c)}${bone(-12, -8, 8, 52, 14, c)}${bone(8, 52, -6, 80, 11, c)}${foot(-8, 96, 24, c)}
      <path d="M-6 82 Q-28 62 -16 46 Q-14 64 2 76 Z" fill="${c}" ${S3}/></g>` },
    body:  { at: [-46, -194], name: 'back and ribs', art: c => { const sp = along(-92, 2, 0, -26, 100, 8, 9);
      return `<g>${ribs(sp.slice(1, 7), 52, c, -30)}${vertebrae(sp, 12, 12, c)}</g>`; } },
    arms:  { at: [-112, -150], name: 'arm', art: c => `<g>${bone(6, -18, -18, 12, 10, c)}${bone(-18, 12, -46, 22, 8, c)}${claw(-50, 18, -16, 16, c)}${claw(-50, 24, -10, 22, c)}${claw(-50, 14, -20, 6, c)}</g>` },
    neck:  { at: [-160, -222], name: 'neck', art: c => vertebrae(along(30, 28, -4, 8, -22, -16, 5), 11, 10, c) },
    head:  { at: [-234, -252], name: 'head', art: c => `<g>
      <path d="M-62 4 Q-64 -14 -32 -18 L30 -28 Q54 -26 56 -4 Q54 14 30 16 L-52 18 Q-64 16 -62 4 Z" fill="${c}" ${S}/>
      ${[-48, -36, -24, -12, 0].map(x => `<path d="M${x - 4} 16 L${x} 25 L${x + 4} 16 Z" fill="#fff" ${S3}/>`).join('')}
      <ellipse cx="28" cy="-6" rx="11" ry="10" fill="${BONED}" ${S3}/><circle cx="26" cy="-6" r="4" fill="${OL}"/>
      <ellipse cx="-12" cy="-2" rx="14" ry="7" fill="${BONED}" ${S3}/></g>` }
  };
  const feathers = (x, y, a0, a1, n, len, c) => Array.from({ length: n }, (_, i) => { const a = (a0 + (a1 - a0) * i / (n - 1)) * Math.PI / 180, tx = x + Math.cos(a) * len, ty = y + Math.sin(a) * len;
    return `<path d="M${x} ${y} Q${(x + tx) / 2 + Math.sin(a) * 10} ${(y + ty) / 2 - Math.cos(a) * 10} ${tx.toFixed(1)} ${ty.toFixed(1)} Q${(x + tx) / 2 - Math.sin(a) * 10} ${(y + ty) / 2 + Math.cos(a) * 10} ${x} ${y} Z" fill="${c}" ${S3}/>`; }).join('');
  const raptorLive = () => {
    const C = '#e2703a', D = '#b8502a', B = '#ffe0c0', F = '#3fa7d6', G = '#ffd166';
    return `<g>
      ${feathers(320, -224, -40, 40, 5, 60, F)}
      <path d="M50 -214 Q200 -230 330 -228 Q200 -194 50 -176 Z" fill="${C}" ${S}/>
      ${limb('M76 -160 L96 -100 L100 -46 L88 -14', 22, D)}<ellipse cx="82" cy="-8" rx="24" ry="8" fill="${D}" ${S3}/>
      <ellipse cx="-44" cy="-196" rx="104" ry="48" fill="${C}" ${S}/><ellipse cx="-60" cy="-172" rx="70" ry="20" fill="${B}"/>
      ${feathers(-20, -238, -150, -30, 6, 30, F)}
      <ellipse cx="40" cy="-166" rx="38" ry="46" fill="${C}" ${S}/>${limb('M36 -136 L32 -90 L52 -42 L38 -14', 26, C)}<ellipse cx="32" cy="-8" rx="28" ry="9" fill="${C}" ${S3}/>
      <path d="M24 -16 Q6 -40 16 -56 Q20 -36 34 -24 Z" fill="#fff6e0" ${S3}/>
      ${feathers(-150, -150, 60, 170, 6, 46, F)}${limb('M-110 -170 L-136 -146 L-160 -138', 16, C)}
      ${[-6, 4, 14].map(d => `<path d="M-160 ${-140 + d} l-12 ${8 + d * .3}" ${SW(4)}/>`).join('')}
      ${limb('M-120 -214 L-170 -236', 40, C)}${feathers(-176, -266, -150, -60, 5, 34, G)}
      <path d="M-300 -246 Q-300 -270 -268 -274 L-200 -282 Q-170 -280 -168 -256 Q-170 -234 -196 -232 L-288 -230 Q-300 -234 -300 -246 Z" fill="${C}" ${S}/>
      <path d="M-296 -240 Q-246 -236 -196 -240" fill="none" ${SW(4)}/>${[-284, -270, -256].map(x => `<path d="M${x - 4} -239 L${x} -231 L${x + 4} -238 Z" fill="#fff" ${S3}/>`).join('')}
      ${eye(-206, -260, 9)}${cheek(-186, -244, 6)}<circle cx="-290" cy="-256" r="3" fill="${OL}"/></g>`;
  };

  // ---------- The Brachiosaurus: the museum's own skeleton (MuseumArt.DINO), now with its living colours ----------
  const brachioLive = () => {
    const C = '#5fb3d9', D = '#3d8fb8', B = '#cdeefc';
    return `<g>
      <path d="M150 -220 Q300 -200 352 -60 Q280 -140 140 -150 Z" fill="${C}" ${S}/>
      ${limb('M120 -160 L124 -14', 44, D)}${limb('M-70 -170 L-74 -14', 44, D)}
      <path d="M-170 -170 Q-150 -270 0 -268 Q150 -266 170 -170 Q160 -110 0 -110 Q-160 -110 -170 -170 Z" fill="${C}" ${S}/>
      <path d="M-130 -126 Q0 -150 130 -130 Q110 -112 0 -112 Q-110 -112 -130 -126 Z" fill="${B}"/>
      ${spots([[-40, -230, 14], [30, -240, 11], [90, -214, 13], [-100, -206, 9], [10, -200, 8]], D)}
      ${limb('M96 -160 L100 -12', 46, C)}${limb('M-100 -170 L-102 -12', 46, C)}
      ${limb('M-130 -200 Q-210 -230 -246 -330', 50, C)}
      <path d="M-308 -340 Q-306 -378 -262 -380 Q-214 -380 -206 -346 Q-206 -318 -236 -316 L-292 -316 Q-310 -320 -308 -340 Z" fill="${C}" ${S}/>
      <path d="M-262 -380 Q-252 -398 -236 -380" fill="${C}" ${S3}/>
      ${eye(-252, -350, 9)}${cheek(-236, -330)}${smileAt(-302, -334, -280, -320, -258, -332)}<circle cx="-294" cy="-352" r="3" fill="${OL}"/></g>`;
  };

  // ---------- The five, in the order the picker shows them ----------
  // order: back to front. legs: where the stand's posts go. real: length and height in metres, for the size picture.
  const DINOS = {
    brachio: { name: 'Brachiosaurus', parts: MA.DINO, order: ['tail', 'back', 'body', 'front', 'neck', 'head'], posts: [[-94, -150], [96, -150], [0, -170]], live: brachioLive, colour: '#5fb3d9', real: [22, 12], span: [-310, 352] },
    trex:    { name: 'T. rex', parts: TREX, order: ['tail', 'legs', 'body', 'arm', 'neck', 'head'], posts: [[-24, -180]], live: trexLive, colour: '#4caf6a', real: [12, 4.5], span: [-306, 336] },
    trike:   { name: 'Triceratops', parts: TRIKE, order: ['tail', 'back', 'body', 'front', 'frill', 'head'], posts: [[18, -150]], live: trikeLive, colour: '#f0a040', real: [9, 3], span: [-308, 318] },
    stego:   { name: 'Stegosaurus', parts: STEGO, order: ['tail', 'back', 'plates', 'body', 'front', 'head'], posts: [[-4, -170]], live: stegoLive, colour: '#9b7bd4', real: [9, 4.2], span: [-308, 364] },
    raptor:  { name: 'Velociraptor', parts: RAPTOR, order: ['tail', 'legs', 'body', 'arms', 'neck', 'head'], posts: [[-46, -170]], live: raptorLive, colour: '#e2703a', real: [2, 0.8], span: [-300, 380] }
  };
  const IDS = ['trex', 'trike', 'stego', 'raptor', 'brachio'];
  const partIds = kind => DINOS[kind].order;
  const part = (kind, id, c = BONE) => { const p = DINOS[kind].parts[id]; return `<g transform="translate(${p.at[0]} ${p.at[1]})">${p.art(c)}</g>`; };
  const ghost = (kind, id) => { const p = DINOS[kind].parts[id];
    return `<g opacity=".55" transform="translate(${p.at[0]} ${p.at[1]})">${p.art('#c9b88f').replace(new RegExp(`stroke="${OL}"`, 'g'), 'stroke="#8a7a58" stroke-dasharray="6 6"')}</g>`; };
  // The whole skeleton on its stand; parts listed in `slots` are drawn by slot(id) instead (Dino Dig's empty places).
  const skeleton = (kind, c = BONE, slot = null) => { const d = DINOS[kind];
    return `<g>${stand(-300, 330, d.posts)}${d.order.map(id => slot && slot(id) != null ? slot(id) : part(kind, id, c)).join('')}</g>`; };
  // A dark shape of the dinosaur, for one not dug up yet.
  const shadow = kind => skeleton(kind, '#8a7a58').replace(/fill="#fff"/g, 'fill="#8a7a58"');
  const live = kind => DINOS[kind].live();

  window.DinoArt = { DINOS, IDS, BONE, partIds, part, ghost, skeleton, shadow, live };
})();
