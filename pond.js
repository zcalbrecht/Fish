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

        gradient.addColorStop(0, "rgba(0, 6, 20, 0.15)");
        gradient.addColorStop(1, "rgba(0, 3, 12, 0.7)");

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);
    }
}

