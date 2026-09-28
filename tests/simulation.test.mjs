import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { makeSimulation, assertClose, fishTrace, frogTrace, collisionTrace } from './helpers.mjs';

const baseline = JSON.parse(readFileSync(new URL('./baseline.json', import.meta.url), 'utf8'));

for (const { pattern, ornament, expected } of baseline.fish) {
    test(`seeded ${pattern || 'solid'} fish with ${ornament} preserves motion and colors`, () => {
        const simulation = makeSimulation({ seed: 512 });
        assertClose(fishTrace(simulation, pattern, ornament), expected);
        simulation.run(`
            for (let i = 1; i < testFish.segments.length; i++) {
                const a = testFish.segments[i - 1], b = testFish.segments[i];
                if (Math.abs(Math.hypot(a.x - b.x, a.y - b.y) - testFish.length) > 1e-8) {
                    throw new Error('Fish spine segment length changed');
                }
            }
        `);
    });
}

for (const { pattern, expected } of baseline.frogs) {
    test(`seeded ${pattern} frog preserves idle animation and passive jump timing`, () => {
        assertClose(frogTrace(makeSimulation({ seed: 137 }), pattern), expected);
    });
}

test('collision resolution preserves ordered outcomes for overlapping chains and dragged items', () => {
    assertClose(collisionTrace(makeSimulation({ seed: 42 })), baseline.collisions);
});

test('dragged bodies stay fixed while collision impulses conserve free-body momentum', () => {
    const simulation = makeSimulation();
    const result = simulation.read(`(() => {
        const fixed = new SurfaceItem(0, 0, 10);
        const free = new SurfaceItem(10, 0, 10);
        fixed.beginDrag();
        SurfaceItem.resolveAll([fixed, free]);
        const a = new SurfaceItem(0, 0, 10);
        const b = new SurfaceItem(10, 0, 10);
        a.vx = 10;
        b.vx = -4;
        SurfaceItem.resolveAll([a, b]);
        return { fixed: [fixed.x, fixed.y], free: [free.x, free.y], momentum: a.vx + b.vx, distance: b.x - a.x };
    })()`);
    assert.deepEqual(result, { fixed: [0, 0], free: [20, 0], momentum: 6, distance: 20 });
});

test('surface release keeps drag momentum and applies time-based decay', () => {
    const simulation = makeSimulation();
    simulation.run(`
        const item = new SurfaceItem(20, 40, 10);
        item.vx = 30;
        item.vy = 20;
        item.beginDrag();
        item.integrateMomentum(0.1);
    `);
    assert.deepEqual(simulation.read('[item.x, item.y, item.vx, item.vy]'), [20, 40, 0, 0]);
    simulation.run('item.releaseMomentum(120, -60); item.integrateMomentum(0.05);');
    assertClose(simulation.read('[item.x, item.y, item.vx, item.vy]'), [26, 37, 120 * Math.exp(-0.4), -60 * Math.exp(-0.4)]);
    simulation.run('for (let i = 0; i < 200; i++) item.integrateMomentum(0.016);');
    assert.ok(simulation.read('Math.hypot(item.vx, item.vy)') < 1e-8);
});

test('frog landing clamps to the moving target and remembers its previous pad', () => {
    const simulation = makeSimulation();
    simulation.run(`
        const origin = new LilyPad(80, 120, 50);
        const target = new LilyPad(680, 350, 55);
        const jumper = new Frog(origin.anchorX, origin.anchorY, 30, { parentPad: origin });
        jumper.jumpTo(target);
    `);
    assert.deepEqual(simulation.read('[jumper.isJumping, jumper.parentPad, jumper.previousPad === origin, jumper.jumpTargetPad === target]'), [true, null, true, true]);
    simulation.run(`
        target.anchorX += 40;
        target.anchorY -= 20;
        jumper.update(jumper.jumpDuration + 0.005, 1600);
    `);
    assert.deepEqual(simulation.read('[jumper.isJumping, jumper.parentPad === target, jumper.jumpTargetPad, jumper.jumpProgress]'), [false, true, null, 1]);
    assertClose(simulation.read('[jumper.x, jumper.y]'), simulation.read('[target.anchorX, target.anchorY]'));
    simulation.run('target.anchorX += 20; target.anchorY += 10; jumper.update(0.016, 1616);');
    assertClose(simulation.read('[jumper.x, jumper.y]'), simulation.read('[target.anchorX, target.anchorY]'));
});

