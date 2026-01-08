class Bubble extends Effect {
    constructor(x, y) {
        super(x, y);
        
        const scale = ResponsiveScale.getScale();
        
        this.radius = 0;
        this.targetRadius = (2 + Math.random() * 5) * scale;
        
        this.vx = (Math.random() - 0.5) * 10 * scale;
        this.vy = (Math.random() - 0.5) * 10 * scale;
        
        // Oscillate properties
        this.wobbleSpeed = 5 + Math.random() * 5;
        this.wobbleOffset = Math.random() * Math.PI * 2;
        this.wobbleAmount = 1 * scale;

        this.life = 1.5 + Math.random(); // Seconds until it reaches "surface"
        this.maxLife = this.life;
        
        this.growRate = this.targetRadius / (this.life * 0.5); // Grow to full size in half life
    }

    update(dt) {
        if (!this.active) return;
        
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        
        // Add wobble
        this.x += Math.sin(Date.now() / 1000 * this.wobbleSpeed + this.wobbleOffset) * this.wobbleAmount * dt;

        // Grow logic
        if (this.radius < this.targetRadius) {
            this.radius += this.growRate * dt;
        }
        
        // Rise logic (life decreases)
        this.life -= dt;
        if (this.life <= 0) {
            this.active = false; // Pop
        }
    }

    draw(ctx) {
        if (!this.active) return;

        ctx.save();
        
        const progress = 1 - (this.life / this.maxLife);
        const alpha = 0.3 + (progress * 0.3);
        
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = "rgba(200, 240, 255, 0.8)";
        ctx.fillStyle = "rgba(220, 245, 255, 0.2)";
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.max(0, this.radius), 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        // Highlight (specular reflection)
        ctx.globalAlpha = alpha + 0.2;
        ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
        ctx.beginPath();
        const highlightOffset = this.radius * 0.3;
        const highlightSize = this.radius * 0.25;
        ctx.arc(this.x - highlightOffset, this.y - highlightOffset, highlightSize, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

