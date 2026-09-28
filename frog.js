const FROG_BODY_PATH = new Path2D("M253.982422,37.258301L255.297363,37.300293C257.907806,37.402519,260.507538,37.691673,263.07666,38.165527C267.153381,38.523872,271.146667,39.530312,274.90625,41.146973C277.793121,42.417366,280.470337,44.1185,282.84668,46.192383C284.971832,48.082142,286.745575,50.33316,288.085938,52.841309C289.336456,55.273224,290.046387,57.946777,290.166992,60.678711C290.926331,64.282448,291.254486,67.963799,291.144531,71.64502C291.044739,76.46212,290.435181,81.255074,289.326172,85.943848C287.816315,92.502594,285.417664,98.824341,282.196777,104.733887C281.814545,105.416992,281.415253,106.090668,280.999512,106.753906C279.191162,111.146011,276.288483,115.001976,272.567871,117.95459C270.382324,119.695648,267.923218,121.062126,265.290527,121.998535C264.334015,122.32814,263.356995,122.594986,262.365723,122.797363C256.060547,124.805542,249.287857,124.80928,242.980469,122.808105C238.679474,121.90892,234.702545,119.860458,231.473145,116.880859C228.336884,114.063629,225.873718,110.577721,224.265625,106.680664C221.447922,101.999794,219.204056,96.996635,217.58252,91.779297C215.634293,85.663422,214.492493,79.319572,214.186035,72.908203C214.053894,69.61068,214.222229,66.308006,214.688965,63.041016C214.81189,62.264313,214.962219,61.492142,215.139648,60.726074C215.276321,57.161819,216.427353,53.710575,218.45752,50.777832C220.35817,47.973724,222.80658,45.583122,225.655273,43.75C229.065613,41.503361,232.859299,39.901287,236.847656,39.023438C238.618195,38.610008,240.415848,38.322998,242.227051,38.164551C246.104431,37.462898,250.04335,37.159233,253.982422,37.258301z");

const FROG_FOOT_PATH = new Path2D("M122.518547,39.441406L122.745613,39.476074C123.183441,39.56604,123.58519,39.782684,123.900879,40.099121C124.330772,40.388752,124.757423,40.683216,125.180656,40.982422L125.621582,41.269531C126.428513,41.785118,127.308289,42.176712,128.231445,42.431152C129.577286,42.847214,130.982544,43.03857,132.390625,42.997559L133.257324,42.987305C134.822281,42.928238,136.389084,43.041725,137.929199,43.325684C139.356018,43.616058,140.69722,44.230785,141.848633,45.12207C142.436432,45.562729,143.000824,46.033741,143.539551,46.533203L145.157715,48.058594C145.84726,48.70269,146.552856,49.329796,147.273438,49.938965L147.790527,50.40332C148.331024,50.899246,148.869171,51.39975,149.402832,51.902832L149.916504,52.376465C150.213821,52.649078,150.517929,52.91412,150.828613,53.171387L150.95752,53.313477C151.29509,53.722691,151.456116,54.249287,151.405289,54.777325C151.354462,55.305363,151.095932,55.791573,150.686523,56.128906C149.891647,56.784863,148.728439,56.729019,148,56C147.862946,55.863392,147.746735,55.707375,147.654785,55.537109L147.541504,55.39209C146.681671,54.297646,145.743164,53.267422,144.733398,52.30957C144.172897,51.849747,143.532288,51.497494,142.84375,51.270508C141.716949,50.837391,140.501495,50.685383,139.302734,50.827637C138.648788,50.932961,138.047623,51.250378,137.591797,51.730957C136.475845,52.808323,135.62468,54.129013,135.104492,55.590332C134.796844,56.675804,134.583954,57.785919,134.468262,58.908203L134.465332,58.907715L134.496094,58.991211C134.801346,59.973793,134.311798,61.027699,133.364258,61.428711C132.415695,61.829433,131.317825,61.444374,130.827148,60.539063C130.384201,59.714413,130.566635,58.693169,131.267578,58.072754C131.544739,57.818443,131.826721,57.569351,132.113281,57.325684L132.327148,57.132813C132.791519,56.723549,133.211014,56.266064,133.578613,55.768066C134.048798,55.089531,134.294403,54.280487,134.280762,53.455078C134.305695,52.941807,134.215408,52.429428,134.016602,51.955566C133.895554,51.706871,133.687164,51.511425,133.431152,51.406738C132.918381,51.145203,132.321045,51.103413,131.776855,51.291016C131.171204,51.5028,130.598083,51.797726,130.07373,52.16748C129.723907,52.401424,129.375641,52.638592,129.029785,52.878418L128.325195,53.336426L127.807129,53.662598C126.915657,54.214226,126.097427,54.876419,125.37207,55.633301C125.121986,55.898239,124.906059,56.193523,124.729492,56.512207L124.700684,56.700684C124.434433,57.993298,123.23278,58.874477,121.919922,58.739746C120.507721,58.594509,119.480591,57.332157,119.625488,55.919922C119.74099,54.789253,120.586273,53.869324,121.703133,53.658691L122.019043,53.505859C124.5028,52.328888,126.788544,50.773048,128.794434,48.894043C129.18367,48.519497,129.491547,48.068691,129.69873,47.569824C129.857651,47.209114,129.850311,46.796749,129.678711,46.441895C129.318832,45.880871,128.793121,45.445644,128.174805,45.196777C127.859253,45.049507,127.54187,44.906281,127.222656,44.76709L126.924316,44.629883C126.694199,44.522533,126.46579,44.412071,126.23877,44.29834L125.958008,44.179199C125.651917,44.07642,125.334808,44.01004,125.013184,43.981445C124.33709,43.941048,123.659317,43.938278,122.98291,43.973145C122.750137,43.975899,122.517441,43.984848,122.285156,44L122.05127,43.988281C121.830002,43.965637,121.613167,43.910892,121.407707,43.825684L121.408203,43.825195C120.317673,43.372036,119.751793,42.1628,120.102539,41.035156C120.426407,39.996983,121.436707,39.330517,122.518547,39.441406z");

