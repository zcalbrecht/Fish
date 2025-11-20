const FISH_CONFIG = {
    speed: 1.5,
    turnSpeed: 0.03,
    turnSpeedClose: 0.01,
    closeDistance: 100,
    fleeDistance: 200,
    fleeChance: 0.25,
    weaveAmplitude: 0.8,
    weaveSpeed: 500,
    // Size and Shape Defaults
    segmentCount: 10,
    segmentLength: 12,
    bodyWidth: {
        head: 15,   // Width at the head
        middle: 25, // Max width
        tail: 5,    // Width at the tail
        taperPoint: 0.15 // Position of max width (0.0 = head, 1.0 = tail)
    }
};

class Fish extends Item {
    constructor(x, y, options = {}) {
        super(x, y);

        // Handle legacy color argument or new options object
        let config = options;
        // If the 3rd arg was passed as just a color object {h,s,l} (legacy support)
        if (options.h !== undefined) {
            config = { color: options };
        }

        // --- Randomize Traits ---

        // Color: Use provided or generate random HSL
        this.color = config.color || {
            h: Math.random() * 360,
            s: 60 + Math.random() * 40, // 60-100% saturation
            l: 40 + Math.random() * 30  // 40-70% lightness
        };

        // Pattern support (e.g. 'spots', 'tricolor')
        this.pattern = config.pattern || null;
        this.patternColor = config.patternColor || null;
        this.patternColor2 = config.patternColor2 || null; // For tricolor

        // Size Scale: Affects width and length
        const sizeScale = config.sizeScale || (0.7 + Math.random() * 0.6); // 0.7x to 1.3x size

        // Segments: Number of body segments (affects length/flexibility)
        this.segmentCount = config.segmentCount || Math.floor(6 + Math.random() * 8); // 6 to 14 segments

        // Segment Length: Distance between segments
        const baseLength = config.segmentLength || FISH_CONFIG.segmentLength;
        this.length = baseLength * sizeScale;

        // Body Width Profile
        const baseWidth = FISH_CONFIG.bodyWidth;
        this.bodyWidth = {
            head: (config.headWidth || baseWidth.head) * sizeScale,
            middle: (config.middleWidth || baseWidth.middle) * sizeScale,
            tail: (config.tailWidth || baseWidth.tail) * sizeScale,
            taperPoint: config.taperPoint || baseWidth.taperPoint
        };

        // Speed Modifier
        const speedMod = config.speedMod || (0.8 + Math.random() * 0.4); // 0.8x to 1.2x speed
        this.speed = FISH_CONFIG.speed * speedMod;
        this.turnSpeed = FISH_CONFIG.turnSpeed * speedMod;

        // --- Initialization ---

        this.segments = [];
        this.angle = 0;

        // Autonomous target
        this.target = {
            x: x,
            y: y
        };
        this.pickNewTarget();

        // Initialize segments
        for (let i = 0; i < this.segmentCount; i++) {
            this.segments.push({
                x: x - i * this.length,
                y: y,
                angle: 0
            });
        }

        // Flee behavior state
        this.fleeing = false;
        this.fleeTimer = 0;
    }

    pickNewTarget() {
        // Pick a random spot on the canvas
        if (typeof width !== 'undefined' && typeof height !== 'undefined') {
            this.target.x = Math.random() * width;
            this.target.y = Math.random() * height;
        }
    }

    setTarget(x, y) {
        this.target.x = x;
        this.target.y = y;
    }

    update() {
        // Update pop-in animation
        // Assuming ~60fps, dt is roughly 1/60 = 0.016
        // Since Fish.update() doesn't take dt, we'll estimate it or update Main to pass it.
        // For now, fixed step estimation.
        this.updatePopIn(0.016);

        // Head follows target
        const head = this.segments[0];
        const dx = this.target.x - head.x;
        const dy = this.target.y - head.y;
        const distToTarget = Math.hypot(dx, dy);
        const angleToTarget = Math.atan2(dy, dx);

        // Indirect movement: Weave towards target
        const time = Date.now() / FISH_CONFIG.weaveSpeed + this.x * 0.01;
        const weave = Math.sin(time) * FISH_CONFIG.weaveAmplitude;

        // Randomly decide to turn away (flee)
        this.fleeTimer--;
        if (this.fleeTimer <= 0) {
            if (distToTarget < FISH_CONFIG.fleeDistance) {
                this.fleeing = Math.random() < FISH_CONFIG.fleeChance;
                this.fleeTimer = 60 + Math.random() * 60;
            } else {
                this.fleeing = false;
                this.fleeTimer = 10;
            }
        }

        let desiredAngle = angleToTarget + weave;

        if (this.fleeing) {
            desiredAngle += Math.PI;
        }

        // Smooth turning
        let angleDiff = desiredAngle - head.angle;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

        // Use instance turnSpeed
        let turnSpeed = this.turnSpeed;
        if (distToTarget < FISH_CONFIG.closeDistance) {
            turnSpeed = FISH_CONFIG.turnSpeedClose; // Keep close turn speed constant or scale it too? Kept constant for stability
        }

        if (Math.abs(angleDiff) > turnSpeed) {
            head.angle += Math.sign(angleDiff) * turnSpeed;
        } else {
            head.angle += angleDiff;
        }

        // Use instance speed
        head.x += Math.cos(head.angle) * this.speed;
        head.y += Math.sin(head.angle) * this.speed;

        // Inverse Kinematics for the rest of the body
        for (let i = 1; i < this.segments.length; i++) {
            const current = this.segments[i];
            const prev = this.segments[i - 1];

            const dx = prev.x - current.x;
            const dy = prev.y - current.y;
            const dist = Math.hypot(dx, dy);
            const angle = Math.atan2(dy, dx);

            current.angle = angle;

            // Move to be exactly 'this.length' away
            current.x = prev.x - Math.cos(angle) * this.length;
            current.y = prev.y - Math.sin(angle) * this.length;
        }

        // Autonomous behavior
        if (distToTarget < 50) {
            this.pickNewTarget();
        }
    }

