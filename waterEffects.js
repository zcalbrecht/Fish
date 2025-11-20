class WaterPolygonEffect extends Effect {
    constructor(width, height) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        super(x, y);
        this.width = width;
        this.height = height;

        this.size = 50 + Math.random() * 100;
        this.sides = 3 + Math.floor(Math.random() * 3);
        this.angle = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.12; // radians per second
        this.vx = (Math.random() - 0.5) * 12; // pixels per second
        this.vy = (Math.random() - 0.5) * 12;
        this.opacity = 0.01 + Math.random() * 0.03;
        this.hue = 120 + Math.random() * 60;
    }

    setBounds(width, height) {
        this.width = width;
        this.height = height;
    }

    update(dt = 0.016) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.angle += this.rotationSpeed * dt;
        const wrapSize = this.size;

        if (this.x < -wrapSize) this.x = this.width + wrapSize;
        if (this.x > this.width + wrapSize) this.x = -wrapSize;
        if (this.y < -wrapSize) this.y = this.height + wrapSize;
        if (this.y > this.height + wrapSize) this.y = -wrapSize;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        const prevFilter = ctx.filter || 'none';
        ctx.filter = 'blur(5px)';
        ctx.fillStyle = `hsla(${this.hue}, 60%, 20%, ${this.opacity})`;

        ctx.beginPath();
        for (let i = 0; i < this.sides; i++) {
            const theta = (i / this.sides) * Math.PI * 2;
            const px = Math.cos(theta) * this.size;
            const py = Math.sin(theta) * this.size;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.filter = prevFilter;
        ctx.restore();
    }
}

class WaterParticleEffect extends Effect {
    constructor(width, height) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        super(x, y);
        this.width = width;
        this.height = height;

        this.size = 1 + Math.random() * 2;
        this.vx = (Math.random() - 0.5) * 30; // pixels per second
        this.vy = (Math.random() - 0.5) * 30;
        this.opacity = 0.1 + Math.random() * 0.2;
    }

    setBounds(width, height) {
        this.width = width;
        this.height = height;
    }

    update(dt = 0.016) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        if (this.x < 0) this.x = this.width;
        if (this.x > this.width) this.x = 0;
        if (this.y < 0) this.y = this.height;
        if (this.y > this.height) this.y = 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = "#88aacc";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class WaterEffectsController {
    constructor(width, height, {
        polygonCount = 40,
        particleCount = 50
    } = {}) {
        this.width = width;
        this.height = height;
        this.polygonCount = polygonCount;
        this.particleCount = particleCount;
        this.polygons = [];
        this.particles = [];
        this.init();
    }

    init() {
        this.polygons = [];
        for (let i = 0; i < this.polygonCount; i++) {
            this.polygons.push(new WaterPolygonEffect(this.width, this.height));
        }

        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(new WaterParticleEffect(this.width, this.height));
        }
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        for (const poly of this.polygons) {
            poly.setBounds(width, height);
        }
        for (const particle of this.particles) {
            particle.setBounds(width, height);
        }
    }

    update(dt = 0.016) {
        for (const poly of this.polygons) {
            poly.update(dt);
        }
        for (const particle of this.particles) {
            particle.update(dt);
        }
    }

    draw(ctx) {
        for (const poly of this.polygons) {
            poly.draw(ctx);
        }
        for (const particle of this.particles) {
            particle.draw(ctx);
        }
    }
}

