class Ripple extends Effect {
    constructor(x, y) {
        super(x, y);
        this.radius = 0;
        this.maxRadius = ResponsiveScale.scaleValue(80);
        this.alpha = 0.4;
        this.speed = ResponsiveScale.scaleValue(80); // Units per second (faster expansion for snappier feel)
        this.lineWidth = ResponsiveScale.scaleValue(6);
        this.splashThreshold = ResponsiveScale.scaleValue(20);
        this.splashBase = ResponsiveScale.scaleValue(5);
        this.ringOffsets = [
            0,
            -ResponsiveScale.scaleValue(20),
            -ResponsiveScale.scaleValue(40),
        ];
    }

    update(dt = 0.016) {
        // Time-based animation: speed is in units per second
        // Default dt assumes ~60fps if not provided
        this.radius += this.speed * dt;
        if ((this.radius - 120) >= this.maxRadius) {
            this.active = false;
        }
    }

    draw(ctx) {
        ctx.save();

        if (this.radius < this.splashThreshold) {
            const splashProgress = this.radius / this.splashThreshold;
            const splashAlpha = this.alpha * (1 - splashProgress);
            if (splashAlpha > 0) {
                ctx.fillStyle = `rgba(200, 230, 255, ${splashAlpha})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.splashBase + this.radius * 0.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        this.drawRing(ctx, this.ringOffsets[0], this.alpha);
        this.drawRing(ctx, this.ringOffsets[1], this.alpha * 0.8);
        this.drawRing(ctx, this.ringOffsets[2], this.alpha * 0.6);

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
