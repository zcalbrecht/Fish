import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

export const sourceDirectory = dirname(dirname(fileURLToPath(import.meta.url)));

function finiteArguments(name, values) {
    for (const value of values) {
        if (typeof value === 'number') assert.ok(Number.isFinite(value), `${name}: ${value}`);
    }
    if (name === 'arc') assert.ok(values[2] >= 0, 'negative arc radius');
    if (name === 'ellipse') assert.ok(values[2] >= 0 && values[3] >= 0, 'negative ellipse radius');
}

export function makeSimulation({ directory = sourceDirectory, seed = 1, width = 1280, height = 800, main = false } = {}) {
    let time = 1000;
    let randomState = seed >>> 0;
    let frameId = 0;
    const frames = new Map();
    const listeners = new Map();
    const contexts = [];
    const random = () => {
        randomState = (Math.imul(randomState, 1664525) + 1013904223) >>> 0;
        return randomState / 4294967296;
    };
    const makeCanvas = () => {
        const canvas = { width, height, style: {}, addEventListener: listen };
        const capturedPointers = new Set();
        canvas.setPointerCapture = id => capturedPointers.add(id);
        canvas.hasPointerCapture = id => capturedPointers.has(id);
        canvas.releasePointerCapture = id => capturedPointers.delete(id);
        const state = { globalAlpha: 1, filter: 'none', lineWidth: 1 };
        const stack = [];
        const calls = new Map();
        const gradient = { addColorStop: (offset) => assert.ok(offset >= 0 && offset <= 1) };
        const methods = {
            save() { stack.push({ ...state }); },
            restore() {
                assert.ok(stack.length, 'unmatched canvas restore');
                for (const name of Object.keys(state)) delete state[name];
                Object.assign(state, stack.pop());
            },
            createLinearGradient(...args) { finiteArguments('gradient', args); return gradient; },
            createRadialGradient(...args) { finiteArguments('gradient', args); return gradient; },
            getTransform() { return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }; },
        };
        const context = new Proxy(methods, {
            get(target, name) {
                if (name === 'canvas') return canvas;
                if (name === 'depth') return stack.length;
                if (name === 'calls') return calls;
                if (name in target) return target[name];
                if (name in state) return state[name];
                return (...args) => {
                    finiteArguments(name, args);
                    calls.set(name, (calls.get(name) || 0) + 1);
                };
            },
            set(_target, name, value) {
                finiteArguments(name, [value]);
                if (typeof value === 'string') assert.doesNotMatch(value, /NaN|Infinity/, `${name}: ${value}`);
                state[name] = value;
                return true;
            },
        });
        canvas.getContext = () => context;
        canvas.getBoundingClientRect = () => ({ left: 0, top: 0, width: canvas.width, height: canvas.height });
        contexts.push(context);
        return canvas;
    };
    function listen(type, callback) {
        if (!listeners.has(type)) listeners.set(type, []);
        listeners.get(type).push(callback);
    }
    const canvas = makeCanvas();
    class Path2D {
        constructor(path) { this.path = path; }
    }
    for (const name of ['moveTo', 'lineTo', 'closePath', 'arc', 'ellipse', 'quadraticCurveTo', 'bezierCurveTo', 'rect', 'addPath']) {
        Path2D.prototype[name] = (...args) => {
            finiteArguments(name, args);
            if (name === 'addPath' && args[1]) finiteArguments('path transform', Object.values(args[1]));
        };
    }
    const window = { innerWidth: width, innerHeight: height, devicePixelRatio: 1, addEventListener: listen };
    const context = vm.createContext({
        console,
        Math: Object.assign(Object.create(Math), { random }),
        Date: class extends Date { static now() { return time; } },
        performance: { now: () => time, timeOrigin: 0 },
        window,
        document: {
            hidden: false,
            getElementById: () => canvas,
            addEventListener: listen,
            createElement(name) { assert.equal(name, 'canvas'); return makeCanvas(); },
        },
        Path2D,
        requestAnimationFrame(callback) { frames.set(++frameId, callback); return frameId; },
        cancelAnimationFrame(id) { frames.delete(id); },
    });
    const run = (code) => vm.runInContext(code, context);
    const html = readFileSync(join(directory, 'index.html'), 'utf8');
    for (const [, filename] of html.matchAll(/<script\s+src="([^"]+)"/g)) {
        if (!main && filename === 'main.js') continue;
        vm.runInContext(readFileSync(join(directory, filename), 'utf8'), context, { filename });
    }
    if (!main) run(`var width = ${width}; var height = ${height}; ResponsiveScale.setScale(width, height);`);
    return {
        run,
        canvas,
        contexts,
        window,
        read: (expression) => JSON.parse(run(`JSON.stringify(${expression})`)),
        resetRandom(value) { randomState = value >>> 0; },
        setTime(value) { time = value; },
        step(value = time + 16) {
            time = value;
            const callbacks = [...frames.values()];
            frames.clear();
            for (const callback of callbacks) callback(time);
        },
        dispatch(type, values = {}) {
            const event = { preventDefault() {}, ...values };
            for (const callback of listeners.get(type) || []) callback(event);
        },
        assertBalanced() {
            for (const ctx of contexts) assert.equal(ctx.depth, 0, 'canvas state leaked across draws');
        },
    };
}

