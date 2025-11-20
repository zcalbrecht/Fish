class LilyPad {
    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.angle = Math.random() * Math.PI * 2;
        // Random shade of green
        this.color = `hsl(${100 + Math.random() * 40}, 60%, ${30 + Math.random() * 20}%)`;

        // Random notch size (0.2 to 1.5 times the base 0.15 PI)
        // Base was 0.15 * Math.PI (approx 0.47 radians)
        // New range: 0.15 * 0.2 to 0.15 * 1.5
        this.notchWidth = (0.1 + Math.random() * 1.6) * 0.14;

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

        // Flower chance 20%
        this.hasFlower = Math.random() < 0.2;
        if (this.hasFlower) {
            const isPink = Math.random() < 0.3; 
            if (isPink) {
                 // Hot pink / Lotus pink
                this.flowerColor = `hsl(${300 + Math.random() * 40}, 80%, 70%)`; 
                this.flowerCenter = '#ffeb3b'; // Yellow center
            } else {
                 // White
                this.flowerColor = '#f0f0f0';
                this.flowerCenter = '#ffd700'; // Gold center
            }
            this.flowerSize = this.size * (0.5 + Math.random() * 0.2);
            this.petalCount = 8 + Math.floor(Math.random() * 4);
            this.flowerOffsetAngle = Math.random() * Math.PI * 2;
            const outerRadius = this.size * 1.3;
            const offsetAngle = this.flowerOffsetAngle + Math.PI / 2;
            this.flowerOffset = {
                x: Math.cos(offsetAngle) * outerRadius,
                y: Math.sin(offsetAngle) * outerRadius
            };
        }
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

    getNow() {
        return typeof performance !== "undefined" ? performance.now() : Date.now();
    }

    update(dt, now = this.getNow()) {
        this.updateTransform(now);
        this.stem.setAnchor(this.anchorX, this.anchorY);
        this.stem.update(dt, now);
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

        // Distribute veins within the solid part of the pad
        // Available angle is (2 - 2 * notchWidth) * PI
        // Start at notchWidth * PI, end at (2 - notchWidth) * PI
        const startAngle = this.notchWidth * Math.PI;
        const endAngle = (2 - this.notchWidth) * Math.PI;
        const totalAngle = endAngle - startAngle;
        const veinCount = 5;

        for (let i = 0; i < veinCount; i++) {
            // Add some padding from the edges (0.1 * totalAngle)
            const t = (i + 0.5) / veinCount; // Distribute evenly
            const veinAngle = startAngle + t * totalAngle;
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(veinAngle) * this.size * 0.9, Math.sin(veinAngle) * this.size * 0.9);
            ctx.stroke();
        }

        // Draw Flower if present
        if (this.hasFlower) {
            ctx.save();
            ctx.translate(this.flowerOffset.x, this.flowerOffset.y);
            this.drawFlower(ctx);
            ctx.restore();
        }

        ctx.restore();
    }

    drawFlower(ctx) {
        ctx.save();
        // Rotate flower independently or offset it slightly?
        // Flowers usually center, but let's rotate it for variety relative to the pad notch
        ctx.rotate(this.flowerOffsetAngle);

        // Shadow for depth
        ctx.save();
        ctx.translate(5, 5); // Offset shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'; // Shadow color
        ctx.shadowBlur = 5;
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        
        const angleStep = (Math.PI * 2) / this.petalCount;
        
        // Draw Shadow Petals
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
        ctx.restore(); // End shadow layer

        // Draw Petals
        ctx.fillStyle = this.flowerColor;
        for (let i = 0; i < this.petalCount; i++) {
            ctx.save();
            ctx.rotate(i * angleStep);
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            // Sharp vector petal
            ctx.quadraticCurveTo(this.flowerSize * 0.4, this.flowerSize * 0.4, this.flowerSize, 0);
            ctx.quadraticCurveTo(this.flowerSize * 0.4, -this.flowerSize * 0.4, 0, 0);
            ctx.fill();
            
            // Subtle outline for definition
            ctx.strokeStyle = 'rgba(0,0,0,0.1)';
            ctx.lineWidth = 0.5;
            ctx.stroke();
            
            ctx.restore();
        }

        // Second layer of petals (smaller, offset) for 3D effect
        ctx.rotate(angleStep / 2);
        ctx.fillStyle = this.flowerColor; 
        // Maybe slightly lighter or darker? Let's keep simple vector style
        
        for (let i = 0; i < this.petalCount; i++) {
            ctx.save();
            ctx.rotate(i * angleStep);
            
            ctx.beginPath();
            ctx.moveTo(0, 0);
            // Smaller petal
            const s = this.flowerSize * 0.7;
            ctx.quadraticCurveTo(s * 0.4, s * 0.4, s, 0);
            ctx.quadraticCurveTo(s * 0.4, -s * 0.4, 0, 0);
            ctx.fill();
            ctx.stroke();
            
            ctx.restore();
        }

        // Draw Center
        ctx.fillStyle = this.flowerCenter;
        ctx.beginPath();
        ctx.arc(0, 0, this.flowerSize * 0.25, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}
