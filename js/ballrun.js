// Ball run engine: drag pieces onto a pegboard, blow Pip's whistle, and balls roll through what was built.
// The physics (Matter.js) lives in BallRun.Sim so it can also be run without a screen, for testing puzzles.
// A world pack gives the theme and the puzzles: see BallRun.packs.rescue at the bottom of this file.
(function () {
  const M = window.Matter;
  const CELL = 100, COLS = 14, ROWS = 8, W = COLS * CELL, H = ROWS * CELL;
  const R = 14;        // ball radius
  const TH = 12;       // thickness of ramps and walls
  const NEED = 3;      // balls in the goal to win
  const GAP = 26;      // steps between balls leaving the hose

  // ---------- Pieces ----------
  // Sizes are in grid cells. segs are [x1, y1, x2, y2] in cell units, drawn as the left-facing version;
  // a flipped piece is mirrored. kind picks special behaviour.
  const arc = (cx, cy, r, a0, a1, n) => {
    const pts = [];
    for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * i / n; pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
    return pts.slice(1).map((p, i) => [pts[i][0], pts[i][1], p[0], p[1]]);
  };
  const PIECES = {
    ramp:   { w: 2, h: 1, flip: true, colour: '#f07a1a', segs: [[0.08, 0.22, 1.92, 0.78]] },
    long:   { w: 4, h: 1, flip: true, colour: '#1e5bd6', segs: [[0.08, 0.2, 3.92, 0.8]] },
    curve:  { w: 2, h: 2, flip: true, colour: '#8e5bd6', segs: arc(1.95, 0.08, 1.75, Math.PI, Math.PI / 2, 9) },
    funnel: { w: 2, h: 2, flip: false, colour: '#2e9e4f', segs: [[0.06, 0.12, 0.76, 1.15], [1.94, 0.12, 1.24, 1.15], [0.76, 1.15, 0.76, 1.9], [1.24, 1.15, 1.24, 1.9]] },
    spring: { w: 1, h: 1, flip: true, colour: '#e53935', kind: 'spring' },
    fan:    { w: 1, h: 2, flip: true, colour: '#5cc3ff', kind: 'fan', reach: 4 },
    seesaw: { w: 3, h: 1, flip: true, colour: '#ffb300', kind: 'seesaw' },
    bucket: { w: 2, h: 2, flip: true, colour: '#8a5a3c', kind: 'bucket' },
    block:  { w: 1, h: 1, flip: false, colour: '#c95a43', kind: 'block' },
    shelf:  { w: 2, h: 1, flip: false, colour: '#9aa3b5', segs: [[0.06, 0.5, 1.94, 0.5]] }
  };
  // Cell units of a piece to world units, mirrored when flipped.
  const toWorld = (p, u, v) => [(p.c + (p.f ? PIECES[p.t].w - u : u)) * CELL, (p.r + v) * CELL];

  const seg = (x1, y1, x2, y2, opts = {}) => M.Bodies.rectangle((x1 + x2) / 2, (y1 + y2) / 2, Math.hypot(x2 - x1, y2 - y1) + TH, TH,
    Object.assign({ isStatic: true, angle: Math.atan2(y2 - y1, x2 - x1), chamfer: { radius: TH / 2 - 1 }, friction: 0.01, frictionStatic: 0.05, restitution: 0.15, label: 'part' }, opts));

  // ---------- Simulation (no drawing) ----------
  class Sim {
    constructor(level) {
      this.level = level;
      this.engine = M.Engine.create({ gravity: { x: 0, y: 1 }, positionIterations: 10, velocityIterations: 8 });
      this.world = this.engine.world;
      this.pieces = []; this.balls = []; this.events = [];
      this.t = 0; this.running = false; this.hits = 0; this.released = 0;
      const wall = (x, y, w, h, label) => M.Bodies.rectangle(x, y, w, h, { isStatic: true, label, friction: 0.3, restitution: 0.1 });
      this.floor = wall(W / 2, H + 40, W + 400, 80, 'floor');
      M.Composite.add(this.world, [this.floor, wall(-40, H / 2 - 400, 80, H + 800, 'wall'), wall(W + 40, H / 2 - 400, 80, H + 800, 'wall')]);
      const g = level.goal;
      this.goal = M.Bodies.rectangle((g + 1) * CELL, H - 55, 2 * CELL - 30, 110, { isStatic: true, isSensor: true, label: 'goal' });
      M.Composite.add(this.world, this.goal);
      // An optional decoy: a second 2-cell target that the balls must miss (in the zoo, an animal that eats something else).
      if (level.decoy != null) M.Composite.add(this.world, M.Bodies.rectangle((level.decoy + 1) * CELL, H - 55, 2 * CELL - 30, 110, { isStatic: true, isSensor: true, label: 'decoy' }));
      M.Events.on(this.engine, 'collisionStart', e => e.pairs.forEach(pr => this.touch(pr.bodyA, pr.bodyB)));
      (level.fixed || []).forEach(p => this.add(Object.assign({ fixed: true }, p)));
    }

    // Which cells a piece covers; used to stop pieces overlapping.
    static cells(p) { const d = PIECES[p.t], out = []; for (let i = 0; i < d.w; i++) for (let j = 0; j < d.h; j++) out.push((p.c + i) + ',' + (p.r + j)); return out; }
    // The hose (top row) and the goal and decoy (bottom row) can't be built over.
    reserved() {
      const l = this.level, s = new Set([l.hose + ',0', l.goal + ',' + (ROWS - 1), (l.goal + 1) + ',' + (ROWS - 1)]);
      if (l.decoy != null) { s.add(l.decoy + ',' + (ROWS - 1)); s.add((l.decoy + 1) + ',' + (ROWS - 1)); }
      return s;
    }
    blocked() {
      const s = this.reserved();
      this.pieces.forEach(p => Sim.cells(p).forEach(c => s.add(c)));
      return s;
    }
    fits(p, ignore = null) {
      const d = PIECES[p.t];
      if (p.c < 0 || p.r < 0 || p.c + d.w > COLS || p.r + d.h > ROWS) return false;
      const taken = this.reserved();
      this.pieces.forEach(q => { if (q !== ignore) Sim.cells(q).forEach(c => taken.add(c)); });
      return Sim.cells(p).every(c => !taken.has(c));
    }

    add(p) {
      const d = PIECES[p.t], bodies = [], dir = p.f ? -1 : 1;
      (d.segs || []).forEach(([a, b, c2, e]) => { const [x1, y1] = toWorld(p, a, b), [x2, y2] = toWorld(p, c2, e); bodies.push(seg(x1, y1, x2, y2)); });
      if (d.kind === 'block') bodies.push(M.Bodies.rectangle((p.c + 0.5) * CELL, (p.r + 0.5) * CELL, CELL - 8, CELL - 8, { isStatic: true, chamfer: { radius: 10 }, label: 'part', friction: 0.05 }));
      if (d.kind === 'spring') {
        const [x, y] = toWorld(p, 0.5, 0.62);
        const pad = M.Bodies.rectangle(x, y, CELL * 0.8, TH, { isStatic: true, chamfer: { radius: 5 }, label: 'spring', restitution: 0.2 });
        pad.piece = p; bodies.push(pad);
        bodies.push(M.Bodies.rectangle(x, (p.r + 0.92) * CELL, CELL * 0.7, 14, { isStatic: true, label: 'part' }));
      }
      if (d.kind === 'fan') {
        const [x, y] = toWorld(p, 0.4, 1);
        bodies.push(M.Bodies.rectangle(x, y, CELL * 0.5, CELL * 1.5, { isStatic: true, chamfer: { radius: 12 }, label: 'part' }));
        // Wind blows out of the open side, across `reach` cells.
        const x0 = dir > 0 ? (p.c + 1) * CELL : (p.c - d.reach) * CELL;
        p.wind = { x0, x1: x0 + d.reach * CELL, y0: p.r * CELL, y1: (p.r + 2) * CELL, dir };
      }
      if (d.kind === 'seesaw') {
        const [x, y] = toWorld(p, 1.5, 0.62);
        const plank = M.Bodies.rectangle(x, y, CELL * 2.9, TH + 4, { chamfer: { radius: 7 }, density: 0.004, friction: 0.05, label: 'part' });
        M.Body.setAngle(plank, -0.32 * dir);
        const pin = M.Constraint.create({ pointA: { x, y }, bodyB: plank, length: 0, stiffness: 1 });
        p.plank = plank; p.pin = pin; p.pivot = { x, y };
        bodies.push(plank); M.Composite.add(this.world, pin);
      }
      if (d.kind === 'bucket') {
        // A bucket on an axle: it fills up, tips over to pour its balls out of the open side, then swings back.
        const pts = [[0.25, 0.35, 0.3, 1.85], [0.3, 1.85, 1.7, 1.85], [1.7, 1.85, 1.75, 0.35]];
        const parts = pts.map(([a, b, c2, e]) => { const [x1, y1] = toWorld(p, a, b), [x2, y2] = toWorld(p, c2, e); return seg(x1, y1, x2, y2, { isStatic: false }); });
        const cup = M.Body.create({ parts, label: 'part' });
        M.Body.setStatic(cup, true);
        const [ax, ay] = toWorld(p, 1.75, 1.85);
        p.cup = cup; p.axle = { x: ax, y: ay }; p.angle = 0; p.state = 'fill'; p.timer = 0;
        bodies.push(cup);
      }
      bodies.forEach(b => { b.piece = p; });
      p.bodies = bodies;
      M.Composite.add(this.world, bodies);
      this.pieces.push(p);
      return p;
    }
    remove(p) {
      M.Composite.remove(this.world, p.bodies);
      if (p.pin) M.Composite.remove(this.world, p.pin);
      this.pieces = this.pieces.filter(q => q !== p);
    }

    start() {
      this.balls.forEach(b => M.Composite.remove(this.world, b));
      this.balls = []; this.t = 0; this.hits = 0; this.released = 0; this.running = true; this.won = false;
      this.toRelease = this.level.balls || 6;
      this.pieces.forEach(p => this.resetPiece(p));
    }
    resetPiece(p) {
      if (p.plank) { M.Body.setAngle(p.plank, -0.32 * (p.f ? -1 : 1)); M.Body.setAngularVelocity(p.plank, 0); M.Body.setVelocity(p.plank, { x: 0, y: 0 }); M.Body.setPosition(p.plank, p.pivot); }
      if (p.cup && p.angle) { M.Body.rotate(p.cup, -p.angle, p.axle); p.angle = 0; p.state = 'fill'; }
    }
    // A run is over when every ball has gone.
    get finished() { return this.running && this.released >= this.toRelease && this.balls.length === 0; }

    touch(a, b) {
      const ball = a.label === 'ball' ? a : b.label === 'ball' ? b : null;
      if (!ball) return;
      const other = ball === a ? b : a;
      if (other.label === 'goal' && !ball.gone) {
        ball.gone = true; this.hits++;
        this.events.push({ type: 'hit', x: ball.position.x, y: ball.position.y, n: this.hits });
        if (this.hits === NEED) { this.won = true; this.events.push({ type: 'win' }); }
      } else if (other.label === 'decoy' && !ball.gone) {
        ball.gone = true; this.missed = (this.missed || 0) + 1;
        this.events.push({ type: 'decoy', x: ball.position.x, y: ball.position.y });
      } else if (other.label === 'spring' && this.t - (ball.sprung || -99) > 10) {
        ball.sprung = this.t;
        const dir = other.piece.f ? -1 : 1;
        M.Body.setVelocity(ball, { x: 3.4 * dir, y: -12.5 });
        other.piece.boing = 12;
        this.events.push({ type: 'spring', x: ball.position.x, y: ball.position.y });
      } else if (other.label === 'floor') {
        if (!ball.gone) this.events.push({ type: 'splash', x: ball.position.x, y: H });
        ball.gone = true;
      } else if (other.label === 'part' && Math.hypot(ball.velocity.x, ball.velocity.y) > 4) {
        this.events.push({ type: 'tap', x: ball.position.x, y: ball.position.y });
      }
    }

    step() {
      this.t++;
      if (this.running && this.released < this.toRelease && this.t % GAP === 1) {
        const ball = M.Bodies.circle((this.level.hose + 0.5) * CELL, 70, R, { restitution: 0.25, friction: 0.005, frictionStatic: 0.02, frictionAir: 0.004, density: 0.002, label: 'ball' });
        ball.born = this.t;
        this.balls.push(ball); M.Composite.add(this.world, ball); this.released++;
        this.events.push({ type: 'release' });
      }
      this.pieces.forEach(p => {
        if (p.wind) this.balls.forEach(b => {
          const { x, y } = b.position, w = p.wind;
          if (x > w.x0 && x < w.x1 && y > w.y0 && y < w.y1) M.Body.setVelocity(b, { x: Math.max(-7, Math.min(7, b.velocity.x + 0.32 * w.dir)), y: b.velocity.y - 0.12 });
        });
        if (p.plank) {
          const lim = 0.36, a = p.plank.angle;
          if (Math.abs(a) > lim) { M.Body.setAngle(p.plank, Math.sign(a) * lim); M.Body.setAngularVelocity(p.plank, 0); }
        }
        if (p.cup) this.bucket(p);
        if (p.boing) p.boing--;
      });
      M.Engine.update(this.engine, 1000 / 120);
      M.Engine.update(this.engine, 1000 / 120);
      // Tidy up balls that are in the goal, resting on the floor, off the board or stuck.
      this.balls = this.balls.filter(b => {
        const out = b.gone || b.position.y > H + 60 || b.position.x < -60 || b.position.x > W + 60 || this.t - b.born > 1500;
        if (out) M.Composite.remove(this.world, b);
        return !out;
      });
    }
    bucket(p) {
      const dir = p.f ? -1 : 1, full = 3, turn = 1.9 * dir, speed = 0.035;
      if (p.state === 'fill') {
        const [x0, y0] = toWorld(p, 0.3, 0.3), [x1, y1] = toWorld(p, 1.7, 1.85);
        const inside = this.balls.filter(b => b.position.x > Math.min(x0, x1) && b.position.x < Math.max(x0, x1) && b.position.y > y0 && b.position.y < y1 && Math.hypot(b.velocity.x, b.velocity.y) < 1.5);
        const lastOne = this.released >= this.toRelease && inside.length && inside.length === this.balls.length;
        if (inside.length >= full || lastOne) { p.state = 'tip'; this.events.push({ type: 'tip' }); }
      } else if (p.state === 'tip') {
        const d = Math.sign(turn) * Math.min(speed, Math.abs(turn - p.angle));
        M.Body.rotate(p.cup, d, p.axle); p.angle += d;
        if (Math.abs(turn - p.angle) < 1e-6) { p.state = 'wait'; p.timer = 70; }
      } else if (p.state === 'wait') {
        if (--p.timer <= 0) p.state = 'back';
      } else if (p.state === 'back') {
        const d = -Math.sign(p.angle) * Math.min(speed, Math.abs(p.angle));
        M.Body.rotate(p.cup, d, p.axle); p.angle += d;
        if (Math.abs(p.angle) < 1e-6) p.state = 'fill';
      }
    }

    // For testing: run the level with these pieces and report how many balls reached the goal.
    static run(level, placed, maxSteps = 2400) {
      const s = new Sim(level);
      placed.forEach(p => s.add(Object.assign({}, p)));
      s.start();
      while (!s.finished && !s.won && s.t < maxSteps) s.step();
      return { hits: s.hits, won: s.won, steps: s.t, decoy: s.missed || 0 };
    }
  }

  window.BallRun = { Sim, PIECES, CELL, COLS, ROWS, W, H, R, NEED, toWorld, packs: {} };
})();

