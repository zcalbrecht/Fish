class WaterPolygonEffect extends Effect {
    constructor(width, height) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        super(x, y);
        this.width = width;
        this.height = height;
        this.size = 50 + Math.random() * 100;
        const sides = 3 + Math.floor(Math.random() * 3);
        this.angle = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.12;
        this.vx = (Math.random() - 0.5) * 12;
        this.vy = (Math.random() - 0.5) * 12;
        const opacity = 0.01 + Math.random() * 0.03;
        const hue = 120 + Math.random() * 60;

        this.extent = Math.ceil(this.size + 20);
        this.sprite = document.createElement("canvas");
        this.sprite.width = this.sprite.height = this.extent * 2;
        const ctx = this.sprite.getContext("2d");
        ctx.translate(this.extent, this.extent);
        ctx.filter = "blur(5px)";
        ctx.fillStyle = `hsla(${hue}, 55%, 28%, ${opacity})`;
        ctx.beginPath();
        for (let i = 0; i < sides; i++) {
            const angle = i / sides * Math.PI * 2;
            const px = Math.cos(angle) * this.size;
            const py = Math.sin(angle) * this.size;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
    }

    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.angle += this.rotationSpeed * dt;
        if (this.x < -this.size) this.x = this.width + this.size;
        if (this.x > this.width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = this.height + this.size;
        if (this.y > this.height + this.size) this.y = -this.size;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.drawImage(this.sprite, -this.extent, -this.extent);
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
        this.vx = (Math.random() - 0.5) * 30;
        this.vy = (Math.random() - 0.5) * 30;
        this.opacity = 0.1 + Math.random() * 0.2;
    }

    update(dt) {
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        if (this.x < 0) this.x = this.width;
        if (this.x > this.width) this.x = 0;
        if (this.y < 0) this.y = this.height;
        if (this.y > this.height) this.y = 0;
    }

    draw(ctx) {
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class WaterEffectsController {
    constructor(width, height, { polygonCount = 40, particleCount = 50 } = {}) {
        this.polygons = Array.from({ length: polygonCount }, () => new WaterPolygonEffect(width, height));
        this.particles = Array.from({ length: particleCount }, () => new WaterParticleEffect(width, height));
    }

    resize(width, height) {
        for (const group of [this.polygons, this.particles]) {
            for (const effect of group) {
                effect.width = width;
                effect.height = height;
            }
        }
    }

    update(dt = 0.016) {
        for (const polygon of this.polygons) polygon.update(dt);
        for (const particle of this.particles) particle.update(dt);
    }

    draw(ctx) {
        for (const polygon of this.polygons) polygon.draw(ctx);
        ctx.save();
        ctx.fillStyle = "#88aacc";
        for (const particle of this.particles) particle.draw(ctx);
        ctx.restore();
    }
}
