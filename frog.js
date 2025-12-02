const FROG_BODY_PATH = "M253.982422,37.258301L255.297363,37.300293C257.907806,37.402519,260.507538,37.691673,263.07666,38.165527C267.153381,38.523872,271.146667,39.530312,274.90625,41.146973C277.793121,42.417366,280.470337,44.1185,282.84668,46.192383C284.971832,48.082142,286.745575,50.33316,288.085938,52.841309C289.336456,55.273224,290.046387,57.946777,290.166992,60.678711C290.926331,64.282448,291.254486,67.963799,291.144531,71.64502C291.044739,76.46212,290.435181,81.255074,289.326172,85.943848C287.816315,92.502594,285.417664,98.824341,282.196777,104.733887C281.814545,105.416992,281.415253,106.090668,280.999512,106.753906C279.191162,111.146011,276.288483,115.001976,272.567871,117.95459C270.382324,119.695648,267.923218,121.062126,265.290527,121.998535C264.334015,122.32814,263.356995,122.594986,262.365723,122.797363C256.060547,124.805542,249.287857,124.80928,242.980469,122.808105C238.679474,121.90892,234.702545,119.860458,231.473145,116.880859C228.336884,114.063629,225.873718,110.577721,224.265625,106.680664C221.447922,101.999794,219.204056,96.996635,217.58252,91.779297C215.634293,85.663422,214.492493,79.319572,214.186035,72.908203C214.053894,69.61068,214.222229,66.308006,214.688965,63.041016C214.81189,62.264313,214.962219,61.492142,215.139648,60.726074C215.276321,57.161819,216.427353,53.710575,218.45752,50.777832C220.35817,47.973724,222.80658,45.583122,225.655273,43.75C229.065613,41.503361,232.859299,39.901287,236.847656,39.023438C238.618195,38.610008,240.415848,38.322998,242.227051,38.164551C246.104431,37.462898,250.04335,37.159233,253.982422,37.258301z";

