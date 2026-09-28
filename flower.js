class Flower extends LilyPad {
    constructor(x, y, size) {
        super(x, y, size);
        this.layer = 2;
        const isPink = Math.random() < 0.3;
        this.flowerColor = isPink ? `hsl(${300 + Math.random() * 40}, 80%, 70%)` : "#f0f0f0";
        this.flowerCenter = isPink ? "#ffeb3b" : "#ffd700";
        this.flowerSize = size * (0.8 + Math.random() * 0.2);
        const petalCount = 8 + Math.floor(Math.random() * 4);
        this.flowerOffsetAngle = Math.random() * Math.PI * 2;
        this.outerPetals = Flower.createPetals(this.flowerSize, petalCount);
        this.petals = this.outerPetals.concat(Flower.createPetals(this.flowerSize * 0.7, petalCount, Math.PI / petalCount));
        this.center = new Path2D();
        this.center.arc(0, 0, this.flowerSize * 0.25, 0, Math.PI * 2);
    }

    static createPetals(size, count, offset = 0) {
        return Array.from({ length: count }, (_, i) => {
            const angle = i / count * Math.PI * 2 + offset;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const path = new Path2D();
            path.moveTo(0, 0);
            path.quadraticCurveTo(size * 0.4 * (cos - sin), size * 0.4 * (sin + cos), size * cos, size * sin);
            path.quadraticCurveTo(size * 0.4 * (cos + sin), size * 0.4 * (sin - cos), 0, 0);
            return path;
        });
    }

    draw(ctx) {
        if (this.popInScale <= 0) return;
        const scale = ResponsiveScale.getScale();
        this.beginTransform(ctx, this.anchorX, this.anchorY, this.currentRotation + this.flowerOffsetAngle);
        ctx.save();
        ctx.translate(5 * scale, 5 * scale);
        ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
        ctx.shadowBlur = 5 * scale;
        ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
        for (const petal of this.outerPetals) ctx.fill(petal);
        ctx.restore();

        ctx.fillStyle = this.flowerColor;
        ctx.strokeStyle = "rgba(0, 0, 0, 0.15)";
        ctx.lineWidth = 0.5 * scale;
        for (const petal of this.petals) {
            ctx.fill(petal);
            ctx.stroke(petal);
        }
        ctx.fillStyle = this.flowerCenter;
        ctx.fill(this.center);
        ctx.restore();
    }
}
