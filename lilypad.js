class LilyPad extends SurfaceItem {
    constructor(x, y, size) {
        super(x, y, size);
        this.angle = Math.random() * Math.PI * 2;
        // Random shade of green
        this.color = `hsl(${100 + Math.random() * 40}, 60%, ${30 + Math.random() * 20}%)`;

        // Random notch size (0.2 to 1.5 times the base 0.15 PI)
        this.notchWidth = (0.1 + Math.random() * 1.6) * 0.14;

        // Stem properties
        this.stemPhase = Math.random() * Math.PI * 2;
        const stemLength = ResponsiveScale.scaleValue(90 + Math.random() * 60);
        const stemSegmentCount = 12 + Math.floor(Math.random() * 5);
        this.stem = new Stem({
            length: stemLength,
            segmentCount: stemSegmentCount,
            phase: this.stemPhase,
            size: this.size,
            anchor: { x, y },
        });

        this.updateTransform(this.getNow());
        this.stem.setAnchor(this.anchorX, this.anchorY);
    }

    getNow() {
        return typeof performance !== "undefined" ? performance.now() : Date.now();
    }

    update(dt, now = this.getNow()) {
        this.updatePopIn(dt);
        this.integrateMomentum(dt);
        this.updateTransform(now);
        this.stem.setAnchor(this.anchorX, this.anchorY);
        this.stem.update(dt, now);
    }

    updateTransform(now) {
        const wobbleTime = now / 5000;
        const wobbleRadius = this.size * 0.16;
        this.wobbleX = Math.sin(wobbleTime + this.stemPhase) * wobbleRadius;
        this.wobbleY = Math.cos(wobbleTime * 1.3 + this.stemPhase) * wobbleRadius;

        const rotationTime = now / 1000;
        this.currentRotation =
            this.angle + Math.sin(rotationTime * 1.2 + this.stemPhase) * 0.05;

        this.anchorX = this.x + this.wobbleX;
        this.anchorY = this.y + this.wobbleY;
    }

    drawStem(ctx) {
        ctx.save();
        // Scale the stem around the anchor point
        // We translate to anchor, scale, then translate back? 
        // Actually, stem nodes are absolute positions. 
        // But we can scale the entire context around the anchor point.
        ctx.translate(this.anchorX, this.anchorY);
        ctx.scale(this.popInScale, this.popInScale);
        ctx.translate(-this.anchorX, -this.anchorY);
        this.stem.draw(ctx);
        ctx.restore();
    }

    draw(ctx) {
        this.withTransform(ctx, () => {
            ctx.fillStyle = this.color;
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.lineWidth = 2 * ResponsiveScale.getScale();

            // Draw lily pad shape (circle with a wedge cut out)
            ctx.beginPath();
            // Start at the notch
            ctx.arc(0, 0, this.size, this.notchWidth * Math.PI, (2 - this.notchWidth) * Math.PI);
            ctx.lineTo(0, 0);
            ctx.closePath();

            ctx.fill();
            ctx.stroke();

            // Add some veins
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.lineWidth = ResponsiveScale.getScale();

            const startAngle = this.notchWidth * Math.PI;
            const endAngle = (2 - this.notchWidth) * Math.PI;
            const totalAngle = endAngle - startAngle;
            const veinCount = 5;

            for (let i = 0; i < veinCount; i++) {
                const t = (i + 0.5) / veinCount;
                const veinAngle = startAngle + t * totalAngle;
                
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(Math.cos(veinAngle) * this.size * 0.9, Math.sin(veinAngle) * this.size * 0.9);
                ctx.stroke();
            }
        }, { x: this.anchorX, y: this.anchorY, angle: this.currentRotation });
    }
}

