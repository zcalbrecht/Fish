class Ripple extends Effect {
    constructor(x, y) {
        super(x, y);
        const scale = ResponsiveScale.getScale();
        this.radius = 0;
        this.maxRadius = 80 * scale;
        this.alpha = 0.4;
        this.speed = 80 * scale;
        this.lineWidth = 6 * scale;
        this.splashThreshold = 20 * scale;
        this.splashBase = 5 * scale;
        this.ringSpacing = 20 * scale;
    }

    update(dt = 0.016) {
        this.radius += this.speed * dt;
        this.active = this.radius < this.maxRadius + this.ringSpacing * 2;
    }

    draw(ctx) {
        if (!this.active) return;
        ctx.save();
        ctx.fillStyle = ctx.strokeStyle = "rgb(200, 230, 255)";
        ctx.lineWidth = this.lineWidth;
        if (this.radius < this.splashThreshold) {
            ctx.globalAlpha = this.alpha * (1 - this.radius / this.splashThreshold);
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.splashBase + this.radius * 0.5, 0, Math.PI * 2);
            ctx.fill();
        }
        for (let i = 0; i < 3; i++) {
            const radius = this.radius - this.ringSpacing * i;
            if (radius <= 0 || radius >= this.maxRadius) continue;
            ctx.globalAlpha = this.alpha * (1 - i * 0.2) * (1 - radius / this.maxRadius);
            ctx.beginPath();
            ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
            ctx.stroke();
        }
        ctx.restore();
    }
}
