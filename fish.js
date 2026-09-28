const FISH_CONFIG = {
    speed: 1.2,
    turnSpeed: 0.03,
    turnSpeedClose: 0.01,
    closeDistance: 100,
    fleeDistance: 200,
    fleeChance: 0.25,
    weaveAmplitude: 0.8,
    weaveSpeed: 500,
    segmentLength: 12,
    bodyWidth: { head: 15, middle: 25, tail: 5, taperPoint: 0.15 },
};

const FISH_FINS = new Path2D(
    'M0 0 Q-10 20 -20 25 Q-10 10 0 5 M0 0 Q-10 -20 -20 -25 Q-10 -10 0 -5'
);
const FISH_TAIL = new Path2D('M0 0 Q-30 15 -40 30 Q-30 0 -40 -30 Q-30 -15 0 0');

class Whisker {
    constructor(length, segmentCount, color) {
        this.segmentLength = length / segmentCount;
        this.segments = Array.from({ length: segmentCount }, () => ({ x: 0, y: 0 }));
        this.anchor = { x: 0, y: 0, angle: 0 };
        this.strokeStyle = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
    }

    setAnchor(x, y, angle) {
        this.anchor.x = x;
        this.anchor.y = y;
        this.anchor.angle = angle;
    }

    update(dt) {
        const { segments, anchor, segmentLength } = this;
        segments[0].x = anchor.x;
        segments[0].y = anchor.y;
        const driftX = (Math.random() - 0.5) * 5 * dt;
        const driftY = (Math.random() - 0.5) * 5 * dt;
        const offsetX = Math.cos(anchor.angle) * segmentLength;
        const offsetY = Math.sin(anchor.angle) * segmentLength;

        for (let i = 1; i < segments.length; i++) {
            const current = segments[i];
            const previous = segments[i - 1];
            current.x += driftX;
            current.y += driftY;
            if (i < 5) {
                const stiffness = 0.45 * (1 - i / 5);
                current.x += (previous.x + offsetX - current.x) * stiffness;
                current.y += (previous.y + offsetY - current.y) * stiffness;
            }
            const dx = current.x - previous.x;
            const dy = current.y - previous.y;
            const distance = Math.hypot(dx, dy);
            if (distance > segmentLength) {
                const scale = segmentLength / distance;
                current.x = previous.x + dx * scale;
                current.y = previous.y + dy * scale;
            }
            current.x += (previous.x - current.x) * 0.1;
            current.y += (previous.y - current.y) * 0.1;
        }
    }

    draw(ctx) {
        const scale = ResponsiveScale.getScale();
        const segments = this.segments;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = this.strokeStyle;
        for (let i = 0; i < segments.length - 1; i++) {
            const current = segments[i];
            const next = segments[i + 1];
            const after = segments[i + 2] || next;
            ctx.lineWidth = (2 - 1.8 * i / (segments.length - 1)) * scale;
            ctx.beginPath();
            ctx.moveTo(current.x, current.y);
            ctx.quadraticCurveTo(next.x, next.y, (next.x + after.x) / 2, (next.y + after.y) / 2);
            ctx.stroke();
        }
    }
}

