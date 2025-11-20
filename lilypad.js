class LilyPad {
    sampleSmoothPath(points, samples) {
        if (points.length < 2) return points.slice();

        const result = [];
        const tension = 0.5;

        for (let i = 0; i < points.length - 1; i++) {
            const p0 = points[Math.max(0, i - 1)];
            const p1 = points[i];
            const p2 = points[i + 1];
            const p3 = points[Math.min(points.length - 1, i + 2)];

            for (let t = 0; t < 1; t += 1 / samples) {
                const t2 = t * t;
                const t3 = t2 * t;

                const tension1 = (p2.x - p0.x) * tension;
                const tension2 = (p3.x - p1.x) * tension;
                const tension3 = (p2.y - p0.y) * tension;
                const tension4 = (p3.y - p1.y) * tension;

                const x =
                    (2 * t3 - 3 * t2 + 1) * p1.x +
                    (t3 - 2 * t2 + t) * tension1 +
                    (-2 * t3 + 3 * t2) * p2.x +
                    (t3 - t2) * tension2;

                const y =
                    (2 * t3 - 3 * t2 + 1) * p1.y +
                    (t3 - 2 * t2 + t) * tension3 +
                    (-2 * t3 + 3 * t2) * p2.y +
                    (t3 - t2) * tension4;

                result.push({ x, y });
            }
        }

        result.push(points[points.length - 1]);
        return result;
    }
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
        this.stemLength = 90 + Math.random() * 60; // Shorter total length
        this.stemPhase = Math.random() * Math.PI * 2;
        
        // Generate control points for a smooth curve
        this.stemControlPoints = [{ x: 0, y: 0 }];
        const cpCount = 6 + Math.floor(Math.random() * 4); // 6-9 control points
        let currentAngle = Math.PI / 2 + (Math.random() - 0.5) * 0.6;
        const cpSpacing = this.stemLength / cpCount;
        
        for (let i = 1; i <= cpCount; i++) {
            // Large drift for dramatic curves
            currentAngle += (Math.random() - 0.5) * 1.2;
            
            // Rare big flips for looping
            if (Math.random() < 0.1) {
                currentAngle += Math.PI * (Math.random() < 0.5 ? 1 : -1);
            }
            
            const prev = this.stemControlPoints[this.stemControlPoints.length - 1];
            const nx = prev.x + Math.cos(currentAngle) * cpSpacing;
            const ny = prev.y + Math.sin(currentAngle) * cpSpacing;
            this.stemControlPoints.push({ x: nx, y: ny });
        }
        
        // Sample smooth path from control points using Catmull-Rom
        this.stemPath = this.sampleSmoothPath(this.stemControlPoints, 50);

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
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // --- Draw Animated Stem ---
        ctx.save();
        const time = Date.now() / 4000;
        const basePath = this.stemPath;
        const lastPoint = basePath[basePath.length - 1];
        const grad = ctx.createLinearGradient(0, 0, lastPoint.x, lastPoint.y);
        grad.addColorStop(0, "rgba(70, 110, 70, 0.6)");
        grad.addColorStop(1, "rgba(70, 110, 70, 0)");

        ctx.strokeStyle = grad;
        ctx.lineWidth = 4.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.beginPath();
        const startWave = Math.sin(time + this.stemPhase) * 3;
        ctx.moveTo(startWave, 0);

        for (let i = 1; i < basePath.length; i++) {
            const prev = basePath[i - 1];
            const curr = basePath[i];
            const t = i / (basePath.length - 1);

            // Tangent
            const tx = curr.x - prev.x;
            const ty = curr.y - prev.y;
            const len = Math.hypot(tx, ty) || 1;
            const nx = -ty / len;
            const ny = tx / len;

            // Wave offset grows with distance but clamp amplitude
            const targetAmp = 6 + t * 14;
            const wave = Math.sin(time + this.stemPhase + t * 6) * targetAmp;
            const offsetX = curr.x + nx * wave;
            const offsetY = curr.y + ny * wave;

            ctx.lineTo(offsetX, offsetY);
        }

        ctx.stroke();
        ctx.restore();

        // --- Draw Pad ---

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