test('pad selection excludes occupied, reserved, undersized, previous pads and flowers', () => {
    const simulation = makeSimulation({ main: true });
    simulation.run(`
        const current = new LilyPad(100, 100, 50);
        const previous = new LilyPad(120, 100, 50);
        const occupied = new LilyPad(140, 100, 50);
        const reserved = new LilyPad(160, 100, 50);
        const small = new LilyPad(180, 100, 35);
        const flower = new Flower(200, 100, 100);
        const eligible = new LilyPad(260, 100, 36);
        const farther = new LilyPad(350, 100, 50);
        const resident = new Frog(140, 100, 20, { parentPad: occupied });
        const incoming = new Frog(400, 100, 20);
        incoming.jumpTo(reserved);
        surfaceItems = [current, previous, occupied, reserved, small, flower, eligible, farther, resident, incoming];
    `);
    assert.equal(simulation.read('findClosestUnoccupiedPad(100, 100, current, previous, 30) === eligible'), true);
    simulation.run('surfaceItems.splice(surfaceItems.indexOf(eligible), 1);');
    assert.equal(simulation.read('findClosestUnoccupiedPad(100, 100, current, previous, 30) === farther'), true);
    simulation.run('surfaceItems.splice(surfaceItems.indexOf(farther), 1);');
    assert.equal(simulation.read('findClosestUnoccupiedPad(100, 100, current, previous, 30)'), null);
});

test('frog clicks use the previous pad only as an eligible fallback', () => {
    const simulation = makeSimulation({ main: true });
    simulation.run(`
        const current = new LilyPad(100, 100, 50);
        const previous = new LilyPad(280, 100, 50);
        const frog = new Frog(100, 100, 30, { parentPad: current });
        frog.previousPad = previous;
        surfaceItems = [current, previous, frog];
    `);
    assert.equal(simulation.read('handleFrogClick(100, 100)'), true);
    assert.equal(simulation.read('frog.jumpTargetPad === previous'), true);
    assert.equal(simulation.read('handleFrogClick(100, 100)'), false);
});

test('a frog without a destination allows dragging its pad without treating the frog as draggable', () => {
    const simulation = makeSimulation({ main: true });
    simulation.run(`
        const isolatedPad = new LilyPad(100, 100, 50);
        const isolatedFrog = new Frog(100, 100, 30, {parentPad: isolatedPad});
        surfaceItems = [isolatedPad, isolatedFrog];
    `);
    simulation.dispatch('pointerdown', { button: 0, pointerId: 1, clientX: 100, clientY: 100 });
    assert.deepEqual(simulation.read('[isolatedFrog.isJumping, isolatedPad.isDragging, draggingItem === isolatedPad]'), [false, true, true]);
    simulation.dispatch('pointerup', { pointerId: 1 });
});

test('passive jumping moves the requested frog even when two frogs overlap', () => {
    const simulation = makeSimulation({ main: true });
    simulation.run(`
        const firstPad = new LilyPad(100, 100, 50);
        const secondPad = new LilyPad(100, 100, 50);
        const destination = new LilyPad(300, 100, 50);
        const firstFrog = new Frog(100, 100, 30, { parentPad: firstPad });
        const secondFrog = new Frog(100, 100, 30, { parentPad: secondPad });
        surfaceItems = [firstPad, secondPad, destination, firstFrog, secondFrog];
    `);
    assert.equal(simulation.read('jumpFrog(secondFrog)'), true);
    assert.deepEqual(simulation.read('[firstFrog.isJumping, secondFrog.isJumping, secondFrog.jumpTargetPad === destination]'), [false, true, true]);
    assert.equal(simulation.read('jumpFrog(firstFrog)'), true);
    assert.equal(simulation.read('firstFrog.jumpTargetPad === secondPad'), true);
});

