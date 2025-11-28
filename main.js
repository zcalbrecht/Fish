const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const MOBILE_BREAKPOINT = 768;
const MOBILE_VIEW_SCALE = 0.85;

let width = window.innerWidth;
let height = window.innerHeight;
let viewportScale = 1;
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
const DUCKWEED_CLUSTER_RADIUS = 100;
let duckweedDragGroup = null;

function resize() {
    viewportScale = window.innerWidth <= MOBILE_BREAKPOINT ? MOBILE_VIEW_SCALE : 1;
    const displayWidth = window.innerWidth;
    const displayHeight = window.innerHeight;
    const scaledWidth = Math.round(displayWidth / viewportScale);
    const scaledHeight = Math.round(displayHeight / viewportScale);
    canvas.width = scaledWidth;
    canvas.height = scaledHeight;
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;
    width = scaledWidth;
    height = scaledHeight;
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
    resize();
    pond = new Pond(width, height);
    window.addEventListener("resize", resize);

    // Helper to get coordinates from mouse or touch events
    const getEventCoords = (e) => {
        const point =
            (e.touches && e.touches.length && e.touches[0]) ||
            (e.changedTouches && e.changedTouches.length && e.changedTouches[0]) ||
            e;
        return toCanvasCoords(point.clientX, point.clientY);
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
        const deltaX = draggingItem.x - prevX;
        const deltaY = draggingItem.y - prevY;
        if (duckweedDragGroup && duckweedDragGroup.length) {
            moveDuckweedGroup(deltaX, deltaY);
        }
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

        if (Math.random() < 0.6) {
            const clusterAngle = Math.random() * Math.PI * 2;
            const clusterDistance = size * 0.6 + Math.random() * 20;
            const clusterX = x + Math.cos(clusterAngle) * clusterDistance;
            const clusterY = y + Math.sin(clusterAngle) * clusterDistance;
            spawnDuckweedClusterAt(surfaceItems, clusterX, clusterY, {
                radius: Math.max(15, size * 0.35),
                leafMin: 3,
                leafMax: 7,
                baseDelay: pad.popInDelay + 0.15,
                margin: 15,
                minSpacing: 8,
                attemptsPerLeaf: 4,
            });
        }

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

    spawnDuckweedClusters(surfaceItems);

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

    ctx.fillStyle = "#071c32";
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
        const duckweedNeighbors =
            typeof Duckweed !== "undefined" && item instanceof Duckweed
                ? findDuckweedNeighbors(item, DUCKWEED_CLUSTER_RADIUS)
                : null;
        draggingItem = item;
        draggingItem.beginDrag();
        dragOffsetX = item.x - x;
        dragOffsetY = item.y - y;
        dragVelocityX = 0;
        dragVelocityY = 0;
        lastDragSampleTime =
            typeof performance !== "undefined" ? performance.now() : Date.now();
        if (duckweedNeighbors && duckweedNeighbors.length) {
            duckweedDragGroup = duckweedNeighbors;
            for (const leaf of duckweedDragGroup) {
                leaf.beginDrag();
            }
        } else {
            duckweedDragGroup = null;
        }
        surfaceItems.splice(i, 1);
        surfaceItems.push(item);
        return true;
    }
    return false;
}

function endSurfaceItemDrag() {
    if (!draggingItem) return;
    draggingItem.releaseMomentum(dragVelocityX, dragVelocityY);
    if (duckweedDragGroup && duckweedDragGroup.length) {
        for (const leaf of duckweedDragGroup) {
            leaf.releaseMomentum(dragVelocityX, dragVelocityY);
        }
        duckweedDragGroup = null;
    }
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

function spawnDuckweedClusters(surfaceItems) {
    if (!surfaceItems || typeof Duckweed === "undefined") return;

    const clusters = 2 + Math.floor(Math.random() * 2);
    const margin = 30;

    for (let c = 0; c < clusters; c++) {
        const centerX = margin + Math.random() * (width - margin * 2);
        const centerY = margin + Math.random() * (height - margin * 2);
        const clusterRadius = 20 + Math.random() * 80;
        const baseDelay = surfaceItems.length * 0.05 + c * 0.08;

        spawnDuckweedClusterAt(surfaceItems, centerX, centerY, {
            radius: clusterRadius,
            leafMin: 8,
            leafMax: 47,
            baseDelay,
            margin,
        });
    }
}

function spawnDuckweedClusterAt(surfaceItems, centerX, centerY, options = {}) {
    if (!surfaceItems || typeof Duckweed === "undefined") return;

    const {
        radius = 45,
        leafMin = 3,
        leafMax = 6,
        baseDelay = surfaceItems.length * 0.05,
        margin = 30,
        minSpacing = 12,
        attemptsPerLeaf = 6,
    } = options;

    const minCount = Math.max(1, Math.floor(leafMin));
    const maxCount = Math.max(minCount, Math.floor(leafMax));
    const leaves = minCount + Math.floor(Math.random() * (maxCount - minCount + 1));
    const placedLeaves = [];

    for (let i = 0; i < leaves; i++) {
        let placed = false;
        let attempt = 0;
        while (!placed && attempt < attemptsPerLeaf) {
            attempt++;
            const angle = Math.random() * Math.PI * 2;
            const distance = radius * (0.35 + Math.pow(Math.random(), 0.65) * 0.65);
            const skewX = 0.75 + Math.random() * 0.5;
            const skewY = 0.75 + Math.random() * 0.5;
            const candidateX = clamp(centerX + Math.cos(angle) * distance * skewX, margin, width - margin);
            const candidateY = clamp(centerY + Math.sin(angle) * distance * skewY, margin, height - margin);

            let tooClose = false;
            for (const existing of placedLeaves) {
                if (Math.hypot(existing.x - candidateX, existing.y - candidateY) < minSpacing) {
                    tooClose = true;
                    break;
                }
            }

            if (tooClose) continue;

            placedLeaves.push({ x: candidateX, y: candidateY });
            const size = 5 + Math.random() * 6;
            const leaf = new Duckweed(candidateX, candidateY, size);
            leaf.popInDelay = baseDelay + i * 0.03;
            surfaceItems.push(leaf);
            placed = true;
        }
    }
}

function moveDuckweedGroup(deltaX, deltaY) {
    if (!duckweedDragGroup || (!deltaX && !deltaY)) return;
    for (const leaf of duckweedDragGroup) {
        const x = clamp(leaf.x + deltaX, 0, width);
        const y = clamp(leaf.y + deltaY, 0, height);
        leaf.setPosition(x, y);
    }
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function findDuckweedNeighbors(source, radius) {
    if (!surfaceItems || !(source instanceof Duckweed)) return [];
    const neighbors = [];
    for (const candidate of surfaceItems) {
        if (candidate === source || !(candidate instanceof Duckweed)) continue;
        const dist = Math.hypot(candidate.x - source.x, candidate.y - source.y);
        if (dist <= radius) {
            neighbors.push(candidate);
        }
    }
    return neighbors;
}

function toCanvasCoords(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = rect.width ? canvas.width / rect.width : 1;
    const scaleY = rect.height ? canvas.height / rect.height : 1;
    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY,
    };
}