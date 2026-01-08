class Item {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.active = true;
        
        // Pop-in animation properties
        this.popInScale = 0;
        this.targetScale = 1;
        this.popInDelay = 0; // Delay before popping in
        
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

        // Spring logic
        const displacement = this.targetScale - this.popInScale;
        const force = displacement * this.popInStiffness;
        
        this.popInVelocity += force * dt;
        this.popInVelocity *= Math.max(0, 1 - this.popInDamping * dt); // Damping
        
        this.popInScale += this.popInVelocity * dt;

        // Small optimization: if very close to target and slow, snap to target
        if (Math.abs(displacement) < 0.001 && Math.abs(this.popInVelocity) < 0.01) {
            this.popInScale = this.targetScale;
            this.popInVelocity = 0;
        }
    }

    withTransform(ctx, callback, options = {}) {
        const x = options.x !== undefined ? options.x : this.x;
        const y = options.y !== undefined ? options.y : this.y;
        const angle = options.angle || 0;
        // Multiply explicit scale by pop-in scale
        const baseScale = options.scale || 1;
        const scale = baseScale * this.popInScale;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        if (scale !== 1) {
            ctx.scale(scale, scale);
        }
        
        callback(ctx);
        
        ctx.restore();
    }
}