test('duckweed drag moves neighbors together and releases the same sampled momentum', () => {
    const simulation = makeSimulation({ main: true });
    simulation.run(`
        const leaf = new Duckweed(100, 100, 10);
        const neighbor = new Duckweed(130, 110, 10);
        const distant = new Duckweed(350, 250, 10);
        surfaceItems = [neighbor, distant, leaf];
    `);
    simulation.dispatch('pointerdown', { button: 0, pointerId: 1, clientX: 100, clientY: 100 });
    assert.equal(simulation.read('leaf.isDragging'), true);
    simulation.setTime(1020);
    simulation.dispatch('pointermove', { pointerId: 1, clientX: 120, clientY: 110 });
    assert.deepEqual(simulation.read('[leaf.x, leaf.y, neighbor.x, neighbor.y, distant.x, distant.y]'), [120, 110, 150, 120, 350, 250]);
    simulation.dispatch('pointerup', { pointerId: 1 });
    assert.deepEqual(simulation.read('[leaf.isDragging, neighbor.isDragging, leaf.vx, leaf.vy, neighbor.vx, neighbor.vy]'), [false, false, 1000, 500, 1000, 500]);
});

test('pointer ownership prevents a second touch from stealing a drag and cancellation releases it', () => {
    const simulation = makeSimulation({ main: true });
    simulation.run('surfaceItems = [new Duckweed(100, 100, 10)];');
    simulation.dispatch('pointerdown', { button: 0, pointerId: 7, clientX: 100, clientY: 100 });
    simulation.dispatch('pointerdown', { button: 0, pointerId: 8, clientX: 200, clientY: 200 });
    simulation.dispatch('pointermove', { pointerId: 8, clientX: 250, clientY: 250 });
    simulation.dispatch('pointerup', { pointerId: 8 });
    assert.deepEqual(simulation.read('[surfaceItems[0].x, surfaceItems[0].y, surfaceItems[0].isDragging]'), [100, 100, true]);
    simulation.dispatch('pointercancel', { pointerId: 7 });
    assert.equal(simulation.read('surfaceItems[0].isDragging'), false);
    simulation.dispatch('pointerdown', { button: 0, pointerId: 9, clientX: 100, clientY: 100 });
    assert.equal(simulation.read('surfaceItems[0].isDragging'), true);
    simulation.dispatch('blur');
    assert.equal(simulation.read('surfaceItems[0].isDragging'), false);
    assert.equal(simulation.canvas.hasPointerCapture(9), false);
});

test('capture loss from an older pointer cannot cancel a newer drag', () => {
    const simulation = makeSimulation({ main: true });
    simulation.run('surfaceItems = [new Duckweed(100, 100, 10)];');
    simulation.dispatch('pointerdown', { button: 0, pointerId: 1, clientX: 100, clientY: 100 });
    simulation.dispatch('pointerup', { pointerId: 1 });
    simulation.dispatch('pointerdown', { button: 0, pointerId: 2, clientX: 100, clientY: 100 });
    simulation.dispatch('lostpointercapture', { pointerId: 1 });
    assert.equal(simulation.read('surfaceItems[0].isDragging'), true);
    simulation.dispatch('lostpointercapture', { pointerId: 2 });
    assert.equal(simulation.read('surfaceItems[0].isDragging'), false);
});

test('tapping open water redirects every fish and adds one ripple', () => {
    const simulation = makeSimulation({ main: true });
    simulation.run('surfaceItems = []; ripples = [];');
    simulation.dispatch('pointerdown', { button: 0, pointerId: 1, clientX: 312, clientY: 456 });
    assert.equal(simulation.read('fishes.every(f => f.target.x === 312 && f.target.y === 456)'), true);
    assert.deepEqual(simulation.read('ripples.map(r => [r.x, r.y])'), [[312, 456]]);
});

