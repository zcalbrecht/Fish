class Flower extends LilyPad {
    constructor(x, y, size) {
        super(x, y, size);
        // Flower overrides
        this.layer = 2; // Second highest z-level
        this.collisionScale = 0.9; // Allow closer overlap
        this.isFlower = true;
        this.notchWidth = 0; // No notch
        this.hasFlower = true;
        
        const isPink = Math.random() < 0.3;
        if (isPink) {
            this.flowerColor = `hsl(${300 + Math.random() * 40}, 80%, 70%)`;
            this.flowerCenter = '#ffeb3b';
        } else {
            this.flowerColor = '#f0f0f0';
            this.flowerCenter = '#ffd700';
        }
        this.flowerSize = this.size * (0.8 + Math.random() * 0.2); // Slightly larger relative to "pad"
        this.petalCount = 8 + Math.floor(Math.random() * 4);
        this.flowerOffsetAngle = Math.random() * Math.PI * 2;
        
        // Center the visual flower on the "pad" body
        this.flowerOffset = { x: 0, y: 0 };
    }

    draw(ctx) {
        this.withTransform(ctx, () => {
            this.drawFlower(ctx);
        }, { x: this.anchorX, y: this.anchorY, angle: this.currentRotation });
    }

    drawFlower(ctx) {
        const scale = ResponsiveScale.getScale();
        ctx.save();
        ctx.rotate(this.flowerOffsetAngle);

        // Shadow
        ctx.save();
        ctx.translate(5 * scale, 5 * scale);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 5 * scale;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        
        const angleStep = (Math.PI * 2) / this.petalCount;
        
        for (let i = 0; i < this.petalCount; i++) {
            ctx.save();
            ctx.rotate(i * angleStep);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(this.flowerSize * 0.4, this.flowerSize * 0.4, this.flowerSize, 0);
            ctx.quadraticCurveTo(this.flowerSize * 0.4, -this.flowerSize * 0.4, 0, 0);
            ctx.fill();
            ctx.restore();
        }
        ctx.restore(); 

        // Petals
        ctx.fillStyle = this.flowerColor;
        for (let i = 0; i < this.petalCount; i++) {
            ctx.save();
            ctx.rotate(i * angleStep);
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(this.flowerSize * 0.4, this.flowerSize * 0.4, this.flowerSize, 0);
            ctx.quadraticCurveTo(this.flowerSize * 0.4, -this.flowerSize * 0.4, 0, 0);
            ctx.fill();
            
            // Lighter/Subtler outline
            ctx.strokeStyle = 'rgba(0,0,0,0.15)';
            ctx.lineWidth = 0.5 * scale;
            ctx.stroke();
            
            ctx.restore();
        }

        // Inner Petals
        ctx.rotate(angleStep / 2);
        ctx.fillStyle = this.flowerColor; 
        
        for (let i = 0; i < this.petalCount; i++) {
            ctx.save();
            ctx.rotate(i * angleStep);
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            const s = this.flowerSize * 0.7;
            ctx.quadraticCurveTo(s * 0.4, s * 0.4, s, 0);
            ctx.quadraticCurveTo(s * 0.4, -s * 0.4, 0, 0);
            ctx.fill();
            
            ctx.strokeStyle = 'rgba(0,0,0,0.15)';
            ctx.lineWidth = 0.5 * scale;
            ctx.stroke();
            
            ctx.restore();
        }

        // Center
        ctx.fillStyle = this.flowerCenter;
        ctx.beginPath();
        ctx.arc(0, 0, this.flowerSize * 0.25, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

