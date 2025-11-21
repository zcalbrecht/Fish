class Raft extends SurfaceItem {
    constructor(x, y, size = 70) {
        super(x, y, size);
        this.width = size * 2;
        this.height = size * 1.2;
        this.wavePhase = Math.random() * Math.PI * 2;
        this.tiltPhase = Math.random() * Math.PI * 2;
        this.anchorX = x;
        this.anchorY = y;
        this.heave = 0;
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
        const wobbleTime = now / 1500;
        const driftRadius = this.size * 0.18;
        this.anchorX = this.x + Math.cos(wobbleTime + this.wavePhase) * driftRadius;
        this.anchorY =
            this.y + Math.sin(wobbleTime * 1.3 + this.wavePhase + 0.7) * driftRadius;
        this.currentRotation = Math.sin(wobbleTime * 0.8 + this.tiltPhase) * 0.08;
        this.heave = Math.sin(wobbleTime * 1.4 + this.wavePhase) * this.size * 0.05;
    }

    draw(ctx) {
        this.withTransform(
            ctx,
            () => {
                this.drawShadow(ctx);
                ctx.translate(0, this.heave);
                this.drawDeck(ctx);
                this.drawBraces(ctx);
            },
            { x: this.anchorX, y: this.anchorY, angle: this.currentRotation }
        );
    }

    drawShadow(ctx) {
        ctx.save();
        const shadowWidth = this.width * 1.05;
        const shadowHeight = this.height * 1.05;
        ctx.filter = "blur(10px)";
        ctx.globalAlpha = 0.65;
        ctx.fillStyle = "rgba(0, 0, 0, 0.75)";
        this.roundedRectPath(
            ctx,
            -shadowWidth / 2,
            -shadowHeight / 2,
            shadowWidth,
            shadowHeight,
            this.size * 0.4
        );
        ctx.fill();
        ctx.restore();
    }

    drawDeck(ctx) {
        const halfW = this.width / 2;
        const halfH = this.height / 2;
        const corner = Math.min(this.size * 0.25, halfH * 0.8);
        const gradient = ctx.createLinearGradient(-halfW, -halfH, -halfW, halfH);
        gradient.addColorStop(0, "#a36d34");
        gradient.addColorStop(0.5, "#c58a4c");
        gradient.addColorStop(1, "#87542a");

        this.roundedRectPath(ctx, -halfW, -halfH, this.width, this.height, corner);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
        ctx.stroke();

        const plankCount = 3;
        const inset = this.size * 0.2;
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
        for (let i = 1; i < plankCount; i++) {
            const y = -halfH + (this.height * i) / plankCount;
            ctx.beginPath();
            ctx.moveTo(-halfW + inset, y);
            ctx.lineTo(halfW - inset, y);
            ctx.stroke();
        }

        ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-halfW + inset * 0.5, -halfH + inset * 0.4);
        ctx.lineTo(halfW - inset * 0.5, -halfH + inset * 0.2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-halfW + inset * 0.5, halfH - inset * 0.2);
        ctx.lineTo(halfW - inset * 0.5, halfH - inset * 0.5);
        ctx.stroke();
    }

    drawBraces(ctx) {
        const halfW = this.width / 2;
        const halfH = this.height / 2;
        const braceInset = this.size * 0.15;
        ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
        ctx.lineWidth = 2.5;

        for (const sign of [-1, 1]) {
            ctx.beginPath();
            ctx.moveTo(-halfW + braceInset, sign * halfH);
            ctx.lineTo(halfW - braceInset, -sign * halfH);
            ctx.stroke();
        }

        ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
        const pegRadius = Math.max(2, this.size * 0.08);
        for (const sx of [-1, 1]) {
            for (const sy of [-1, 1]) {
                ctx.beginPath();
                ctx.arc(
                    sx * (halfW - braceInset * 0.8),
                    sy * (halfH - braceInset * 0.8),
                    pegRadius,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
        }
    }

    roundedRectPath(ctx, x, y, width, height, radius) {
        const r = Math.min(radius, width / 2, height / 2);
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.lineTo(x + width - r, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + r);
        ctx.lineTo(x + width, y + height - r);
        ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
        ctx.lineTo(x + r, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - r);
        ctx.lineTo(x, y + r);
        ctx.quadraticCurveTo(x, y, x + r, y);
        ctx.closePath();
    }
}