const FROG_SPOTS = [
    [0, -0.15, 0.15], [0.25, 0.2, 0.12], [-0.3, 0.15, 0.1],
    [0.1, 0.5, 0.13], [-0.15, 0.45, 0.11], [0.35, 0.55, 0.08], [-0.35, 0.5, 0.09],
];

const FROG_COLORS = [
    { h: 30, s: 85, l: 55 }, { h: 120, s: 50, l: 45 }, { h: 280, s: 60, l: 50 },
    { h: 200, s: 70, l: 50 }, { h: 50, s: 80, l: 55 }, { h: 350, s: 70, l: 55 },
    { h: 160, s: 60, l: 45 },
];
const FROG_PATTERNS = ['stripes', 'spots', 'solid', 'gradient'];

class Frog extends Item {
    constructor(x, y, size, options = {}) {
        super(x, y);
        this.frogSize = size;
        this.parentPad = options.parentPad || null;

        this.baseColor = options.baseColor || FROG_COLORS[Math.floor(Math.random() * FROG_COLORS.length)];
        this.patternColor = options.patternColor || this.randomPatternColor();
        this.bellyColor = options.bellyColor || {
            h: this.baseColor.h,
            s: Math.max(0, this.baseColor.s - 15),
            l: Math.min(95, this.baseColor.l + 30),
        };

        this.pattern = options.pattern || FROG_PATTERNS[Math.floor(Math.random() * FROG_PATTERNS.length)];

        this.baseRotation = options.rotation || (Math.random() - 0.5) * 0.3;
        this.rotation = this.baseRotation;

        this.breathPhase = Math.random() * Math.PI * 2;
        this.blinkTimer = 2 + Math.random() * 4;
        this.isBlinking = false;
        this.blinkDuration = 0.15;

        this.layer = 2.5;

        this.passiveJumpTimer = 5 + Math.random() * 10;
        this.onPassiveJump = null;

        this.isJumping = false;
        this.jumpProgress = 0;
        this.jumpDuration = 0.4;
        this.jumpStartX = 0;
        this.jumpStartY = 0;
        this.jumpTargetPad = null;
        this.landingRotation = null;
        this.previousPad = null;
        this.svgScale = size * 1.54 / 87;
        this.legPoses = this.createLegPoses();
        this.patternPath = this.createPatternPath();
        this.paint = this.createPaint();
    }

