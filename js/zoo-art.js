// Zoo artwork, drawn in the app's style (navy outline, flat colours). Every animal is a head-and-shoulders
// portrait in a 120 x 120 box centred on 0,0, so the same drawing works on a sticker, a game card, the
// ball run board (via ZooArt.image) and the story pages. mood: 'smile' (default), 'open' (hungry) or 'munch'.
(function () {
  const { OL, S, S3 } = Art;
  const eye = (x, y, r = 5.5) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${OL}"/><circle cx="${x + r * .35}" cy="${y - r * .38}" r="${r * .34}" fill="#fff"/>`;
  const eyes = (dx, y, r) => eye(-dx, y, r) + eye(dx, y, r);
  const cheeks = (dx, y, r = 6) => `<circle cx="${-dx}" cy="${y}" r="${r}" fill="#ff8fa3" opacity=".45"/><circle cx="${dx}" cy="${y}" r="${r}" fill="#ff8fa3" opacity=".45"/>`;
  const mouth = (y, w = 12, mood = 'smile', fill = '#c2185b') => mood === 'open'
    ? `<path d="M${-w} ${y - 2} Q0 ${y + w * 1.5} ${w} ${y - 2} Z" fill="${OL}"/><path d="M${-w * .5} ${y + w * .55} Q0 ${y + w * .2} ${w * .5} ${y + w * .55} Q0 ${y + w * 1.1} ${-w * .5} ${y + w * .55} Z" fill="${fill}"/>`
    : mood === 'munch'
      ? `<path d="M${-w * .7} ${y + 2} Q${-w * .35} ${y - 3} 0 ${y + 2} Q${w * .35} ${y - 3} ${w * .7} ${y + 2}" fill="none" ${S3}/>`
      : `<path d="M${-w} ${y} Q0 ${y + w * .9} ${w} ${y}" fill="none" ${S3}/>`;

  const ANIMALS = {
    elephant: { name: 'elephant', colour: '#9aa7b8', draw: m => `
      <path d="M-30 -30 Q-66 -50 -62 -4 Q-60 26 -30 18 Z" fill="#b8c2d0" ${S}/><path d="M30 -30 Q66 -50 62 -4 Q60 26 30 18 Z" fill="#b8c2d0" ${S}/>
      <path d="M-34 -26 Q-54 -36 -52 -6 Q-50 14 -32 10 Z M34 -26 Q54 -36 52 -6 Q50 14 32 10 Z" fill="#f2b8c0"/>
      <circle cy="-12" r="34" fill="#9aa7b8" ${S}/>
      ${eyes(14, -18)}${cheeks(22, -4, 5)}
      ${m === 'open' ? `<path d="M-10 14 Q0 30 10 14 Z" fill="${OL}"/>` : ''}
      <path d="M-14 22 Q-18 30 -12 32" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/><path d="M14 22 Q18 30 12 32" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
      <path d="M-9 -2 Q-12 30 -2 46 Q8 58 22 50 Q14 46 10 38 Q6 22 9 -2 Z" fill="#9aa7b8" ${S}/>
      <path d="M-6 16 H6 M-4 28 H7 M2 40 H10" stroke="#7f8b9c" stroke-width="2.5" stroke-linecap="round"/>` },
    zebra: { name: 'zebra', colour: '#fff', draw: m => `
      <path d="M-22 -36 L-30 -60 L-10 -42 Z M22 -36 L30 -60 L10 -42 Z" fill="#fff" ${S3}/>
      <path d="M-10 -52 Q0 -64 10 -52 L8 -30 H-8 Z" fill="${OL}"/>
      <path d="M-28 -30 Q-30 -50 0 -50 Q30 -50 28 -30 L22 26 Q0 34 -22 26 Z" fill="#fff" ${S}/>
      <path d="M-27 -22 Q-14 -18 -10 -24 M-26 -8 Q-14 -4 -8 -10 M-24 6 Q-14 10 -10 4 M27 -22 Q14 -18 10 -24 M26 -8 Q14 -4 8 -10 M24 6 Q14 10 10 4 M-8 -48 Q0 -40 8 -48" stroke="${OL}" stroke-width="5" fill="none" stroke-linecap="round"/>
      ${eyes(14, -26, 5)}
      <ellipse cy="34" rx="26" ry="20" fill="#5a5f73" ${S}/>
      <ellipse cx="-10" cy="30" rx="4" ry="3" fill="${OL}"/><ellipse cx="10" cy="30" rx="4" ry="3" fill="${OL}"/>
      ${mouth(42, 10, m, '#e57373').replace(/stroke="#2a2f45"/g, 'stroke="#fff"')}` },
    monkey: { name: 'monkey', colour: '#8b5a2b', draw: m => `
      <circle cx="-42" cy="-4" r="15" fill="#8b5a2b" ${S}/><circle cx="42" cy="-4" r="15" fill="#8b5a2b" ${S}/>
      <circle cx="-42" cy="-4" r="8" fill="#f2c79a"/><circle cx="42" cy="-4" r="8" fill="#f2c79a"/>
      <circle cy="-6" r="38" fill="#8b5a2b" ${S}/>
      <path d="M0 -24 Q-10 -38 -22 -32 Q-36 -24 -28 -6 Q-34 8 -24 22 Q-12 36 0 36 Q12 36 24 22 Q34 8 28 -6 Q36 -24 22 -32 Q10 -38 0 -24 Z" fill="#f2c79a" ${S3}/>
      ${eyes(12, -14, 5.5)}<ellipse cx="-4" cy="4" rx="2.5" ry="2" fill="${OL}"/><ellipse cx="4" cy="4" rx="2.5" ry="2" fill="${OL}"/>
      ${mouth(14, 12, m)}<path d="M-6 -44 Q0 -56 8 -46" fill="none" stroke="${OL}" stroke-width="4" stroke-linecap="round"/>` },
    crocodile: { name: 'crocodile', colour: '#3f9b4f', draw: m => `
      <path d="M-58 ${m === 'open' ? -6 : 2} Q-58 -24 -30 -24 L52 -14 Q60 -12 58 -2 L54 ${m === 'open' ? -4 : 6} Z" fill="#3f9b4f" ${S}/>
      ${m === 'open' ? `<path d="M-56 4 L56 6 Q58 22 40 22 L-40 30 Q-58 30 -56 4 Z" fill="#3f9b4f" ${S}/><path d="M-50 -2 L52 -2 L52 4 L-50 6 Z" fill="#c2185b"/>
        <path d="M-40 -4 l4 8 l4 -8 l4 8 l4 -8 l4 8 l4 -8 l4 8 l4 -8 l4 8 l4 -8 l4 8 l4 -8 l4 8 l4 -8 l4 8 l4 -8 l4 8 l4 -8 l4 8 l4 -8 l4 8 l4 -8" fill="#fff" stroke="${OL}" stroke-width="1.5"/>`
        : `<path d="M-56 4 L56 6 Q58 22 40 22 L-40 30 Q-58 30 -56 4 Z" fill="#3f9b4f" ${S}/><path d="M-30 6 l4 6 l4 -6 M-6 6 l4 6 l4 -6 M18 6 l4 6 l4 -6 M38 6 l4 6 l4 -6" fill="#fff" stroke="${OL}" stroke-width="2"/>`}
      <circle cx="-30" cy="-28" r="13" fill="#3f9b4f" ${S}/><circle cx="-4" cy="-26" r="12" fill="#3f9b4f" ${S}/>
      ${eye(-30, -30, 6)}${eye(-4, -28, 5.5)}
      <ellipse cx="46" cy="-12" rx="3" ry="2" fill="${OL}"/>
      <circle cx="10" cy="-12" r="3" fill="#6cc06e"/><circle cx="24" cy="-10" r="3" fill="#6cc06e"/><circle cx="-16" cy="-12" r="3" fill="#6cc06e"/>` },
    penguin: { name: 'penguin', colour: '#2a2f45', draw: m => `
      <path d="M-40 60 Q-46 -6 0 -10 Q46 -6 40 60 Z" fill="#30364a" ${S}/><path d="M-26 60 Q-26 10 0 10 Q26 10 26 60 Z" fill="#fff"/>
      <circle cy="-16" r="36" fill="#30364a" ${S}/>
      <path d="M0 -26 Q-8 -40 -20 -34 Q-32 -26 -24 -8 Q-18 8 0 10 Q18 8 24 -8 Q32 -26 20 -34 Q8 -40 0 -26 Z" fill="#fff"/>
      ${eyes(11, -20, 5)}${cheeks(20, -6, 5)}
      ${m === 'open' ? `<path d="M-10 -6 L14 -10 L-10 -16 Z M-10 -4 L12 2 L-10 4 Z" fill="#f7a823" ${S3}/>` : `<path d="M-11 -10 L13 -6 L-11 0 Z" fill="#f7a823" ${S3}/>`}` },
    giraffe: { name: 'giraffe', colour: '#f2b705', draw: m => `
      <path d="M-18 20 L-22 62 H22 L18 20 Z" fill="#f2b705" ${S}/><circle cx="-6" cy="40" r="6" fill="#b5651d"/><circle cx="10" cy="54" r="5" fill="#b5651d"/>
      <path d="M-14 -38 L-16 -58 M14 -38 L16 -58" stroke="${OL}" stroke-width="9" stroke-linecap="round"/><path d="M-14 -38 L-16 -58 M14 -38 L16 -58" stroke="#f2b705" stroke-width="5" stroke-linecap="round"/>
      <circle cx="-16" cy="-60" r="6" fill="#b5651d" ${S3}/><circle cx="16" cy="-60" r="6" fill="#b5651d" ${S3}/>
      <path d="M-30 -32 L-46 -40 L-36 -24 Z M30 -32 L46 -40 L36 -24 Z" fill="#f2b705" ${S3}/>
      <path d="M-26 -10 Q-28 -46 0 -46 Q28 -46 26 -10 L22 22 Q0 34 -22 22 Z" fill="#f2b705" ${S}/>
      <circle cx="-14" cy="-36" r="4" fill="#b5651d"/><circle cx="16" cy="-34" r="5" fill="#b5651d"/><circle cx="-20" cy="-18" r="3" fill="#b5651d"/>
      ${eyes(12, -20, 5)}
      <ellipse cy="16" rx="22" ry="16" fill="#f7d77a" ${S3}/><ellipse cx="-8" cy="10" rx="3" ry="2.5" fill="${OL}"/><ellipse cx="8" cy="10" rx="3" ry="2.5" fill="${OL}"/>
      ${mouth(20, 9, m)}` },
    lion: { name: 'lion', colour: '#f2a33a', draw: m => `
      <g fill="#b5651d" ${S}>${Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<circle cx="${(Math.cos(a) * 40).toFixed(1)}" cy="${(Math.sin(a) * 40 - 2).toFixed(1)}" r="16"/>`; }).join('')}</g>
      <circle cy="-2" r="40" fill="#b5651d"/>
      <circle cx="-24" cy="-28" r="9" fill="#f2a33a" ${S3}/><circle cx="24" cy="-28" r="9" fill="#f2a33a" ${S3}/>
      <circle cy="0" r="30" fill="#f2a33a" ${S}/>
      ${eyes(11, -8, 5)}
      <ellipse cy="12" rx="15" ry="11" fill="#f7d08a"/><path d="M-7 6 H7 L0 13 Z" fill="${OL}" ${S3}/>
      ${mouth(18, 8, m)}` },
    tiger: { name: 'tiger', colour: '#f07a1a', draw: m => `
      <circle cx="-30" cy="-30" r="12" fill="#f07a1a" ${S3}/><circle cx="30" cy="-30" r="12" fill="#f07a1a" ${S3}/>
      <circle cx="-30" cy="-30" r="5" fill="#fff"/><circle cx="30" cy="-30" r="5" fill="#fff"/>
      <ellipse cy="-2" rx="42" ry="38" fill="#f07a1a" ${S}/>
      <path d="M0 -40 V-26 M-10 -38 L-6 -26 M10 -38 L6 -26 M-42 -6 H-28 M-41 6 H-30 M42 -6 H28 M41 6 H30" stroke="${OL}" stroke-width="5" stroke-linecap="round"/>
      <path d="M-30 10 Q-30 -6 -12 -2 Q0 4 12 -2 Q30 -6 30 10 Q24 30 0 32 Q-24 30 -30 10 Z" fill="#fff"/>
      ${eyes(14, -12, 5.5)}<path d="M-7 4 H7 L0 11 Z" fill="${OL}" ${S3}/>
      ${mouth(16, 9, m)}` },
    panda: { name: 'panda', colour: '#fff', draw: m => `
      <circle cx="-30" cy="-32" r="14" fill="${OL}"/><circle cx="30" cy="-32" r="14" fill="${OL}"/>
      <ellipse cy="-2" rx="42" ry="38" fill="#fff" ${S}/>
      <ellipse cx="-16" cy="-8" rx="10" ry="14" fill="${OL}" transform="rotate(30 -16 -8)"/><ellipse cx="16" cy="-8" rx="10" ry="14" fill="${OL}" transform="rotate(-30 16 -8)"/>
      <circle cx="-15" cy="-9" r="4.5" fill="#fff"/><circle cx="15" cy="-9" r="4.5" fill="#fff"/><circle cx="-14" cy="-9" r="2.5" fill="${OL}"/><circle cx="14" cy="-9" r="2.5" fill="${OL}"/>
      ${cheeks(26, 10, 6)}<ellipse cy="8" rx="7" ry="5" fill="${OL}"/>
      ${mouth(16, 9, m)}` },
    parrot: { name: 'parrot', colour: '#e53935', draw: m => `
      <path d="M-8 -36 Q-14 -60 4 -62 Q0 -50 8 -40 Z M4 -38 Q12 -60 26 -54 Q16 -48 14 -34 Z" fill="#1e5bd6" ${S3}/>
      <path d="M-34 60 Q-44 0 -6 -6 Q34 -6 30 60 Z" fill="#2e9e4f" ${S}/>
      <circle cx="-4" cy="-12" r="32" fill="#e53935" ${S}/>
      <ellipse cx="-12" cy="-16" rx="12" ry="10" fill="#fff" ${S3}/>${eye(-12, -16, 5)}
      <path d="M10 -24 Q38 -26 36 0 Q34 14 24 14 Q30 0 18 -4 Z" fill="#f2c94c" ${S3}/>
      <path d="M12 -4 Q22 ${m === 'open' ? 14 : 6} 12 ${m === 'open' ? 16 : 10} Z" fill="#596178" ${S3}/>` },
    kangaroo: { name: 'kangaroo', colour: '#c98b4e', draw: m => `
      <path d="M-20 -26 Q-34 -66 -16 -60 Q-6 -46 -10 -26 Z M20 -26 Q34 -66 16 -60 Q6 -46 10 -26 Z" fill="#c98b4e" ${S}/>
      <path d="M-18 -32 Q-24 -52 -16 -52 Q-12 -42 -14 -32 Z M18 -32 Q24 -52 16 -52 Q12 -42 14 -32 Z" fill="#f2b8c0"/>
      <ellipse cy="-8" rx="30" ry="28" fill="#c98b4e" ${S}/>
      ${eyes(12, -14, 5)}
      <ellipse cy="16" rx="18" ry="16" fill="#e8c194" ${S3}/><ellipse cy="8" rx="7" ry="5" fill="${OL}"/>
      ${mouth(18, 8, m)}` },
    flamingo: { name: 'flamingo', colour: '#ff8fb1', draw: m => `
      <path d="M-6 60 Q-30 30 -8 10 Q12 -8 -2 -24" fill="none" stroke="${OL}" stroke-width="20" stroke-linecap="round"/>
      <path d="M-6 60 Q-30 30 -8 10 Q12 -8 -2 -24" fill="none" stroke="#ff8fb1" stroke-width="13" stroke-linecap="round"/>
      <circle cx="0" cy="-32" r="20" fill="#ff8fb1" ${S}/>${eye(-4, -38, 4.5)}
      <path d="M14 -40 Q40 -40 40 -20 Q40 -6 32 4 Q32 -14 16 -24 Z" fill="#fff" ${S3}/><path d="M36 -14 Q40 -6 32 4 Q31 -8 33 -14 Z" fill="${OL}"/>` },
    polarbear: { name: 'polar bear', colour: '#f3f6fa', draw: m => `
      <circle cx="-30" cy="-30" r="12" fill="#f3f6fa" ${S3}/><circle cx="30" cy="-30" r="12" fill="#f3f6fa" ${S3}/>
      <circle cx="-30" cy="-30" r="5" fill="#d3d9e3"/><circle cx="30" cy="-30" r="5" fill="#d3d9e3"/>
      <ellipse cy="-2" rx="40" ry="36" fill="#f3f6fa" ${S}/>
      ${eyes(14, -10, 5)}
      <ellipse cy="14" rx="17" ry="13" fill="#fff" ${S3}/><ellipse cy="8" rx="7" ry="5" fill="${OL}"/>
      ${mouth(17, 8, m)}` },
    camel: { name: 'camel', colour: '#d6a35c', draw: m => `
      <path d="M-14 16 L-18 62 H18 L14 16 Z" fill="#d6a35c" ${S}/>
      <path d="M-24 -34 Q-36 -42 -30 -28 Z M24 -34 Q36 -42 30 -28 Z" fill="#d6a35c" ${S3}/>
      <path d="M-26 -14 Q-28 -46 0 -46 Q28 -46 26 -14 L24 24 Q0 36 -24 24 Z" fill="#d6a35c" ${S}/>
      <path d="M-10 -46 Q-4 -56 2 -46 Q6 -56 12 -46" fill="#a8762f"/>
      ${eyes(12, -22, 5)}<path d="M-18 -26 Q-12 -30 -6 -26 M6 -26 Q12 -30 18 -26" stroke="${OL}" stroke-width="3" fill="none" stroke-linecap="round"/>
      <ellipse cy="16" rx="21" ry="15" fill="#e8c194" ${S3}/><path d="M-10 8 Q-6 10 -6 6 M10 8 Q6 10 6 6" stroke="${OL}" stroke-width="3" fill="none" stroke-linecap="round"/>
      ${mouth(20, 9, m)}` },
    meerkat: { name: 'meerkat', colour: '#d9b07a', draw: m => `
      <path d="M-22 20 Q-26 62 -20 62 H20 Q26 62 22 20 Z" fill="#d9b07a" ${S}/><path d="M-12 30 Q0 26 12 30 V62 H-12 Z" fill="#f0d6ae"/>
      <circle cx="-24" cy="-22" r="7" fill="#7a5a3a" ${S3}/><circle cx="24" cy="-22" r="7" fill="#7a5a3a" ${S3}/>
      <path d="M-26 -10 Q-28 -44 0 -44 Q28 -44 26 -10 Q18 26 0 30 Q-18 26 -26 -10 Z" fill="#d9b07a" ${S}/>
      <ellipse cx="-12" cy="-14" rx="9" ry="8" fill="#7a5a3a"/><ellipse cx="12" cy="-14" rx="9" ry="8" fill="#7a5a3a"/>${eyes(12, -14, 5)}
      <ellipse cy="14" rx="6" ry="4.5" fill="${OL}"/>${mouth(20, 6, m)}` },
    turtle: { name: 'turtle', colour: '#2e9e4f', draw: m => `
      <path d="M-56 50 Q-56 0 -10 0 Q36 0 36 50 Z" fill="#2e9e4f" ${S}/>
      <path d="M-46 50 L-36 24 L-10 14 L16 24 L26 50 M-36 24 L-30 50 M-10 14 V50 M16 24 L8 50" fill="none" stroke="#1d6b33" stroke-width="4" stroke-linejoin="round"/>
      <path d="M22 26 Q36 -6 30 -24" fill="none" stroke="${OL}" stroke-width="24" stroke-linecap="round"/><path d="M22 26 Q36 -6 30 -24" fill="none" stroke="#9ccc65" stroke-width="16" stroke-linecap="round"/>
      <ellipse cx="34" cy="-30" rx="22" ry="18" fill="#9ccc65" ${S}/>${eye(40, -36, 5)}
      ${m === 'open' ? `<path d="M30 -24 Q40 -10 50 -24 Z" fill="${OL}"/>` : `<path d="M30 -24 Q40 -16 50 -24" fill="none" ${S3}/>`}` },
    shark: { name: 'shark', colour: '#7f9bb8', draw: m => `
      <path d="M-58 4 L-44 -14 L-38 4 L-44 22 Z" fill="#7f9bb8" ${S}/>
      <path d="M-6 -24 L6 -52 L20 -22 Z" fill="#7f9bb8" ${S}/>
      <path d="M-44 4 Q-30 -30 20 -26 Q56 -22 58 2 Q54 28 14 30 Q-30 32 -44 4 Z" fill="#7f9bb8" ${S}/>
      <path d="M-30 14 Q0 30 52 10 Q48 26 14 30 Q-20 30 -30 14 Z" fill="#fff"/>
      <path d="M-4 30 L4 42 L14 30 Z" fill="#7f9bb8" ${S3}/>${eye(34, -8, 5)}
      <path d="M-12 -8 V6 M-18 -8 V6" stroke="#5f7b98" stroke-width="3" stroke-linecap="round"/>
      ${m === 'open' ? `<path d="M30 10 Q44 18 54 8 Z" fill="${OL}"/>` : `<path d="M30 10 Q44 18 54 8" fill="none" ${S3}/>`}` },
    caterpillar: { name: 'caterpillar', colour: '#7cc46a', draw: m => `
      ${[[-46, 26, '#9ccc65'], [-28, 20, '#7cc46a'], [-10, 22, '#9ccc65'], [8, 14, '#7cc46a']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="15" fill="${c}" ${S}/><path d="M${x - 4} ${y + 13} v8 M${x + 4} ${y + 13} v8" stroke="${OL}" stroke-width="3"/>`).join('')}
      <circle cx="26" cy="-4" r="26" fill="#ffd21f" ${S}/>
      <path d="M16 -26 Q10 -46 2 -46 M36 -26 Q42 -46 50 -46" fill="none" stroke="${OL}" stroke-width="3"/><circle cx="2" cy="-46" r="4" fill="#e53935"/><circle cx="50" cy="-46" r="4" fill="#e53935"/>
      ${eye(17, -8, 4.5)}${eye(35, -8, 4.5)}<circle cx="12" cy="4" r="4" fill="#ff8fa3" opacity=".5"/><circle cx="40" cy="4" r="4" fill="#ff8fa3" opacity=".5"/>
      <path d="M18 6 Q26 14 34 6" fill="none" ${S3}/>` }
  };

  // Bodies to stand behind a head, for the bigger scenes (head centre at 0,0; feet at about y 120).
  const leg = (x, y, h, c) => `<rect x="${x - 12}" y="${y}" width="24" height="${h}" rx="9" fill="${c}" ${S}/>`;
  const BODIES = {
    elephant: `${leg(10, 60, 62, '#8794a6')}${leg(96, 60, 62, '#8794a6')}<path d="M136 30 Q156 50 150 76" fill="none" stroke="${OL}" stroke-width="6" stroke-linecap="round"/>
      <ellipse cx="66" cy="44" rx="78" ry="52" fill="#9aa7b8" ${S}/>${leg(36, 70, 52, '#9aa7b8')}${leg(118, 70, 52, '#9aa7b8')}`,
    lion: `<path d="M120 40 Q150 30 146 0" fill="none" stroke="${OL}" stroke-width="6" stroke-linecap="round"/><circle cx="146" cy="-4" r="9" fill="#b5651d" ${S3}/>
      ${leg(40, 50, 60, '#e0922c')}${leg(104, 50, 60, '#e0922c')}<ellipse cx="72" cy="44" rx="62" ry="36" fill="#f2a33a" ${S}/>${leg(60, 60, 52, '#f2a33a')}${leg(120, 60, 52, '#f2a33a')}`,
    panda: `<ellipse cx="0" cy="66" rx="52" ry="52" fill="#fff" ${S}/><path d="M-50 40 Q-56 80 -36 96 L-20 60 Z M50 40 Q56 80 36 96 L20 60 Z" fill="${OL}"/>
      <ellipse cx="-30" cy="112" rx="20" ry="14" fill="${OL}"/><ellipse cx="30" cy="112" rx="20" ry="14" fill="${OL}"/>`
  };
  const body = id => BODIES[id] || '';

  // ---------- Food (about 60 units across, centred) ----------
  const FOOD = {
    banana: `<path d="M-26 -14 Q-30 22 4 26 Q26 26 30 12 Q8 18 -4 4 Q-14 -6 -14 -20 Z" fill="#ffd21f" ${S}/><path d="M-26 -14 L-24 -24 L-14 -22 L-14 -20" fill="#8b5a2b" ${S3}/>`,
    fish: `<path d="M-28 0 Q-10 -20 14 -12 L28 -22 L26 0 L28 22 L14 12 Q-10 20 -28 0 Z" fill="#5cc3ff" ${S}/>${eye(-14, -3, 3.5)}<path d="M0 -10 Q6 0 0 10" fill="none" stroke="#1e5bd6" stroke-width="3"/>`,
    apple: `<circle cy="4" r="24" fill="#e53935" ${S}/><path d="M0 -18 Q2 -28 6 -32" stroke="${OL}" stroke-width="4" stroke-linecap="round"/><path d="M4 -24 Q18 -34 22 -22 Q12 -16 4 -24 Z" fill="#2e9e4f" ${S3}/><circle cx="-9" cy="-4" r="5" fill="#fff" opacity=".5"/>`,
    watermelon: `<circle r="26" fill="#2e9e4f" ${S}/><path d="M-12 -23 Q-18 0 -12 23 M0 -26 V26 M12 -23 Q18 0 12 23" stroke="#1d6b33" stroke-width="4" fill="none"/><circle cx="-10" cy="-10" r="5" fill="#fff" opacity=".35"/>`,
    bamboo: `<g transform="rotate(-30)"><rect x="-8" y="-30" width="16" height="60" rx="6" fill="#9ccc65" ${S}/><path d="M-8 -10 H8 M-8 12 H8" stroke="#558b2f" stroke-width="4"/>
      <path d="M8 -12 Q26 -24 30 -10 Q18 -4 8 -12 Z" fill="#2e9e4f" ${S3}/><path d="M-8 6 Q-26 -2 -28 12 Q-16 16 -8 6 Z" fill="#2e9e4f" ${S3}/></g>`,
    leaves: `<path d="M0 26 Q-30 10 -22 -16 Q-8 -30 0 -26 Q8 -30 22 -16 Q30 10 0 26 Z" fill="#2e9e4f" ${S}/><path d="M0 26 V-20 M0 0 L-12 -10 M0 10 L12 -2" stroke="#1d6b33" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    meat: `<path d="M-22 -14 Q-6 -30 14 -18 Q30 -6 18 12 Q4 28 -14 18 Q-30 6 -22 -14 Z" fill="#d9534f" ${S}/><path d="M-12 -8 Q0 -14 10 -6" stroke="#f7b2a5" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M14 10 L28 24" stroke="${OL}" stroke-width="11" stroke-linecap="round"/><path d="M14 10 L28 24" stroke="#fff" stroke-width="6" stroke-linecap="round"/><circle cx="30" cy="22" r="6" fill="#fff" ${S3}/><circle cx="26" cy="28" r="6" fill="#fff" ${S3}/>`,
    carrot: `<path d="M-6 -16 L26 22 Q22 28 16 24 L-16 -6 Z" fill="#f07a1a" ${S}/><path d="M-10 -12 Q-24 -30 -14 -32 Q-8 -24 -6 -18 Q-6 -34 2 -30 Q0 -20 -4 -14" fill="#2e9e4f" ${S3}/>`,
    seeds: `<ellipse cx="-10" cy="-6" rx="9" ry="13" fill="#f2c94c" ${S3} transform="rotate(-20 -10 -6)"/><ellipse cx="10" cy="-8" rx="9" ry="13" fill="#e8b33c" ${S3} transform="rotate(20 10 -8)"/><ellipse cx="0" cy="10" rx="9" ry="13" fill="#f2c94c" ${S3}/>`
  };

  // ---------- Habitats (Animal homes): a scene in a 240 x 150 box from 0,0 ----------
  const HOMES = {
    jungle: { name: 'jungle', colour: '#2e9e4f', art: `<rect width="240" height="150" fill="#bfe8a8"/>
      <path d="M0 150 V100 Q60 80 120 100 T240 96 V150 Z" fill="#6ab45a"/>
      <rect x="28" y="30" width="16" height="120" fill="#8b5a2b" ${S3}/><rect x="190" y="20" width="16" height="130" fill="#8b5a2b" ${S3}/>
      <path d="M36 34 Q0 20 -6 44 Q20 36 36 34 Q30 0 6 -2 Q24 16 36 34 Q66 6 84 20 Q56 24 36 34 Q70 40 74 64 Q50 46 36 34 Z" fill="#2e9e4f" ${S3}/>
      <path d="M198 24 Q160 8 154 32 Q180 26 198 24 Q196 -10 170 -10 Q190 6 198 24 Q228 0 246 14 Q220 18 198 24 Q232 34 236 58 Q212 40 198 24 Z" fill="#2e9e4f" ${S3}/>
      <path d="M90 0 Q96 40 84 70 M130 0 Q124 30 136 56" fill="none" stroke="#3a8a3a" stroke-width="5"/>
      <path d="M100 118 Q110 100 120 118 Q130 100 140 118 Z" fill="#e86aa6" ${S3}/>` },
    sea: { name: 'sea', colour: '#1e5bd6', art: `<rect width="240" height="150" fill="#3aa6e6"/>
      <path d="M0 22 Q20 12 40 22 T80 22 T120 22 T160 22 T200 22 T240 22 V0 H0 Z" fill="#bfe6ff"/>
      <path d="M0 150 V128 Q60 116 120 130 T240 124 V150 Z" fill="#f2d48a"/>
      <path d="M40 128 Q34 104 44 86 M50 128 Q58 108 52 92" fill="none" stroke="#2e9e4f" stroke-width="6" stroke-linecap="round"/>
      <circle cx="180" cy="70" r="6" fill="#fff" opacity=".6"/><circle cx="190" cy="52" r="4" fill="#fff" opacity=".6"/><circle cx="176" cy="40" r="3" fill="#fff" opacity=".6"/>
      <path d="M196 134 l8 -10 l8 10 l-8 -4 Z" fill="#f07a1a" ${S3}/>` },
    ice: { name: 'ice', colour: '#5cc3ff', art: `<rect width="240" height="150" fill="#dff3ff"/>
      <path d="M0 150 V112 Q60 100 120 114 T240 108 V150 Z" fill="#fff" ${S3}/>
      <path d="M20 112 L50 40 L74 70 L92 30 L126 112 Z" fill="#cfeeff" ${S3}/><path d="M50 40 L58 70 L74 70 M92 30 L96 64" fill="none" stroke="#bfe6ff" stroke-width="5"/>
      <path d="M150 112 L180 64 L214 112 Z" fill="#eaf7ff" ${S3}/>
      ${[[30, 20], [140, 18], [210, 34], [110, 60], [200, 80]].map(([x, y]) => `<path d="M${x - 6} ${y} H${x + 6} M${x} ${y - 6} V${y + 6} M${x - 4} ${y - 4} L${x + 4} ${y + 4} M${x + 4} ${y - 4} L${x - 4} ${y + 4}" stroke="#5cc3ff" stroke-width="2.5" stroke-linecap="round"/>`).join('')}` },
    desert: { name: 'desert', colour: '#f2a900', art: `<rect width="240" height="150" fill="#ffe7a8"/>
      <circle cx="196" cy="34" r="20" fill="#ffd21f" ${S3}/>
      <path d="M0 150 V100 Q60 70 120 100 Q170 80 240 104 V150 Z" fill="#f2c879" ${S3}/>
      <path d="M0 150 V124 Q80 108 160 128 Q200 120 240 126 V150 Z" fill="#e8b35a"/>
      <g transform="translate(60 110)"><rect x="-8" y="-60" width="16" height="64" rx="8" fill="#4caf50" ${S3}/><path d="M-8 -30 H-20 V-46" fill="none" stroke="${OL}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/><path d="M-8 -30 H-20 V-46" fill="none" stroke="#4caf50" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M8 -38 H20 V-52" fill="none" stroke="${OL}" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 -38 H20 V-52" fill="none" stroke="#4caf50" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g>` }
  };

  const svg = (inner, box = '-60 -64 120 128', extra = '') => `<svg viewBox="${box}" ${extra}>${inner}</svg>`;
  const animal = (id, mood = 'smile') => ANIMALS[id].draw(mood);
  const animalSvg = (id, mood) => svg(animal(id, mood));
  const foodSvg = id => svg(FOOD[id], '-36 -36 72 72');

  // A drawing as an image, for the canvas (ball run board). Ready when loaded; draw() skips it until then.
  const cache = {};
  const image = (inner, box) => {
    const key = box + inner;
    if (!cache[key]) {
      const img = new Image();
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="${box}">${inner}</svg>`);
      cache[key] = img;
    }
    return cache[key];
  };
  const animalImage = (id, mood) => image(animal(id, mood), '-64 -66 128 132');
  const foodImage = id => image(FOOD[id], '-36 -36 72 72');

  // A round sticker for an animal.
  const sticker = (id, earned) => `
    <svg viewBox="-60 -60 120 120" class="sticker-svg ${earned ? 'earned' : 'locked'}">
      <circle r="54" fill="${earned ? '#fff' : '#e7ebf2'}" stroke="${earned ? '#ffd21f' : '#c3cad6'}" stroke-width="8"/>
      <circle r="44" fill="${earned ? '#bfe8a8' : '#d3d9e3'}"/>
      <defs><clipPath id="zs-${id}"><circle r="44"/></clipPath></defs>
      <g clip-path="url(#zs-${id})" opacity="${earned ? 1 : 0.3}"><g transform="translate(0 6) scale(.72)">${earned ? animal(id) : `<g style="filter:grayscale(1) brightness(.7)">${animal(id)}</g>`}</g></g>
    </svg>`;

  // ---------- The zookeeper, Zara (stands with feet at 0,0, about 230 tall) ----------
  const keeper = (wave = false) => `
    <g class="zara">
      <rect x="-24" y="-80" width="18" height="76" rx="6" fill="#3f5a3a" ${S3}/><rect x="6" y="-80" width="18" height="76" rx="6" fill="#3f5a3a" ${S3}/>
      <ellipse cx="-16" cy="-4" rx="16" ry="8" fill="#5a3a22" ${S3}/><ellipse cx="16" cy="-4" rx="16" ry="8" fill="#5a3a22" ${S3}/>
      <path d="M-34 -150 Q0 -162 34 -150 L30 -76 H-30 Z" fill="#6b8f3a" ${S}/>
      <path d="M-34 -146 L-50 -96" stroke="${OL}" stroke-width="18" stroke-linecap="round"/><path d="M-34 -146 L-50 -96" stroke="#6b8f3a" stroke-width="12" stroke-linecap="round"/><circle cx="-50" cy="-92" r="8" fill="#8d5a3b" ${S3}/>
      ${wave ? `<g class="zara-arm"><path d="M34 -146 L56 -190" stroke="${OL}" stroke-width="18" stroke-linecap="round"/><path d="M34 -146 L56 -190" stroke="#6b8f3a" stroke-width="12" stroke-linecap="round"/><circle cx="58" cy="-196" r="8" fill="#8d5a3b" ${S3}/></g>`
             : `<path d="M34 -146 L50 -96" stroke="${OL}" stroke-width="18" stroke-linecap="round"/><path d="M34 -146 L50 -96" stroke="#6b8f3a" stroke-width="12" stroke-linecap="round"/><circle cx="50" cy="-92" r="8" fill="#8d5a3b" ${S3}/>`}
      <rect x="-12" y="-134" width="24" height="16" rx="3" fill="#ffd21f" ${S3}/>
      <circle cy="-182" r="26" fill="#8d5a3b" ${S}/>
      <path d="M-26 -186 Q-30 -150 -18 -150 M26 -186 Q30 -150 18 -150" fill="none" stroke="#2a1a10" stroke-width="10" stroke-linecap="round"/>
      ${eyes(9, -184, 3.6)}<path d="M-8 -172 Q0 -165 8 -172" fill="none" ${S3}/>
      <path d="M-34 -198 Q0 -236 34 -198 Z" fill="#d6b46a" ${S3}/><ellipse cy="-198" rx="42" ry="7" fill="#c39a4a" ${S3}/>
    </g>`;

  // ---------- Bits of scenery ----------
  const fence = (x, y, w) => `<g transform="translate(${x} ${y})"><path d="M0 -40 H${w} M0 -14 H${w}" stroke="${OL}" stroke-width="11"/><path d="M0 -40 H${w} M0 -14 H${w}" stroke="#c98b4e" stroke-width="6"/>
    ${Array.from({ length: Math.floor(w / 40) + 1 }, (_, i) => `<rect x="${i * 40 - 5}" y="-54" width="10" height="56" rx="3" fill="#a8622c" ${S3}/>`).join('')}</g>`;
  const pool = (x, y, rx, ry) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="url(#water)" ${S}/><path d="M${x - rx * .5} ${y - 4} q10 -6 20 0 t20 0 M${x + rx * .1} ${y + ry * .4} q10 -6 20 0" fill="none" stroke="#bfe6ff" stroke-width="4" stroke-linecap="round"/>`;
  const palm = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-6 0 Q-14 -90 4 -170" fill="none" stroke="${OL}" stroke-width="22" stroke-linecap="round"/><path d="M-6 0 Q-14 -90 4 -170" fill="none" stroke="#a8762f" stroke-width="15" stroke-linecap="round"/>
    <path d="M4 -170 Q-50 -200 -90 -150 Q-40 -176 4 -170 Q-30 -230 -10 -250 Q0 -210 4 -170 Q50 -230 90 -210 Q40 -196 4 -170 Q60 -170 90 -120 Q40 -160 4 -170 Z" fill="#2e9e4f" ${S}/></g>`;
  const bambooClump = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${[-24, 0, 22].map((dx, i) => `<rect x="${dx - 7}" y="${-170 + i * 18}" width="14" height="${170 - i * 18}" rx="5" fill="#9ccc65" ${S3}/>
    ${[1, 2, 3].map(k => `<path d="M${dx - 7} ${-170 + i * 18 + k * 40} H${dx + 7}" stroke="#558b2f" stroke-width="3"/>`).join('')}
    <path d="M${dx + 7} ${-140 + i * 18} q22 -16 30 -2 q-16 8 -30 2 Z" fill="#2e9e4f" ${S3}/>`).join('')}</g>`;

  window.ZooArt = { body, ANIMALS, FOOD, HOMES, animal, animalSvg, foodSvg, animalImage, foodImage, image, sticker, keeper, fence, pool, palm, bambooClump, eye, eyes };
})();