class Fish extends Item {
    constructor(x, y, options = {}) {
        super(x, y);
        const config = options.h !== undefined ? { color: options } : options;
        this.color = config.color || {
            h: Math.random() * 360,
            s: 60 + Math.random() * 40,
            l: 40 + Math.random() * 30,
        };
        this.pattern = config.pattern || null;
        this.patternColor = config.patternColor || null;
        this.patternColor2 = config.patternColor2 || null;
        this.ornament = config.ornament ?? Fish.randomOrnament();

        const scale = ResponsiveScale.getScale();
        const sizeScale = (config.sizeScale || 0.7 + Math.random() * 0.6) * scale;
        this.segmentCount = config.segmentCount || Math.floor(6 + Math.random() * 8);
        this.length = (config.segmentLength || FISH_CONFIG.segmentLength) * sizeScale;
        const defaults = FISH_CONFIG.bodyWidth;
        this.bodyWidth = {
            head: (config.headWidth || defaults.head) * sizeScale,
            middle: (config.middleWidth || defaults.middle) * sizeScale,
            tail: (config.tailWidth || defaults.tail) * sizeScale,
            taperPoint: config.taperPoint || defaults.taperPoint,
        };
        const speedMod = config.speedMod || 0.8 + Math.random() * 0.4;
        this.speed = FISH_CONFIG.speed * speedMod * scale;
        this.turnSpeed = FISH_CONFIG.turnSpeed * speedMod * scale;
        this.angle = Math.random() * Math.PI * 2;
        this.target = { x, y };
        this.pickNewTarget();
        this.segments = [];
        const stepX = Math.cos(this.angle) * this.length;
        const stepY = Math.sin(this.angle) * this.length;
        const w = this.bodyWidth;
        for (let i = 0; i < this.segmentCount; i++) {
            const t = i / (this.segmentCount - 1);
            const radius = t < w.taperPoint
                ? w.head + t / w.taperPoint * (w.middle - w.head)
                : w.middle - (t - w.taperPoint) / (1 - w.taperPoint) * (w.middle - w.tail);
            const color = this.getSegmentColorAt(t);
            this.segments.push({
                x: x - stepX * i,
                y: y - stepY * i,
                angle: this.angle,
                radius,
                fill: `hsl(${color.h}, ${color.s}%, ${color.l}%)`,
            });
        }
        this.finFill = `hsl(${this.color.h}, ${this.color.s}%, ${this.color.l}%)`;
        this.finScale = w.middle / defaults.middle;
        this.pectoralIndex = Math.floor(this.segmentCount * 0.3);
        this.fleeing = false;
        this.fleeTimer = 0;
        this.bubbleTimer = 5 + Math.random() * 15;
        this.bubbleBurstCount = 0;

        if (this.ornament === 'whiskers') {
            const length = this.length * 4 + Math.random() * this.length * 6;
            const count = Math.max(10, Math.min(22, Math.round(length / (this.length * 0.4))));
            const color = this.getSegmentColorAt(1 / (this.segmentCount - 1));
            this.leftWhisker = new Whisker(length, count, color);
            this.rightWhisker = new Whisker(length, count, color);
        }
    }

    static randomOrnament() {
        const value = Math.random();
        return value < 0.2 ? 'eyes' : value < 0.5 ? 'whiskers' : 'none';
    }

    pickNewTarget() {
        if (typeof width !== 'undefined' && typeof height !== 'undefined') {
            this.setTarget(Math.random() * width, Math.random() * height);
        }
    }

    setTarget(x, y) {
        this.target.x = x;
        this.target.y = y;
    }

    update(dt = 0.016, bubbles = null, now = Date.now()) {
        this.updatePopIn(dt);
        const head = this.segments[0];
        const dx = this.target.x - head.x;
        const dy = this.target.y - head.y;
        const distance = Math.hypot(dx, dy);
        const weave = Math.sin(now / FISH_CONFIG.weaveSpeed + this.x * 0.01) * FISH_CONFIG.weaveAmplitude;

        if (--this.fleeTimer <= 0) {
            this.fleeing = distance < FISH_CONFIG.fleeDistance && Math.random() < FISH_CONFIG.fleeChance;
            this.fleeTimer = distance < FISH_CONFIG.fleeDistance ? 60 + Math.random() * 60 : 10;
        }
        let difference = Math.atan2(dy, dx) + weave + (this.fleeing ? Math.PI : 0) - head.angle;
        while (difference > Math.PI) difference -= Math.PI * 2;
        while (difference < -Math.PI) difference += Math.PI * 2;
        const turn = distance < FISH_CONFIG.closeDistance ? FISH_CONFIG.turnSpeedClose : this.turnSpeed;
        head.angle += Math.max(-turn, Math.min(turn, difference));
        const forwardX = Math.cos(head.angle);
        const forwardY = Math.sin(head.angle);
        head.x += forwardX * this.speed;
        head.y += forwardY * this.speed;

        for (let i = 1; i < this.segments.length; i++) {
            const current = this.segments[i];
            const previous = this.segments[i - 1];
            current.angle = Math.atan2(previous.y - current.y, previous.x - current.x);
            current.x = previous.x - Math.cos(current.angle) * this.length;
            current.y = previous.y - Math.sin(current.angle) * this.length;
        }
        if (distance < 50) this.pickNewTarget();

        if (bubbles && (this.bubbleTimer -= dt) <= 0) {
            if (this.bubbleBurstCount > 0) {
                const offset = this.bodyWidth.head * 0.8;
                bubbles.push(new Bubble(head.x + forwardX * offset, head.y + forwardY * offset));
                this.bubbleBurstCount--;
                this.bubbleTimer = this.bubbleBurstCount > 0
                    ? 0.1 + Math.random() * 0.2 : 15 + Math.random() * 30;
            } else {
                this.bubbleBurstCount = Math.floor(2 + Math.random() * 3);
                this.bubbleTimer = 0.05;
            }
        }

        if (this.leftWhisker) {
            const headWidth = this.bodyWidth.head;
            const baseX = head.x + forwardX * headWidth * 0.5;
            const baseY = head.y + forwardY * headWidth * 0.5;
            const perpendicular = head.angle + Math.PI / 2;
            this.leftWhisker.setAnchor(
                baseX - forwardY * headWidth, baseY + forwardX * headWidth, perpendicular - 0.35
            );
            this.rightWhisker.setAnchor(
                baseX + forwardY * headWidth, baseY - forwardX * headWidth, perpendicular + Math.PI + 0.35
            );
            this.leftWhisker.update(0.016);
            this.rightWhisker.update(0.016);
        }
    }

