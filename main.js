const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scaleValue = value => ResponsiveScale.scaleValue(value);

let width, height, pond;
let fishes = [], bubbles = [], surfaceItems = [], ripples = [], dragonflies = [];
let drawOrder = [];
let draggingItem = null, duckweedDragGroup = [];
let pointerId = null;
let dragOffsetX = 0, dragOffsetY = 0, dragVelocityX = 0, dragVelocityY = 0;
let lastDragSampleTime = 0, lastFrameTime = performance.now(), dragonflyTimer = 0;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    ResponsiveScale.setScale(width, height);
    pond?.resize(width, height);
}

function init() {
    pond = new Pond(window.innerWidth, window.innerHeight);
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("blur", endSurfaceItemDrag);
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointercancel", handlePointerUp);
    canvas.addEventListener("lostpointercapture", handlePointerUp);

    fishes = [
        {color: {h: 210, s: 120, l: 4}, sizeScale: 0.6, pattern: "silhouette"},
        {color: {h: 210, s: 120, l: 4}, sizeScale: 0.8, pattern: "silhouette"},
        {color: {h: 35, s: 90, l: 50}},
        {color: {h: 200, s: 10, l: 90}},
        {color: {h: 0, s: 0, l: 95}, pattern: "spots", patternColor: {h: 25, s: 90, l: 50}},
        {color: {h: 0, s: 0, l: 95}, pattern: "tricolor", patternColor: {h: 10, s: 90, l: 50}, patternColor2: {h: 0, s: 0, l: 15}}
    ].map(options => new Fish(Math.random() * width, Math.random() * height, options));

    surfaceItems = [];
    for (let i = 0; i < 5; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = scaleValue(40 + Math.random() * 40);
        const pad = new LilyPad(x, y, size);
        pad.popInDelay = i * 0.1;
        surfaceItems.push(pad);

        if (Math.random() < 0.6) {
            const angle = Math.random() * Math.PI * 2;
            const distance = size * 0.6 + scaleValue(Math.random() * 20);
            spawnDuckweedClusterAt(surfaceItems, x + Math.cos(angle) * distance, y + Math.sin(angle) * distance, {
                radius: Math.max(scaleValue(15), size * 0.35),
                leafMin: 3,
                leafMax: 7,
                baseDelay: pad.popInDelay + 0.15,
                margin: scaleValue(15),
                minSpacing: scaleValue(8),
                attemptsPerLeaf: 4
            });
        }
        if (Math.random() < 0.25) {
            const frog = new Frog(x, y, size * 0.65, {parentPad: pad});
            frog.popInDelay = pad.popInDelay + 0.25;
            frog.onPassiveJump = jumpFrog;
            surfaceItems.push(frog);
        }
        const flower = Math.random() < 0.3;
        if (flower || Math.random() < 0.4) {
            const angle = Math.random() * Math.PI * 2;
            const distance = size + scaleValue(15 + Math.random() * 20);
            const Type = flower ? Flower : LilyPad;
            const neighbor = new Type(x + Math.cos(angle) * distance, y + Math.sin(angle) * distance, size * 0.6);
            neighbor.popInDelay = pad.popInDelay + 0.2;
            surfaceItems.push(neighbor);
        }
    }
    spawnDuckweedClusters(surfaceItems);
    sortSurfaceItems();
    dragonflies = [];
    dragonflyTimer = Math.random() * 3600;
}

function sortSurfaceItems() {
    drawOrder = surfaceItems.slice().sort((a, b) => (a.layer || 0) - (b.layer || 0));
}

