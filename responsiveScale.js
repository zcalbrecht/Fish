const ResponsiveScale = {
    scale: 1,
    setScale(width, height) {
        this.scale = Math.max(0.55, Math.min(1.1, Math.min(width, height) / 1200));
    },
    getScale() {
        return this.scale;
    },
    scaleValue(value) {
        return value * this.scale;
    }
};
