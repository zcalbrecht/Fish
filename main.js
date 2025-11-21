const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let fishes = [];
let surfaceItems = [];
let ripples = [];
let dragonflies = [];
let pond = null;
let raft = null;

let draggingItem = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let lastFrameTime =
    typeof performance !== "undefined" ? performance.now() : Date.now();
let lastDragSampleTime = 0;
let dragVelocityX = 0;
let dragVelocityY = 0;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    if (pond) pond.resize(width, height);
    positionRaft();
}

function positionRaft() {
    if (!raft) return;
    const marginX = raft.width * 0.5 + 40;
    const marginY = raft.height * 0.5 + 60;
    const targetX = Math.max(marginX, width - marginX);
    const targetY = Math.max(marginY, height - marginY);
    raft.setPosition(targetX, targetY);
}

function init() {
    pond = new Pond(window.innerWidth, window.innerHeight);
    resize();
    window.addEventListener("resize", resize);

    // Helper to get coordinates from mouse or touch events
    const getEventCoords = (e) => {
        if (e.touches && e.touches.length > 0) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        } else if (e.changedTouches && e.changedTouches.length > 0) {
            return {
                x: e.changedTouches[0].clientX,
                y: e.changedTouches[0].clientY,
            };
        }
        return { x: e.clientX, y: e.clientY };
    };

    const handleStart = (e) => {
        const coords = getEventCoords(e);
        if (beginSurfaceItemDrag(coords.x, coords.y)) {
            return;
        }
        for (const fish of fishes) {
            fish.setTarget(coords.x, coords.y);
        }
        ripples.push(new Ripple(coords.x, coords.y));
    };

    const handleMove = (e) => {
        if (!draggingItem) return;
        e.preventDefault(); // Prevent scrolling on mobile
        const coords = getEventCoords(e);
        const now =
            typeof performance !== "undefined" ? performance.now() : Date.now();
        const dt = Math.max((now - lastDragSampleTime) / 1000, 0.001);
        const prevX = draggingItem.x;
        const prevY = draggingItem.y;
        const nextX = coords.x + dragOffsetX;
        const nextY = coords.y + dragOffsetY;
        draggingItem.setPosition(nextX, nextY);
        dragVelocityX = (draggingItem.x - prevX) / dt;
        dragVelocityY = (draggingItem.y - prevY) / dt;
        lastDragSampleTime = now;
    };

    // Mouse events
    window.addEventListener("mousedown", handleStart);
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", endSurfaceItemDrag);
    window.addEventListener("mouseleave", endSurfaceItemDrag);

    // Touch events
    window.addEventListener(
        "touchstart",
        (e) => {
            e.preventDefault(); // Prevent default touch behavior
            handleStart(e);
        },
        { passive: false }
    );
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("touchend", endSurfaceItemDrag);
    window.addEventListener("touchcancel", endSurfaceItemDrag);

    fishes = [];

    // Shadow Fish
    fishes.push(
        new Fish(Math.random() * width, Math.random() * height, {
            color: { h: 210, s: 120, l: 4 },
            sizeScale: 0.6,
            pattern: "silhouette",
        })
    );

    fishes.push(
        new Fish(Math.random() * width, Math.random() * height, {
            color: { h: 210, s: 120, l: 4 },
            sizeScale: 0.8,
            pattern: "silhouette",
        })
    );

    fishes.push(
        new Fish(Math.random() * width, Math.random() * height, {
            color: { h: 35, s: 90, l: 50 },
        })
    );

    fishes.push(
        new Fish(Math.random() * width, Math.random() * height, {
            color: { h: 200, s: 10, l: 90 },
        })
    );

    fishes.push(
        new Fish(Math.random() * width, Math.random() * height, {
            color: { h: 0, s: 0, l: 95 },
            pattern: "spots",
            patternColor: { h: 25, s: 90, l: 50 },
        })
    );

    fishes.push(
        new Fish(Math.random() * width, Math.random() * height, {
            color: { h: 0, s: 0, l: 95 },
            pattern: "tricolor",
            patternColor: { h: 10, s: 90, l: 50 },
            patternColor2: { h: 0, s: 0, l: 15 },
        })
    );

    // // Spawn Random Fish(leave commented out for now)
    //  for (let i = 0; i < 10; i++) {
    //      fishes.push(new Fish(Math.random() * width, Math.random() * height));
    //  }

    surfaceItems = [];
    const padCount = 5;
    for (let i = 0; i < padCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = 40 + Math.random() * 40;

        const pad = new LilyPad(x, y, size);
        // Add delay: 0.1s per index
        pad.popInDelay = i * 0.1;
        surfaceItems.push(pad);

        // 20% chance to spawn a flower buddy nearby
        if (Math.random() < 0.2) {
            // Pick a spot next to the pad (size + margin)
            const angle = Math.random() * Math.PI * 2;
            const dist = size + 15 + Math.random() * 20;
            const fx = x + Math.cos(angle) * dist;
            const fy = y + Math.sin(angle) * dist;

            // Create flower instance
            const flower = new Flower(fx, fy, size * 0.6);
            // Give flower same delay as parent pad, plus a tiny bit
            flower.popInDelay = pad.popInDelay + 0.2;
            surfaceItems.push(flower);
        }

        // 20% chance to spawn a smaller lily pad nearby
        else if (Math.random() < 0.4) {
            // Pick a spot next to the pad (size + margin)
            const angle = Math.random() * Math.PI * 2;
            const dist = size + 15 + Math.random() * 20;
            const sx = x + Math.cos(angle) * dist;
            const sy = y + Math.sin(angle) * dist;

            // Create smaller lily pad instance
            const smallPad = new LilyPad(sx, sy, size * 0.6);
            // Give small pad same delay as parent pad, plus a tiny bit
            smallPad.popInDelay = pad.popInDelay + 0.2;
            surfaceItems.push(smallPad);
        }
    }

    const raftSize = 75;
    raft = new Raft(0, 0, raftSize);
    raft.popInDelay = padCount * 0.1 + 0.3;
    surfaceItems.push(raft);
    positionRaft();

    dragonflies = [];
    dragonflyTimer = Math.random() * 3600;
}

