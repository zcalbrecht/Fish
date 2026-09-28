class LilyPad extends SurfaceItem {
    constructor(x, y, size) {
        super(x, y, size);
        this.layer = 1;
        this.collisionScale = 0.9;
        this.angle = Math.random() * Math.PI * 2;
        this.color = `hsl(${100 + Math.random() * 40}, 60%, ${30 + Math.random() * 20}%)`;
        const notchWidth = (0.1 + Math.random() * 1.6) * 0.14;
        this.stemPhase = Math.random() * Math.PI * 2;
        this.stem = new Stem({
            length: ResponsiveScale.scaleValue(90 + Math.random() * 60),
            segmentCount: 12 + Math.floor(Math.random() * 5),
            phase: this.stemPhase,
            size,
            anchor: { x, y },
        });

        const start = notchWidth * Math.PI;
        const end = (2 - notchWidth) * Math.PI;
        this.leaf = new Path2D();
        this.leaf.arc(0, 0, size, start, end);
        this.leaf.lineTo(0, 0);
        this.leaf.closePath();
        this.veins = new Path2D();
        for (let i = 0; i < 5; i++) {
            const angle = start + (i + 0.5) / 5 * (end - start);
            this.veins.moveTo(0, 0);
            this.veins.lineTo(Math.cos(angle) * size * 0.9, Math.sin(angle) * size * 0.9);
        }
        this.updateTransform(performance.now());
        this.stem.setAnchor(this.anchorX, this.anchorY);
    }

    update(dt, now = performance.now()) {
        this.updatePopIn(dt);
        this.integrateMomentum(dt);
        this.updateTransform(now);
        this.stem.setAnchor(this.anchorX, this.anchorY);
        this.stem.update(dt, now);
    }

    updateTransform(now) {
        const radius = this.size * 0.16;
        this.anchorX = this.x + Math.sin(now / 5000 + this.stemPhase) * radius;
        this.anchorY = this.y + Math.cos(now / 5000 * 1.3 + this.stemPhase) * radius;
        this.currentRotation = this.angle + Math.sin(now / 1000 * 1.2 + this.stemPhase) * 0.05;
    }

    drawStem(ctx) {
        if (this.popInScale <= 0) return;
        this.beginTransform(ctx, this.anchorX, this.anchorY);
        ctx.translate(-this.anchorX, -this.anchorY);
        this.stem.draw(ctx);
        ctx.restore();
    }

    draw(ctx) {
        if (this.popInScale <= 0) return;
        const scale = ResponsiveScale.getScale();
        this.beginTransform(ctx, this.anchorX, this.anchorY, this.currentRotation);
        ctx.shadowColor = `rgba(18, 35, 75, ${0.4 * this.popInScale})`;
        ctx.shadowBlur = 12 * scale;
        ctx.shadowOffsetY = 15 * scale;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
        ctx.lineWidth = 2 * scale;
        ctx.fill(this.leaf);
        ctx.stroke(this.leaf);
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = ctx.shadowOffsetY = 0;

        ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
        ctx.lineWidth = scale;
        ctx.stroke(this.veins);
        ctx.restore();
    }
}
