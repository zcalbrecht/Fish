class Sparkle extends Effect {
    constructor(x, y, options = {}) {
        super(x, y);
        const scale = ResponsiveScale.getScale();
        
        this.size = (options.size || 2 + Math.random() * 4) * scale;
        this.vx = options.vx || (Math.random() - 0.5) * 50;
        this.vy = options.vy || (Math.random() - 0.5) * 50;
        this.lifetime = options.lifetime || 0.3 + Math.random() * 0.3;
        this.age = 0;
        this.hue = options.hue || 200 + Math.random() * 60;
        this.opacity = options.opacity || 0.8 + Math.random() * 0.2;
    }

    update(dt = 0.016) {
        this.age += dt;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        this.vx *= 0.92;
        this.vy *= 0.92;
        
        if (this.age >= this.lifetime) {
            this.active = false;
        }
    }

    draw(ctx) {
        const progress = this.age / this.lifetime;
        const alpha = this.opacity * (1 - progress);
        
        if (alpha <= 0) return;
        
        ctx.save();
        ctx.globalAlpha = alpha;
        
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.size
        );
        gradient.addColorStop(0, `hsla(${this.hue}, 80%, 90%, 1)`);
        gradient.addColorStop(0.5, `hsla(${this.hue}, 70%, 70%, 0.6)`);
        gradient.addColorStop(1, `hsla(${this.hue}, 60%, 50%, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

class SparkleSystem {
    constructor() {
        this.sparkles = [];
    }

    spawnSparkles(x, y, velocityX = 0, velocityY = 0, count = 5) {
        const speed = Math.hypot(velocityX, velocityY);
        const intensity = Math.min(speed / 100, 3);
        const sparkleCount = Math.floor(count * intensity);
        
        for (let i = 0; i < sparkleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const sparkleSpeed = 20 + Math.random() * 40;
            const vx = velocityX * 0.3 + Math.cos(angle) * sparkleSpeed;
            const vy = velocityY * 0.3 + Math.sin(angle) * sparkleSpeed;
            
            this.sparkles.push(new Sparkle(x, y, {
                vx,
                vy,
                size: 1 + Math.random() * 3,
                hue: 180 + Math.random() * 80
            }));
        }
    }

    update(dt) {
        for (let i = this.sparkles.length - 1; i >= 0; i--) {
            this.sparkles[i].update(dt);
            if (!this.sparkles[i].active) {
                this.sparkles.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        for (const sparkle of this.sparkles) {
            sparkle.draw(ctx);
        }
    }
}