let dragonflyTimer = 0;

function animate() {
    const now =
        typeof performance !== "undefined" ? performance.now() : Date.now();
    const dt = Math.min((now - lastFrameTime) / 1000, 0.05);
    lastFrameTime = now;

    ctx.fillStyle = "#001123";
    ctx.fillRect(0, 0, width, height);

    if (pond) {
        pond.update(dt);
        pond.drawBackground(ctx);
    }

    // Update surface items (needed for transforms/stems)
    for (const item of surfaceItems) {
        if (typeof item.update === "function") {
            item.update(dt, now);
        }
    }

    SurfaceItem.resolveAll(surfaceItems);

    // Draw all stems first (bottom layer, before everything else)
    for (const item of surfaceItems) {
        if (typeof item.drawStem === "function") {
            item.drawStem(ctx);
        }
    }

    for (const fish of fishes) {
        fish.update();
        fish.draw(ctx);
    }

    if (pond) {
        pond.drawOverlay(ctx);
    }

    updateEffectList(ripples, dt);
    drawEffectList(ripples, ctx);

    // Draw surface items (on top of stems and fish)
    for (const item of surfaceItems) {
        item.draw(ctx);
    }

    dragonflyTimer--;
    if (dragonflyTimer <= 0) {
        dragonflies.push(new Dragonfly(width, height));
        dragonflyTimer = Math.random() * 3600;
    }

    updateEffectList(dragonflies, dt);
    drawEffectList(dragonflies, ctx);

    requestAnimationFrame(animate);
}

init();
animate();

function beginSurfaceItemDrag(x, y) {
    for (let i = surfaceItems.length - 1; i >= 0; i--) {
        const item = surfaceItems[i];
        if (!item.containsPoint || !item.containsPoint(x, y)) continue;
        draggingItem = item;
        draggingItem.beginDrag();
        dragOffsetX = item.x - x;
        dragOffsetY = item.y - y;
        dragVelocityX = 0;
        dragVelocityY = 0;
        lastDragSampleTime =
            typeof performance !== "undefined" ? performance.now() : Date.now();
        surfaceItems.splice(i, 1);
        surfaceItems.push(item);
        return true;
    }
    return false;
}

function endSurfaceItemDrag() {
    if (!draggingItem) return;
    draggingItem.releaseMomentum(dragVelocityX, dragVelocityY);
    draggingItem = null;
}

function updateEffectList(list, dt) {
    for (let i = list.length - 1; i >= 0; i--) {
        const effect = list[i];
        effect.update(dt);
        if (!effect.active) {
            list.splice(i, 1);
        }
    }
}

function drawEffectList(list, ctx) {
    for (const effect of list) {
        effect.draw(ctx);
    }
}