    drawFin(ctx, segment, path) {
        this.beginTransform(ctx, segment.x, segment.y, segment.angle, this.finScale);
        ctx.fillStyle = this.finFill;
        ctx.fill(path);
        ctx.restore();
    }

    draw(ctx, now = Date.now()) {
        const silhouette = this.pattern === 'silhouette';
        if (silhouette) {
            ctx.save();
            ctx.filter = `blur(${3 * ResponsiveScale.getScale()}px)`;
        }
        this.drawFin(ctx, this.segments[this.pectoralIndex], FISH_FINS);
        this.drawFin(ctx, this.segments[this.segments.length - 1], FISH_TAIL);
        if (this.leftWhisker) {
            this.leftWhisker.draw(ctx);
            this.rightWhisker.draw(ctx);
        }
        if (this.ornament === 'eyes') {
            const head = this.segments[0];
            const size = this.bodyWidth.head * this.popInScale;
            const forwardX = Math.cos(head.angle);
            const forwardY = Math.sin(head.angle);
            const x = head.x + forwardX * size * 0.2;
            const y = head.y + forwardY * size * 0.2;
            ctx.fillStyle = this.segments[1].fill;
            for (let side = -1; side <= 1; side += 2) {
                ctx.beginPath();
                ctx.arc(x - forwardY * size * 1.2 * side, y + forwardX * size * 1.2 * side,
                    Math.abs(size) * 0.55, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        const phase = now / 150 + this.x * 0.1;
        for (let i = this.segments.length - 1; i >= 0; i--) {
            const segment = this.segments[i];
            const radius = segment.radius * Math.abs(this.popInScale);
            const angle = segment.angle + Math.sin(phase + i * 0.5) * i * 0.015;
            ctx.fillStyle = segment.fill;
            ctx.beginPath();
            ctx.ellipse(segment.x, segment.y, radius * 1.2, radius, angle, 0, Math.PI * 2);
            ctx.fill();
        }
        if (silhouette) ctx.restore();
    }

    getSegmentColorAt(t) {
        let color = this.color;
        if (this.pattern === 'spots' && this.patternColor) {
            if ((t > 0.1 && t < 0.35) || (t > 0.55 && t < 0.8)) color = this.patternColor;
        } else if (this.pattern === 'tricolor' && this.patternColor && this.patternColor2) {
            if ((t > 0.05 && t < 0.25) || (t > 0.45 && t < 0.65)) color = this.patternColor;
            else if ((t > 0.25 && t < 0.35) || (t > 0.7 && t < 0.85)) color = this.patternColor2;
        }
        return {
            h: color.h,
            s: color.s,
            l: this.pattern === 'silhouette' ? color.l : color.l + (1 - t) * 10 - t * 10,
        };
    }
}
