class Frog extends Item {
    constructor(x, y, size, options = {}) {
        super(x, y);
        // Use frogSize for drawing, don't set this.size so collision system ignores us
        this.frogSize = size;
        this.baseX = x;
        this.baseY = y;

        // Parent lily pad reference (set externally)
        this.parentPad = options.parentPad || null;

        // Color configuration
        this.baseColor = options.baseColor || this.randomBaseColor();
        this.patternColor = options.patternColor || this.randomPatternColor();
        this.bellyColor = options.bellyColor || this.lightenColor(this.baseColor, 30);
        
        // Pattern type: 'stripes', 'spots', 'solid', 'gradient'
        this.pattern = options.pattern || this.randomPattern();
        
        // Slight rotation for natural look
        this.baseRotation = options.rotation || (Math.random() - 0.5) * 0.3;
        this.rotation = this.baseRotation;
        
        // Animation properties
        this.breathPhase = Math.random() * Math.PI * 2;
        this.blinkTimer = 2 + Math.random() * 4;
        this.isBlinking = false;
        this.blinkDuration = 0.15;
        
        // Idle animation
        this.idlePhase = Math.random() * Math.PI * 2;
        
        // Layer for draw order
        this.layer = 2.5; // Above lily pads
        
    }

    randomBaseColor() {
        const palettes = [
            { h: 30, s: 85, l: 55 },   // Orange
            { h: 120, s: 50, l: 45 },  // Green
            { h: 280, s: 60, l: 50 },  // Purple
            { h: 200, s: 70, l: 50 },  // Blue
            { h: 50, s: 80, l: 55 },   // Yellow
            { h: 350, s: 70, l: 55 },  // Red/Pink
            { h: 160, s: 60, l: 45 },  // Teal
        ];
        return palettes[Math.floor(Math.random() * palettes.length)];
    }

    randomPatternColor() {
        // Slightly different shade or complementary color
        const variation = Math.random();
        return variation < 0.5
            ? { h: this.baseColor.h, s: this.baseColor.s + 10, l: this.baseColor.l + 15 }
            : { h: (this.baseColor.h + 30) % 360, s: this.baseColor.s, l: this.baseColor.l - 10 };
    }

    lightenColor(color, amount) {
        return { h: color.h, s: Math.max(0, color.s - 15), l: Math.min(95, color.l + amount) };
    }

    randomPattern() {
        const patterns = ['stripes', 'spots', 'solid', 'gradient'];
        return patterns[Math.floor(Math.random() * patterns.length)];
    }

    update(dt, now) {
        this.updatePopIn(dt);
        
        // Follow parent lily pad if attached
        if (this.parentPad) {
            // Use anchor position if available (after pad has updated)
            const padX = this.parentPad.anchorX !== undefined ? this.parentPad.anchorX : this.parentPad.x;
            const padY = this.parentPad.anchorY !== undefined ? this.parentPad.anchorY : this.parentPad.y;
            this.x = padX;
            this.y = padY;
            // Match lily pad rotation slightly
            const padRotation = this.parentPad.currentRotation !== undefined ? this.parentPad.currentRotation : 0;
            this.rotation = padRotation + this.baseRotation;
        }
        
        // Breathing animation
        this.breathPhase += dt * 2;
        
        // Idle subtle movement
        this.idlePhase += dt * 0.5;
        
        // Blink timer
        this.blinkTimer -= dt;
        if (this.blinkTimer <= 0) {
            if (!this.isBlinking) {
                this.isBlinking = true;
                this.blinkTimer = this.blinkDuration;
            } else {
                this.isBlinking = false;
                this.blinkTimer = 2 + Math.random() * 5;
            }
        }
    }

    draw(ctx) {
        const scale = ResponsiveScale.getScale();
        const breathScale = 1 + Math.sin(this.breathPhase) * 0.02;
        
        this.withTransform(ctx, () => {
            ctx.rotate(this.rotation);
            ctx.scale(breathScale, breathScale);
            
            // Draw all legs first (behind body)
            this.drawBackLegs(ctx, scale);
            this.drawFrontLegs(ctx, scale);
            
            // Draw body shadow
            this.drawShadow(ctx, scale);
            
            // Draw body
            this.drawBody(ctx, scale);
            
            // Draw pattern on body
            this.drawPattern(ctx, scale);
            
            // Draw belly highlight
            this.drawBelly(ctx, scale);
            
            // Draw eyes on top
            this.drawEyes(ctx, scale);
            
            // Draw nostrils
            this.drawNostrils(ctx, scale);
            
        }, { x: this.x, y: this.y });
    }

