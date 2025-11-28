const ResponsiveScale = (() => {
    const reference = 1200;
    const min = 0.55;
    const max = 1.1;
    let scale = 1;

    const clamp = (value, lo, hi) => Math.max(lo, Math.min(hi, value));

    return {
        setScale(width, height) {
            const shorterSide = Math.max(1, Math.min(width, height));
            scale = clamp(shorterSide / reference, min, max);
        },
        getScale() {
            return scale;
        },
        scaleValue(value) {
            return value * scale;
        },
    };
})();


