class Bubble extends Effect {
    constructor(x, y, options = {}) {
        super(x, y);
        const scale = ResponsiveScale.getScale();
        
        this.size = (options.size || 2 + Math.random() * 4) * scale;
        this.speed = (options.speed || 20 + Math.random() * 40) * scale;
        this.wobbleAmount = options.wobbleAmount || 0.5 * scale;
        this.wobbleSpeed = options.wobbleSpeed || 2 + Math.random() * 3;
        this.opacity = options.opacity || 0.3 + Math.random() * 0.3;
        this.lifetime = options.lifetime || 2 + Math.random() * 2;
        this.age = 0;
        
        this.wobblePhase = Math.random() * Math.PI * 2;
        this.vx = (Math.random() - 0.5) * this.wobbleAmount;
    }

    update(dt = 0.016) {
        this.age += dt;
        this.y -= this.speed * dt;
        
        this.wobblePhase += this.wobbleSpeed * dt;
        this.x += Math.sin(this.wobblePhase) * this.wobbleAmount * dt;
        
        if (this.age >= this.lifetime || this.y < -this.size) {
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
            this.x - this.size * 0.3,
            this.y - this.size * 0.3,
            0,
            this.x,
            this.y,
            this.size
        );
        gradient.addColorStop(0, 'rgba(200, 230, 255, 0.8)');
        gradient.addColorStop(0.7, 'rgba(150, 200, 255, 0.4)');
        gradient.addColorStop(1, 'rgba(100, 150, 200, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(200, 230, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        ctx.restore();
    }
}

class BubbleEmitter {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.bubbles = [];
        this.fishBubbleTimer = 0;
        this.randomBubbleTimer = 0;
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
    }

    update(dt, fishes) {
        this.fishBubbleTimer -= dt;
        this.randomBubbleTimer -= dt;
        
        if (this.fishBubbleTimer <= 0 && fishes && fishes.length > 0) {
            const randomFish = fishes[Math.floor(Math.random() * fishes.length)];
            if (randomFish && randomFish.segments && randomFish.segments.length > 0) {
                const tailSeg = randomFish.segments[randomFish.segments.length - 1];
                this.spawnBubble(tailSeg.x, tailSeg.y, { size: 2 + Math.random() * 3 });
            }
            this.fishBubbleTimer = 0.5 + Math.random() * 1.5;
        }
        
        if (this.randomBubbleTimer <= 0) {
            const x = Math.random() * this.width;
            const y = this.height - 20 - Math.random() * 50;
            this.spawnBubble(x, y, { size: 1.5 + Math.random() * 2.5 });
            this.randomBubbleTimer = 1 + Math.random() * 2;
        }
        
        for (let i = this.bubbles.length - 1; i >= 0; i--) {
            this.bubbles[i].update(dt);
            if (!this.bubbles[i].active) {
                this.bubbles.splice(i, 1);
            }
        }
    }

    spawnBubble(x, y, options = {}) {
        this.bubbles.push(new Bubble(x, y, options));
    }

    draw(ctx) {
        for (const bubble of this.bubbles) {
            bubble.draw(ctx);
        }
    }
}
