class Item {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.active = true;
        this.popInScale = 0;
        this.targetScale = 1;
        this.popInDelay = 0;
        this.popInVelocity = 0;
        this.popInStiffness = 100 + Math.random() * 50;
        this.popInDamping = 14 + Math.random() * 4;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    updatePopIn(dt) {
        if (this.popInDelay > 0) {
            this.popInDelay -= dt;
            return;
        }
        if (this.popInScale === this.targetScale && this.popInVelocity === 0) return;
        const displacement = this.targetScale - this.popInScale;
        this.popInVelocity += displacement * this.popInStiffness * dt;
        this.popInVelocity *= Math.max(0, 1 - this.popInDamping * dt);
        this.popInScale += this.popInVelocity * dt;
        if (Math.abs(displacement) < 0.001 && Math.abs(this.popInVelocity) < 0.01) {
            this.popInScale = this.targetScale;
            this.popInVelocity = 0;
        }
    }

    beginTransform(ctx, x = this.x, y = this.y, angle = 0, scale = 1) {
        ctx.save();
        ctx.translate(x, y);
        if (angle) ctx.rotate(angle);
        scale *= this.popInScale;
        if (scale !== 1) ctx.scale(scale, scale);
    }
}
