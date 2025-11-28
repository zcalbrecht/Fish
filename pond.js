class Pond {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.effects = new WaterEffectsController(width, height);
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        if (this.effects) {
            this.effects.resize(width, height);
        }
    }

    update(dt = 0.016) {
        if (this.effects) {
            this.effects.update(dt);
        }
    }

    draw(ctx) {
        this.drawBackground(ctx);
        this.drawOverlay(ctx);
    }

    drawBackground(ctx) {
        if (!this.effects) return;
        this.effects.draw(ctx);
    }

    drawOverlay(ctx) {
        const gradient = ctx.createRadialGradient(
            this.width / 2,
            this.height / 2,
            this.height * 0.2,
            this.width / 2,
            this.height / 2,
            this.height * 0.8
        );

        gradient.addColorStop(0, "rgba(12, 30, 62, 0.17)");
        gradient.addColorStop(0.45, "rgba(4, 14, 32, 0.62)");
        gradient.addColorStop(0.75, "rgba(0, 3, 10, 0.93)");
        gradient.addColorStop(1, "rgba(0, 0, 1, 1)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);
    }

}

