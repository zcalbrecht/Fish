const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let fishes = [];
let lilyPads = [];
let ripples = [];
let dragonflies = [];
let draggingPad = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

function init() {
    resize();
    window.addEventListener("resize", resize);

    // Click to set target and spawn ripple
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
        draggingPad.setPosition(
            e.clientX + dragOffsetX,
            e.clientY + dragOffsetY
        );
    });
    window.addEventListener("mouseup", endPadDrag);
    window.addEventListener("mouseleave", endPadDrag);

    fishes = [];

    fishes.push(
        new Fish(width / 2, height / 2, { color: { h: 35, s: 90, l: 50 } })
    );

    fishes.push(
        new Fish(width / 2 + 50, height / 2 + 50, {
            color: { h: 200, s: 10, l: 90 },
        })
    );

    fishes.push(
        new Fish(width / 2 - 50, height / 2 + 20, {
            color: { h: 0, s: 0, l: 95 }, // White base
            pattern: "spots",
            patternColor: { h: 25, s: 90, l: 50 }, // Orange spots
        })
    );

    fishes.push(
        new Fish(width / 2, height / 2 - 50, {
            color: { h: 0, s: 0, l: 95 }, // White base
            pattern: "tricolor",
            patternColor: { h: 10, s: 90, l: 50 }, // Red/Orange
            patternColor2: { h: 0, s: 0, l: 15 }, // Black
        })
    );

    //Spawn Random Fish(leave commented out for now)
    // for (let i = 0; i < 10; i++) {
    //     fishes.push(new Fish(Math.random() * width, Math.random() * height));
    // }

    // Create some lily pads
    lilyPads = [];
    const padCount = 7;
    for (let i = 0; i < padCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        const size = 40 + Math.random() * 40;
        lilyPads.push(new LilyPad(x, y, size));
    }

    dragonflies = [];
    // Initialize timer for next spawn (random between 0s and 60s)
    dragonflyTimer = Math.random() * 3600;
}

let dragonflyTimer = 0;

function animate() {
    ctx.fillStyle = "#001123";
    ctx.fillRect(0, 0, width, height);

    // Draw fish first (under water effect)
    for (const fish of fishes) {
        fish.update();
        fish.draw(ctx);
    }

    // Draw "Pond Effect" (Water depth/vignette)
    // Overlaps fish, but under lily pads
    drawPondEffect();

    // Draw ripples (above fish and pond effect, below lily pads)
    for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].update();
        ripples[i].draw(ctx);
        if (ripples[i].isFinished()) {
            ripples.splice(i, 1);
        }
    }

    // Draw lily pads last (on top of water effect)
    for (const pad of lilyPads) {
        pad.draw(ctx);
    }

    // Spawn dragonflies randomly
    // Timer based logic
    dragonflyTimer--;
    if (dragonflyTimer <= 0) {
        dragonflies.push(new Dragonfly(width, height));
        // Reset timer: 0 to 60 seconds (at 60fps, 0 to 3600 frames)
        dragonflyTimer = Math.random() * 3600;
    }

    // Update and draw dragonflies
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

class WaterTexture {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.polygons = [];
        this.particles = [];
        this.init();
    }

    init() {
        // Create drifting polygons (large, faint shapes)
        // Increased count and decreased size for better texture
        for (let i = 0; i < 40; i++) {
            this.polygons.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: 50 + Math.random() * 100, // Smaller: 50-150
                sides: 3 + Math.floor(Math.random() * 3), // Triangles to Pentagons
                angle: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.002,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                // Reduced opacity for subtlety: 0.01 to 0.04
                opacity: 0.01 + Math.random() * 0.03,
                // Random hue: Green (120) to Cyan (180)
                hue: 120 + Math.random() * 60,
            });
        }

        // Create suspended particles (sediment)
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: 1 + Math.random() * 2,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                opacity: 0.1 + Math.random() * 0.2,
            });
        }
    }

    update() {
        // Update polygons
        for (const poly of this.polygons) {
            poly.x += poly.vx;
            poly.y += poly.vy;
            poly.angle += poly.rotationSpeed;

            // Wrap around
            if (poly.x < -poly.size) poly.x = this.width + poly.size;
            if (poly.x > this.width + poly.size) poly.x = -poly.size;
            if (poly.y < -poly.size) poly.y = this.height + poly.size;
            if (poly.y > this.height + poly.size) poly.y = -poly.size;
        }

        // Update particles
        for (const p of this.particles) {
            p.x += p.vx;
            p.y += p.vy;

            // Wrap around
            if (p.x < 0) p.x = this.width;
            if (p.x > this.width) p.x = 0;
            if (p.y < 0) p.y = this.height;
            if (p.y > this.height) p.y = 0;
        }
    }

    draw(ctx) {
        // Draw polygons
        for (const poly of this.polygons) {
            ctx.save();
            ctx.translate(poly.x, poly.y);
            ctx.rotate(poly.angle);

            // Use HSLA for color variation
            ctx.fillStyle = `hsla(${poly.hue}, 60%, 20%, ${poly.opacity})`;

            ctx.beginPath();
            for (let i = 0; i < poly.sides; i++) {
                const theta = (i / poly.sides) * Math.PI * 2;
                const px = Math.cos(theta) * poly.size;
                const py = Math.sin(theta) * poly.size;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        // Draw particles
        ctx.fillStyle = "#88aacc"; // Light blue-ish gray for sediment
        for (const p of this.particles) {
            ctx.globalAlpha = p.opacity;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1.0; // Reset alpha
    }
}

let waterTexture;

function drawPondEffect() {
    if (!waterTexture) {
        waterTexture = new WaterTexture(width, height);
    }

    // Update and draw texture
    waterTexture.update();
    waterTexture.draw(ctx);

    // Create a radial gradient for depth/vignette
    // Center is clearer, edges are darker
    const gradient = ctx.createRadialGradient(
        width / 2,
        height / 2,
        height * 0.2,
        width / 2,
        height / 2,
        height * 0.8
    );

    // Colors: Dark Blue/Black with transparency
    // Center: Low opacity (fish visible)
    gradient.addColorStop(0, "rgba(0, 6, 20, 0.15)");
    // Edges: Higher opacity (murky depth)
    gradient.addColorStop(1, "rgba(0, 3, 12, 0.7)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
}

init();
animate();

function beginPadDrag(x, y) {
    for (let i = lilyPads.length - 1; i >= 0; i--) {
        const pad = lilyPads[i];
        if (pad.containsPoint(x, y)) {
            draggingPad = pad;
            dragOffsetX = pad.x - x;
            dragOffsetY = pad.y - y;
            lilyPads.splice(i, 1);
            lilyPads.push(pad);
            return true;
        }
    }
    return false;
}

function endPadDrag() {
    draggingPad = null;
}
