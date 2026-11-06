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
  // The gate is a ramp with a trapdoor in it; whatever falls through drops down a short chute (the CHUTE walls).
  const GATE = [[0.08, 0.14, 0.62, 0.32], [1.38, 0.58, 1.92, 0.76]], CHUTE = [[0.62, 0.48, 0.62, 1.9], [1.38, 0.72, 1.38, 1.9]];
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
    shelf:  { w: 2, h: 1, flip: false, colour: '#9aa3b5', segs: [[0.06, 0.5, 1.94, 0.5]] },
    // Logic pieces. Each carries a kind (p.k): which food or colour it is about.
    // gate: a ramp with a trapdoor in the middle that only things of kind k fall through (down a chute); the rest roll over it.
    // not:  the opposite trapdoor: everything falls through except kind k.
    // flip: a flip-flop: a paddle under a little funnel that sends one thing left, then the next thing right.
    gate:   { w: 2, h: 2, flip: true, colour: '#00a19a', kind: 'gate', segs: GATE, trap: [0.62, 0.32, 1.38, 0.58], chute: CHUTE },
    not:    { w: 2, h: 2, flip: true, colour: '#e86aa6', kind: 'not', segs: GATE, trap: [0.62, 0.32, 1.38, 0.58], chute: CHUTE },
    flip:   { w: 2, h: 2, flip: true, colour: '#f2b705', kind: 'flip', segs: [[0.1, 0.06, 0.72, 0.6], [1.9, 0.06, 1.28, 0.6]] },
    // count: a counting gate: its trapdoor lets the first k things through (any kind), then shuts.
    // bin:   a reject bin: anything that falls in stays there.
    count:  { w: 2, h: 2, flip: true, colour: '#1e5bd6', kind: 'count', segs: GATE, trap: [0.62, 0.32, 1.38, 0.58], chute: CHUTE },
    bin:    { w: 2, h: 2, flip: false, colour: '#596178', kind: 'bin', segs: [[0.12, 0.3, 0.3, 1.88], [0.3, 1.88, 1.7, 1.88], [1.7, 1.88, 1.88, 0.3]] }
  };
  // Collision groups: the board and pieces are group 1, the trapdoors group 2, and each kind of ball has its own bit.
  const TRAP = 0x0002, kindBit = (level, k) => { const i = (level.kinds || []).indexOf(k); return i < 0 ? 0 : 0x0010 << i; };
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
      // Logic levels: level.want is the only kind the goal takes; an optional second goal (goal2) takes level.want2.
      if (level.goal2 != null) M.Composite.add(this.world, M.Bodies.rectangle((level.goal2 + 1) * CELL, H - 55, 2 * CELL - 30, 110, { isStatic: true, isSensor: true, label: 'goal2' }));
      M.Events.on(this.engine, 'collisionStart', e => e.pairs.forEach(pr => this.touch(pr.bodyA, pr.bodyB)));
      (level.fixed || []).forEach(p => this.add(Object.assign({ fixed: true }, p)));
    }

    // Which cells a piece covers; used to stop pieces overlapping.
    static cells(p) { const d = PIECES[p.t], out = []; for (let i = 0; i < d.w; i++) for (let j = 0; j < d.h; j++) out.push((p.c + i) + ',' + (p.r + j)); return out; }
    // The hose (top row) and the goal and decoy (bottom row) can't be built over.
    reserved() {
      const l = this.level, s = new Set([l.hose + ',0', l.goal + ',' + (ROWS - 1), (l.goal + 1) + ',' + (ROWS - 1)]);
      [l.decoy, l.goal2].forEach(g => { if (g != null) { s.add(g + ',' + (ROWS - 1)); s.add((g + 1) + ',' + (ROWS - 1)); } });
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
      if (d.trap) {
        const bit = kindBit(this.level, p.k), [x1, y1] = toWorld(p, d.trap[0], d.trap[1]), [x2, y2] = toWorld(p, d.trap[2], d.trap[3]);
        // An Only gate is solid for every kind but its own; a Not gate is solid only for its own kind.
        const mask = d.kind === 'gate' ? 0xFFFF & ~bit : d.kind === 'count' ? 0 : bit;
        const trap = seg(x1, y1, x2, y2, { collisionFilter: { category: TRAP, mask, group: 0 } });
        bodies.push(trap);
        if (d.kind === 'count') { // a sensor in the chute counts what falls through; the trapdoor shuts at k
          const [cx, cy] = toWorld(p, 1, 1.1);
          const eye = M.Bodies.rectangle(cx, cy, CELL * 0.6, 20, { isStatic: true, isSensor: true, label: 'counter' });
          p.trap = trap; p.passed = 0; p.seen = new Set(); bodies.push(eye);
        }
        d.chute.forEach(([a, b, c2, e]) => { const [x1, y1] = toWorld(p, a, b), [x2, y2] = toWorld(p, c2, e); bodies.push(seg(x1, y1, x2, y2)); });
      }
      if (d.kind === 'flip') {
        const [x, y] = toWorld(p, 1, 1.42);
        const paddle = M.Bodies.rectangle(x, y, CELL * 1.1, TH + 2, { isStatic: true, chamfer: { radius: 6 }, label: 'flip', friction: 0.01, restitution: 0.1 });
        p.paddle = paddle; p.hinge = { x, y }; p.side = 1; p.pending = 0; p.seen = new Set();
        M.Body.setAngle(paddle, 0.62 * (p.f ? -1 : 1));
        bodies.push(paddle);
      }
      if (d.kind === 'bin') {
        const [x, y] = toWorld(p, 1, 1.45);
        bodies.push(M.Bodies.rectangle(x, y, CELL * 1.2, CELL * 0.7, { isStatic: true, isSensor: true, label: 'bin' }));
      }
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
      this.balls = []; this.t = 0; this.hits = 0; this.hits2 = 0; this.released = 0; this.running = true; this.won = false; this.spoiled = false; this.missed = 0;
      this.toRelease = this.level.balls || 6;
      this.pieces.forEach(p => this.resetPiece(p));
    }
    resetPiece(p) {
      if (p.plank) { M.Body.setAngle(p.plank, -0.32 * (p.f ? -1 : 1)); M.Body.setAngularVelocity(p.plank, 0); M.Body.setVelocity(p.plank, { x: 0, y: 0 }); M.Body.setPosition(p.plank, p.pivot); }
      if (p.cup && p.angle) { M.Body.rotate(p.cup, -p.angle, p.axle); p.angle = 0; p.state = 'fill'; }
      if (p.paddle) { p.side = 1; p.pending = 0; p.seen = new Set(); M.Body.setAngle(p.paddle, 0.62 * (p.f ? -1 : 1)); }
      if (p.trap) { p.passed = 0; p.seen = new Set(); p.trap.collisionFilter.mask = 0; }
    }
    // The flip-flop paddle swaps sides a moment after each new thing lands on it.
    flipNow(p) { p.side = -p.side; p.pending = 0; M.Body.setAngle(p.paddle, 0.62 * (p.f ? -1 : 1) * p.side); this.events.push({ type: 'flip' }); }
    // A run is over when every ball has gone.
    get finished() { return this.running && this.released >= this.toRelease && this.balls.length === 0; }

    touch(a, b) {
      const ball = a.label === 'ball' ? a : b.label === 'ball' ? b : null;
      if (!ball) return;
      const other = ball === a ? b : a;
      const l = this.level;
      if ((other.label === 'goal' || other.label === 'goal2') && !ball.gone) {
        ball.gone = true;
        const g = other.label === 'goal' ? 1 : 2, want = g === 1 ? l.want : l.want2;
        if (want != null && ball.kind !== want) { // the wrong kind: this run can't win, and no more are sent
          if (!this.won) { this.spoiled = true; this.toRelease = this.released; }
          this.events.push({ type: 'wrong', g, kind: ball.kind, x: ball.position.x, y: ball.position.y });
          return;
        }
        const n = g === 1 ? ++this.hits : ++this.hits2;
        this.events.push({ type: 'hit', g, x: ball.position.x, y: ball.position.y, n, idx: ball.idx, kind: ball.kind });
        if (!this.won && !this.spoiled && this.hits >= NEED && (l.goal2 == null || this.hits2 >= NEED)) { this.won = true; this.events.push({ type: 'win' }); }
      } else if (other.label === 'counter') {
        const p = other.piece;
        if (!p.seen.has(ball.id) && p.passed < p.k) { p.seen.add(ball.id); p.passed++; this.events.push({ type: 'count', n: p.passed });
          if (p.passed >= p.k) { p.trap.collisionFilter.mask = 0xFFFF; this.events.push({ type: 'shut' }); } }
      } else if (other.label === 'bin' && !ball.gone) {
        ball.gone = true; this.events.push({ type: 'binned', x: ball.position.x, y: ball.position.y, kind: ball.kind });
      } else if (other.label === 'flip') {
        const p = other.piece;
        if (!p.seen.has(ball.id)) { p.seen.add(ball.id); if (!p.pending) p.pending = this.t + 9; }
      } else if (other.label === 'decoy' && !ball.gone) {
        ball.gone = true; this.missed++;
        // In logic levels (mixed kinds) the decoy must be kept clear: anything landing on it spoils the run.
        if (l.mix && !this.won) { this.spoiled = true; this.toRelease = this.released; }
        this.events.push({ type: 'decoy', x: ball.position.x, y: ball.position.y, kind: ball.kind });
      } else if (other.label === 'spring' && this.t - (ball.sprung || -99) > 10) {
        ball.sprung = this.t;
        const dir = other.piece.f ? -1 : 1;
        M.Body.setVelocity(ball, { x: 3.4 * dir, y: -12.5 });
        other.piece.boing = 12;
        this.events.push({ type: 'spring', x: ball.position.x, y: ball.position.y });
      } else if (other.label === 'floor') {
        if (!ball.gone) this.events.push({ type: 'splash', x: ball.position.x, y: H, kind: ball.kind });
        ball.gone = true;
      } else if (other.label === 'part' && Math.hypot(ball.velocity.x, ball.velocity.y) > 4) {
        this.events.push({ type: 'tap', x: ball.position.x, y: ball.position.y });
      }
    }

    step() {
      this.t++;
      if (this.running && this.released < this.toRelease && this.t % GAP === 1) {
        const ball = M.Bodies.circle((this.level.hose + 0.5) * CELL, 70, R, { restitution: 0.25, friction: 0.005, frictionStatic: 0.02, frictionAir: 0.004, density: 0.002, label: 'ball' });
        ball.born = this.t; ball.idx = this.released; // idx: which ball this is (0 = first), for numbered balls
        if (this.level.mix) { ball.kind = this.level.mix[ball.idx % this.level.mix.length]; ball.collisionFilter.category = kindBit(this.level, ball.kind) || 0x0001; }
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
        if (p.pending && this.t >= p.pending) this.flipNow(p);
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
      return { hits: s.hits, hits2: s.hits2, won: s.won, steps: s.t, decoy: s.missed, spoiled: s.spoiled };
    }
  }

  window.BallRun = { Sim, PIECES, CELL, COLS, ROWS, W, H, R, NEED, GAP, toWorld, packs: {} };
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

  // Medium and Hard: mixed things come down, and gates (or a flip-flop) sort them. Each level is one of the
  // checked Zoo and Puppies layouts (some mirrored) with this world's things, and was checked again by running its physics.
  ((pack, g, lv) => {
    pack.medium = [
      lv({ hose: 3, goal: 3, balls: 8, mix: ['water', 'leaf'], want: 'water', tray: [g('gate', 'water')], hint: [{ t: 'gate', k: 'water', c: 3, r: 1 }] }),
      lv({ hose: 9, goal: 8, balls: 8, mix: ['water', 'leaf'], want: 'water', tray: [g('gate', 'water')], hint: [{ t: 'gate', k: 'water', c: 8, r: 1, f: true }] }),
      lv({ hose: 11, goal: 6, balls: 8, mix: ['water', 'leaf'], want: 'water', tray: [g('gate', 'water'), 'long'], hint: [{ t: 'long', c: 9, r: 1, f: true }, { t: 'gate', k: 'water', c: 7, r: 2, f: true }] }),
      lv({ hose: 1, goal: 5, balls: 8, mix: ['water', 'leaf'], want: 'water', tray: [g('gate', 'water'), 'long'], hint: [{ t: 'long', c: 1, r: 1 }, { t: 'gate', k: 'water', c: 5, r: 2 }] }),
      lv({ hose: 4, goal: 9, balls: 8, mix: ['water', 'leaf'], want: 'water', fixed: [{ t: 'block', c: 7, r: 4 }], tray: [g('gate', 'water'), 'ramp'], hint: [{ t: 'gate', k: 'water', c: 4, r: 1 }, { t: 'ramp', c: 5, r: 3 }] }),
      lv({ hose: 10, goal: 3, balls: 8, mix: ['water', 'leaf'], want: 'water', tray: [g('gate', 'water'), 'curve'], hint: [{ t: 'gate', k: 'water', c: 10, r: 1, f: true }, { t: 'curve', c: 8, r: 4, f: true }] }),
      lv({ hose: 11, goal: 3, balls: 8, mix: ['water', 'leaf'], want: 'water', tray: [g('gate', 'water'), 'spring'], hint: [{ t: 'spring', c: 11, r: 1, f: true }, { t: 'gate', k: 'water', c: 8, r: 1, f: true }] }),
      lv({ hose: 1, goal: 6, balls: 8, mix: ['water', 'leaf'], want: 'water', fixed: [{ t: 'block', c: 1, r: 4 }], tray: [g('gate', 'water'), 'long'], hint: [{ t: 'long', c: 1, r: 1 }, { t: 'gate', k: 'water', c: 5, r: 2 }] })
    ];
    pack.hard = [
      lv({ hose: 5, goal: 4, balls: 8, mix: ['water', 'leaf'], goal2: 8, want: 'water', want2: 'leaf', tray: [g('gate', 'water')], hint: [{ t: 'gate', k: 'water', c: 5, r: 3 }] }),
      lv({ hose: 3, goal: 6, balls: 8, mix: ['water', 'leaf'], goal2: 9, want: 'water', want2: 'leaf', tray: [g('gate', 'water'), 'long'], hint: [{ t: 'gate', k: 'water', c: 3, r: 3 }, { t: 'long', c: 3, r: 5 }] }),
      lv({ hose: 5, goal: 5, balls: 9, mix: ['water', 'leaf', 'twig'], want: 'water', tray: [g('gate', 'leaf'), g('gate', 'water')], hint: [{ t: 'gate', k: 'water', c: 5, r: 1 }] }),
      lv({ hose: 3, goal: 9, balls: 9, mix: ['water', 'leaf', 'twig'], want: 'water', tray: [g('not', 'water'), 'long'], hint: [{ t: 'not', k: 'water', c: 3, r: 1 }, { t: 'long', c: 5, r: 2 }] }),
      lv({ hose: 6, goal: 2, balls: 8, mix: ['water', 'leaf'], goal2: 10, want: 'water', want2: 'leaf', tray: ['flip', 'long'], hint: [{ t: 'flip', c: 5, r: 2, f: true }, { t: 'long', c: 6, r: 4 }] }),
      lv({ hose: 10, goal: 9, balls: 9, mix: ['water', 'leaf', 'twig'], goal2: 6, want: 'water', want2: 'leaf', tray: [g('gate', 'water'), g('gate', 'leaf')], hint: [{ t: 'gate', k: 'water', c: 9, r: 2, f: true }, { t: 'gate', k: 'leaf', c: 7, r: 3, f: true }] }),
      lv({ hose: 6, goal: 11, balls: 8, mix: ['water', 'leaf'], goal2: 1, want: 'water', want2: 'leaf', tray: ['flip', 'long', 'long'], hint: [{ t: 'flip', c: 6, r: 2 }, { t: 'long', c: 6, r: 4 }, { t: 'long', c: 2, r: 4, f: true }] }),
      lv({ hose: 11, goal: 6, balls: 8, mix: ['water', 'leaf'], goal2: 10, want: 'water', want2: 'leaf', fixed: [{ t: 'block', c: 4, r: 5 }], tray: [g('not', 'water'), 'long'], hint: [{ t: 'not', k: 'water', c: 10, r: 1, f: true }, { t: 'long', c: 7, r: 4, f: true }] })
    ];
  })(window.BallRun.packs.rescue, (t, k) => ({ t, k }), o => Object.assign({ balls: 8, kinds: [...new Set(o.mix)] }, o));


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
    'ballrun.p.bucket': 'A bucket. When it fills up, it tips over!',
    // The level tabs on every ball run's picker (Easy, Medium, Hard), shared by all worlds.
    'brlevel.easy':   'Easy puzzles.',
    'brlevel.medium': 'Medium puzzles. These are a bit trickier!',
    'brlevel.hard':   'Hard puzzles! Have a good think.',
    'brlevel.done':   'You solved every puzzle on this page! Well done!',
    // Medium and Hard puzzles (mixed things, gates) in worlds without their own lines for them.
    'brlogic.only':   'Look at the picture in the bubble. Only things like that can go in! Use a gate to sort them.',
    'brlogic.two':    'Two bubbles, two pictures! Send each thing to the place that shows its picture.',
    'brlogic.share':  'Share them out fairly! Three for each. A counting gate can help.',
    'brlogic.wrong':  "Oops! That one doesn't go there. Look at the picture in the bubble, and try again!",
    'brlogic.woke':   'Oh no, that one landed in the wrong place! Keep the way clear, and try again.',
    'brlogic.sorted': 'Brilliant sorting! Everything went to the right place!',
    'brlogic.shared': 'Three each! That is fair sharing!',
    'brlogic.p.gate':  'A gate! Only things like the picture drop through the trapdoor. Everything else rolls over the top.',
    'brlogic.p.not':   'A not gate! Everything drops through the trapdoor, except things like the picture.',
    'brlogic.p.flip':  'A flip-flop! It sends one thing this way, then the next thing that way.',
    'brlogic.p.count': 'A counting gate! It counts things through its trapdoor. When it gets to its number, the trapdoor shuts.',
    'brlogic.p.bin':   'A reject bin! Anything that falls in stays in the bin.'
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

  // A picture of a kind (a food, a ball colour) inside a white bubble, drawn by the current world's theme.
  let kindPic = null;
  function kindBadge(ctx, k, x, y, r, not) {
    ctx.fillStyle = '#fff'; ctx.strokeStyle = OL; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    if (kindPic) kindPic(ctx, k, x, y, r * 1.5);
    if (not) { line(ctx, x - r * .7, y - r * .7, x + r * .7, y + r * .7, '#fff', 11); line(ctx, x - r * .7, y - r * .7, x + r * .7, y + r * .7, '#e53935', 7); }
  }
  function drawPiece(ctx, p, now, k = 1) {
    const d = PIECES[p.t], tw = (u, v) => BR.toWorld(p, u, v);
    if (d.chute) { // the chute behind the trapdoor, and the trapdoor itself as a dashed strip
      const [cx0, cy0] = tw(0.62, 0.42), [cx1] = tw(1.38, 0), cy1 = (p.r + 1.9) * CELL;
      ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fillRect(Math.min(cx0, cx1), cy0, Math.abs(cx1 - cx0), cy1 - cy0);
      d.chute.forEach(([a, b, c, e]) => { const s = [...tw(a, b), ...tw(c, e)]; line(ctx, ...s, OL, 19 * k); line(ctx, ...s, '#9aa3b5', 12 * k); });
      const t = [...tw(d.trap[0], d.trap[1]), ...tw(d.trap[2], d.trap[3])];
      const shut = d.kind === 'count' && p.passed >= p.k;
      ctx.save(); if (!shut) ctx.setLineDash([14, 10]); line(ctx, ...t, OL, 12 * k); line(ctx, ...t, d.colour, 7 * k); ctx.restore();
      const [ax, ay] = tw(1, 1.35); // a down arrow in the chute
      ctx.fillStyle = d.colour; ctx.strokeStyle = OL; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(ax - 14, ay - 8); ctx.lineTo(ax + 14, ay - 8); ctx.lineTo(ax, ay + 12); ctx.closePath(); ctx.fill(); ctx.stroke();
    }
    if (d.segs) {
      const segs = d.segs.map(([a, b, c, e]) => [...tw(a, b), ...tw(c, e)]);
      segs.forEach(s => line(ctx, ...s, OL, (12 + 7) * k));
      segs.forEach(s => line(ctx, ...s, d.colour, 12 * k));
      segs.forEach(s => line(ctx, s[0], s[1] - 2, s[2], s[3] - 2, 'rgba(255,255,255,.35)', 3));
      const f = segs[0], l = segs[segs.length - 1];
      bolt(ctx, f[0], f[1], p.fixed); bolt(ctx, l[2], l[3], p.fixed);
    }
    if (d.chute && p.k != null && d.kind === 'count') { // how many more it lets through: 3, 2, 1, then a padlock
      const [bx, by] = tw(1, 0.95), left = p.k - (p.passed || 0);
      ctx.fillStyle = left ? '#fff' : '#ffd21f'; ctx.strokeStyle = OL; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(bx, by, 24, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.font = '700 32px Fredoka, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = OL;
      if (left) ctx.fillText(left, bx, by + 2);
      else { ctx.beginPath(); ctx.roundRect(bx - 11, by - 3, 22, 16, 3); ctx.fill(); ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(bx, by - 4, 7, Math.PI, 0); ctx.stroke(); }
    } else if (d.chute && p.k != null) { const [bx, by] = tw(1, 0.95); kindBadge(ctx, p.k, bx, by, 24, d.kind === 'not'); }
    if (d.kind === 'bin') { // a grey bin with a red cross on its front
      const [x0, y0] = tw(0.3, 0.6), [x1, y1] = tw(1.7, 1.86);
      ctx.fillStyle = 'rgba(89,97,120,.25)'; ctx.fillRect(Math.min(x0, x1), y0, Math.abs(x1 - x0), y1 - y0);
      const [cx, cy] = tw(1, 1.25);
      line(ctx, cx - 18, cy - 18, cx + 18, cy + 18, '#fff', 13); line(ctx, cx + 18, cy - 18, cx - 18, cy + 18, '#fff', 13);
      line(ctx, cx - 18, cy - 18, cx + 18, cy + 18, '#e53935', 8); line(ctx, cx + 18, cy - 18, cx - 18, cy + 18, '#e53935', 8);
    }
    if (d.kind === 'flip') {
      poly(ctx, p.paddle.vertices, d.colour);
      bolt(ctx, p.hinge.x, p.hinge.y, false);
      const y = (p.r + 1.85) * CELL; // little arrows: one this way, one that way
      [[0.35, -1], [1.65, 1]].forEach(([u, s]) => { const [x] = tw(u, 0), sx = s * (p.f ? -1 : 1);
        ctx.fillStyle = '#fff'; ctx.strokeStyle = OL; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(x - 12 * sx, y - 9); ctx.lineTo(x + 10 * sx, y); ctx.lineTo(x - 12 * sx, y + 9); ctx.closePath(); ctx.fill(); ctx.stroke(); });
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
      // A big curved arrow over the spring shows which way it throws (tap the spring to turn it round).
      const sx = p.f ? -1 : 1, x0 = x - 18 * sx, y0 = top - 12;
      const arrow = () => { ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo(x0 + 6 * sx, y0 - 58, x0 + 46 * sx, y0 - 46); };
      ctx.lineCap = 'round'; arrow(); ctx.strokeStyle = OL; ctx.lineWidth = 17; ctx.stroke(); arrow(); ctx.strokeStyle = '#ffd21f'; ctx.lineWidth = 9; ctx.stroke();
      const hx = x0 + 52 * sx, hy = y0 - 44; // arrow head
      ctx.beginPath(); ctx.moveTo(hx + 8 * sx, hy + 1); ctx.lineTo(hx - 14 * sx, hy - 17); ctx.lineTo(hx - 10 * sx, hy + 18); ctx.closePath();
      ctx.fillStyle = '#ffd21f'; ctx.fill(); ctx.strokeStyle = OL; ctx.lineWidth = 4; ctx.lineJoin = 'round'; ctx.stroke();
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
  const shapeOf = (t, f, k) => { const s = new Sim({ hose: -5, goal: -5 }); return s.add({ t, k, c: 0, r: 0, f: !!f }); };
  function pieceIcon(t, kind) {
    const d = PIECES[t], cv = document.createElement('canvas'), k = 2;
    const pw = d.w * CELL, ph = d.h * CELL, size = Math.max(pw, ph) + 30;
    cv.width = cv.height = 160 * k;
    const ctx = cv.getContext('2d');
    ctx.scale(160 * k / size, 160 * k / size); ctx.translate((size - pw) / 2, (size - ph) / 2);
    drawPiece(ctx, shapeOf(t, false, kind), null, 2);
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
  // Medium and Hard Water Run puzzles mix water with leaves and twigs blowing about; only water puts out a fire,
  // and the leaves go in the garden bin.
  function drawThing(ctx, kind, x, y, s = 1, rot = 0) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(rot); ctx.strokeStyle = OL; ctx.lineWidth = 3;
    if (kind === 'leaf') {
      ctx.fillStyle = '#5cb85c'; ctx.beginPath(); ctx.moveTo(-R - 2, 0); ctx.quadraticCurveTo(0, -R - 4, R + 2, 0); ctx.quadraticCurveTo(0, R + 4, -R - 2, 0); ctx.fill(); ctx.stroke();
      line(ctx, -R + 2, 0, R - 2, 0, '#2e7d32', 2.5);
    } else if (kind === 'twig') {
      line(ctx, -R - 4, 4, R + 4, -4, OL, 11); line(ctx, -R - 4, 4, R + 4, -4, '#8a5a3c', 6); line(ctx, 0, 0, 6, -12, OL, 8); line(ctx, 0, 0, 6, -12, '#8a5a3c', 4);
    } else {
      ctx.fillStyle = '#5cc3ff'; ctx.beginPath(); ctx.arc(0, 0, R, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.8)'; ctx.beginPath(); ctx.arc(-4, -5, 4, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }
  function drawBall(ctx, b) { drawThing(ctx, b.kind, b.position.x, b.position.y, 1, b.kind ? b.angle : 0); }
  function gardenBin(ctx, x, hits, shake) { // a green garden bin, filling with leaves
    const dx = shake > 0 ? Math.sin(shake * 1.2) * 8 : 0;
    for (let i = 0; i < Math.min(3, hits); i++) drawThing(ctx, 'leaf', x + dx - 30 + i * 30, H - 158 - (i % 2) * 8, 1, i - 1);
    poly(ctx, [{ x: x + dx - 62, y: H - 150 }, { x: x + dx + 62, y: H - 150 }, { x: x + dx + 52, y: H - 12 }, { x: x + dx - 52, y: H - 12 }], '#2e9e4f');
    line(ctx, x + dx - 70, H - 150, x + dx + 70, H - 150, OL, 14); line(ctx, x + dx - 70, H - 150, x + dx + 70, H - 150, '#1f7a3a', 8);
    [-30, 30].forEach(o => { ctx.fillStyle = '#596178'; ctx.beginPath(); ctx.arc(x + dx + o, H - 12, 10, 0, Math.PI * 2); ctx.fill(); });
  }
  const water = {
    source: (ctx, level, now, dripping, next) => { drawHose(ctx, level.hose, now, dripping && !next); if (dripping && next) drawThing(ctx, next, (level.hose + .5) * CELL, 68, .6); },
    ball: (ctx, b) => drawBall(ctx, b),
    kindPic: (ctx, k, x, y, size) => drawThing(ctx, k, x, y, size / 34),
    goal: (ctx, st) => drawFire(ctx, (st.level.goal + 1) * CELL, H - 6, NEED - st.hits, st.now),
    goal2: (ctx, st) => gardenBin(ctx, (st.level.goal2 + 1) * CELL, st.hits2, st.fx.shake2),
    bubbleY: 270,
    splash: '#5cc3ff',
    hit(ev, fx) { if (ev.g === 2) { Sfx.plop(); fx.burst(ev.x, ev.y, 6, '#5cb85c', 1.2); return; } Sfx.splash(); Sfx.hiss(); fx.burst(ev.x, ev.y, 10, '#bfe6ff', 1.4); fx.steam = 40; },
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
    // Puzzles come in up to three tiers, all open from the start. Easy puzzles are saved as their index (as before);
    // Medium and Hard ones as 'm0', 'h0' and so on. A puzzle's screen argument is 1, 2 ... for Easy and 'm1', 'h1' ... for the others.
    const TIERS = [{ id: 'easy', pre: '', list: pack.puzzles, colour: '#2e9e4f' }, { id: 'medium', pre: 'm', list: pack.medium, colour: '#f07a1a' }, { id: 'hard', pre: 'h', list: pack.hard, colour: '#e53935' }]
      .filter(t => t.list && t.list.length);
    const key = (tier, i) => tier.pre ? tier.pre + i : i;
    const argOf = (tier, i) => tier.pre ? tier.pre + (i + 1) : i + 1;
    let tab = 0;

    // ---------- Mode picker ----------
    function picker() {
      A.ui({ home: true });
      const draw = () => {
        const tier = TIERS[tab], done = solved(), isDone = i => done.includes(key(tier, i)), next = tier.list.findIndex((_, i) => !isDone(i));
        const stars = n => '★'.repeat(n);
        scene().innerHTML = `
          <div class="br-pick ${cfg.cls || ''}">
            <button class="br-free" style="background:${cfg.colour}" aria-label="Build your own"><span class="art">${cfg.icon}</span><span class="label">Build</span></button>
            <div class="br-right">
              ${TIERS.length > 1 ? `<div class="br-tabs" role="tablist">${TIERS.map((t, j) => `<button class="br-tab${j === tab ? ' on' : ''}" role="tab" aria-selected="${j === tab}" data-j="${j}"
                style="--tab:${t.colour}" aria-label="${t.id} puzzles"><span class="br-stars">${stars(j + 1)}</span><span class="br-tabname">${t.id[0].toUpperCase() + t.id.slice(1)}</span></button>`).join('')}</div>` : ''}
              <div class="br-levels">${tier.list.map((_, i) => `<button class="br-level${isDone(i) ? ' done' : ''}${i === next ? ' next' : ''}" data-i="${i}" aria-label="Puzzle ${i + 1}">
                <span>${i + 1}</span>${isDone(i) ? '<b aria-hidden="true">★</b>' : ''}</button>`).join('')}</div>
            </div>
          </div>`;
        scene().querySelector('.br-free').onclick = () => { Sfx.pop(); A.go(screen, 'free'); };
        scene().querySelectorAll('.br-level').forEach(b => b.onclick = () => { Sfx.pop(); A.go(screen, argOf(tier, +b.dataset.i)); });
        scene().querySelectorAll('.br-tab').forEach(b => b.onclick = () => { if (+b.dataset.j === tab) return; Sfx.tap(); tab = +b.dataset.j; draw(); A.say('brlevel.' + TIERS[tab].id); });
      };
      draw();
      A.say(L('pick'));
    }

    // ---------- Playing ----------
    A.screens[screen] = (arg, alive) => {
      if (!arg) return picker();
      const free = arg === 'free', m = !free && /^([mh])(\d+)$/.exec(arg);
      const tier = free ? TIERS[0] : m ? TIERS.find(t => t.pre === m[1]) : TIERS[0];
      const index = free ? -1 : (m ? +m[2] : +arg) - 1, level = free ? pack.free : tier.list[index];
      if (!free) tab = TIERS.indexOf(tier);
      kindPic = theme.kindPic || null;
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
      let scale = 1, hits = 0, hits2 = 0, fails = 0, hint = null, won = false, said = {};
      const parts = [];
      const fx = { steam: 0, shake: 0, chew: 0, burst: (x, y, n, colour, up = 1) => { for (let i = 0; i < n; i++) parts.push({ x, y, vx: (Math.random() - .5) * 8, vy: -Math.random() * 7 * up, life: 30, colour }); } };
      // Tray items are piece names, or { t, k } for a logic piece about one kind (a food, a ball colour).
      const tray = free ? pack.freeTray.map(t => ({ t, endless: true })) : level.tray.map(t => typeof t === 'string' ? { t, placed: null } : { t: t.t, k: t.k, placed: null });

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
          b.setAttribute('aria-label', it.k != null ? it.t + ' ' + it.k : it.t);
          b.appendChild(pieceIcon(it.t, it.k));
          b.addEventListener('pointerdown', e => { if (!it.placed) startDrag(e, { t: it.t, k: it.k, f: false, tray: i }, null); });
          trayEl.appendChild(b);
        });
      }
      renderTray();
      // Pictures of foods and balls are images that may still be loading the first time; draw the tray again once they are in.
      if (tray.some(it => it.k != null)) [400, 1500].forEach(ms => A.later(() => { if (alive()) renderTray(); }, ms));

      // ----- Dragging pieces -----
      let drag = null;
      const toBoard = e => { const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) / scale, y: (e.clientY - r.top) / scale, inside: e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom }; };
      function startDrag(e, piece, from) {
        if (drag) return;
        e.preventDefault();
        Sfx.tap(); A.Hint.clear();
        drag = { piece, from, x0: e.clientX, y0: e.clientY, moved: false, id: e.pointerId, shape: shapeOf(piece.t, piece.f, piece.k) };
        if (!said[piece.t] && !from) { said[piece.t] = true; A.say(CONTENT.lines[L('p.' + piece.t)] ? L('p.' + piece.t) : 'brlogic.p.' + piece.t); }
        dragEl.innerHTML = ''; dragEl.appendChild(pieceIcon(piece.t, piece.k));
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
        dragEl.style.transform = `translate(${e.clientX - rr.left}px, ${e.clientY - rr.top}px) translate(-50%, -50%)`;
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
        if (r >= ROWS - 1 && level.goal2 != null && (c === level.goal2 || c === level.goal2 + 1)) { if (theme.tapGoal2) theme.tapGoal2(level); return; }
        if (r === 0 && c === level.hose) go();
      });
      root.addEventListener('pointermove', moveDrag);
      root.addEventListener('pointerup', endDrag);
      root.addEventListener('pointercancel', e => { if (drag) { drag.at = null; endDrag(e); } });

      // ----- Running the balls -----
      function go() {
        if (won && !free) return;
        Sfx.whistle(); A.Pip.act('jump'); A.Hint.clear();
        sim.start(); hits = 0; hits2 = 0; fx.steam = 0; won = false; refused = false;
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
          if (!refused && level.mix && !theme.logicLines) { refused = true; A.say('brlogic.woke'); }
          if (!refused && theme.refuse) { refused = true; A.say(theme.refuse(level)); }
        }
        if (ev.type === 'flip') Sfx.clank(1.4);
        if (ev.type === 'count') Sfx.plink(1.2 + ev.n * .15);
        if (ev.type === 'shut') Sfx.clank(1);
        if (ev.type === 'binned') { Sfx.clank(.8); fx.burst(ev.x, ev.y, 5, '#9aa3b5'); }
        if (ev.type === 'wrong') { // the wrong kind reached a goal: this run is spoilt
          if (ev.g === 2) fx.shake2 = 40; else fx.shake = 40;
          Sfx.boing();
          if (!refused) { refused = true; A.say(theme.wrong ? theme.wrong(level, ev) : 'brlogic.wrong'); }
        }
        if (ev.type === 'hit' && ev.g === 2) { // themes animate fx.chew; for the second goal that is fx.chew2
          hits2 = ev.n; const chew = fx.chew; theme.hit(ev, fx, level); if (!theme.goal2) { fx.chew2 = fx.chew; fx.chew = chew; }
          if (ev.n <= NEED) { // the theme's own count for the second goal if it has one ("Two!", "Six pence!"), else plain numbers
            const id = [theme.hitLine && theme.hitLine(ev, level2), L('n' + ev.n), 'ballrun.n' + ev.n].find(x => x && CONTENT.lines[x]);
            A.say(id);
          }
        }
        else if (ev.type === 'hit') {
          hits = ev.n; theme.hit(ev, fx, level);
          if (ev.n <= NEED) A.say(theme.hitLine ? theme.hitLine(ev, level) : L('n' + ev.n));
        }
        if (ev.type === 'win') win();
      }
      async function win() {
        won = true; A.Hint.clear(); hint = null; theme.win(fx);
        await A.wait(900);
        if (!alive()) return;
        A.Pip.mood('cheer'); A.Pip.act('dance');
        if (free) { A.confetti(); Sfx.chime(); A.say(theme.freeLine ? theme.freeLine(level) : L('freeOut')); return; }
        const first = !solved().includes(key(tier, index));
        if (first) { solved().push(key(tier, index)); A.saveProgress(); }
        await A.say(logicLine('win') || (theme.winLine ? theme.winLine(level) : L('out')));
        if (!alive()) return;
        const tierDone = tier.list.every((_, i) => solved().includes(key(tier, i)));
        const allDone = TIERS.every(t => t.list.every((_, i) => solved().includes(key(t, i))));
        A.gameDone(screen, { buttons: false });
        if (first && allDone) A.later(() => A.say(L('allDone')), 4500);
        else if (first && tierDone && tier.pre) A.later(() => A.say('brlevel.done'), 4500);
        else if (first && tierDone && TIERS.length === 1) A.later(() => A.say(L('allDone')), 4500);
        const end = document.createElement('div');
        end.className = 'game-end';
        end.innerHTML = `<button class="big-btn" style="background:#8e5bd6" aria-label="All puzzles">${LIST}</button>
          ${index + 1 < tier.list.length ? `<button class="big-btn" style="background:#2e9e4f" aria-label="Next puzzle">${NEXT}</button>` : ''}`;
        scene().appendChild(end);
        const [l, n] = end.querySelectorAll('button');
        l.onclick = () => { Sfx.tap(); A.go(screen); };
        if (n) n.onclick = () => { Sfx.tap(); A.go(screen, argOf(tier, index + 1)); };
      }
      function missed() {
        sim.running = false;
        if (won) return;
        fails++;
        if (!free && fails >= 2) showHint(); else if (!sim.spoiled) A.say(L('again'));
      }
      function showHint() {
        const placed = sim.pieces.filter(p => !p.fixed);
        const want = level.hint.find(h => !placed.some(p => p.t === h.t && p.k === h.k && p.c === h.c && p.r === h.r && !!p.f === !!h.f));
        if (!want) { A.say(L('again')); return; }
        hint = { piece: Object.assign({}, want, { f: !!want.f }), shape: shapeOf(want.t, want.f, want.k) };
        A.say(L('hint'));
      }

      // Worlds without lines of their own for logic puzzles (theme.logicLines) use the shared brlogic ones.
      function logicLine(when) {
        if (!level.mix || theme.logicLines) return null;
        const share = level.want == null && level.goal2 != null;
        if (when === 'intro') return share ? 'brlogic.share' : level.goal2 != null ? 'brlogic.two' : 'brlogic.only';
        if (when === 'win') return share ? 'brlogic.shared' : level.goal2 != null ? 'brlogic.sorted' : null;
      }
      // The second goal is drawn by the theme's own goal picture unless it has a goal2 of its own;
      // level.g2 holds what is different about it (another monster, another colour of pot ...).
      const level2 = level.goal2 != null ? Object.assign({}, level, { goal: level.goal2, want: level.want2 }, level.g2 || {}) : null;
      const fx2 = { chew: 0, shake: 0, burp: 0, steam: 0, burst: fx.burst };
      function drawGoal2(ctx, st) {
        if (theme.goal2) return theme.goal2(ctx, st);
        fx2.chew = fx.chew2 || 0; fx2.shake = fx.shake2 || 0;
        theme.goal(ctx, Object.assign({}, st, { level: level2, hits: st.hits2, fx: fx2, second: true }));
      }
      // A bubble over each goal shows what it takes, in worlds that don't show it themselves.
      function bubbles(ctx) {
        if (!level.mix || theme.logicLines) return;
        const y = H - (theme.bubbleY || 255);
        if (level.want != null) kindBadge(ctx, level.want, (level.goal + 1) * CELL, y, 32);
        if (level.want2 != null) kindBadge(ctx, level.want2, (level.goal2 + 1) * CELL, y, 32);
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
          if (fx.shake2 > 0) fx.shake2--;
          if (fx.chew2 > 0) fx.chew2--;
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
        const st = { level, now, hits: won ? NEED : hits, hits2: won ? NEED : hits2, fx, running: sim.running, won };
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
        if (level.goal2 != null) drawGoal2(ctx, st);
        bubbles(ctx);
        sim.balls.forEach(b => theme.ball(ctx, b, level));
        theme.source(ctx, level, now, sim.running && sim.released < sim.toRelease, level.mix ? level.mix[sim.released % level.mix.length] : null);
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
          if (!!drag.shape.f !== !!drag.piece.f) drag.shape = shapeOf(drag.piece.t, drag.piece.f, drag.piece.k);
          ctx.globalAlpha = .75; drawPiece(ctx, drag.shape, now); ctx.restore();
        }
      }
      requestAnimationFrame(frame);

      if (free) A.say(L('free'));
      else if (logicLine('intro')) A.say(logicLine('intro'));
      else if (theme.intro) A.say(theme.intro(level, index));
      else A.say(L('puzzle'));
      if (!free) A.Hint.set([trayEl.querySelector('.br-item')], L('puzzle'));
      A.ballrun = { sim, level, go, tray, tier: tier.id, index }; // for testing
    };
  };

  BR.mount({ screen: 'ballrun', lines: 'ballrun', colour: '#0097a7', icon: ICON, pack: BR.packs.rescue, theme: water });
})();