// ---------- Rescue Station pack: water drops from the fire hose put out a fire ----------
// Each puzzle: hose = column the water comes from, goal = left column of the fire (bottom row),
// fixed = pieces already bolted on, tray = pieces the child places, hint = one way to solve it.
window.BallRun.packs.rescue = {
  id: 'rescue',
  free: { hose: 1, goal: 11, balls: 8 },
  freeTray: ['ramp', 'long', 'curve', 'funnel', 'spring', 'fan', 'seesaw', 'bucket'],
  puzzles: [
    // 1 to 4: one piece
    { hose: 3,  goal: 5,  tray: ['ramp'],   hint: [{ t: 'ramp', c: 3, r: 3 }] },
    { hose: 10, goal: 8,  tray: ['ramp'],   hint: [{ t: 'ramp', c: 10, r: 3, f: true }] },
    { hose: 2,  goal: 5,  tray: ['long'],   hint: [{ t: 'long', c: 1, r: 3 }] },
    { hose: 9,  goal: 6,  tray: ['curve'],  hint: [{ t: 'curve', c: 9, r: 3, f: true }] },
    // 5 to 8: two pieces
    { hose: 1,  goal: 9,  tray: ['long', 'long'],  hint: [{ t: 'long', c: 1, r: 2 }, { t: 'long', c: 5, r: 4 }] },
    { hose: 12, goal: 4,  tray: ['long', 'long'],  hint: [{ t: 'long', c: 9, r: 2, f: true }, { t: 'long', c: 6, r: 4, f: true }] },
    { hose: 2,  goal: 9,  tray: ['long', 'spring'], hint: [{ t: 'long', c: 2, r: 2 }, { t: 'spring', c: 6, r: 5 }] },
    { hose: 11, goal: 4,  tray: ['ramp', 'fan'],   hint: [{ t: 'fan', c: 12, r: 3, f: true }, { t: 'ramp', c: 10, r: 3, f: true }] },
    // 9 to 12: a see-saw or a bucket
    { hose: 4,  goal: 9,  tray: ['seesaw', 'ramp'], hint: [{ t: 'seesaw', c: 3, r: 3, f: true }, { t: 'ramp', c: 6, r: 5 }] },
    { hose: 2,  goal: 8,  tray: ['bucket', 'long'], hint: [{ t: 'bucket', c: 2, r: 1 }, { t: 'long', c: 4, r: 4 }] },
    { hose: 5,  goal: 11, tray: ['seesaw', 'long'], hint: [{ t: 'seesaw', c: 4, r: 3, f: true }, { t: 'long', c: 7, r: 4 }] },
    { hose: 6,  goal: 12, fixed: [{ t: 'block', c: 6, r: 5 }, { t: 'block', c: 9, r: 6 }], tray: ['bucket', 'long'],
      hint: [{ t: 'bucket', c: 5, r: 1 }, { t: 'long', c: 8, r: 4 }] }
  ].map(p => Object.assign({ balls: 6 }, p))
};

