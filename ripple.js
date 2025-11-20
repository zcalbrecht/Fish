class Ripple {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = 80;
        this.alpha = 0.4;
        this.speed = 0.5;
        this.lineWidth = 6;
    }

    update() {
        this.radius += this.speed;
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
        return (this.radius - 120) >= this.maxRadius;
    }
}