function animate(now = performance.now()) {
    const dt = Math.min((now - lastFrameTime) / 1000, 0.05);
    const wallTime = Date.now();
    lastFrameTime = now;
    ctx.fillStyle = "#071c32";
    ctx.fillRect(0, 0, width, height);
    pond.update(dt);
    pond.drawBackground(ctx);

    for (const item of surfaceItems) item.update(dt, now);
    SurfaceItem.resolveAll(surfaceItems);
    for (const item of drawOrder) item.drawStem?.(ctx);
    for (const fish of fishes) {
        fish.update(dt, bubbles, wallTime);
        fish.draw(ctx, wallTime);
    }
    updateEffectList(bubbles, dt, wallTime);
    drawEffectList(bubbles, ctx);
    pond.drawOverlay(ctx);
    updateEffectList(ripples, dt, wallTime);
    drawEffectList(ripples, ctx);
    for (const item of drawOrder) item.draw(ctx);

    if (--dragonflyTimer <= 0) {
        dragonflies.push(new Dragonfly(width, height));
        dragonflyTimer = Math.random() * 3600;
    }
    updateEffectList(dragonflies, dt, wallTime);
    drawEffectList(dragonflies, ctx);
    requestAnimationFrame(animate);
}

function handlePointerDown(event) {
    if (pointerId !== null || event.button !== 0) return;
    const {clientX: x, clientY: y} = event;
    if (handleFrogClick(x, y)) return;
    if (beginSurfaceItemDrag(x, y)) {
        pointerId = event.pointerId;
        canvas.setPointerCapture(pointerId);
        return;
    }
    for (const fish of fishes) fish.setTarget(x, y);
    ripples.push(new Ripple(x, y));
}

function handlePointerMove(event) {
    if (!draggingItem || event.pointerId !== pointerId) return;
    const now = performance.now();
    const dt = Math.max((now - lastDragSampleTime) / 1000, 0.001);
    const previousX = draggingItem.x, previousY = draggingItem.y;
    draggingItem.setPosition(event.clientX + dragOffsetX, event.clientY + dragOffsetY);
    const dx = draggingItem.x - previousX, dy = draggingItem.y - previousY;
    moveDuckweedGroup(dx, dy);
    dragVelocityX = dx / dt;
    dragVelocityY = dy / dt;
    lastDragSampleTime = now;
}

function handlePointerUp(event) {
    if (event.pointerId !== pointerId) return;
    endSurfaceItemDrag();
}

function beginSurfaceItemDrag(x, y) {
    for (let i = surfaceItems.length - 1; i >= 0; i--) {
        const item = surfaceItems[i];
        if (!item.beginDrag || !item.containsPoint?.(x, y)) continue;
        draggingItem = item;
        item.beginDrag();
        dragOffsetX = item.x - x;
        dragOffsetY = item.y - y;
        dragVelocityX = dragVelocityY = 0;
        lastDragSampleTime = performance.now();
        duckweedDragGroup = item instanceof Duckweed ? findDuckweedNeighbors(item, scaleValue(100)) : [];
        for (const leaf of duckweedDragGroup) leaf.beginDrag();
        surfaceItems.splice(i, 1);
        surfaceItems.push(item);
        sortSurfaceItems();
        return true;
    }
    return false;
}

function endSurfaceItemDrag() {
    if (!draggingItem) return;
    const capturedPointer = pointerId;
    draggingItem.releaseMomentum(dragVelocityX, dragVelocityY);
    for (const leaf of duckweedDragGroup) leaf.releaseMomentum(dragVelocityX, dragVelocityY);
    duckweedDragGroup = [];
    draggingItem = null;
    pointerId = null;
    if (capturedPointer !== null && canvas.hasPointerCapture(capturedPointer)) canvas.releasePointerCapture(capturedPointer);
}

function updateEffectList(list, dt, now) {
    let count = 0;
    for (const effect of list) {
        effect.update(dt, now);
        if (effect.active) list[count++] = effect;
    }
    list.length = count;
}

function drawEffectList(list, ctx) {
    for (const effect of list) effect.draw(ctx);
}