test('expired effects are removed without reordering survivors', () => {
    const simulation = makeSimulation({ main: true });
    simulation.run(`
        const testEffects = Array.from({ length: 8 }, (_, id) => ({
            id, active: true, calls: 0,
            update() { this.calls++; this.active = this.id % 3 === 1; }
        }));
        const allEffects = testEffects.slice();
        updateEffectList(testEffects, 0.016);
    `);
    assert.deepEqual(simulation.read('testEffects.map(effect => effect.id)'), [1, 4, 7]);
    assert.deepEqual(simulation.read('allEffects.map(effect => effect.calls)'), Array(8).fill(1));
});

test('water effects wrap at resized viewport bounds and fish choose reachable targets', () => {
    const simulation = makeSimulation({ main: true });
    simulation.window.innerWidth = 390;
    simulation.window.innerHeight = 844;
    simulation.dispatch('resize');
    assert.deepEqual([simulation.canvas.width, simulation.canvas.height], [390, 844]);
    assert.deepEqual(simulation.read('[pond.width, pond.height]'), [390, 844]);
    assert.equal(simulation.read('[...pond.effects.particles, ...pond.effects.polygons].every(p => p.width === 390 && p.height === 844)'), true);
    simulation.run(`
        for (const particle of pond.effects.particles) {
            particle.x = -1;
            particle.y = 845;
            particle.update(0);
        }
        for (const polygon of pond.effects.polygons) {
            polygon.x = -polygon.size - 1;
            polygon.y = 844 + polygon.size + 1;
            polygon.update(0);
        }
        for (const fish of fishes) fish.pickNewTarget();
    `);
    assert.equal(simulation.read('pond.effects.particles.every(p => p.x === 390 && p.y === 0)'), true);
    assert.equal(simulation.read('pond.effects.polygons.every(p => p.x === 390 + p.size && p.y === -p.size)'), true);
    assert.equal(simulation.read('fishes.every(f => f.target.x >= 0 && f.target.x <= 390 && f.target.y >= 0 && f.target.y <= 844)'), true);
});

test('all visual variants draw finite geometry without leaking canvas state', () => {
    const simulation = makeSimulation({ seed: 91 });
    simulation.run(`
        const drawingCanvas = document.createElement('canvas');
        const drawingContext = drawingCanvas.getContext('2d');
        const variants = [];
        for (const pattern of [null, 'spots', 'tricolor', 'silhouette']) {
            for (const ornament of ['none', 'eyes', 'whiskers']) {
                variants.push(new Fish(200, 300, {
                    pattern, ornament, patternColor: {h: 10, s: 80, l: 50}, patternColor2: {h: 0, s: 0, l: 10}
                }));
            }
        }
        for (const pattern of ['solid', 'stripes', 'spots', 'gradient']) variants.push(new Frog(400, 300, 30, {pattern}));
        variants.push(new LilyPad(100, 100, 40), new Flower(300, 200, 30), new Duckweed(500, 400, 8));
        variants.push(new Ripple(600, 300), new Bubble(700, 200), new Dragonfly(width, height));
        const water = new Pond(width, height);
        for (let frame = 0; frame < 180; frame++) {
            const now = 1000 + frame * 16;
            water.update(0.016, now);
            water.drawBackground(drawingContext);
            water.drawOverlay(drawingContext);
            for (const item of variants) {
                if (item instanceof Fish) item.update(0.016, null, now);
                else item.update(0.016, now);
                item.drawStem?.(drawingContext);
                item.draw(drawingContext, now);
            }
        }
    `);
    simulation.assertBalanced();
});

for (const [width, height] of [[390, 844], [1280, 800], [1920, 1080]]) {
    test(`${width}x${height} scene initializes and animates without the floating board`, () => {
        const simulation = makeSimulation({ main: true, width, height, seed: 57 });
        for (let frame = 1; frame <= 120; frame++) simulation.step(1000 + frame * 16);
        assert.equal(simulation.read('fishes.length'), 6);
        assert.equal(simulation.read('surfaceItems.some(item => item.constructor.name === "Raft")'), false);
        assert.equal(simulation.read('surfaceItems.every(item => Number.isFinite(item.x) && Number.isFinite(item.y))'), true);
        simulation.assertBalanced();
    });
}