    drawShadow(ctx, scale) {
        const s = this.frogSize;
        ctx.save();
        ctx.translate(s * 0.05, s * 0.08);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        
        // Body shadow
        ctx.beginPath();
        ctx.ellipse(0, s * 0.1, s * 0.75, s * 0.9, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    drawBody(ctx, scale) {
        const s = this.frogSize;
        const { h, s: sat, l } = this.baseColor;
        
        // Main body - egg/teardrop shape (wider at bottom)
        const gradient = ctx.createRadialGradient(
            -s * 0.15, -s * 0.2, 0,
            0, s * 0.1, s * 1.1
        );
        gradient.addColorStop(0, `hsl(${h}, ${sat}%, ${l + 15}%)`);
        gradient.addColorStop(0.5, `hsl(${h}, ${sat}%, ${l}%)`);
        gradient.addColorStop(1, `hsl(${h}, ${sat}%, ${l - 15}%)`);
        
        ctx.fillStyle = gradient;
        
        // Draw body as custom shape - not a circle!
        ctx.beginPath();
        
        // Start at top (head area) and draw clockwise
        // Head is narrower, body widens toward bottom
        const headWidth = s * 0.55;
        const bodyWidth = s * 0.75;
        const bodyHeight = s * 0.95;
        
        // Top of head
        ctx.moveTo(0, -bodyHeight * 0.45);
        
        // Right side of head curving to body
        ctx.bezierCurveTo(
            headWidth * 0.8, -bodyHeight * 0.4,  // control 1
            bodyWidth, -bodyHeight * 0.1,         // control 2
            bodyWidth, bodyHeight * 0.15          // end point
        );
        
        // Right side of body bulging out
        ctx.bezierCurveTo(
            bodyWidth * 1.05, bodyHeight * 0.4,
            bodyWidth * 0.9, bodyHeight * 0.7,
            bodyWidth * 0.5, bodyHeight * 0.85
        );
        
        // Bottom curve
        ctx.bezierCurveTo(
            bodyWidth * 0.2, bodyHeight * 0.95,
            -bodyWidth * 0.2, bodyHeight * 0.95,
            -bodyWidth * 0.5, bodyHeight * 0.85
        );
        
        // Left side of body
        ctx.bezierCurveTo(
            -bodyWidth * 0.9, bodyHeight * 0.7,
            -bodyWidth * 1.05, bodyHeight * 0.4,
            -bodyWidth, bodyHeight * 0.15
        );
        
        // Left side up to head
        ctx.bezierCurveTo(
            -bodyWidth, -bodyHeight * 0.1,
            -headWidth * 0.8, -bodyHeight * 0.4,
            0, -bodyHeight * 0.45
        );
        
        ctx.closePath();
        ctx.fill();
        
        // Subtle outline
        ctx.strokeStyle = `hsla(${h}, ${sat}%, ${l - 25}%, 0.3)`;
        ctx.lineWidth = scale * 1.5;
        ctx.stroke();
    }

    drawPattern(ctx, scale) {
        const s = this.frogSize;
        const { h, s: sat, l } = this.patternColor;
        
        ctx.save();
        
        // Clip to body shape
        ctx.beginPath();
        const headWidth = s * 0.55;
        const bodyWidth = s * 0.72;
        const bodyHeight = s * 0.92;
        
        ctx.moveTo(0, -bodyHeight * 0.45);
        ctx.bezierCurveTo(headWidth * 0.8, -bodyHeight * 0.4, bodyWidth, -bodyHeight * 0.1, bodyWidth, bodyHeight * 0.15);
        ctx.bezierCurveTo(bodyWidth * 1.05, bodyHeight * 0.4, bodyWidth * 0.9, bodyHeight * 0.7, bodyWidth * 0.5, bodyHeight * 0.85);
        ctx.bezierCurveTo(bodyWidth * 0.2, bodyHeight * 0.95, -bodyWidth * 0.2, bodyHeight * 0.95, -bodyWidth * 0.5, bodyHeight * 0.85);
        ctx.bezierCurveTo(-bodyWidth * 0.9, bodyHeight * 0.7, -bodyWidth * 1.05, bodyHeight * 0.4, -bodyWidth, bodyHeight * 0.15);
        ctx.bezierCurveTo(-bodyWidth, -bodyHeight * 0.1, -headWidth * 0.8, -bodyHeight * 0.4, 0, -bodyHeight * 0.45);
        ctx.closePath();
        ctx.clip();
        
        ctx.fillStyle = `hsl(${h}, ${sat}%, ${l}%)`;
        
        if (this.pattern === 'stripes') {
            // Vertical stripes like Pocket Frogs orange frog
            const stripeCount = 5;
            const stripeWidth = s * 0.12;
            
            for (let i = 0; i < stripeCount; i++) {
                const offset = (i - (stripeCount - 1) / 2) * (stripeWidth * 1.8);
                
                ctx.beginPath();
                ctx.moveTo(offset, -s * 0.4);
                
                // Wavy stripe down the body
                ctx.bezierCurveTo(
                    offset + stripeWidth * 0.3, -s * 0.1,
                    offset - stripeWidth * 0.3, s * 0.3,
                    offset, s * 0.7
                );
                ctx.bezierCurveTo(
                    offset + stripeWidth * 0.2, s * 0.8,
                    offset, s * 0.85,
                    offset, s * 0.9
                );
                
                // Make it a filled stripe shape
                ctx.lineTo(offset + stripeWidth * 0.5, s * 0.9);
                ctx.bezierCurveTo(
                    offset + stripeWidth * 0.5, s * 0.85,
                    offset + stripeWidth * 0.7, s * 0.8,
                    offset + stripeWidth * 0.5, s * 0.7
                );
                ctx.bezierCurveTo(
                    offset + stripeWidth * 0.8, s * 0.3,
                    offset + stripeWidth * 0.2, -s * 0.1,
                    offset + stripeWidth * 0.5, -s * 0.4
                );
                ctx.closePath();
                ctx.fill();
            }
        } else if (this.pattern === 'spots') {
            // Random spots
            const spots = [
                { x: 0, y: -s * 0.15, r: s * 0.15 },
                { x: s * 0.25, y: s * 0.2, r: s * 0.12 },
                { x: -s * 0.3, y: s * 0.15, r: s * 0.1 },
                { x: s * 0.1, y: s * 0.5, r: s * 0.13 },
                { x: -s * 0.15, y: s * 0.45, r: s * 0.11 },
                { x: s * 0.35, y: s * 0.55, r: s * 0.08 },
                { x: -s * 0.35, y: s * 0.5, r: s * 0.09 },
            ];
            
            for (const spot of spots) {
                ctx.beginPath();
                ctx.ellipse(spot.x, spot.y, spot.r, spot.r * 0.9, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        } else if (this.pattern === 'gradient') {
            // Darker edges gradient overlay
            const gradOverlay = ctx.createRadialGradient(0, s * 0.1, s * 0.2, 0, s * 0.1, s);
            gradOverlay.addColorStop(0, 'transparent');
            gradOverlay.addColorStop(1, `hsla(${h}, ${sat}%, ${l - 20}%, 0.4)`);
            ctx.fillStyle = gradOverlay;
            ctx.fillRect(-s, -s, s * 2, s * 2);
        }
        
        ctx.restore();
    }

    drawBelly(ctx, scale) {
        const s = this.frogSize;
        const { h, s: sat, l } = this.bellyColor;
        
        // Belly highlight - lighter oval in center
        const gradient = ctx.createRadialGradient(
            0, s * 0.25, 0,
            0, s * 0.25, s * 0.5
        );
        gradient.addColorStop(0, `hsla(${h}, ${sat - 10}%, ${l + 10}%, 0.6)`);
        gradient.addColorStop(0.7, `hsla(${h}, ${sat}%, ${l}%, 0.3)`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(0, s * 0.3, s * 0.4, s * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    drawBackLegs(ctx, scale) {
        const s = this.frogSize;
        const { h, s: sat, l } = this.baseColor;
        const legColor = `hsl(${h}, ${sat}%, ${l - 5}%)`;
        
        ctx.fillStyle = legColor;
        ctx.strokeStyle = `hsla(${h}, ${sat}%, ${l - 25}%, 0.3)`;
        ctx.lineWidth = scale * 1.5;
        
        for (const side of [-1, 1]) {
            ctx.save();
            ctx.scale(side, 1);
            
            // Thigh - big rounded shape bulging out to the side
            ctx.beginPath();
            ctx.ellipse(s * 0.55, s * 0.45, s * 0.32, s * 0.22, 0.4, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            // Knee bump - where leg bends
            ctx.beginPath();
            ctx.ellipse(s * 0.8, s * 0.55, s * 0.15, s * 0.12, 0.3, 0, Math.PI * 2);
            ctx.fill();
            
            // Foot - to the side of body, toes point FORWARD (toward head)
            this.drawWebbedFoot(ctx, s * 0.95, s * 0.6, s * 0.22, Math.PI, scale, legColor);
            
            ctx.restore();
        }
    }

    drawFrontLegs(ctx, scale) {
        const s = this.frogSize;
        const { h, s: sat, l } = this.baseColor;
        const legColor = `hsl(${h}, ${sat}%, ${l - 3}%)`;
        
        ctx.fillStyle = legColor;
        ctx.strokeStyle = `hsla(${h}, ${sat}%, ${l - 25}%, 0.4)`;
        ctx.lineWidth = scale * 1.5;
        
        // Front legs - go OUT to the sides, then hands reach FORWARD
        for (const side of [-1, 1]) {
            ctx.save();
            ctx.scale(side, 1);
            
            // Upper arm - goes straight out to the side
            ctx.beginPath();
            ctx.moveTo(s * 0.45, -s * 0.05);
            ctx.quadraticCurveTo(s * 0.65, -s * 0.1, s * 0.8, -s * 0.05);
            ctx.quadraticCurveTo(s * 0.85, s * 0.05, s * 0.75, s * 0.1);
            ctx.quadraticCurveTo(s * 0.6, s * 0.08, s * 0.45, s * 0.05);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // Forearm - bends forward (toward negative Y / head direction)
            ctx.beginPath();
            ctx.moveTo(s * 0.75, -s * 0.02);
            ctx.quadraticCurveTo(s * 0.85, -s * 0.15, s * 0.8, -s * 0.3);
            ctx.quadraticCurveTo(s * 0.72, -s * 0.28, s * 0.68, -s * 0.1);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
            
            // Hand with fingers - at the end, pointing forward
            this.drawHand(ctx, s * 0.78, -s * 0.35, s * 0.14, Math.PI, scale, legColor);
            
            ctx.restore();
        }
    }

    drawWebbedFoot(ctx, x, y, size, rotation, scale, color) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        const { h, s: sat, l } = this.baseColor;
        
        ctx.fillStyle = color;
        ctx.strokeStyle = `hsla(${h}, ${sat}%, ${l - 25}%, 0.3)`;
        ctx.lineWidth = scale;
        
        // Toes spreading out
        const toeAngles = [-0.6, -0.2, 0.2, 0.6];
        const toeLengths = [0.7, 0.95, 0.95, 0.7];
        
        // Draw webbing first (behind toes)
        ctx.fillStyle = `hsla(${h}, ${sat - 10}%, ${l + 5}%, 0.5)`;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        for (let i = 0; i < toeAngles.length; i++) {
            const angle = toeAngles[i];
            const len = toeLengths[i] * size * 0.8;
            ctx.lineTo(Math.sin(angle) * len, Math.cos(angle) * len);
        }
        ctx.closePath();
        ctx.fill();
        
        // Draw toes on top
        ctx.fillStyle = color;
        for (let i = 0; i < toeAngles.length; i++) {
            const angle = toeAngles[i];
            const len = toeLengths[i] * size;
            
            // Toe as tapered line
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.sin(angle) * len, Math.cos(angle) * len);
            ctx.lineWidth = size * 0.22;
            ctx.lineCap = 'round';
            ctx.strokeStyle = color;
            ctx.stroke();
            
            // Round toe tip
            ctx.beginPath();
            ctx.arc(
                Math.sin(angle) * len,
                Math.cos(angle) * len,
                size * 0.1,
                0, Math.PI * 2
            );
            ctx.fill();
        }
        
        ctx.restore();
    }

    drawHand(ctx, x, y, size, rotation, scale, color) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);
        
        const { h, s: sat, l } = this.baseColor;
        
        ctx.fillStyle = color;
        ctx.strokeStyle = `hsla(${h}, ${sat}%, ${l - 25}%, 0.4)`;
        ctx.lineWidth = scale;
        
        // Fingers - 4 splayed out in a fan
        const fingerAngles = [-0.7, -0.25, 0.25, 0.7];
        const fingerLengths = [0.7, 0.9, 0.9, 0.7];
        
        for (let i = 0; i < fingerAngles.length; i++) {
            const angle = fingerAngles[i];
            const len = fingerLengths[i] * size;
            
            // Draw finger as tapered shape
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(
                Math.sin(angle) * len * 0.5,
                Math.cos(angle) * len * 0.5,
                Math.sin(angle) * len,
                Math.cos(angle) * len
            );
            ctx.lineWidth = size * 0.2;
            ctx.lineCap = 'round';
            ctx.strokeStyle = color;
            ctx.stroke();
            
            // Fingertip
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(
                Math.sin(angle) * len,
                Math.cos(angle) * len,
                size * 0.12,
                0, Math.PI * 2
            );
            ctx.fill();
        }
        
        // Palm in center
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(0, size * 0.1, size * 0.25, size * 0.2, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }

    drawEyes(ctx, scale) {
        const s = this.frogSize;
        const eyeSpacing = s * 0.28;
        const eyeY = -s * 0.28;
        const eyeSize = s * 0.15;
        const { h, s: sat, l } = this.baseColor;
        
        // Draw eye bumps/ridges first (behind the actual eyes)
        for (const side of [-1, 1]) {
            const ex = eyeSpacing * side;
            ctx.fillStyle = `hsla(${h}, ${sat}%, ${l + 8}%, 0.4)`;
            ctx.beginPath();
            ctx.ellipse(ex, eyeY, eyeSize * 1.3, eyeSize * 1.2, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Draw actual eyes on top
        for (const side of [-1, 1]) {
            const ex = eyeSpacing * side;
            
            // Eye white/base (slightly visible around pupil)
            ctx.fillStyle = '#111';
            ctx.beginPath();
            ctx.ellipse(ex, eyeY, eyeSize, eyeSize * 0.95, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Main black pupil
            if (!this.isBlinking) {
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.ellipse(ex, eyeY, eyeSize * 0.95, eyeSize * 0.9, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // Eye highlight - top left
                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                ctx.beginPath();
                ctx.ellipse(
                    ex - eyeSize * 0.3,
                    eyeY - eyeSize * 0.25,
                    eyeSize * 0.25,
                    eyeSize * 0.2,
                    -0.3,
                    0, Math.PI * 2
                );
                ctx.fill();
                
                // Secondary smaller highlight
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.beginPath();
                ctx.ellipse(
                    ex + eyeSize * 0.15,
                    eyeY + eyeSize * 0.2,
                    eyeSize * 0.1,
                    eyeSize * 0.08,
                    0,
                    0, Math.PI * 2
                );
                ctx.fill();
            } else {
                // Closed eye - curved line
                ctx.strokeStyle = '#000';
                ctx.lineWidth = scale * 2;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.arc(ex, eyeY, eyeSize * 0.5, 0.2, Math.PI - 0.2);
                ctx.stroke();
            }
        }
    }

    drawNostrils(ctx, scale) {
        const s = this.frogSize;
        
        // Two small nostril dots near the front of the head
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        
        const nostrilY = -s * 0.38;
        const nostrilSpacing = s * 0.1;
        const nostrilSize = s * 0.035;
        
        ctx.beginPath();
        ctx.ellipse(-nostrilSpacing, nostrilY, nostrilSize, nostrilSize * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.ellipse(nostrilSpacing, nostrilY, nostrilSize, nostrilSize * 0.8, 0, 0, Math.PI * 2);
        ctx.fill();
    }
}

