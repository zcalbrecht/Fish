class Ripple {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.maxRadius = 80;
        this.alpha = 0.4; // Lower starting opacity
        this.speed = 0.5;
        this.lineWidth = 6; // Wider lines
    }

    update() {
        this.radius += this.speed;
        // Alpha is now calculated based on radius in draw()
    }

    draw(ctx) {
        ctx.save();

        // Central "Splash"
        // Fades out quickly based on main radius
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

        // Draw 4 rings with quadrupled spacing
        // Offsets: 0, -40, -80, -120
        this.drawRing(ctx, 0, this.alpha);
        this.drawRing(ctx, -20, this.alpha * 0.8);
        this.drawRing(ctx, -40, this.alpha * 0.6);

        ctx.restore();
    }

    drawRing(ctx, offset, startingOpacity) {
        const r = this.radius + offset;
        if (r > 0) {
            // Calculate alpha based on THIS ring's progress towards maxRadius
            // When r reaches maxRadius, alpha should be 0.
            const progress = r / this.maxRadius;
            // Clamp progress to 0-1
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
        // Finished when the innermost ring (offset -120) has faded out
        return (this.radius - 120) >= this.maxRadius;
    }
}