export function assertClose(actual, expected, path = 'value', tolerance = 1e-8) {
    if (typeof expected === 'number') {
        assert.ok(Number.isFinite(actual), `${path}: not finite`);
        assert.ok(Math.abs(actual - expected) <= tolerance * Math.max(1, Math.abs(expected)), `${path}: ${actual} != ${expected}`);
    } else if (expected && typeof expected === 'object') {
        assert.deepEqual(Object.keys(actual), Object.keys(expected), path);
        for (const key of Object.keys(expected)) assertClose(actual[key], expected[key], `${path}.${key}`, tolerance);
    } else {
        assert.equal(actual, expected, path);
    }
}

export function fishTrace(simulation, pattern, ornament) {
    simulation.run(`
        const testFish = new Fish(240, 180, {
            pattern: ${JSON.stringify(pattern)}, ornament: ${JSON.stringify(ornament)},
            color: { h: 30, s: 80, l: 55 }, patternColor: { h: 12, s: 90, l: 40 },
            patternColor2: { h: 0, s: 0, l: 10 }, segmentCount: 10
        });
        const testBubbles = [];
        testFish.bubbleTimer = 0;
    `);
    const frames = [];
    for (let frame = 0; frame < 360; frame++) {
        simulation.setTime(1000 + frame * 16);
        if (frame === 90) simulation.run('testFish.setTarget(10, 20)');
        if (frame === 180) simulation.run('testFish.setTarget(1220, 750)');
        simulation.run('testFish.update(0.016, testBubbles, Date.now())');
        if ([24, 99, 359].includes(frame)) {
            frames.push(simulation.read(`({
                segments: testFish.segments.map(({x, y, angle}) => [x, y, angle]),
                target: testFish.target, fleeing: testFish.fleeing, fleeTimer: testFish.fleeTimer,
                bubbleCount: testBubbles.length, bubbleTimer: testFish.bubbleTimer,
                whiskers: testFish.leftWhisker ? [testFish.leftWhisker, testFish.rightWhisker].map(w => w.segments.map(({x, y}) => [x, y])) : []
            })`));
        }
    }
    return {
        frames,
        colors: simulation.read('[0, 0.1, 0.2, 0.3, 0.5, 0.6, 0.75, 1].map(t => testFish.getSegmentColorAt(t))'),
    };
}

export function frogTrace(simulation, pattern) {
    simulation.run(`
        const testPad = { x: 90, y: 120, anchorX: 100, anchorY: 130, currentRotation: 0.7 };
        const testFrog = new Frog(100, 130, 30, { parentPad: testPad, pattern: ${JSON.stringify(pattern)} });
        let passiveJumps = 0;
        testFrog.onPassiveJump = () => passiveJumps++;
        testFrog.passiveJumpTimer = 7.5;
    `);
    simulation.resetRandom(137);
    const frames = [];
    for (let frame = 0; frame < 1200; frame++) {
        simulation.setTime(1000 + frame * 16);
        simulation.run('testFrog.update(0.016, Date.now())');
        if ([0, 199, 599, 1199].includes(frame)) {
            frames.push(simulation.read(`({
                x: testFrog.x, y: testFrog.y, rotation: testFrog.rotation,
                breathPhase: testFrog.breathPhase,
                blinkTimer: testFrog.blinkTimer, isBlinking: testFrog.isBlinking,
                passiveJumpTimer: testFrog.passiveJumpTimer, passiveJumps
            })`));
        }
    }
    return { frames, colors: simulation.read('[testFrog.baseColor, testFrog.patternColor, testFrog.bellyColor]') };
}

export function collisionTrace(simulation) {
    simulation.run(`
        const collisionGroups = Array.from({ length: 32 }, (_, group) => Array.from({ length: 8 }, (_, i) => ({
            x: 100 + Math.random() * 70, y: 100 + Math.random() * 70,
            vx: (Math.random() - 0.5) * 80, vy: (Math.random() - 0.5) * 80,
            size: i === 7 ? undefined : 10 + Math.random() * 40,
            collisionScale: [0.25, 0.9, 1, 1.5][i % 4], isDragging: (group + i) % 5 === 0
        })));
        collisionGroups.push([
            {x: 0, y: 0, size: 10, vx: 8, vy: 0},
            {x: 12, y: 0, size: 10, vx: 0, vy: 0},
            {x: 28, y: 0, size: 10, vx: -8, vy: 0}
        ]);
        for (const group of collisionGroups) SurfaceItem.resolveAll(group);
    `);
    return simulation.read('collisionGroups.map(group => group.map(({ x, y, vx, vy }) => [x, y, vx, vy]))');
}
