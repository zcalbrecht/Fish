class Pond {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.polygons = [];
        this.particles = [];
        this.init();
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        // Could respawn particles or just let them wrap
    }

    init() {
        // Create drifting polygons (large, faint shapes)
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

        // Draw Vignette / Depth Gradient
        const gradient = ctx.createRadialGradient(
            this.width / 2,
            this.height / 2,
            this.height * 0.2,
            this.width / 2,
            this.height / 2,
            this.height * 0.8
        );

        // Colors: Dark Blue/Black with transparency
        // Center: Low opacity (fish visible)
        gradient.addColorStop(0, "rgba(0, 6, 20, 0.15)");
        // Edges: Higher opacity (murky depth)
        gradient.addColorStop(1, "rgba(0, 3, 12, 0.7)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);
    }
}

