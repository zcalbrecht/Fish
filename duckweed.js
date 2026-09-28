class Duckweed extends SurfaceItem {
    constructor(x, y, size = 8) {
        super(x, y, size);
        this.baseAngle = Math.random() * Math.PI * 2;
        this.driftPhase = Math.random() * Math.PI * 2;
        this.driftSpeed = 0.7 + Math.random() * 0.6;
        this.wobbleAmount = 0.12 + Math.random() * 0.08;
        const aspect = 0.7 + Math.random() * 0.4;
        const hue = 95 + Math.random() * 35;
        const saturation = 50 + Math.random() * 25;
        const lightness = 30 + Math.random() * 25;
        this.fillColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        this.veinColor = `hsl(${hue + Math.random() * 10 - 5}, ${saturation + 5}%, ${Math.min(lightness + 20, 85)}%)`;

        this.leaf = new Path2D();
        this.leaf.ellipse(0, 0, size, size * aspect, 0, 0, Math.PI * 2);
        this.vein = new Path2D();
        this.vein.moveTo(-size * 0.6, 0);
        this.vein.lineTo(size * 0.6, 0);
        this.highlight = new Path2D();
        this.highlight.arc(size * 0.2, -size * 0.15, size * 0.25, 0, Math.PI * 2);
        this.updateTransform(performance.now());
    }

    update(dt, now = performance.now()) {
        this.updatePopIn(dt);
        this.integrateMomentum(dt);
        this.updateTransform(now);
    }

    updateTransform(now) {
        const wobbleTime = now / 2200;
        const radius = this.size * this.wobbleAmount;
        this.anchorX = this.x + Math.sin(wobbleTime * this.driftSpeed + this.driftPhase) * radius;
        this.anchorY = this.y + Math.cos(wobbleTime * this.driftSpeed * 0.8 + this.driftPhase) * radius;
        this.currentRotation = this.baseAngle + Math.sin(now / 1800 * this.driftSpeed + this.driftPhase) * 0.08;
    }

    draw(ctx) {
        if (this.popInScale <= 0) return;
        const scale = ResponsiveScale.getScale();
        this.beginTransform(ctx, this.anchorX, this.anchorY, this.currentRotation);
        ctx.shadowColor = `rgba(18, 35, 75, ${0.4 * this.popInScale})`;
        ctx.shadowBlur = 8 * scale;
        ctx.shadowOffsetY = 12 * scale;
        ctx.fillStyle = this.fillColor;
        ctx.fill(this.leaf);
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = ctx.shadowOffsetY = 0;

        ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
        ctx.lineWidth = 0.6 * scale;
        ctx.stroke(this.leaf);
        ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
        ctx.lineWidth = 0.4 * scale;
        ctx.stroke(this.vein);
        ctx.fillStyle = this.veinColor;
        ctx.fill(this.highlight);
        ctx.restore();
    }
}