// ---------- The ball run screen ----------
// BallRun.mount(cfg) adds one world's ball run game: cfg.screen (also the game id and its progress key),
// cfg.lines (prefix of its voice lines), cfg.pack (levels), cfg.theme (how the source, balls and goal look and sound).
(function () {
  const A = window.App;
  if (!A) return;
  const BR = window.BallRun, { Sim, PIECES, CELL, COLS, ROWS, W, H, R, NEED } = BR;
  const { OL, S3 } = Art;
  const scene = () => document.getElementById('scene');

  Object.assign(CONTENT.lines, {
    'games.ballrun':    'Water Run',
    'ballrun.pick':     'Water Run! Build your own, or try one of my puzzles.',
    'ballrun.free':     'Drag pieces onto the board. Then blow my whistle to turn the water on!',
    'ballrun.puzzle':   'Help the water reach the fire! Drag a piece onto the board, then blow my whistle.',
    'ballrun.go':       'Water on!',
    'ballrun.flip':     'Tap a piece to turn it around.',
    'ballrun.n1':       'One!',
    'ballrun.n2':       'Two!',
    'ballrun.n3':       'Three!',
    'ballrun.out':      'Splish, splash! Three drops of water put the fire out!',
    'ballrun.again':    'Oops! The water missed the fire. Move the pieces and try again.',
    'ballrun.hint':     "Here's a clue. Try putting a piece where it glows.",
    'ballrun.allDone':  'You solved all my puzzles! You are a water run expert!',
    'ballrun.freeOut':  'You put the fire out! What else can you build?',
    'ballrun.bolted':   'That piece is bolted on. Build around it!',
    'ballrun.cleared':  'All clear! Let us build something new.',
    'ballrun.p.ramp':   'A ramp! Water rolls down a slope.',
    'ballrun.p.long':   'A long ramp. The water rolls a long way down it.',
    'ballrun.p.curve':  'A curve. It turns falling water to the side.',
    'ballrun.p.funnel': 'A funnel. It catches the water and drops it through the middle.',
    'ballrun.p.spring': 'A spring! Boing! It bounces the water up into the air.',
    'ballrun.p.fan':    'A fan. Whoosh! It blows the water sideways.',
    'ballrun.p.seesaw': 'A see-saw. When water lands on one end, it tips!',
    'ballrun.p.bucket': 'A bucket. When it fills up, it tips over!'
  });

  const ICON = `<svg viewBox="-60 -60 120 120"><path d="M-50 -30 L0 -6" stroke="${OL}" stroke-width="13" stroke-linecap="round"/><path d="M-50 -30 L0 -6" stroke="#f07a1a" stroke-width="8" stroke-linecap="round"/>
    <path d="M40 -14 L-6 18" stroke="${OL}" stroke-width="13" stroke-linecap="round"/><path d="M40 -14 L-6 18" stroke="#1e5bd6" stroke-width="8" stroke-linecap="round"/>
    <path d="M-30 -50 Q-22 -38 -30 -34 Q-38 -38 -30 -50 Z" fill="#5cc3ff" ${S3}/><circle cx="16" cy="-18" r="8" fill="#5cc3ff" ${S3}/>
    <path d="M-16 50 Q-24 30 -12 18 Q-10 32 -2 30 Q2 16 10 12 Q22 30 14 50 Z" fill="#f07a1a" ${S3}/><path d="M-8 50 Q-10 38 -4 32 Q0 40 6 38 Q10 46 6 50 Z" fill="#ffd21f"/></svg>`;

  const WHISTLE = `<svg viewBox="0 0 64 64"><path d="M8 26 H34 A14 14 0 1 1 22 46 H16 Q8 46 8 38 Z" fill="#fff"/><circle cx="36" cy="40" r="6" fill="#0097a7"/><rect x="26" y="18" width="10" height="10" rx="2" fill="#fff"/>
    <path d="M44 14 L50 8 M50 22 L58 20 M40 10 L40 4" stroke="#fff" stroke-width="4" stroke-linecap="round"/></svg>`;
  const BIN = `<svg viewBox="0 0 64 64"><path d="M16 20 H48 L45 54 H19 Z" fill="#fff"/><path d="M12 16 H52 M26 16 V10 H38 V16" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M26 26 V46 M38 26 V46" stroke="#e53935" stroke-width="4" stroke-linecap="round"/></svg>`;
  const LIST = `<svg viewBox="0 0 64 64">${[0, 1, 2].map(r => [0, 1, 2].map(c => `<rect x="${10 + c * 16}" y="${10 + r * 16}" width="12" height="12" rx="3" fill="#fff"/>`).join('')).join('')}</svg>`;
  const NEXT = `<svg viewBox="0 0 64 64"><path d="M14 32 H46 M34 18 L48 32 L34 46" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  // ---------- Drawing ----------
  const line = (ctx, x1, y1, x2, y2, colour, w) => { ctx.strokeStyle = colour; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };
  const poly = (ctx, verts, fill, stroke = OL, w = 4) => {
    ctx.beginPath(); verts.forEach((v, i) => i ? ctx.lineTo(v.x, v.y) : ctx.moveTo(v.x, v.y)); ctx.closePath();
    ctx.fillStyle = fill; ctx.fill(); ctx.lineWidth = w; ctx.strokeStyle = stroke; ctx.lineJoin = 'round'; ctx.stroke();
  };
  const bolt = (ctx, x, y, fixed) => { ctx.fillStyle = fixed ? '#596178' : '#fff'; ctx.strokeStyle = OL; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(x, y, fixed ? 6 : 4.5, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); };

  function drawPiece(ctx, p, now, k = 1) {
    const d = PIECES[p.t], tw = (u, v) => BR.toWorld(p, u, v);
    if (d.segs) {
      const segs = d.segs.map(([a, b, c, e]) => [...tw(a, b), ...tw(c, e)]);
      segs.forEach(s => line(ctx, ...s, OL, (12 + 7) * k));
      segs.forEach(s => line(ctx, ...s, d.colour, 12 * k));
      segs.forEach(s => line(ctx, s[0], s[1] - 2, s[2], s[3] - 2, 'rgba(255,255,255,.35)', 3));
      const f = segs[0], l = segs[segs.length - 1];
      bolt(ctx, f[0], f[1], p.fixed); bolt(ctx, l[2], l[3], p.fixed);
    }
    if (d.kind === 'block') {
      const x = p.c * CELL + 4, y = p.r * CELL + 4, s = CELL - 8;
      ctx.fillStyle = d.colour; ctx.strokeStyle = OL; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.roundRect(x, y, s, s, 10); ctx.fill(); ctx.stroke();
      line(ctx, x + 6, y + s / 3, x + s - 6, y + s / 3, '#a9442f', 3); line(ctx, x + 6, y + 2 * s / 3, x + s - 6, y + 2 * s / 3, '#a9442f', 3);
      line(ctx, x + s / 2, y + 6, x + s / 2, y + s / 3, '#a9442f', 3); line(ctx, x + s / 4, y + s / 3, x + s / 4, y + 2 * s / 3, '#a9442f', 3);
      line(ctx, x + 3 * s / 4, y + s / 3, x + 3 * s / 4, y + 2 * s / 3, '#a9442f', 3); line(ctx, x + s / 2, y + 2 * s / 3, x + s / 2, y + s - 6, '#a9442f', 3);
      bolt(ctx, x + 10, y + 10, true); bolt(ctx, x + s - 10, y + 10, true);
    }
    if (d.kind === 'spring') {
      const [x] = tw(0.5, 0), squash = (p.boing || 0) * 1.4;
      const top = (p.r + 0.62) * CELL + squash, base = (p.r + 0.92) * CELL;
      ctx.beginPath(); ctx.moveTo(x - 24, base);
      for (let i = 1; i <= 6; i++) ctx.lineTo(x + (i % 2 ? 24 : -24), base - (base - top) * i / 6);
      ctx.strokeStyle = OL; ctx.lineWidth = 9; ctx.lineJoin = 'round'; ctx.stroke(); ctx.strokeStyle = '#c3cad6'; ctx.lineWidth = 5; ctx.stroke();
      ctx.fillStyle = '#596178'; ctx.beginPath(); ctx.roundRect(x - 36, base - 4, 72, 12, 5); ctx.fill();
      ctx.fillStyle = d.colour; ctx.strokeStyle = OL; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(x - 40, top - 8, 80, 16, 7); ctx.fill(); ctx.stroke();
      const [ax] = tw(0.78, 0); // a small arrow shows which way it throws
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(ax, top - 4); ctx.lineTo(ax + (p.f ? 8 : -8), top - 1); ctx.lineTo(ax + (p.f ? 8 : -8), top - 7); ctx.fill();
    }
    if (d.kind === 'fan') {
      const [x0, y0] = tw(0.15, 0.25), [x1] = tw(0.65, 0), y1 = (p.r + 1.75) * CELL;
      const left = Math.min(x0, x1), wdt = Math.abs(x1 - x0), dir = p.f ? -1 : 1;
      if (p.wind && now != null) { // moving air
        ctx.save(); ctx.globalAlpha = .45; ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 5; ctx.lineCap = 'round';
        for (let i = 0; i < 4; i++) {
          const y = p.r * CELL + 30 + i * 46, ph = ((now / 6 + i * 70) % 300);
          const xs = dir > 0 ? p.wind.x0 + ph : p.wind.x1 - ph;
          ctx.beginPath(); ctx.moveTo(xs, y); ctx.quadraticCurveTo(xs + dir * 30, y - 10, xs + dir * 60, y); ctx.stroke();
        }
        ctx.restore();
      }
      ctx.fillStyle = '#9fb1c7'; ctx.strokeStyle = OL; ctx.lineWidth = 4; ctx.beginPath(); ctx.roundRect(left, y0, wdt, y1 - y0, 12); ctx.fill(); ctx.stroke();
      const cx = tw(0.68, 0)[0], cy = (p.r + 1) * CELL, a = (now || 0) / 60;
      ctx.save(); ctx.translate(cx, cy); ctx.scale(0.45, 1);
      for (let i = 0; i < 3; i++) { ctx.rotate(Math.PI * 2 / 3); ctx.fillStyle = d.colour; ctx.beginPath(); ctx.ellipse(0, -30 * Math.cos(a), 14, 30 * Math.abs(Math.cos(a)) + 4, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); }
      ctx.restore();
      ctx.fillStyle = OL; ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI * 2); ctx.fill();
    }
    if (d.kind === 'seesaw') {
      const { x, y } = p.pivot;
      poly(ctx, [{ x, y }, { x: x - 30, y: (p.r + 1) * CELL - 4 }, { x: x + 30, y: (p.r + 1) * CELL - 4 }], '#596178');
      poly(ctx, p.plank.vertices, d.colour);
      bolt(ctx, x, y, false);
    }
    if (d.kind === 'bucket') {
      p.cup.parts.slice(1).forEach(part => poly(ctx, part.vertices, d.colour, OL, 4));
      ctx.fillStyle = '#596178'; ctx.beginPath(); ctx.arc(p.axle.x, p.axle.y, 9, 0, Math.PI * 2); ctx.fill();
    }
  }

  // Pictures of single pieces, for the tray and for ghosts while dragging.
  const shapeOf = (t, f) => { const s = new Sim({ hose: -5, goal: -5 }); return s.add({ t, c: 0, r: 0, f: !!f }); };
  function pieceIcon(t) {
    const d = PIECES[t], cv = document.createElement('canvas'), k = 2;
    const pw = d.w * CELL, ph = d.h * CELL, size = Math.max(pw, ph) + 30;
    cv.width = cv.height = 160 * k;
    const ctx = cv.getContext('2d');
    ctx.scale(160 * k / size, 160 * k / size); ctx.translate((size - pw) / 2, (size - ph) / 2);
    drawPiece(ctx, shapeOf(t), null, 2);
    return cv;
  }

  function drawBoard(ctx, now) {
    const g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#fdf3dc'); g.addColorStop(1, '#f6e2b8');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(138,90,60,.22)';
    for (let c = 1; c < COLS; c++) for (let r = 1; r < ROWS; r++) { ctx.beginPath(); ctx.arc(c * CELL, r * CELL, 5, 0, Math.PI * 2); ctx.fill(); }
    ctx.fillStyle = '#7cc46a'; ctx.fillRect(0, H - 8, W, 8);
  }

  BR.draw = { line, poly, bolt };

  // ---------- Rescue Station theme: water drops from the fire hose put out a fire ----------
  function drawFire(ctx, x, y, level, now) {
    // logs
    ctx.save(); ctx.translate(x, y);
    [[-50, -6, 40, -16], [-40, -16, 50, -4]].forEach(([a, b, c, e]) => { line(ctx, a, b, c, e, OL, 22); line(ctx, a, b, c, e, '#8a5a3c', 15); });
    if (level > 0) {
      const s = 0.45 + 0.55 * level / NEED;
      [[-30, '#e53935', 1], [26, '#e53935', .9], [0, '#f07a1a', 1.25]].forEach(([dx, col, k], i) => {
        const fl = Math.sin(now / 90 + i * 2) * 6;
        const h = 90 * s * k + fl, w = 34 * s * k;
        ctx.beginPath(); ctx.moveTo(dx - w, -12); ctx.quadraticCurveTo(dx - w * 1.1, -h * .5, dx + fl * .4, -h); ctx.quadraticCurveTo(dx + w * 1.1, -h * .5, dx + w, -12); ctx.closePath();
        ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = OL; ctx.lineWidth = 3; ctx.stroke();
      });
      const fl = Math.sin(now / 70) * 4;
      ctx.beginPath(); ctx.moveTo(-18 * s, -12); ctx.quadraticCurveTo(-16 * s, -50 * s, fl, -70 * s); ctx.quadraticCurveTo(16 * s, -50 * s, 18 * s, -12); ctx.fillStyle = '#ffd21f'; ctx.fill();
    }
    ctx.restore();
  }
  function drawHose(ctx, col, now, dripping) {
    const x = (col + 0.5) * CELL;
    line(ctx, x - 70, -10, x - 70, 20, OL, 30); line(ctx, x - 70, -10, x - 70, 20, '#e53935', 22);
    ctx.beginPath(); ctx.moveTo(x - 70, 20); ctx.quadraticCurveTo(x - 70, 40, x - 30, 40); ctx.lineTo(x - 12, 40);
    ctx.strokeStyle = OL; ctx.lineWidth = 30; ctx.lineCap = 'round'; ctx.stroke(); ctx.strokeStyle = '#e53935'; ctx.lineWidth = 22; ctx.stroke();
    poly(ctx, [{ x: x - 16, y: 26 }, { x: x + 16, y: 26 }, { x: x + 10, y: 62 }, { x: x - 10, y: 62 }], '#ffd21f');
    line(ctx, x - 16, 36, x + 16, 36, '#e0a800', 4);
    if (dripping) { ctx.fillStyle = '#5cc3ff'; ctx.beginPath(); ctx.arc(x, 66 + (now / 20) % 8, 5, 0, Math.PI * 2); ctx.fill(); }
  }
  function drawBall(ctx, b) {
    const { x, y } = b.position;
    ctx.fillStyle = '#5cc3ff'; ctx.strokeStyle = OL; ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.beginPath(); ctx.arc(x - 4, y - 5, 4, 0, Math.PI * 2); ctx.fill();
  }
  const water = {
    source: (ctx, level, now, dripping) => drawHose(ctx, level.hose, now, dripping),
    ball: (ctx, b) => drawBall(ctx, b),
    goal: (ctx, st) => drawFire(ctx, (st.level.goal + 1) * CELL, H - 6, NEED - st.hits, st.now),
    splash: '#5cc3ff',
    hit(ev, fx) { Sfx.splash(); Sfx.hiss(); fx.burst(ev.x, ev.y, 10, '#bfe6ff', 1.4); fx.steam = 40; },
    win(fx) { fx.steam = 120; },
    over(ctx, st) {
      const fx = st.fx;
      if (fx.steam <= 0) return;
      fx.steam--;
      const x = (st.level.goal + 1) * CELL, now = st.now;
      for (let i = 0; i < 4; i++) { const k = ((now / 12 + i * 25) % 100) / 100; ctx.globalAlpha = (1 - k) * Math.min(1, fx.steam / 30) * .7; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(x + Math.sin(i * 2 + k * 5) * 30, H - 60 - k * 160, 20 + k * 30, 0, Math.PI * 2); ctx.fill(); }
      ctx.globalAlpha = 1;
    },
    tapGoal() { Sfx.crackle(); }
  };

  BR.mount = cfg => {
    const { screen, pack, theme } = cfg, L = k => cfg.lines + '.' + k;
    A.addGame(screen, cfg.colour, cfg.icon, { world: cfg.world, back: cfg.back });
    const solved = () => (A.progress[screen] = A.progress[screen] || []);

    // ---------- Mode picker ----------
    function picker() {
      A.ui({ home: true });
      const done = solved(), next = pack.puzzles.findIndex((_, i) => !done.includes(i));
      scene().innerHTML = `
        <div class="br-pick ${cfg.cls || ''}">
          <button class="br-free" style="background:${cfg.colour}" aria-label="Build your own"><span class="art">${cfg.icon}</span><span class="label">Build</span></button>
          <div class="br-levels">${pack.puzzles.map((_, i) => `<button class="br-level${done.includes(i) ? ' done' : ''}${i === next ? ' next' : ''}" data-i="${i}" aria-label="Puzzle ${i + 1}">
            <span>${i + 1}</span>${done.includes(i) ? '<b aria-hidden="true">★</b>' : ''}</button>`).join('')}</div>
        </div>`;
      scene().querySelector('.br-free').onclick = () => { Sfx.pop(); A.go(screen, 'free'); };
      scene().querySelectorAll('.br-level').forEach(b => b.onclick = () => { Sfx.pop(); A.go(screen, +b.dataset.i + 1); });
      A.say(L('pick'));
    }

    // ---------- Playing ----------
    A.screens[screen] = (arg, alive) => {
      if (!arg) return picker();
      const free = arg === 'free', index = free ? -1 : arg - 1, level = free ? pack.free : pack.puzzles[index];
      A.ui({ home: true });
      scene().innerHTML = `
        <div class="ballrun ${cfg.cls || ''}">
          <div class="br-board"><canvas></canvas></div>
          <div class="br-side">
            <div class="br-tray"></div>
            <div class="br-controls">
              ${free ? `<button class="big-btn br-clear" style="background:#e86aa6" aria-label="Clear the board">${BIN}</button>`
                     : `<button class="big-btn br-list" style="background:#8e5bd6" aria-label="All puzzles">${LIST}</button>`}
              <button class="big-btn br-go" style="background:${cfg.colour}" aria-label="Blow the whistle">${WHISTLE}</button>
            </div>
          </div>
          <div class="br-drag" hidden></div>
        </div>`;
      const root = scene().querySelector('.ballrun'), boardEl = root.querySelector('.br-board'), cv = boardEl.querySelector('canvas'), ctx = cv.getContext('2d');
      const trayEl = root.querySelector('.br-tray'), dragEl = root.querySelector('.br-drag'), goBtn = root.querySelector('.br-go');
      const sim = new Sim(level);
      let scale = 1, hits = 0, fails = 0, hint = null, won = false, said = {};
      const parts = [];
      const fx = { steam: 0, shake: 0, chew: 0, burst: (x, y, n, colour, up = 1) => { for (let i = 0; i < n; i++) parts.push({ x, y, vx: (Math.random() - .5) * 8, vy: -Math.random() * 7 * up, life: 30, colour }); } };
      const tray = free ? pack.freeTray.map(t => ({ t, endless: true })) : level.tray.map(t => ({ t, placed: null }));

      // Fit the 14 x 8 board into the space, keeping its shape.
      function fit() {
        const r = boardEl.getBoundingClientRect(), dpr = Math.min(2, window.devicePixelRatio || 1);
        scale = Math.min(r.width / W, r.height / H);
        cv.style.width = W * scale + 'px'; cv.style.height = H * scale + 'px';
        cv.width = Math.round(W * scale * dpr); cv.height = Math.round(H * scale * dpr);
        ctx.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0);
      }
      fit();
      const onResize = () => { if (alive()) fit(); else window.removeEventListener('resize', onResize); };
      window.addEventListener('resize', onResize);

      function renderTray() {
        trayEl.innerHTML = '';
        tray.forEach((it, i) => {
          const b = document.createElement('button');
          b.className = 'br-item' + (it.placed ? ' used' : '');
          b.setAttribute('aria-label', it.t);
          b.appendChild(pieceIcon(it.t));
          b.addEventListener('pointerdown', e => { if (!it.placed) startDrag(e, { t: it.t, f: false, tray: i }, null); });
          trayEl.appendChild(b);
        });
      }
      renderTray();

      // ----- Dragging pieces -----
      let drag = null;
      const toBoard = e => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) / scale, y: (e.clientY - r.top) / scale, inside: e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom }; };
      function startDrag(e, piece, from) {
        if (drag) return;
        e.preventDefault();
        Sfx.tap(); A.Hint.clear();
        drag = { piece, from, x0: e.clientX, y0: e.clientY, moved: false, id: e.pointerId, shape: shapeOf(piece.t, piece.f) };
        if (!said[piece.t] && !from) { said[piece.t] = true; A.say(L('p.' + piece.t)); }
        dragEl.innerHTML = ''; dragEl.appendChild(pieceIcon(piece.t));
        moveDrag(e);
      }
      function snap(e) {
        const pt = toBoard(e), d = PIECES[drag.piece.t];
        return { pt, c: Math.round(pt.x / CELL - d.w / 2), r: Math.round(pt.y / CELL - d.h / 2) };
      }
      function moveDrag(e) {
        if (!drag || e.pointerId !== drag.id) return;
        if (Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) > 10) drag.moved = true;
        const s = snap(e);
        drag.at = s.pt.inside ? { c: s.c, r: s.r } : null;
        drag.ok = drag.at && sim.fits(Object.assign({}, drag.piece, drag.at));
        const rr = root.getBoundingClientRect();
        dragEl.hidden = !!drag.at || !drag.moved && !!drag.from;
        dragEl.style.left = (e.clientX - rr.left) + 'px'; dragEl.style.top = (e.clientY - rr.top) + 'px';
      }
      function endDrag(e) {
        if (!drag || e.pointerId !== drag.id) return;
        const d = drag; drag = null; dragEl.hidden = true;
        const p = d.piece;
        if (d.from && !d.moved) { // a tap on a piece on the board turns it around
          p.f = PIECES[p.t].flip ? !p.f : p.f;
          if (!sim.fits(p)) p.f = !p.f;
          sim.add(p); Sfx.whoosh();
          return;
        }
        if (d.at && d.ok) {
          Object.assign(p, d.at); delete p.bodies;
          sim.add(p); Sfx.pop();
          if (p.tray != null && !tray[p.tray].endless) tray[p.tray].placed = p;
          if (!said.flip && PIECES[p.t].flip) { said.flip = true; A.later(() => { if (!A.isTalking()) A.say(L('flip')); }, 2600); }
        } else {
          if (d.at && !d.ok) Sfx.boing();
          if (p.tray != null && !tray[p.tray].endless) tray[p.tray].placed = null;
        }
        renderTray();
      }
      cv.addEventListener('pointerdown', e => {
        const pt = toBoard(e), c = Math.floor(pt.x / CELL), r = Math.floor(pt.y / CELL), key = c + ',' + r;
        const p = sim.pieces.find(q => Sim.cells(q).includes(key));
        if (p && p.fixed) { Sfx.clank(1); A.say(L('bolted')); return; }
        if (p) { sim.remove(p); startDrag(e, p, 'board'); return; }
        if (r >= ROWS - 1 && (c === level.goal || c === level.goal + 1)) { theme.tapGoal(level); return; }
        if (r >= ROWS - 1 && level.decoy != null && (c === level.decoy || c === level.decoy + 1)) { if (theme.tapDecoy) theme.tapDecoy(level); return; }
        if (r === 0 && c === level.hose) go();
      });
      root.addEventListener('pointermove', moveDrag);
      root.addEventListener('pointerup', endDrag);
      root.addEventListener('pointercancel', e => { if (drag) { drag.at = null; endDrag(e); } });

      // ----- Running the balls -----
      function go() {
        if (won && !free) return;
        Sfx.whistle(); A.Pip.act('jump'); A.Hint.clear();
        sim.start(); hits = 0; fx.steam = 0; won = false; refused = false;
        A.say(L('go'));
      }
      goBtn.onclick = go;
      const clear = root.querySelector('.br-clear');
      if (clear) clear.onclick = () => { Sfx.whoosh(); [...sim.pieces].forEach(p => sim.remove(p)); sim.start(); sim.running = false; hits = 0; won = false; A.say(L('cleared')); };
      const list = root.querySelector('.br-list');
      if (list) list.onclick = () => { Sfx.tap(); A.go(screen); };

      let lastTap = 0, refused = false;
      function handle(ev) {
        if (ev.type === 'release') (theme.release || Sfx.drip)();
        if (ev.type === 'tap' && sim.t - lastTap > 4) { lastTap = sim.t; Sfx.plink(1 + Math.random() * .3); }
        if (ev.type === 'spring') Sfx.sproing();
        if (ev.type === 'tip') Sfx.whoosh();
        if (ev.type === 'splash') fx.burst(ev.x, H - 8, 6, theme.splash);
        if (ev.type === 'decoy') {
          fx.shake = 40; Sfx.boing();
          if (!refused && theme.refuse) { refused = true; A.say(theme.refuse(level)); }
        }
        if (ev.type === 'hit') {
          hits = ev.n; theme.hit(ev, fx, level);
          if (ev.n <= NEED) A.say(L('n' + ev.n));
        }
        if (ev.type === 'win') win();
      }
      async function win() {
        won = true; A.Hint.clear(); hint = null; theme.win(fx);
        await A.wait(900);
        if (!alive()) return;
        A.Pip.mood('cheer'); A.Pip.act('dance');
        if (free) { A.confetti(); Sfx.chime(); A.say(L('freeOut')); return; }
        const first = !solved().includes(index);
        if (first) { solved().push(index); A.saveProgress(); }
        await A.say(theme.winLine ? theme.winLine(level) : L('out'));
        if (!alive()) return;
        const last = solved().length === pack.puzzles.length && first;
        A.gameDone(screen, { buttons: false });
        if (last) A.later(() => A.say(L('allDone')), 4500);
        const end = document.createElement('div');
        end.className = 'game-end';
        end.innerHTML = `<button class="big-btn" style="background:#8e5bd6" aria-label="All puzzles">${LIST}</button>
          ${index + 1 < pack.puzzles.length ? `<button class="big-btn" style="background:#2e9e4f" aria-label="Next puzzle">${NEXT}</button>` : ''}`;
        scene().appendChild(end);
        const [l, n] = end.querySelectorAll('button');
        l.onclick = () => { Sfx.tap(); A.go(screen); };
        if (n) n.onclick = () => { Sfx.tap(); A.go(screen, index + 2); };
      }
      function missed() {
        sim.running = false;
        if (won) return;
        fails++;
        if (!free && fails >= 2) showHint(); else A.say(L('again'));
      }
      function showHint() {
        const placed = sim.pieces.filter(p => !p.fixed);
        const want = level.hint.find(h => !placed.some(p => p.t === h.t && p.c === h.c && p.r === h.r && !!p.f === !!h.f));
        if (!want) { A.say(L('again')); return; }
        hint = { piece: Object.assign({}, want, { f: !!want.f }), shape: shapeOf(want.t, want.f) };
        A.say(L('hint'));
      }

      // ----- Animation loop: fixed physics steps, drawn every frame -----
      let acc = 0, last = performance.now();
      function frame(now) {
        if (!alive()) return;
        acc += Math.min(100, now - last); last = now;
        while (acc >= 1000 / 60) {
          acc -= 1000 / 60;
          if (fx.shake > 0) fx.shake--;
          if (fx.chew > 0) fx.chew--;
          if (sim.running) {
            sim.step();
            sim.events.splice(0).forEach(handle);
            if (sim.finished) missed();
          } else sim.pieces.forEach(p => { if (p.boing) p.boing--; });
        }
        draw(now);
        requestAnimationFrame(frame);
      }
      function draw(now) {
        const st = { level, now, hits: won ? NEED : hits, fx, running: sim.running, won };
        (theme.board || drawBoard)(ctx, now, level);
        if (hint) {
          ctx.save(); ctx.translate(hint.piece.c * CELL, hint.piece.r * CELL); ctx.globalAlpha = .35 + .3 * Math.sin(now / 200);
          const d = PIECES[hint.piece.t];
          ctx.fillStyle = '#ffd21f'; ctx.beginPath(); ctx.roundRect(0, 0, d.w * CELL, d.h * CELL, 16); ctx.fill();
          drawPiece(ctx, hint.shape, now); ctx.restore();
        }
        sim.pieces.forEach(p => drawPiece(ctx, p, now));
        if (level.decoy != null && theme.decoy) theme.decoy(ctx, st);
        theme.goal(ctx, st);
        sim.balls.forEach(b => theme.ball(ctx, b, level));
        theme.source(ctx, level, now, sim.running && sim.released < sim.toRelease);
        for (let i = parts.length - 1; i >= 0; i--) {
          const q = parts[i]; q.x += q.vx; q.y += q.vy; q.vy += .5; q.life--;
          if (q.life <= 0) { parts.splice(i, 1); continue; }
          ctx.globalAlpha = q.life / 30; ctx.fillStyle = q.colour; ctx.beginPath(); ctx.arc(q.x, q.y, 6, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
        }
        if (theme.over) theme.over(ctx, st);
        if (drag && drag.at) {
          const d = PIECES[drag.piece.t];
          ctx.save(); ctx.translate(drag.at.c * CELL, drag.at.r * CELL);
          ctx.fillStyle = drag.ok ? 'rgba(46,158,79,.25)' : 'rgba(229,57,53,.25)';
          ctx.beginPath(); ctx.roundRect(0, 0, d.w * CELL, d.h * CELL, 16); ctx.fill();
          if (!!drag.shape.f !== !!drag.piece.f) drag.shape = shapeOf(drag.piece.t, drag.piece.f);
          ctx.globalAlpha = .75; drawPiece(ctx, drag.shape, now); ctx.restore();
        }
      }
      requestAnimationFrame(frame);

      if (free) A.say(L('free'));
      else if (theme.intro) A.say(theme.intro(level, index));
      else A.say(L('puzzle'));
      if (!free) A.Hint.set([trayEl.querySelector('.br-item')], L('puzzle'));
      A.ballrun = { sim, level, go, tray }; // for testing
    };
  };

  BR.mount({ screen: 'ballrun', lines: 'ballrun', colour: '#0097a7', icon: ICON, pack: BR.packs.rescue, theme: water });
})();