// Foot/hand path from SVG (webbed foot with toes)
const FROG_FOOT_PATH = "M122.518547,39.441406L122.745613,39.476074C123.183441,39.56604,123.58519,39.782684,123.900879,40.099121C124.330772,40.388752,124.757423,40.683216,125.180656,40.982422L125.621582,41.269531C126.428513,41.785118,127.308289,42.176712,128.231445,42.431152C129.577286,42.847214,130.982544,43.03857,132.390625,42.997559L133.257324,42.987305C134.822281,42.928238,136.389084,43.041725,137.929199,43.325684C139.356018,43.616058,140.69722,44.230785,141.848633,45.12207C142.436432,45.562729,143.000824,46.033741,143.539551,46.533203L145.157715,48.058594C145.84726,48.70269,146.552856,49.329796,147.273438,49.938965L147.790527,50.40332C148.331024,50.899246,148.869171,51.39975,149.402832,51.902832L149.916504,52.376465C150.213821,52.649078,150.517929,52.91412,150.828613,53.171387L150.95752,53.313477C151.29509,53.722691,151.456116,54.249287,151.405289,54.777325C151.354462,55.305363,151.095932,55.791573,150.686523,56.128906C149.891647,56.784863,148.728439,56.729019,148,56C147.862946,55.863392,147.746735,55.707375,147.654785,55.537109L147.541504,55.39209C146.681671,54.297646,145.743164,53.267422,144.733398,52.30957C144.172897,51.849747,143.532288,51.497494,142.84375,51.270508C141.716949,50.837391,140.501495,50.685383,139.302734,50.827637C138.648788,50.932961,138.047623,51.250378,137.591797,51.730957C136.475845,52.808323,135.62468,54.129013,135.104492,55.590332C134.796844,56.675804,134.583954,57.785919,134.468262,58.908203L134.465332,58.907715L134.496094,58.991211C134.801346,59.973793,134.311798,61.027699,133.364258,61.428711C132.415695,61.829433,131.317825,61.444374,130.827148,60.539063C130.384201,59.714413,130.566635,58.693169,131.267578,58.072754C131.544739,57.818443,131.826721,57.569351,132.113281,57.325684L132.327148,57.132813C132.791519,56.723549,133.211014,56.266064,133.578613,55.768066C134.048798,55.089531,134.294403,54.280487,134.280762,53.455078C134.305695,52.941807,134.215408,52.429428,134.016602,51.955566C133.895554,51.706871,133.687164,51.511425,133.431152,51.406738C132.918381,51.145203,132.321045,51.103413,131.776855,51.291016C131.171204,51.5028,130.598083,51.797726,130.07373,52.16748C129.723907,52.401424,129.375641,52.638592,129.029785,52.878418L128.325195,53.336426L127.807129,53.662598C126.915657,54.214226,126.097427,54.876419,125.37207,55.633301C125.121986,55.898239,124.906059,56.193523,124.729492,56.512207L124.700684,56.700684C124.434433,57.993298,123.23278,58.874477,121.919922,58.739746C120.507721,58.594509,119.480591,57.332157,119.625488,55.919922C119.74099,54.789253,120.586273,53.869324,121.703133,53.658691L122.019043,53.505859C124.5028,52.328888,126.788544,50.773048,128.794434,48.894043C129.18367,48.519497,129.491547,48.068691,129.69873,47.569824C129.857651,47.209114,129.850311,46.796749,129.678711,46.441895C129.318832,45.880871,128.793121,45.445644,128.174805,45.196777C127.859253,45.049507,127.54187,44.906281,127.222656,44.76709L126.924316,44.629883C126.694199,44.522533,126.46579,44.412071,126.23877,44.29834L125.958008,44.179199C125.651917,44.07642,125.334808,44.01004,125.013184,43.981445C124.33709,43.941048,123.659317,43.938278,122.98291,43.973145C122.750137,43.975899,122.517441,43.984848,122.285156,44L122.05127,43.988281C121.830002,43.965637,121.613167,43.910892,121.407707,43.825684L121.408203,43.825195C120.317673,43.372036,119.751793,42.1628,120.102539,41.035156C120.426407,39.996983,121.436707,39.330517,122.518547,39.441406z";

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
        
        // Jump state
        this.isJumping = false;
        this.jumpProgress = 0;
        this.jumpDuration = 0.4;
        this.jumpStartX = 0;
        this.jumpStartY = 0;
        this.jumpTargetPad = null;
        this.landingRotation = null; // Preserved rotation from jump landing
        this.previousPad = null; // Track the pad we just came from
    }

    containsPoint(x, y) {
        const dx = x - this.x;
        const dy = y - this.y;
        return Math.hypot(dx, dy) <= this.frogSize;
    }

    jumpTo(targetPad) {
        if (this.isJumping || !targetPad) return;
        
        // Save current pad as previous before jumping
        this.previousPad = this.parentPad;
        
        // Calculate distance to target
        const targetX = targetPad.anchorX ?? targetPad.x;
        const targetY = targetPad.anchorY ?? targetPad.y;
        const distance = Math.hypot(targetX - this.x, targetY - this.y);
        
        // Scale duration with distance (base 0.2s + distance-based time)
        // 2000 pixels per second
        const baseDuration = 0.2;
        const speed = 2000;
        this.jumpDuration = baseDuration + (distance / speed);
        
        this.isJumping = true;
        this.jumpProgress = 0;
        this.jumpStartX = this.x;
        this.jumpStartY = this.y;
        this.jumpTargetPad = targetPad;
        this.landingRotation = null; // Reset landing rotation for new jump
        
        // Detach from current pad
        this.parentPad = null;
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
        
        // Handle jumping
        if (this.isJumping) {
            this.jumpProgress += dt / this.jumpDuration;
            
            // Interpolate position during jump
            const targetX = this.jumpTargetPad.anchorX ?? this.jumpTargetPad.x;
            const targetY = this.jumpTargetPad.anchorY ?? this.jumpTargetPad.y;
            const t = this.jumpProgress;
            this.x = this.jumpStartX + (targetX - this.jumpStartX) * t;
            this.y = this.jumpStartY + (targetY - this.jumpStartY) * t;
            
            // Face toward target pad - calculate from start to target (not current to target)
            // This ensures consistent angle throughout jump and at landing
            const dx = targetX - this.jumpStartX;
            const dy = targetY - this.jumpStartY;
            const angleToTarget = Math.atan2(dy, dx);
            this.rotation = angleToTarget + Math.PI / 2;
            
            if (this.jumpProgress >= 1) {
                // Land on target pad - preserve the jump angle
                this.jumpProgress = 1;
                this.isJumping = false;
                // Save the rotation (already calculated above) as landing rotation
                this.landingRotation = this.rotation;
                this.parentPad = this.jumpTargetPad;
                this.jumpTargetPad = null;
            }
        } else if (this.parentPad) {
            // Follow parent lily pad if attached
            const padX = this.parentPad.anchorX !== undefined ? this.parentPad.anchorX : this.parentPad.x;
            const padY = this.parentPad.anchorY !== undefined ? this.parentPad.anchorY : this.parentPad.y;
            this.x = padX;
            this.y = padY;
            // Preserve landing rotation if set, otherwise use pad rotation
            if (this.landingRotation !== null) {
                this.rotation = this.landingRotation;
            } else {
                const padRotation = this.parentPad.currentRotation !== undefined ? this.parentPad.currentRotation : 0;
                this.rotation = padRotation + this.baseRotation;
            }
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
        
        // Calculate jump height (parabolic arc)
        let jumpHeight = 0;
        let jumpScale = 1;
        if (this.isJumping) {
            const t = this.jumpProgress;
            // Parabolic arc: peaks at t=0.5
            jumpHeight = Math.sin(t * Math.PI) * this.frogSize * 2;
            // Squash at start/end, stretch at peak
            const stretchFactor = Math.sin(t * Math.PI) * 0.15;
            jumpScale = 1 + stretchFactor;
        }
        
        // Draw blurry drop shadow first (at ground level)
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Use filter for blur if available, otherwise use shadowBlur
        if (ctx.filter !== undefined) {
            ctx.filter = `blur(${scale * 12}px)`;
        } else {
            ctx.shadowBlur = scale * 20;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
        }
        
        ctx.shadowOffsetX = scale * 3;
        ctx.shadowOffsetY = scale * 4;
        
        // Draw a larger ellipse for the shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.beginPath();
        const shadowSize = this.frogSize * 1.2;
        ctx.ellipse(scale * 3, scale * 4, shadowSize, shadowSize * 0.7, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw additional blurred layers for more blur effect
        if (ctx.filter === undefined) {
            ctx.shadowBlur = scale * 15;
            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.beginPath();
            ctx.ellipse(scale * 3, scale * 4, shadowSize * 1.1, shadowSize * 0.75, 0, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
        
        this.withTransform(ctx, () => {
            ctx.rotate(this.rotation);
            ctx.scale(breathScale * jumpScale, breathScale * jumpScale);
            
            // Offset upward for jump height
            if (jumpHeight > 0) {
                ctx.translate(0, -jumpHeight);
            }
            
            // Draw all legs first (behind body)
            this.drawFrontLegs(ctx, scale);
            this.drawBackLegs(ctx, scale);
            
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

    drawBody(ctx, scale) {
        const s = this.frogSize;
        const { h, s: sat, l } = this.baseColor;
        
        // Main body gradient
        const gradient = ctx.createRadialGradient(
            -s * 0.15, -s * 0.2, 0,
            0, s * 0.1, s * 1.1
        );
        gradient.addColorStop(0, `hsl(${h}, ${sat}%, ${l + 15}%)`);
        gradient.addColorStop(0.5, `hsl(${h}, ${sat}%, ${l}%)`);
        gradient.addColorStop(1, `hsl(${h}, ${sat}%, ${l - 15}%)`);
        
        ctx.fillStyle = gradient;
        ctx.strokeStyle = `hsla(${h}, ${sat}%, ${l - 25}%, 0.3)`;
        ctx.lineWidth = scale * 1.5;

        // Use SVG path
        ctx.save();
        // Scale to fit frogSize. SVG height is ~87 units. 
        // We want body height to be about 1.54 * s (70% of previous 2.2)
        const svgScale = (s * 1.54) / 87; 
        ctx.scale(svgScale, -svgScale); // Flip Y to match SVG transform
        // Translate to center the shape (BBox center is roughly 252.5, 80)
        ctx.translate(-252.5, -80);
        
        const bodyPath = new Path2D(FROG_BODY_PATH);
        ctx.fill(bodyPath);
        ctx.stroke(bodyPath);
        ctx.restore();
    }

    drawPattern(ctx, scale) {
        const s = this.frogSize;
        const { h, s: sat, l } = this.patternColor;
        
        ctx.save();
        
        // Create clipping path using the same transform as body
        const svgScale = (s * 1.54) / 87;
        ctx.scale(svgScale, -svgScale);
        ctx.translate(-252.5, -80);
        const bodyPath = new Path2D(FROG_BODY_PATH);
        
        // Apply clip
        ctx.clip(bodyPath);
        
        // Undo transform for pattern drawing so pattern logic stays simple
        ctx.translate(252.5, 80);
        ctx.scale(1/svgScale, -1/svgScale);
        
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

    drawFrontLegs(ctx, scale) {
        const s = this.frogSize;
        const { h, s: sat, l } = this.baseColor;
        const legColor = `hsl(${h}, ${sat}%, ${l - 5}%)`;
        
        // SVG scale factor (same as body)
        const svgScale = (s * 1.54) / 87;
        // Body center in SVG coords
        const bodyCenterX = 182.5;
        const bodyCenterY = -76.2;
        
        ctx.fillStyle = legColor;
        ctx.strokeStyle = `hsla(${h}, ${sat}%, ${l - 25}%, 0.3)`;
        ctx.lineWidth = scale * 1.5;
        
        // Front leg thighs from SVG: ellipses at (219.14, -64.16) and (146.23, -64.16)
        // rx=8.838539, ry=10.164585
        const frontThighRx = 8.84 * svgScale;
        const frontThighRy = 10.16 * svgScale;
        const frontThighX = (219.14 - bodyCenterX) * svgScale;
        const frontThighY = (-64.16 - bodyCenterY) * svgScale;
        
        if (this.isJumping) {
            // JUMPING POSE: Front legs on sides of body, reaching FORWARD
            // Thighs positioned at sides (like normal) but angled forward
            const jumpThighY = frontThighY - s * 0.35; // Further forward
            const jumpThighX = frontThighX; // Keep side position
            
            // Right front thigh - at side, angled forward
            ctx.save();
            ctx.translate(jumpThighX, jumpThighY);
            ctx.rotate(-0.4); // Angle forward
            ctx.beginPath();
            ctx.ellipse(0, 0, frontThighRx, frontThighRy, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
            
            // Left front thigh - at side, angled forward
            ctx.save();
            ctx.translate(-jumpThighX, jumpThighY);
            ctx.rotate(0.4); // Angle forward
            ctx.beginPath();
            ctx.ellipse(0, 0, frontThighRx, frontThighRy, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
            
            // Front feet - outstretched forward from sides
            const footPath = new Path2D(FROG_FOOT_PATH);
            const footScale = svgScale;
            
            // Front right foot - forward from side, pointing forward
            ctx.save();
            ctx.translate(jumpThighX + frontThighRx * 0.3, jumpThighY - frontThighRy * 1.2);
            ctx.rotate(Math.PI * 0.5); // Point forward (up)
            ctx.transform(1 * footScale, 0, 0, 1 * footScale, 0, 0);
            ctx.translate(-135, -50);
            ctx.fill(footPath);
            ctx.restore();
            
            // Front left foot - forward from side, pointing forward
            ctx.save();
            ctx.translate(-jumpThighX - frontThighRx * 0.3, jumpThighY - frontThighRy * 1.2);
            ctx.rotate(Math.PI * 0.5); // Point forward (up)
            ctx.transform(1 * footScale, 0, 0, 1 * footScale, 0, 0);
            ctx.translate(-135, -50);
            ctx.fill(footPath);
            ctx.restore();
        } else {
            // NORMAL POSE: Front legs to the sides
            // Right front thigh
            ctx.beginPath();
            ctx.ellipse(frontThighX, frontThighY, frontThighRx, frontThighRy, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            // Left front thigh
            ctx.beginPath();
            ctx.ellipse(-frontThighX, frontThighY, frontThighRx, frontThighRy, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            // Front feet - positioned relative to thighs, extending outward and slightly forward
            const footPath = new Path2D(FROG_FOOT_PATH);
            const footScale = svgScale;
            
            // Front right foot - extends from thigh outward and forward (rotated 180 degrees)
            ctx.save();
            ctx.translate(frontThighX + frontThighRx * 1.0, frontThighY - frontThighRy * 0.8);
            ctx.rotate(Math.PI);
            ctx.transform(0.951483 * footScale, -0.3077 * footScale, -0.3077 * footScale, 0.951483 * footScale, 0, 0);
            ctx.translate(-135, -50);
            ctx.fill(footPath);
            ctx.restore();
            
            // Front left foot - extends from thigh outward and forward (rotated 180 degrees)
            ctx.save();
            ctx.translate(-frontThighX - frontThighRx * 1.0, frontThighY - frontThighRy * 0.8);
            ctx.rotate(Math.PI);
            ctx.transform(-0.951483 * footScale, -0.3077 * footScale, 0.3077 * footScale, 0.951483 * footScale, 0, 0);
            ctx.translate(-135, -50);
            ctx.fill(footPath);
            ctx.restore();
        }
    }

    drawBackLegs(ctx, scale) {
        const s = this.frogSize;
        const { h, s: sat, l } = this.baseColor;
        const legColor = `hsl(${h}, ${sat}%, ${l - 3}%)`;
        
        // SVG scale factor (same as body)
        const svgScale = (s * 1.54) / 87;
        // Body center in SVG coords
        const bodyCenterX = 182.5;
        const bodyCenterY = -76.2;
        
        ctx.fillStyle = legColor;
        ctx.strokeStyle = `hsla(${h}, ${sat}%, ${l - 25}%, 0.4)`;
        ctx.lineWidth = scale * 1.5;
        
        // Back leg thighs from SVG: ellipses at (211.59, -39.07) and (153.78, -38.63)
        // rx=22, ry=11.5, with slight rotation (~0.17 rad)
        const backThighRx = 22 * svgScale;
        const backThighRy = 11.5 * svgScale;
        const backThighRightX = (211.59 - bodyCenterX) * svgScale;
        const backThighRightY = (-39.07 - bodyCenterY) * svgScale;
        const backThighLeftX = (153.78 - bodyCenterX) * svgScale;
        const backThighLeftY = (-38.63 - bodyCenterY) * svgScale;
        
        if (this.isJumping) {
            // JUMPING POSE: Back legs stretched BACKWARD
            // Thighs start from normal position but rotated backward
            const jumpThighY = backThighRightY + s * 0.1; // Slightly back from normal
            const jumpThighXOffset = s * 0.2; // Keep at sides
            
            // Right back thigh - at side, rotated backward
            ctx.save();
            ctx.translate(jumpThighXOffset, jumpThighY);
            ctx.rotate(0.4); // Rotated backward
            ctx.beginPath();
            ctx.ellipse(0, 0, backThighRx, backThighRy, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
            
            // Left back thigh - at side, rotated backward
            ctx.save();
            ctx.translate(-jumpThighXOffset, jumpThighY);
            ctx.rotate(-0.4); // Rotated backward
            ctx.beginPath();
            ctx.ellipse(0, 0, backThighRx, backThighRy, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
            
            // Back feet - stretched backward, pointing backward
            const footPath = new Path2D(FROG_FOOT_PATH);
            const footScale = svgScale;
            
            // Back right foot - extends backward from thigh, pointing backward
            ctx.save();
            ctx.translate(jumpThighXOffset + backThighRx * 0.5, jumpThighY + backThighRy * 1.3);
            ctx.rotate(Math.PI * 1.5); // Point backward (down)
            ctx.transform(1 * footScale, 0, 0, 1 * footScale, 0, 0);
            ctx.translate(-135, -50);
            ctx.fill(footPath);
            ctx.restore();
            
            // Back left foot - extends backward from thigh, pointing backward
            ctx.save();
            ctx.translate(-jumpThighXOffset - backThighRx * 0.5, jumpThighY + backThighRy * 1.3);
            ctx.rotate(Math.PI * 1.5); // Point backward (down)
            ctx.transform(1 * footScale, 0, 0, 1 * footScale, 0, 0);
            ctx.translate(-135, -50);
            ctx.fill(footPath);
            ctx.restore();
        } else {
            // NORMAL POSE: Back legs in normal position
            // Right back thigh (rotated slightly)
            ctx.save();
            ctx.translate(backThighRightX, backThighRightY);
            ctx.rotate(-0.17);
            ctx.beginPath();
            ctx.ellipse(0, 0, backThighRx, backThighRy, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
            
            // Left back thigh (rotated slightly other way)
            ctx.save();
            ctx.translate(backThighLeftX, backThighLeftY);
            ctx.rotate(0.17);
            ctx.beginPath();
            ctx.ellipse(0, 0, backThighRx, backThighRy, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
            
            // Back feet (hands) - positioned relative to thighs, extending forward
            const footPath = new Path2D(FROG_FOOT_PATH);
            const footScale = svgScale;
            
            // Back right foot - extends forward from thigh (rotated 180 degrees)
            ctx.save();
            ctx.translate(backThighRightX + backThighRx * 1.0, backThighRightY - backThighRy * 0.8);
            ctx.rotate(Math.PI);
            ctx.transform(1 * footScale, 0, 0, 1 * footScale, 0, 0);
            ctx.translate(-135, -50);
            ctx.fill(footPath);
            ctx.restore();
            
            // Back left foot - extends forward from thigh (rotated 180 degrees)
            ctx.save();
            ctx.translate(backThighLeftX - backThighRx * 1.0, backThighLeftY - backThighRy * 0.8);
            ctx.rotate(Math.PI);
            ctx.transform(-1 * footScale, 0, 0, 1 * footScale, 0, 0);
            ctx.translate(-135, -50);
            ctx.fill(footPath);
            ctx.restore();
        }
    }

    drawEyes(ctx, scale) {
        const s = this.frogSize;
        // Derived from SVG: eye offset ~18.46 units, body height ~87
        // Eye Y offset from center ~21.3 units, eye radius ~6.5
        // With svgScale = (s * 1.54) / 87:
        const eyeSpacing = s * 0.33;  // 18.46 * 1.54 / 87
        const eyeY = -s * 0.38;       // 21.3 * 1.54 / 87
        const eyeSize = s * 0.115;    // 6.5 * 1.54 / 87
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
        
        // Derived from SVG: nostrils at ~9.6 units from center, ~38.4 units above body center
        // rx=1.126, ry=1.689, tilted ~50° outward
        // With svgScale = (s * 1.54) / 87:
        const nostrilSpacing = s * 0.17;  // 9.6 * 1.54 / 87
        const nostrilY = -s * 0.68;       // 38.4 * 1.54 / 87
        const nostrilRx = s * 0.02;       // 1.126 * 1.54 / 87
        const nostrilRy = s * 0.03;       // 1.689 * 1.54 / 87
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        
        // Left nostril (tilted outward ~50°)
        ctx.beginPath();
        ctx.ellipse(-nostrilSpacing, nostrilY, nostrilRx, nostrilRy, -0.87, 0, Math.PI * 2);
        ctx.fill();
        
        // Right nostril (tilted outward ~50° other direction)
        ctx.beginPath();
        ctx.ellipse(nostrilSpacing, nostrilY, nostrilRx, nostrilRy, 0.87, 0, Math.PI * 2);
        ctx.fill();
    }
}

