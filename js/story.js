// Picture story engine: a short story read aloud by Pip, one page at a time. The child turns the pages,
// and anything in a picture with class "st-tap" (and a data-sfx sound name) wiggles and makes a sound when tapped.
//
// Story.mount(cfg): cfg.screen (game id), cfg.colour, cfg.tile, cfg.world, cfg.back,
// cfg.pages: [{ art: () => '<svg ...>', line: 'line id' }], cfg.lines.end (said on the last page).
window.Story = {};
(function () {
  const A = window.App;
  if (!A) return;
  const scene = () => document.getElementById('scene');
  const ARROW = d => `<svg viewBox="0 0 64 64"><path d="${d > 0 ? 'M14 32 H46 M34 18 L48 32 L34 46' : 'M50 32 H18 M30 18 L16 32 L30 46'}" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const BOOK = `<svg viewBox="-60 -60 120 120"><path d="M-50 -34 Q-26 -44 0 -32 Q26 -44 50 -34 V36 Q26 26 0 38 Q-26 26 -50 36 Z" fill="#fff" ${Art.S}/>
    <path d="M0 -32 V38" stroke="${Art.OL}" stroke-width="4"/><path d="M-40 -18 Q-22 -24 -10 -18 M-40 -4 Q-22 -10 -10 -4 M-40 10 Q-22 4 -10 10 M10 -18 Q22 -24 40 -18 M10 -4 Q22 -10 40 -4" stroke="#c3cad6" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`;
  Story.BOOK = BOOK;

  Story.mount = cfg => {
    const { screen, pages } = cfg;
    A.addGame(screen, cfg.colour, cfg.tile || BOOK, { world: cfg.world, back: cfg.back });

    A.screens[screen] = (arg, alive) => {
      A.ui({ home: true });
      let n = 0, reading = 0;
      scene().innerHTML = `
        <div class="story ${cfg.cls || ''}">
          <div class="st-page"></div>
          <button class="big-btn st-prev" style="background:#8e5bd6" aria-label="Back a page">${ARROW(-1)}</button>
          <button class="big-btn st-next" style="background:${cfg.colour}" aria-label="Next page">${ARROW(1)}</button>
          <div class="st-dots">${pages.map((_, i) => `<span data-i="${i}"></span>`).join('')}</div>
        </div>`;
      const root = scene().querySelector('.story'), pageEl = root.querySelector('.st-page');
      const prev = root.querySelector('.st-prev'), next = root.querySelector('.st-next'), dots = [...root.querySelectorAll('.st-dots span')];

      async function show(i, dir = 1) {
        n = i; const my = ++reading;
        A.Hint.clear();
        pageEl.classList.remove('turn-l', 'turn-r'); void pageEl.offsetWidth;
        pageEl.classList.add(dir > 0 ? 'turn-r' : 'turn-l');
        pageEl.innerHTML = pages[i].art();
        dots.forEach((d, k) => d.classList.toggle('on', k === i));
        prev.hidden = i === 0;
        pageEl.querySelectorAll('.st-tap').forEach(t => t.addEventListener('click', e => {
          e.stopPropagation();
          t.classList.remove('wiggle'); void t.getBoundingClientRect(); t.classList.add('wiggle');
          const s = t.dataset.sfx; if (s && Sfx[s]) Sfx[s](); else Sfx.pop();
        }));
        Sfx.whoosh();
        await A.wait(350);
        if (!alive() || my !== reading) return;
        await A.say(pages[i].line);
        if (!alive() || my !== reading) return;
        if (i === pages.length - 1) return finish();
        A.Hint.set([next], null);
      }
      async function finish() {
        next.hidden = true;
        A.Pip.mood('cheer'); A.Pip.act('dance');
        await A.say(cfg.lines.end);
        await A.wait(1200); // a moment to look at the last picture before the sticker
        if (alive()) A.gameDone(screen);
      }
      next.onclick = () => { Sfx.tap(); if (n < pages.length - 1) show(n + 1, 1); };
      prev.onclick = () => { Sfx.tap(); if (n > 0) { next.hidden = false; show(n - 1, -1); } };
      show(0);
    };
  };
})();