function spawnDuckweedClusters(items) {
    const clusters = 2 + Math.floor(Math.random() * 2);
    const margin = scaleValue(30);
    for (let i = 0; i < clusters; i++) {
        const x = margin + Math.random() * (width - margin * 2);
        const y = margin + Math.random() * (height - margin * 2);
        spawnDuckweedClusterAt(items, x, y, {
            radius: scaleValue(20 + Math.random() * 80),
            leafMin: 8,
            leafMax: 47,
            baseDelay: items.length * 0.05 + i * 0.08,
            margin
        });
    }
}

function spawnDuckweedClusterAt(items, centerX, centerY, {
    radius = scaleValue(45), leafMin = 3, leafMax = 6,
    baseDelay = items.length * 0.05, margin = scaleValue(30),
    minSpacing = scaleValue(12), attemptsPerLeaf = 6
} = {}) {
    const min = Math.max(1, Math.floor(leafMin));
    const max = Math.max(min, Math.floor(leafMax));
    const count = min + Math.floor(Math.random() * (max - min + 1));
    const placed = [];
    for (let i = 0; i < count; i++) {
        for (let attempt = 0; attempt < attemptsPerLeaf; attempt++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = radius * (0.35 + Math.pow(Math.random(), 0.65) * 0.65);
            const skewX = 0.75 + Math.random() * 0.5, skewY = 0.75 + Math.random() * 0.5;
            const x = clamp(centerX + Math.cos(angle) * distance * skewX, margin, width - margin);
            const y = clamp(centerY + Math.sin(angle) * distance * skewY, margin, height - margin);
            if (placed.some(leaf => (leaf.x - x) ** 2 + (leaf.y - y) ** 2 < minSpacing ** 2)) continue;
            const leaf = new Duckweed(x, y, scaleValue(5 + Math.random() * 6));
            leaf.popInDelay = baseDelay + i * 0.03;
            placed.push(leaf);
            items.push(leaf);
            break;
        }
    }
}

function moveDuckweedGroup(dx, dy) {
    if (!dx && !dy) return;
    for (const leaf of duckweedDragGroup) leaf.setPosition(clamp(leaf.x + dx, 0, width), clamp(leaf.y + dy, 0, height));
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function findDuckweedNeighbors(source, radius) {
    return surfaceItems.filter(item => item !== source && item instanceof Duckweed
        && (item.x - source.x) ** 2 + (item.y - source.y) ** 2 <= radius ** 2);
}

function handleFrogClick(x, y) {
    for (const item of surfaceItems) {
        if (item instanceof Frog && !item.isJumping && item.containsPoint(x, y) && jumpFrog(item)) return true;
    }
    return false;
}

function jumpFrog(frog) {
    if (frog.isJumping) return false;
    let target = findClosestUnoccupiedPad(frog.x, frog.y, frog.parentPad, frog.previousPad, frog.frogSize);
    const previous = frog.previousPad;
    if (!target && previous && previous.size >= frog.frogSize * 1.2
        && !surfaceItems.some(item => item instanceof Frog && (item.parentPad === previous || item.jumpTargetPad === previous))) {
        target = previous;
    }
    if (!target) return false;
    frog.jumpTo(target);
    ripples.push(new Ripple(frog.x, frog.y));
    return true;
}

function findClosestUnoccupiedPad(x, y, excludePad, previousPad, minPadSize = 0) {
    const occupied = new Set();
    for (const item of surfaceItems) {
        if (item instanceof Frog) {
            occupied.add(item.parentPad);
            occupied.add(item.jumpTargetPad);
        }
    }
    let closest = null, distance = Infinity;
    for (const item of surfaceItems) {
        if (!(item instanceof LilyPad) || item instanceof Flower || item === excludePad || item === previousPad
            || occupied.has(item) || item.size < minPadSize * 1.2) continue;
        const squared = (item.x - x) ** 2 + (item.y - y) ** 2;
        if (squared < distance) {
            closest = item;
            distance = squared;
        }
    }
    return closest;
}

init();
animate();
