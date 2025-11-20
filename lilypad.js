class LilyPad {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.angle = Math.random() * Math.PI * 2;
        // Random shade of green
        this.color = `hsl(${100 + Math.random() * 40}, 60%, ${30 + Math.random() * 20}%)`;

        // Random notch size (0.2 to 1.5 times the base 0.15 PI)
        this.notchWidth = (0.1 + Math.random() * 1.6) * 0.14;

        // Motion properties
        this.vx = 0;
        this.vy = 0;
        this.isDragging = false;
        this.momentumFriction = 8;

        // Stem properties
        this.stemPhase = Math.random() * Math.PI * 2;
        const stemLength = 90 + Math.random() * 60;
        const stemSegmentCount = 12 + Math.floor(Math.random() * 5);
        this.stem = new Stem({
            length: stemLength,
            segmentCount: stemSegmentCount,
            phase: this.stemPhase,
            size: this.size,
            anchor: { x, y },
        });

        this.updateTransform(this.getNow());
        this.stem.setAnchor(this.anchorX, this.anchorY);
    }

    containsPoint(x, y) {
        return Math.hypot(x - this.x, y - this.y) <= this.size;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    beginDrag() {
        this.isDragging = true;
        this.vx = 0;
        this.vy = 0;
    }

    releaseMomentum(vx, vy) {
        this.isDragging = false;
        this.vx = vx;
        this.vy = vy;
    }

    getNow() {
        return typeof performance !== "undefined" ? performance.now() : Date.now();
    }

    update(dt, now = this.getNow()) {
        this.integrateMomentum(dt);
        this.updateTransform(now);
        this.stem.setAnchor(this.anchorX, this.anchorY);
        this.stem.update(dt, now);
    }

    integrateMomentum(dt) {
        if (this.isDragging || !dt) return;
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        const damping = Math.exp(-this.momentumFriction * dt);
        this.vx *= damping;
        this.vy *= damping;
    }

    updateTransform(now) {
        const wobbleTime = now / 5000;
        const wobbleRadius = this.size * 0.16;
        this.wobbleX = Math.sin(wobbleTime + this.stemPhase) * wobbleRadius;
        this.wobbleY = Math.cos(wobbleTime * 1.3 + this.stemPhase) * wobbleRadius;

        const rotationTime = now / 1000;
        this.currentRotation =
            this.angle + Math.sin(rotationTime * 1.2 + this.stemPhase) * 0.05;

        this.anchorX = this.x + this.wobbleX;
        this.anchorY = this.y + this.wobbleY;
    }

    draw(ctx) {
        this.stem.draw(ctx);

        ctx.save();
        ctx.translate(this.anchorX, this.anchorY);
        ctx.rotate(this.currentRotation);

        ctx.fillStyle = this.color;
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.lineWidth = 2;

        // Draw lily pad shape (circle with a wedge cut out)
        ctx.beginPath();
        // Start at the notch
        ctx.arc(0, 0, this.size, this.notchWidth * Math.PI, (2 - this.notchWidth) * Math.PI);
        ctx.lineTo(0, 0);
        ctx.closePath();

        ctx.fill();
        ctx.stroke();

        // Add some veins
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
        ctx.lineWidth = 1;

        const startAngle = this.notchWidth * Math.PI;
        const endAngle = (2 - this.notchWidth) * Math.PI;
        const totalAngle = endAngle - startAngle;
        const veinCount = 5;

        for (let i = 0; i < veinCount; i++) {
            const t = (i + 0.5) / veinCount;
            const veinAngle = startAngle + t * totalAngle;
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(veinAngle) * this.size * 0.9, Math.sin(veinAngle) * this.size * 0.9);
            ctx.stroke();
        }
        
        ctx.restore();
    }

    drawFlower(ctx) {
        // Helper for subclasses (Flower.js uses this)
        ctx.save();
        ctx.rotate(this.flowerOffsetAngle);

        // Shadow
        ctx.save();
        ctx.translate(5, 5);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 5;
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
            ctx.lineWidth = 0.5;
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