    createPaint() {
        const { h, s, l } = this.baseColor;
        const belly = this.bellyColor;
        const pattern = this.patternColor;
        return {
            bodyLight: `hsl(${h}, ${s}%, ${l + 15}%)`,
            body: `hsl(${h}, ${s}%, ${l}%)`,
            bodyDark: `hsl(${h}, ${s}%, ${l - 15}%)`,
            outline: `hsla(${h}, ${s}%, ${l - 25}%, 0.3)`,
            backOutline: `hsla(${h}, ${s}%, ${l - 25}%, 0.4)`,
            frontLeg: `hsl(${h}, ${s}%, ${l - 5}%)`,
            backLeg: `hsl(${h}, ${s}%, ${l - 3}%)`,
            eyeRidge: `hsla(${h}, ${s}%, ${l + 8}%, 0.4)`,
            pattern: `hsl(${pattern.h}, ${pattern.s}%, ${pattern.l}%)`,
            patternEdge: `hsla(${pattern.h}, ${pattern.s}%, ${pattern.l - 20}%, 0.4)`,
            bellyLight: `hsla(${belly.h}, ${belly.s - 10}%, ${belly.l + 10}%, 0.6)`,
            belly: `hsla(${belly.h}, ${belly.s}%, ${belly.l}%, 0.3)`,
        };
    }

    containsPoint(x, y) {
        const dx = x - this.x;
        const dy = y - this.y;
        return dx * dx + dy * dy <= this.frogSize * this.frogSize;
    }

    jumpTo(targetPad) {
        if (this.isJumping || !targetPad) return;

        this.previousPad = this.parentPad;

        const targetX = targetPad.anchorX ?? targetPad.x;
        const targetY = targetPad.anchorY ?? targetPad.y;
        const distance = Math.hypot(targetX - this.x, targetY - this.y);

        this.jumpDuration = 0.2 + distance / 2000;

        this.isJumping = true;
        this.jumpProgress = 0;
        this.jumpStartX = this.x;
        this.jumpStartY = this.y;
        this.jumpTargetPad = targetPad;
        this.landingRotation = null;

        this.parentPad = null;
    }

    randomPatternColor() {
        const variation = Math.random();
        return variation < 0.5
            ? { h: this.baseColor.h, s: this.baseColor.s + 10, l: this.baseColor.l + 15 }
            : { h: (this.baseColor.h + 30) % 360, s: this.baseColor.s, l: this.baseColor.l - 10 };
    }

    update(dt) {
        this.updatePopIn(dt);

        if (this.isJumping) {
            this.jumpProgress = Math.min(1, this.jumpProgress + dt / this.jumpDuration);

            const targetX = this.jumpTargetPad.anchorX ?? this.jumpTargetPad.x;
            const targetY = this.jumpTargetPad.anchorY ?? this.jumpTargetPad.y;
            const t = this.jumpProgress;
            this.x = this.jumpStartX + (targetX - this.jumpStartX) * t;
            this.y = this.jumpStartY + (targetY - this.jumpStartY) * t;

            const dx = targetX - this.jumpStartX;
            const dy = targetY - this.jumpStartY;
            const angleToTarget = Math.atan2(dy, dx);
            this.rotation = angleToTarget + Math.PI / 2;

            if (this.jumpProgress >= 1) {
                this.isJumping = false;

                this.landingRotation = this.rotation;
                this.parentPad = this.jumpTargetPad;
                this.jumpTargetPad = null;
            }
        } else if (this.parentPad) {
            this.x = this.parentPad.anchorX ?? this.parentPad.x;
            this.y = this.parentPad.anchorY ?? this.parentPad.y;

            this.rotation = this.landingRotation
                ?? (this.parentPad.currentRotation ?? 0) + this.baseRotation;
        }

        this.breathPhase += dt * 2;

        this.blinkTimer -= dt;
        if (this.blinkTimer <= 0) {
            this.isBlinking = !this.isBlinking;
            this.blinkTimer = this.isBlinking ? this.blinkDuration : 2 + Math.random() * 5;
        }

        if (!this.isJumping && this.parentPad) {
            this.passiveJumpTimer -= dt;
            if (this.passiveJumpTimer <= 0) {
                this.passiveJumpTimer = 5 + Math.random() * 10;
                this.onPassiveJump?.(this);
            }
        }
    }

    draw(ctx) {
        const scale = ResponsiveScale.getScale();
        const jump = this.isJumping ? Math.sin(this.jumpProgress * Math.PI) : 0;
        const breath = 1 + Math.sin(this.breathPhase) * 0.02;
        this.beginTransform(ctx, this.x, this.y, this.rotation, breath * (1 + jump * 0.15));
        if (jump > 0) ctx.translate(0, -jump * this.frogSize * 2);
        this.drawLegs(ctx, scale);
        this.drawBody(ctx, scale);
        this.drawPattern(ctx);
        this.drawBelly(ctx);
        this.drawEyes(ctx, scale);
        this.drawNostrils(ctx);
        ctx.restore();
    }