    draw(ctx) {
        // Pectoral fins
        const pectoralSegIndex = Math.floor(this.segments.length * 0.3);
        const pectoralSeg = this.segments[pectoralSegIndex];
        if (pectoralSeg) {
            // Scale fins with body width
            const finScale = this.bodyWidth.middle / FISH_CONFIG.bodyWidth.middle; 

            this.withTransform(ctx, () => {
                ctx.fillStyle = `hsl(${this.color.h}, ${this.color.s}%, ${this.color.l}%)`;

                // Left fin
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.quadraticCurveTo(-10, 20, -20, 25);
                ctx.quadraticCurveTo(-10, 10, 0, 5);
                ctx.fill();

                // Right fin
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.quadraticCurveTo(-10, -20, -20, -25);
                ctx.quadraticCurveTo(-10, -10, 0, -5);
                ctx.fill();
            }, { x: pectoralSeg.x, y: pectoralSeg.y, angle: pectoralSeg.angle, scale: finScale });
        }

        // Tail fin
        const tailSeg = this.segments[this.segments.length - 1];
        if (tailSeg) {
            const tailScale = this.bodyWidth.middle / FISH_CONFIG.bodyWidth.middle;

            this.withTransform(ctx, () => {
                ctx.fillStyle = `hsl(${this.color.h}, ${this.color.s}%, ${this.color.l}%)`;
                
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.quadraticCurveTo(-30, 15, -40, 30);
                ctx.quadraticCurveTo(-30, 0, -40, -30);
                ctx.quadraticCurveTo(-30, -15, 0, 0);
                ctx.fill();
            }, { x: tailSeg.x, y: tailSeg.y, angle: tailSeg.angle, scale: tailScale });
        }

        // Draw body layers
        for (let i = this.segments.length - 1; i >= 0; i--) {
            const seg = this.segments[i];

            // Note: 'angle' here needs to include the swim offset if possible, 
            // but swimOffset was applied AFTER base rotation in original code via a second rotate.
            // withTransform supports single rotation. We can sum them or nest them.
            // Original: translate -> rotate(angle) -> rotate(swimOffset)
            // Which is equivalent to rotate(angle + swimOffset).
            
            const swimOffset = Math.sin(Date.now() / 150 + i * 0.5 + this.x * 0.1) * (i * 0.05) * 0.3;
            
            this.withTransform(ctx, () => {
                const t = i / (this.segments.length - 1);

                let size;
                // Use instance bodyWidth
                const w = this.bodyWidth;

                if (t < w.taperPoint) {
                    const progress = t / w.taperPoint;
                    size = w.head + progress * (w.middle - w.head);
                } else {
                    const progress = (t - w.taperPoint) / (1 - w.taperPoint);
                    size = w.middle - progress * (w.middle - w.tail);
                }

                // Pattern logic
                let segmentColor = this.color;
                
                if (this.pattern === 'spots' && this.patternColor) {
                    // Kohaku pattern logic: Large patches
                    if ((t > 0.1 && t < 0.35) || (t > 0.55 && t < 0.8)) {
                        segmentColor = this.patternColor;
                    }
                } else if (this.pattern === 'tricolor' && this.patternColor && this.patternColor2) {
                    // Showa/Sanke pattern logic: Patches of two colors on base
                    // Base is usually white (this.color)
                    // PatternColor is Red/Orange
                    // PatternColor2 is Black
                    
                    // Red patches (Head, Mid-body)
                    if ((t > 0.05 && t < 0.25) || (t > 0.45 && t < 0.65)) {
                        segmentColor = this.patternColor;
                    }
                    // Black patches (Shoulders, Tail) - distinct from red
                    // Using different ranges to create "sumi" (ink) spots
                    else if ((t > 0.25 && t < 0.35) || (t > 0.7 && t < 0.85)) {
                        segmentColor = this.patternColor2;
                    }
                }

                let lightness = segmentColor.l + (1 - t) * 10 - t * 10;
                if (this.pattern === 'silhouette') {
                    lightness = segmentColor.l; // Solid color, no gradient
                }
                
                ctx.fillStyle = `hsl(${segmentColor.h}, ${segmentColor.s}%, ${lightness}%)`;

                ctx.beginPath();
                ctx.ellipse(0, 0, size * 1.2, size, 0, 0, Math.PI * 2);
                ctx.fill();
            }, { x: seg.x, y: seg.y, angle: seg.angle + swimOffset });
        }
    }
}
