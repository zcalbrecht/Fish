const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let fishes = [];
let lilyPads = [];
let ripples = [];
let dragonflies = [];
let pond = null;

let draggingPad = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let lastFrameTime = typeof performance !== "undefined" ? performance.now() : Date.now();
let lastDragSampleTime = 0;
let dragVelocityX = 0;
let dragVelocityY = 0;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    if (pond) pond.resize(width, height);
}

function init() {
    pond = new Pond(window.innerWidth, window.innerHeight);
    resize();
    window.addEventListener("resize", resize);

    window.addEventListener("mousedown", (e) => {
        if (beginPadDrag(e.clientX, e.clientY)) {
            return;
        }
        for (const fish of fishes) {
            fish.setTarget(e.clientX, e.clientY);
        }
        ripples.push(new Ripple(e.clientX, e.clientY));
    });
    window.addEventListener("mousemove", (e) => {
        if (!draggingPad) return;
        const now = typeof performance !== "undefined" ? performance.now() : Date.now();
        const dt = Math.max((now - lastDragSampleTime) / 1000, 0.001);
        const prevX = draggingPad.x;
        const prevY = draggingPad.y;
        const nextX = e.clientX + dragOffsetX;
        const nextY = e.clientY + dragOffsetY;
        draggingPad.setPosition(nextX, nextY);
        dragVelocityX = (draggingPad.x - prevX) / dt;
        dragVelocityY = (draggingPad.y - prevY) / dt;
        lastDragSampleTime = now;
    });
    window.addEventListener("mouseup", endPadDrag);
    window.addEventListener("mouseleave", endPadDrag);

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
        new Fish(Math.random() * width, Math.random() * height, { color: { h: 35, s: 90, l: 50 } })
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

    //Spawn Random Fish(leave commented out for now)
    // for (let i = 0; i < 10; i++) {
    //     fishes.push(new Fish(Math.random() * width, Math.random() * height));
    // }

    lilyPads = [];
    const padCount = 7;
    for (let i = 0; i < padCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = 40 + Math.random() * 40;
        
        const pad = new LilyPad(x, y, size);
        // Add delay: 0.1s per index
        pad.popInDelay = i * 0.1;
        lilyPads.push(pad);

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
            lilyPads.push(flower);
        }
    }

    dragonflies = [];
    dragonflyTimer = Math.random() * 3600;
}

let dragonflyTimer = 0;

function animate() {
    const now = typeof performance !== "undefined" ? performance.now() : Date.now();
    const dt = Math.min((now - lastFrameTime) / 1000, 0.05);
    lastFrameTime = now;

    ctx.fillStyle = "#001123";
    ctx.fillRect(0, 0, width, height);

    for (const fish of fishes) {
        fish.update();
        fish.draw(ctx);
    }

    if (pond) {
        pond.update();
        pond.draw(ctx);
    }

    for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].update();
        ripples[i].draw(ctx);
        if (ripples[i].isFinished()) {
            ripples.splice(i, 1);
        }
    }

    for (const pad of lilyPads) {
        pad.update(dt, now);
    }

    resolveLilyPadCollisions();

    for (const pad of lilyPads) {
        pad.draw(ctx);
    }

    dragonflyTimer--;
    if (dragonflyTimer <= 0) {
        dragonflies.push(new Dragonfly(width, height));
        dragonflyTimer = Math.random() * 3600;
    }

    for (let i = dragonflies.length - 1; i >= 0; i--) {
        const df = dragonflies[i];
        df.update();
        df.draw(ctx);
        if (!df.active) {
            dragonflies.splice(i, 1);
        }
    }

    requestAnimationFrame(animate);
}

init();
animate();

function beginPadDrag(x, y) {
    for (let i = lilyPads.length - 1; i >= 0; i--) {
        const pad = lilyPads[i];
        if (pad.containsPoint(x, y)) {
            draggingPad = pad;
            draggingPad.beginDrag();
            dragOffsetX = pad.x - x;
            dragOffsetY = pad.y - y;
            dragVelocityX = 0;
            dragVelocityY = 0;
            lastDragSampleTime =
                typeof performance !== "undefined" ? performance.now() : Date.now();
            lilyPads.splice(i, 1);
            lilyPads.push(pad);
            return true;
        }
    }
    return false;
}

function endPadDrag() {
    if (!draggingPad) return;
    draggingPad.releaseMomentum(dragVelocityX, dragVelocityY);
    draggingPad = null;
}

function resolveLilyPadCollisions() {
    for (let i = 0; i < lilyPads.length; i++) {
        for (let j = i + 1; j < lilyPads.length; j++) {
            const a = lilyPads[i];
            const b = lilyPads[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.hypot(dx, dy) || 0.0001;
            const minDist = a.size + b.size;
            if (dist >= minDist) continue;

            const overlap = minDist - dist;
            const nx = dx / dist;
            const ny = dy / dist;

            const aFlex = a.isDragging ? 0.2 : 0.5;
            const bFlex = b.isDragging ? 0.2 : 0.5;
            const flexSum = aFlex + bFlex;

            const moveA = overlap * (bFlex / flexSum);
            const moveB = overlap * (aFlex / flexSum);

            a.x -= nx * moveA;
            a.y -= ny * moveA;
            b.x += nx * moveB;
            b.y += ny * moveB;

            const relativeNormalVel =
                (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
            if (relativeNormalVel > 0) {
                const impulse = relativeNormalVel * 0.5;
                a.vx -= impulse * nx;
                a.vy -= impulse * ny;
                b.vx += impulse * nx;
                b.vy += impulse * ny;
            }
        }
    }
}
