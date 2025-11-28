class Dragonfly extends Effect {
    constructor(canvasWidth, canvasHeight) {
        super(0, 0);
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        // this.active is inherited and true by default

        // Random size (scale factor)
        // Base size is small, this multiplier makes them vary
        this.scale =
            (1.6 + Math.random() * 1.4) * ResponsiveScale.getScale(); // 1.6x to 3.0x (Doubled from 0.8-1.5)

        // Random Color Hue
        this.hue = Math.floor(Math.random() * 360);

        // Spawn position and velocity
        // 0: Left, 1: Right, 2: Top, 3: Bottom
        const side = Math.floor(Math.random() * 4);
        // Speed: Fast but viewable
        const speed = 2 + Math.random() * 3; // 2 to 5 px/frame (Halved from 4-10)

        const padding = ResponsiveScale.scaleValue(100); // Spawn well outside

        if (side === 0) { // Left
            this.x = -padding;
            this.y = Math.random() * canvasHeight;
            this.vx = speed;
            this.vy = (Math.random() - 0.5) * speed * 0.5; // Slight angle
        } else if (side === 1) { // Right
            this.x = canvasWidth + padding;
            this.y = Math.random() * canvasHeight;
            this.vx = -speed;
            this.vy = (Math.random() - 0.5) * speed * 0.5;
        } else if (side === 2) { // Top
            this.x = Math.random() * canvasWidth;
            this.y = -padding;
            this.vx = (Math.random() - 0.5) * speed * 0.5;
            this.vy = speed;
        } else { // Bottom
            this.x = Math.random() * canvasWidth;
            this.y = canvasHeight + padding;
            this.vx = (Math.random() - 0.5) * speed * 0.5;
            this.vy = -speed;
        }

        // Calculate angle based on velocity
        this.angle = Math.atan2(this.vy, this.vx);
        
        // Shadow offset (simulates height)
        // The higher the fly, the further the shadow?
        // Let's say it's hovering 50-150 units above water.
        // Assuming light source is somewhat overhead but angled.
        this.height = ResponsiveScale.scaleValue(50 + Math.random() * 100);
        this.shadowOffset = {
            x: this.height * 0.2, 
            y: this.height * 0.8 // Shadow falls mostly "down" the screen
        };

        // Wing animation
        this.wingPhase = Math.random() * Math.PI * 2;
        this.wingSpeed = 0.8 + Math.random() * 0.4; // Flapping speed
    }

    update(dt = 0.016) {
        // Update pop-in animation
        this.updatePopIn(dt);

        // Move linear
        this.x += this.vx;
        this.y += this.vy;

        // Jitter / Buzz removed for smoother flight
        
        this.wingPhase += this.wingSpeed;

        // Check bounds
        const margin = 200;
        if (this.x < -margin || this.x > this.canvasWidth + margin ||
            this.y < -margin || this.y > this.canvasHeight + margin) {
            this.active = false;
        }
    }

    draw(ctx) {
        if (!this.active) return;

        // --- Draw Shadow ---
        // Shadow is drawn on the water surface (offset position)
        this.withTransform(ctx, () => {
            // Shadow style: Blur and dark
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            // Draw simplified shape for shadow
            this.drawBody(ctx, true);
            this.drawWings(ctx, true);
        }, { 
            x: this.x + this.shadowOffset.x, 
            y: this.y + this.shadowOffset.y, 
            angle: this.angle, 
            scale: this.scale 
        });

        // --- Draw Dragonfly ---
        this.withTransform(ctx, () => {
            this.drawBody(ctx, false);
            this.drawWings(ctx, false);
        }, { 
            x: this.x, 
            y: this.y, 
            angle: this.angle, 
            scale: this.scale 
        });
    }

    drawBody(ctx, isShadow) {
        if (isShadow) {
            // Simple line for shadow body
            ctx.beginPath();
            ctx.moveTo(10, 0);
            ctx.lineTo(-30, 0);
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
            ctx.strokeStyle = 'rgba(0,0,0,0.2)';
            ctx.stroke();
            return;
        }

        // Vector Body using Random Hue
        // Head
        ctx.fillStyle = `hsl(${this.hue}, 40%, 50%)`; // Head (Reduced Saturation)
        ctx.beginPath();
        ctx.arc(8, 0, 4, 0, Math.PI * 2);
        ctx.fill();

        // Thorax (Middle)
        ctx.fillStyle = `hsl(${this.hue}, 40%, 40%)`; // Slightly darker
        ctx.beginPath();
        ctx.ellipse(0, 0, 6, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Abdomen (Tail - Long segmented look)
        ctx.strokeStyle = `hsl(${this.hue}, 40%, 50%)`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-6, 0);
        ctx.lineTo(-40, 0);
        ctx.stroke();

        // Little segmentation dots
        ctx.fillStyle = `hsl(${this.hue}, 40%, 50%)`;
        for(let i=0; i<5; i++) {
            ctx.beginPath();
            ctx.arc(-10 - i*6, 0, 1.5, 0, Math.PI*2);
            ctx.fill();
        }
    }

    drawWings(ctx, isShadow) {
        // Wing flap animation
        // Wings oscillate angle
        // Reduce flap amplitude around the 90 degree mark
        const flap = Math.sin(this.wingPhase) * 0.2;

        // Front Wings
        // Perpendicular is roughly Math.PI/2 (90 deg)
        // Slightly forward of perpendicular: PI/2 - 0.2
        this.drawOneWingPair(ctx, 2, 0, 28, 6, Math.PI/2 - 0.2 + flap, isShadow);
        
        // Back Wings
        // Slightly back of perpendicular: PI/2 + 0.2
        this.drawOneWingPair(ctx, -2, 0, 24, 5, Math.PI/2 + 0.2 - flap, isShadow);
    }

    drawOneWingPair(ctx, x, y, len, width, angleBase, isShadow) {
        // Left Wing (Top side if facing Right)
        this.withTransform(ctx, () => {
            this.drawWingShape(ctx, len, width, isShadow);
        }, { x, y, angle: -angleBase });

        // Right Wing (Bottom side if facing Right)
        this.withTransform(ctx, () => {
            this.drawWingShape(ctx, len, width, isShadow);
        }, { x, y, angle: angleBase });
    }

    drawWingShape(ctx, len, width, isShadow) {
        ctx.beginPath();
        // Teardrop / Ellipse shape
        // Start at 0,0, go out to len along X axis
        ctx.ellipse(len/2, 0, len/2, width/2, 0, 0, Math.PI*2);
        
        if (isShadow) {
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            ctx.fill();
        } else {
            // Vector Grid / Veins look?
            ctx.strokeStyle = `hsla(${this.hue}, 40%, 80%, 0.2)`; // Less bright wings
            ctx.lineWidth = 0.5;
            ctx.stroke();
            
            ctx.fillStyle = `hsla(${this.hue}, 40%, 50%, 0.1)`; // Very transparent body color
            ctx.fill();
        }
    }
}
