// Sorting engine: drag each item to the right place. One engine for "who eats what" (food to the hungry animal),
// "animal homes" (animal to its habitat), and later the supermarket trolley and school bag.
//
// Sorter.mount(cfg): cfg.screen (game id), cfg.colour, cfg.tile (menu picture), cfg.world, cfg.back,
// cfg.round(level) -> { bins: [{ id, art, label, cls }], items: [{ id, art, bin, line }] },
// cfg.lines: { intro, no, done } (line ids), cfg.cls (extra class for styling),
// cfg.onRight(binEl, item) and cfg.onWrong(binEl, item) for a world's own animations and sounds.
window.Sorter = {};
(function () {
  const A = window.App;
  if (!A) return;
  const scene = () => document.getElementById('scene');
  const shuffle = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

  Sorter.shuffle = shuffle;
  Sorter.mount = cfg => {
    const { screen } = cfg;
    A.addGame(screen, cfg.colour, cfg.tile, { world: cfg.world, back: cfg.back });

    A.screens[screen] = (arg, alive) => {
      A.ui({ home: true });
      const { bins, items } = cfg.round(A.level(screen));
      scene().innerHTML = `
        <div class="sorter ${cfg.cls || ''}">
          <div class="so-bins">${bins.map((b, i) => `
            <div class="so-bin ${b.cls || ''}" data-bin="${b.id}" style="animation-delay:${i * .08}s">
              <div class="so-art">${b.art}</div><div class="so-got"></div>
              ${b.label ? `<span class="so-label">${b.label}</span>` : ''}</div>`).join('')}</div>
          <div class="so-tray">${shuffle(items).map((it, i) => `
            <button class="so-item" data-i="${items.indexOf(it)}" style="animation-delay:${.3 + i * .06}s" aria-label="${it.label || it.id}">${it.art}</button>`).join('')}</div>
        </div>`;
      const root = scene().querySelector('.sorter');
      const binEls = [...root.querySelectorAll('.so-bin')], itemEls = [...root.querySelectorAll('.so-item')];
      let left = items.length, busy = false;

      const binAt = (x, y) => binEls.find(b => { const r = b.getBoundingClientRect(); return x >= r.left - 10 && x <= r.right + 10 && y >= r.top - 10 && y <= r.bottom + 10; });
      const hintNext = () => {
        const el = itemEls.find(e => !e.classList.contains('placed'));
        if (!el) return;
        const it = items[+el.dataset.i];
        A.Hint.set([el, binEls.find(b => b.dataset.bin === it.bin)], cfg.lines.go || cfg.lines.intro);
      };

      async function right(el, binEl, it) {
        busy = true; A.Hint.clear();
        el.classList.add('placed'); el.style.transform = '';
        const mini = document.createElement('span');
        mini.className = 'so-mini'; mini.innerHTML = it.art;
        binEl.querySelector('.so-got').appendChild(mini);
        binEl.classList.remove('yes'); void binEl.offsetWidth; binEl.classList.add('yes');
        if (cfg.onRight) cfg.onRight(binEl, it); else Sfx.pop();
        left--;
        if (it.line) await A.say(it.line); else await A.wait(500);
        if (!alive()) return;
        busy = false;
        if (left === 0) {
          A.Pip.mood('cheer'); A.Pip.act('dance');
          await A.say(cfg.lines.done);
          if (alive()) A.gameDone(screen);
        } else hintNext();
      }
      function wrong(binEl, it) {
        binEl.classList.remove('no'); void binEl.offsetWidth; binEl.classList.add('no');
        if (cfg.onWrong) cfg.onWrong(binEl, it); else Sfx.boing();
        A.Pip.mood('thinking');
        A.say(cfg.lines.no);
      }

      // Drag an item; a tap without moving says what it is.
      itemEls.forEach(el => {
        const it = items[+el.dataset.i];
        el.onpointerdown = e => {
          if (busy || el.classList.contains('placed')) return;
          e.preventDefault();
          const x0 = e.clientX, y0 = e.clientY; let moved = false, over = null;
          el.setPointerCapture(e.pointerId); el.classList.add('dragging'); Sfx.tap(); A.Hint.clear();
          el.onpointermove = ev => {
            if (Math.hypot(ev.clientX - x0, ev.clientY - y0) > 10) moved = true;
            el.style.transform = `translate(${ev.clientX - x0}px, ${ev.clientY - y0}px) scale(1.1)`;
            const b = binAt(ev.clientX, ev.clientY);
            if (b !== over) { if (over) over.classList.remove('over'); over = b; if (b) b.classList.add('over'); }
          };
          el.onpointerup = el.onpointercancel = ev => {
            el.onpointermove = el.onpointerup = el.onpointercancel = null;
            el.classList.remove('dragging');
            if (over) over.classList.remove('over');
            const b = moved && ev.type === 'pointerup' ? binAt(ev.clientX, ev.clientY) : null;
            if (!moved) { el.style.transform = ''; if (it.name) A.say(it.name); return; }
            if (b && b.dataset.bin === it.bin) return right(el, b, it);
            if (b) wrong(b, it);
            el.style.transition = 'transform .3s'; el.style.transform = '';
            setTimeout(() => { el.style.transition = ''; }, 320);
          };
        };
      });

      // Tapping a place says what it is.
      binEls.forEach(b => b.onclick = () => { const bin = bins.find(x => x.id === b.dataset.bin); if (bin.name && !busy) A.say(bin.name); });

      (async () => {
        await A.say(cfg.lines.intro);
        if (alive()) hintNext();
      })();
    };
  };
})();