    drawBody(ctx, scale) {
        const s = this.frogSize;

        const gradient = ctx.createRadialGradient(
            -s * 0.15, -s * 0.2, 0,
            0, s * 0.1, s * 1.1
        );
        gradient.addColorStop(0, this.paint.bodyLight);
        gradient.addColorStop(0.5, this.paint.body);
        gradient.addColorStop(1, this.paint.bodyDark);

        ctx.fillStyle = gradient;
        ctx.strokeStyle = this.paint.outline;
        ctx.lineWidth = scale * 1.5;

        ctx.save();
        const svgScale = this.svgScale;
        ctx.scale(svgScale, -svgScale);
        ctx.translate(-252.5, -80);
        ctx.fill(FROG_BODY_PATH);
        ctx.stroke(FROG_BODY_PATH);
        ctx.restore();
    }

    createPatternPath() {
        const path = new Path2D();
        const s = this.frogSize;
        if (this.pattern === 'stripes') {
            const width = s * 0.12;
            for (let i = 0; i < 5; i++) {
                const x = (i - 2) * width * 1.8;
                path.moveTo(x, -s * 0.4);
                path.bezierCurveTo(x + width * 0.3, -s * 0.1, x - width * 0.3, s * 0.3, x, s * 0.7);
                path.bezierCurveTo(x + width * 0.2, s * 0.8, x, s * 0.85, x, s * 0.9);
                path.lineTo(x + width * 0.5, s * 0.9);
                path.bezierCurveTo(x + width * 0.5, s * 0.85, x + width * 0.7, s * 0.8, x + width * 0.5, s * 0.7);
                path.bezierCurveTo(x + width * 0.8, s * 0.3, x + width * 0.2, -s * 0.1, x + width * 0.5, -s * 0.4);
                path.closePath();
            }
        } else if (this.pattern === 'spots') {
            for (const [x, y, radius] of FROG_SPOTS) {
                path.moveTo((x + radius) * s, y * s);
                path.ellipse(x * s, y * s, radius * s, radius * s * 0.9, 0, 0, Math.PI * 2);
            }
        }
        return path;
    }

    drawPattern(ctx) {
        if (this.pattern === 'solid') return;
        const s = this.frogSize;
        const svgScale = this.svgScale;
        ctx.save();
        ctx.scale(svgScale, -svgScale);
        ctx.translate(-252.5, -80);
        ctx.clip(FROG_BODY_PATH);
        ctx.translate(252.5, 80);
        ctx.scale(1 / svgScale, -1 / svgScale);
        if (this.pattern === 'gradient') {
            const gradient = ctx.createRadialGradient(0, s * 0.1, s * 0.2, 0, s * 0.1, s);
            gradient.addColorStop(0, 'transparent');
            gradient.addColorStop(1, this.paint.patternEdge);
            ctx.fillStyle = gradient;
            ctx.fillRect(-s, -s, s * 2, s * 2);
        } else {
            ctx.fillStyle = this.paint.pattern;
            ctx.fill(this.patternPath);
        }
        ctx.restore();
    }

