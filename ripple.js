class Ripple extends Effect {
    constructor(x, y) {
        super(x, y);
        this.radius = 0;
        this.maxRadius = 80;
        this.alpha = 0.4;
        this.speed = 30; // Units per second (was 0.5 per frame at 60fps = 30/sec)
        this.lineWidth = 6;
    }

    update(dt = 0.016) {
        // Time-based animation: speed is in units per second
        // Default dt assumes ~60fps if not provided
        this.radius += this.speed * dt;
        if ((this.radius - 120) >= this.maxRadius) {
            this.active = false;
        }
    }

    isFinished() {
        return !this.active;
    }


    draw(ctx) {
        ctx.save();

        if (this.radius < 20) {
            const splashProgress = this.radius / 20;
            const splashAlpha = this.alpha * (1 - splashProgress);
            if (splashAlpha > 0) {
                ctx.fillStyle = `rgba(200, 230, 255, ${splashAlpha})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 5 + this.radius * 0.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        this.drawRing(ctx, 0, this.alpha);
        this.drawRing(ctx, -20, this.alpha * 0.8);
        this.drawRing(ctx, -40, this.alpha * 0.6);

        ctx.restore();
    }

    drawRing(ctx, offset, startingOpacity) {
        const r = this.radius + offset;
        if (r > 0) {
            const progress = r / this.maxRadius;
            const p = Math.max(0, Math.min(1, progress));
            const currentAlpha = startingOpacity * (1 - p);

            if (currentAlpha > 0) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, r, 0, Math.PI * 2);
                ctx.strokeStyle = `rgba(200, 230, 255, ${currentAlpha})`;
                ctx.lineWidth = this.lineWidth;
                ctx.stroke();
            }
        }
    }

    isFinished() {
        // Deprecated, check .active instead
        return !this.active;
    }
}
