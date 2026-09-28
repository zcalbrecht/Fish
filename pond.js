class Pond {
    constructor(width, height) {
        this.effects = new WaterEffectsController(width, height);
        this.resize(width, height);
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.overlay = null;
        this.effects.resize(width, height);
    }

    update(dt) {
        this.effects.update(dt);
    }

    drawBackground(ctx) {
        this.effects.draw(ctx);
    }

    drawOverlay(ctx) {
        if (!this.width || !this.height) return;
        if (!this.overlay) {
            this.overlay = document.createElement("canvas");
            this.overlay.width = this.width;
            this.overlay.height = this.height;
            const overlayContext = this.overlay.getContext("2d");
            const gradient = overlayContext.createRadialGradient(
                this.width / 2, this.height / 2, this.height * 0.2,
                this.width / 2, this.height / 2, this.height * 0.8
            );
            gradient.addColorStop(0, "rgba(12, 30, 62, 0.17)");
            gradient.addColorStop(0.45, "rgba(4, 14, 32, 0.62)");
            gradient.addColorStop(0.75, "rgba(0, 3, 10, 0.93)");
            gradient.addColorStop(1, "rgba(0, 0, 1, 1)");
            overlayContext.fillStyle = gradient;
            overlayContext.fillRect(0, 0, this.width, this.height);
        }
        ctx.drawImage(this.overlay, 0, 0);
    }
}
