// Match the Gear: drag each tool onto the vehicle that uses it (or tap a tool, then tap a vehicle).
(function () {
  const A = window.App;
  const { OL, S3 } = Art;

  const TOOLS = {
    fire:     { name: 'fire hose', art: `<svg viewBox="-20 -80 200 110"><path d="M-10 0 Q40 -10 70 -20" stroke="${OL}" stroke-width="22" fill="none" stroke-linecap="round"/><path d="M-10 0 Q40 -10 70 -20" stroke="#e9e3d6" stroke-width="14" fill="none" stroke-linecap="round"/><rect x="64" y="-36" width="60" height="26" rx="6" fill="#9fb1c7" ${S3} transform="rotate(-12 64 -23)"/><path d="M128 -40 Q160 -60 176 -50 M128 -32 Q160 -40 178 -30" stroke="#5cc3ff" stroke-width="6" fill="none" stroke-linecap="round"/></svg>` },
    medical:  { name: "doctor's bag", art: `<svg viewBox="-50 -50 100 90"><path d="M-14 -24 V-34 H14 V-24" fill="none" stroke="${OL}" stroke-width="6"/><rect x="-40" y="-26" width="80" height="58" rx="10" fill="#8a5a3c" ${S3}/><path d="M0 -14 V20 M-17 3 H17" stroke="#fff" stroke-width="9"/></svg>` },
    hover:    { name: 'life ring', art: `<svg viewBox="-50 -50 100 100"><circle r="30" fill="none" stroke="${OL}" stroke-width="26"/><circle r="30" fill="none" stroke="#fff" stroke-width="18"/><circle r="30" fill="none" stroke="#e53935" stroke-width="18" stroke-dasharray="23.6 23.6"/></svg>` },
    tow:      { name: 'big hook', art: `<svg viewBox="-50 -60 100 110"><rect x="-14" y="-56" width="28" height="18" rx="4" fill="#596178" ${S3}/><path d="M0 -38 V6 Q0 38 -24 30 Q-36 24 -30 10" fill="none" stroke="${OL}" stroke-width="16" stroke-linecap="round"/><path d="M0 -38 V6 Q0 38 -24 30 Q-36 24 -30 10" fill="none" stroke="#c7cfdb" stroke-width="8" stroke-linecap="round"/></svg>` },
    helitack: { name: 'water bucket', art: `<svg viewBox="-50 -60 100 110"><path d="M0 -56 V-30 M-30 -26 L0 -50 L30 -26" fill="none" stroke="${OL}" stroke-width="4"/><path d="M-36 -26 H36 L24 34 H-24 Z" fill="#f07a1a" ${S3}/><ellipse cx="0" cy="-22" rx="30" ry="7" fill="#5cc3ff"/></svg>` }
  };

  const shuffle = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

  A.screens.match = (arg, alive) => {
    A.ui({ home: true });
    const ids = shuffle(Object.keys(TOOLS)).slice(0, 4);
    const scene = document.getElementById('scene');
    scene.innerHTML = `
      <div class="match">
        <div class="col vehicles">${ids.map(id => {
          const v = A.vehicle(id);
          return `<div class="slot" data-v="${id}">${Art.sticker(v, true)}<span>${v.name}</span><div class="got"></div></div>`;
        }).join('')}</div>
        <div class="col tools">${shuffle(ids).map(id => `<button class="tool" data-v="${id}" aria-label="${TOOLS[id].name}">${TOOLS[id].art}</button>`).join('')}</div>
      </div>`;
    const root = scene.querySelector('.match');
    let done = 0, picked = null;

    function tryMatch(tool, slot) {
      const ok = slot && tool.dataset.v === slot.dataset.v;
      if (ok) {
        slot.querySelector('.got').innerHTML = TOOLS[tool.dataset.v].art;
        slot.classList.add('done');
        tool.classList.add('placed');
        Sfx.chime();
        done++;
        if (done === ids.length) finish();
        else A.say('match.yes', { vehicle: A.vehicle(slot.dataset.v).name, tool: TOOLS[tool.dataset.v].name });
      } else if (slot) { Sfx.boing(); A.say('match.no'); }
      return ok;
    }

    // Dragging
    root.querySelectorAll('.tool').forEach(tool => {
      let start = null, moved = false;
      tool.addEventListener('pointerdown', e => {
        if (tool.classList.contains('placed')) return;
        start = { x: e.clientX, y: e.clientY }; moved = false;
        tool.setPointerCapture(e.pointerId);
        tool.classList.add('dragging');
        Sfx.tap();
      });
      tool.addEventListener('pointermove', e => {
        if (!start) return;
        const dx = e.clientX - start.x, dy = e.clientY - start.y;
        if (Math.hypot(dx, dy) > 8) moved = true;
        tool.style.transform = `translate(${dx}px, ${dy}px) scale(1.08)`;
        tool.style.pointerEvents = 'none';
        const over = document.elementFromPoint(e.clientX, e.clientY);
        tool.style.pointerEvents = '';
        root.querySelectorAll('.slot').forEach(s => s.classList.toggle('over', !!over && s.contains(over) && !s.classList.contains('done')));
      });
      const end = e => {
        if (!start) return;
        tool.classList.remove('dragging');
        root.querySelectorAll('.slot').forEach(s => s.classList.remove('over'));
        if (moved) {
          tool.style.visibility = 'hidden';
          const over = document.elementFromPoint(e.clientX, e.clientY);
          tool.style.visibility = '';
          const slot = over && over.closest('.slot:not(.done)');
          tryMatch(tool, slot);
        } else {
          // A tap selects the tool; then tap a vehicle.
          root.querySelectorAll('.tool').forEach(t => t.classList.remove('picked'));
          picked = tool; tool.classList.add('picked');
          A.sayText(`The ${TOOLS[tool.dataset.v].name}. Which vehicle uses it?`);
        }
        tool.style.transition = 'transform .25s'; tool.style.transform = '';
        setTimeout(() => { tool.style.transition = ''; }, 260);
        start = null;
      };
      tool.addEventListener('pointerup', end);
      tool.addEventListener('pointercancel', end);
    });
    root.querySelectorAll('.slot').forEach(slot => slot.addEventListener('click', () => {
      if (slot.classList.contains('done')) return;
      if (picked) { if (tryMatch(picked, slot)) picked = null; else { picked.classList.remove('picked'); picked = null; } }
      else { Sfx.tap(); A.sayText(`The ${A.vehicle(slot.dataset.v).name}.`); }
    }));

    function finish() {
      A.say('match.done');
      A.gameDone('match', { buttons: false });
      const end = document.createElement('div');
      end.className = 'end';
      end.innerHTML = `
        <button class="big-btn" style="background:#1e5bd6" aria-label="Play again"><svg viewBox="0 0 64 64"><path d="M48 32 A16 16 0 1 1 40 18" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/><path d="M34 8 L46 18 L34 26 Z" fill="#fff"/></svg></button>
        <button class="big-btn" style="background:#2e9e4f" aria-label="Back to the station"><svg viewBox="0 0 64 64"><path d="M10 32 L32 12 L54 32" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M18 30 V52 H28 V40 H36 V52 H46 V30" fill="#fff"/></svg></button>`;
      end.style.gridColumn = 'auto';
      root.querySelector('.tools').replaceWith(end);
      const [again, home] = end.querySelectorAll('button');
      again.onclick = () => { Sfx.tap(); A.go('match'); };
      home.onclick = () => { Sfx.tap(); A.go('hub'); };
    }

    A.say('match.intro');
  };
})();