    drawBelly(ctx) {
        const s = this.frogSize;

        const gradient = ctx.createRadialGradient(
            0, s * 0.25, 0,
            0, s * 0.25, s * 0.5
        );
        gradient.addColorStop(0, this.paint.bellyLight);
        gradient.addColorStop(0.7, this.paint.belly);
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.ellipse(0, s * 0.3, s * 0.4, s * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();
    }

    createLegPoses() {
        const scale = this.svgScale;
        const size = this.frogSize;
        const frontX = (219.14 - 182.5) * scale;
        const frontY = (-64.16 + 76.2) * scale;
        const backRightX = (211.59 - 182.5) * scale;
        const backRightY = (-39.07 + 76.2) * scale;
        const backLeftX = (153.78 - 182.5) * scale;
        const backLeftY = (-38.63 + 76.2) * scale;
        const frontRx = 8.84 * scale;
        const frontRy = 10.16 * scale;
        const backRx = 22 * scale;
        const backRy = 11.5 * scale;
        const poses = [];
        for (const jumping of [false, true]) {
            const front = [];
            const back = [];
            for (const side of [1, -1]) {
                const frontLeg = {
                    x: side * frontX,
                    y: frontY - (jumping ? size * 0.35 : 0),
                    rx: frontRx,
                    ry: frontRy,
                    angle: jumping ? -side * 0.4 : 0,
                };
                const backLeg = {
                    x: jumping ? side * size * 0.2 : side === 1 ? backRightX : backLeftX,
                    y: jumping ? backRightY + size * 0.1 : side === 1 ? backRightY : backLeftY,
                    rx: backRx,
                    ry: backRy,
                    angle: side * (jumping ? 0.4 : -0.17),
                };
                frontLeg.foot = this.createFootPath(
                    frontLeg.x + side * frontRx * (jumping ? 0.3 : 1),
                    frontLeg.y - frontRy * (jumping ? 1.2 : 0.8),
                    jumping ? Math.PI * 0.5 : Math.PI,
                    jumping ? 1 : side * 0.951483, jumping ? 0 : -0.3077,
                    jumping ? 0 : -side * 0.3077, jumping ? 1 : 0.951483
                );
                backLeg.foot = this.createFootPath(
                    backLeg.x + side * backRx * (jumping ? 0.5 : 1),
                    backLeg.y + backRy * (jumping ? 1.3 : -0.8),
                    jumping ? Math.PI * 1.5 : Math.PI, jumping ? 1 : side, 0, 0, 1
                );
                front.push(frontLeg);
                back.push(backLeg);
            }
            poses.push([front, back]);
        }
        return poses;
    }

    createFootPath(x, y, angle, a, b, c, d) {
        const cosine = Math.cos(angle) * this.svgScale;
        const sine = Math.sin(angle) * this.svgScale;
        const xx = cosine * a - sine * b;
        const xy = sine * a + cosine * b;
        const yx = cosine * c - sine * d;
        const yy = sine * c + cosine * d;
        const path = new Path2D();
        path.addPath(FROG_FOOT_PATH, {
            a: xx, b: xy, c: yx, d: yy,
            e: x - 135 * xx - 50 * yx,
            f: y - 135 * xy - 50 * yy,
        });
        return path;
    }

    drawLegs(ctx, scale) {
        const groups = this.legPoses[this.isJumping ? 1 : 0];
        ctx.lineWidth = scale * 1.5;
        for (let group = 0; group < groups.length; group++) {
            const legs = groups[group];
            ctx.fillStyle = group === 0 ? this.paint.frontLeg : this.paint.backLeg;
            ctx.strokeStyle = group === 0 ? this.paint.outline : this.paint.backOutline;
            for (const leg of legs) {
                ctx.beginPath();
                ctx.ellipse(leg.x, leg.y, leg.rx, leg.ry, leg.angle, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            }
            for (const leg of legs) ctx.fill(leg.foot);
        }
    }

    drawEyes(ctx, scale) {
        const s = this.frogSize;

        const eyeSpacing = s * 0.33;
        const eyeY = -s * 0.38;
        const eyeSize = s * 0.115;

        for (let side = -1; side <= 1; side += 2) {
            const ex = eyeSpacing * side;
            ctx.fillStyle = this.paint.eyeRidge;
            ctx.beginPath();
            ctx.ellipse(ex, eyeY, eyeSize * 1.3, eyeSize * 1.2, 0, 0, Math.PI * 2);
            ctx.fill();
        }

        for (let side = -1; side <= 1; side += 2) {
            const ex = eyeSpacing * side;

            ctx.fillStyle = '#111';
            ctx.beginPath();
            ctx.ellipse(ex, eyeY, eyeSize, eyeSize * 0.95, 0, 0, Math.PI * 2);
            ctx.fill();

            if (!this.isBlinking) {
                ctx.fillStyle = '#000';
                ctx.beginPath();
                ctx.ellipse(ex, eyeY, eyeSize * 0.95, eyeSize * 0.9, 0, 0, Math.PI * 2);
                ctx.fill();

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
                ctx.strokeStyle = '#000';
                ctx.lineWidth = scale * 2;
                ctx.lineCap = 'round';
                ctx.beginPath();
                ctx.arc(ex, eyeY, eyeSize * 0.5, 0.2, Math.PI - 0.2);
                ctx.stroke();
            }
        }
    }

    drawNostrils(ctx) {
        const s = this.frogSize;

        const nostrilSpacing = s * 0.17;
        const nostrilY = -s * 0.68;
        const nostrilRx = s * 0.02;
        const nostrilRy = s * 0.03;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';

        ctx.beginPath();
        ctx.ellipse(-nostrilSpacing, nostrilY, nostrilRx, nostrilRy, -0.87, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.ellipse(nostrilSpacing, nostrilY, nostrilRx, nostrilRy, 0.87, 0, Math.PI * 2);
        ctx.fill();
    }
}

