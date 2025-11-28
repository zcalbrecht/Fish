class FishTrailParticle extends Effect {
    constructor(x, y, color) {
        super(x, y);
        this.color = { ...color };
        this.size = 2 + Math.random() * 3;
        this.lifetime = 0.3 + Math.random() * 0.4;
        this.age = 0;
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 0.5) * 10;
        this.opacity = 0.6;
    }

    update(dt = 0.016) {
        this.age += dt;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.vx *= 0.95;
        this.vy *= 0.95;
        
        if (this.age >= this.lifetime) {
            this.active = false;
        }
    }

    draw(ctx) {
        const progress = this.age / this.lifetime;
        const alpha = this.opacity * (1 - progress);
        const scale = ResponsiveScale.getScale();
        
        if (alpha <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size * scale
        );
        gradient.addColorStop(0, `hsla(${this.color.h}, ${this.color.s}%, ${this.color.l}%, 1)`);
        gradient.addColorStop(1, `hsla(${this.color.h}, ${this.color.s}%, ${this.color.l}%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * scale, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

class FishTrailSystem {
    constructor() {
        this.particles = [];
    }

    spawnParticle(x, y, color) {
        if (Math.random() < 0.3) {
            this.particles.push(new FishTrailParticle(x, y, color));
        }
    }

    update(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update(dt);
            if (!this.particles[i].active) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        for (const particle of this.particles) {
            particle.draw(ctx);
        }
    }
}
