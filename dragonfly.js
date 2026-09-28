class Dragonfly extends Effect {
    constructor(canvasWidth, canvasHeight) {
        super(0, 0);
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.scale = (1.6 + Math.random() * 1.4) * ResponsiveScale.getScale();
        const hue = Math.floor(Math.random() * 360);
        const side = Math.floor(Math.random() * 4);
        const speed = 2 + Math.random() * 3;
        const padding = ResponsiveScale.scaleValue(100);

        if (side < 2) {
            this.x = side === 0 ? -padding : canvasWidth + padding;
            this.y = Math.random() * canvasHeight;
            this.vx = side === 0 ? speed : -speed;
            this.vy = (Math.random() - 0.5) * speed * 0.5;
        } else {
            this.x = Math.random() * canvasWidth;
            this.y = side === 2 ? -padding : canvasHeight + padding;
            this.vx = (Math.random() - 0.5) * speed * 0.5;
            this.vy = side === 2 ? speed : -speed;
        }

        this.angle = Math.atan2(this.vy, this.vx);
        const height = ResponsiveScale.scaleValue(50 + Math.random() * 100);
        this.shadowX = height * 0.2;
        this.shadowY = height * 0.8;
        this.wingPhase = Math.random() * Math.PI * 2;
        this.wingSpeed = 0.8 + Math.random() * 0.4;
        this.bodyColor = `hsl(${hue}, 40%, 50%)`;
        this.thoraxColor = `hsl(${hue}, 40%, 40%)`;
        this.wingFill = `hsla(${hue}, 40%, 50%, 0.1)`;
        this.wingStroke = `hsla(${hue}, 40%, 80%, 0.2)`;
        this.frontWing = new Path2D();
        this.frontWing.ellipse(14, 0, 14, 3, 0, 0, Math.PI * 2);
        this.backWing = new Path2D();
        this.backWing.ellipse(12, 0, 12, 2.5, 0, 0, Math.PI * 2);
        this.head = new Path2D();
        this.head.arc(8, 0, 4, 0, Math.PI * 2);
        this.thorax = new Path2D();
        this.thorax.ellipse(0, 0, 6, 4, 0, 0, Math.PI * 2);
        this.segments = new Path2D();
        for (let i = 0; i < 5; i++) {
            const x = -10 - i * 6;
            this.segments.moveTo(x + 1.5, 0);
            this.segments.arc(x, 0, 1.5, 0, Math.PI * 2);
        }
    }

    update(dt = 0.016) {
        this.updatePopIn(dt);
        this.x += this.vx;
        this.y += this.vy;
        this.wingPhase += this.wingSpeed;
        if (this.x < -200 || this.x > this.canvasWidth + 200 ||
            this.y < -200 || this.y > this.canvasHeight + 200) {
            this.active = false;
        }
    }

    draw(ctx) {
        if (!this.active || this.popInScale <= 0) return;
        const flap = Math.sin(this.wingPhase) * 0.2;
        this.beginTransform(ctx, this.x + this.shadowX, this.y + this.shadowY, this.angle, this.scale);
        this.drawBody(ctx, true);
        this.drawWings(ctx, flap, true);
        ctx.restore();
        this.beginTransform(ctx, this.x, this.y, this.angle, this.scale);
        this.drawBody(ctx, false);
        this.drawWings(ctx, flap, false);
        ctx.restore();
    }

    drawBody(ctx, shadow) {
        if (shadow) {
            ctx.beginPath();
            ctx.moveTo(10, 0);
            ctx.lineTo(-30, 0);
            ctx.lineWidth = 4;
            ctx.lineCap = "round";
            ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
            ctx.stroke();
            return;
        }
        ctx.fillStyle = this.bodyColor;
        ctx.fill(this.head);
        ctx.fillStyle = this.thoraxColor;
        ctx.fill(this.thorax);
        ctx.strokeStyle = this.bodyColor;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-6, 0);
        ctx.lineTo(-40, 0);
        ctx.stroke();
        ctx.fillStyle = this.bodyColor;
        ctx.fill(this.segments);
    }

    drawWings(ctx, flap, shadow) {
        ctx.fillStyle = shadow ? "rgba(0, 0, 0, 0.2)" : this.wingFill;
        ctx.strokeStyle = this.wingStroke;
        ctx.lineWidth = 0.5;
        this.drawWingPair(ctx, this.frontWing, 2, Math.PI / 2 - 0.2 + flap, shadow);
        this.drawWingPair(ctx, this.backWing, -2, Math.PI / 2 + 0.2 - flap, shadow);
    }

    drawWingPair(ctx, path, x, angle, shadow) {
        for (let side = -1; side <= 1; side += 2) {
            this.beginTransform(ctx, x, 0, angle * side);
            if (!shadow) ctx.stroke(path);
            ctx.fill(path);
            ctx.restore();
        }
    }
}
