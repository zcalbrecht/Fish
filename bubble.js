class Bubble extends Effect {
    constructor(x, y) {
        super(x, y);
        const scale = ResponsiveScale.getScale();
        this.radius = 0;
        this.targetRadius = (2 + Math.random() * 5) * scale;
        this.vx = (Math.random() - 0.5) * 10 * scale;
        this.vy = (Math.random() - 0.5) * 10 * scale;
        this.wobbleSpeed = 5 + Math.random() * 5;
        this.wobbleOffset = Math.random() * Math.PI * 2;
        this.wobbleAmount = scale;
        this.life = this.maxLife = 1.5 + Math.random();
        this.growRate = this.targetRadius / (this.life * 0.5);
    }

    update(dt, now = Date.now()) {
        if (!this.active) return;
        this.x += (this.vx + Math.sin(now / 1000 * this.wobbleSpeed + this.wobbleOffset) * this.wobbleAmount) * dt;
        this.y += this.vy * dt;
        if (this.radius < this.targetRadius) this.radius += this.growRate * dt;
        this.life -= dt;
        this.active = this.life > 0;
    }

    draw(ctx) {
        if (!this.active) return;
        const alpha = 0.6 - this.life / this.maxLife * 0.3;
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = "rgba(200, 240, 255, 0.8)";
        ctx.fillStyle = "rgba(220, 245, 255, 0.2)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0, this.radius), 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.globalAlpha = alpha + 0.2;
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.beginPath();
        const offset = this.radius * 0.3;
        ctx.arc(this.x - offset, this.y - offset, this.radius * 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}
