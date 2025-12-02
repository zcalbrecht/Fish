class Duckweed extends SurfaceItem {
    constructor(x, y, size = 8) {
        super(x, y, size);
        this.layer = 0; // Lowest z-level (default, but explicit for clarity)
        this.baseAngle = Math.random() * Math.PI * 2;
        this.driftPhase = Math.random() * Math.PI * 2;
        this.driftSpeed = 0.7 + Math.random() * 0.6;
        this.wobbleAmount = 0.12 + Math.random() * 0.08;
        this.aspect = 0.7 + Math.random() * 0.4;

        const hue = 95 + Math.random() * 35;
        const saturation = 50 + Math.random() * 25;
        const lightness = 30 + Math.random() * 25;
        this.fillColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        this.veinColor = `hsl(${hue + (Math.random() * 10 - 5)}, ${saturation + 5}%, ${Math.min(
            lightness + 20,
            85
        )}%)`;

        this.updateTransform(this.getNow());
    }

    getNow() {
        return typeof performance !== "undefined" ? performance.now() : Date.now();
    }

    update(dt, now = this.getNow()) {
        this.updatePopIn(dt);
        this.integrateMomentum(dt);
        this.updateTransform(now);
    }

    updateTransform(now) {
        const wobbleTime = now / 2200;
        const wobbleRadius = this.size * this.wobbleAmount;
        this.wobbleX = Math.sin(wobbleTime * this.driftSpeed + this.driftPhase) * wobbleRadius;
        this.wobbleY = Math.cos(wobbleTime * (this.driftSpeed * 0.8) + this.driftPhase) * wobbleRadius;

        const rotationTime = now / 1800;
        this.currentRotation =
            this.baseAngle + Math.sin(rotationTime * this.driftSpeed + this.driftPhase) * 0.08;

        this.anchorX = this.x + this.wobbleX;
        this.anchorY = this.y + this.wobbleY;
    }

    draw(ctx) {
        this.withTransform(
            ctx,
            () => {
                // Draw shadow (only when plant is visible)
                if (this.popInScale > 0) {
                    const shadowOffset = ResponsiveScale.scaleValue(12);
                    const shadowOpacity = 0.4 * this.popInScale;
                    ctx.shadowColor = `rgba(18, 35, 75, ${shadowOpacity})`;
                    ctx.shadowBlur = ResponsiveScale.scaleValue(8);
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = shadowOffset;
                }
                
                ctx.fillStyle = this.fillColor;
                ctx.beginPath();
                ctx.ellipse(0, 0, this.size, this.size * this.aspect, 0, 0, Math.PI * 2);
                ctx.fill();

                // Reset shadow properties
                ctx.shadowColor = "transparent";
                ctx.shadowBlur = 0;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;

                ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
                ctx.lineWidth = 0.6 * ResponsiveScale.getScale();
                ctx.stroke();

                ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
                ctx.lineWidth = 0.4 * ResponsiveScale.getScale();
                ctx.beginPath();
                ctx.moveTo(-this.size * 0.6, 0);
                ctx.lineTo(this.size * 0.6, 0);
                ctx.stroke();

                ctx.fillStyle = this.veinColor;
                ctx.beginPath();
                ctx.arc(this.size * 0.2, -this.size * 0.15, this.size * 0.25, 0, Math.PI * 2);
                ctx.fill();
            },
            { x: this.anchorX, y: this.anchorY, angle: this.currentRotation }
        );
    }
}


