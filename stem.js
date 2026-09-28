class Stem {
    constructor({
        length = 120,
        segmentCount = 14,
        phase = 0,
        size = 60,
        anchor = { x: 0, y: 0 },
        damping = 0.5,
        lagFactor = 0.2,
    } = {}) {
        segmentCount = Math.max(segmentCount, 2);
        this.restLength = length / (segmentCount - 1);
        this.damping = damping;
        this.lagFactor = lagFactor;
        this.anchorX = anchor.x;
        this.anchorY = anchor.y;
        this.anchorVelX = this.anchorVelY = 0;
        this.nodes = [];

        for (let i = 0; i < segmentCount; i++) {
            const ratio = i / (segmentCount - 1);
            const x = anchor.x + Math.sin(phase + i * 0.7) * size * 0.25 * ratio;
            const y = anchor.y + i * this.restLength;
            const waveOffset = Math.random() * Math.PI * 2;
            const strength = 4 + ratio * 8 + Math.random() * 2;
            this.nodes.push({
                x, y, prevX: x, prevY: y, ratio,
                waveSinX: Math.sin(waveOffset) * strength,
                waveCosX: Math.cos(waveOffset) * strength,
                waveSinY: Math.sin(waveOffset * 0.7) * strength,
                waveCosY: Math.cos(waveOffset * 0.7) * strength,
            });
        }
    }

    setAnchor(x, y) {
        this.anchorVelX = x - this.anchorX;
        this.anchorVelY = y - this.anchorY;
        this.anchorX = x;
        this.anchorY = y;
    }

    update(dt, now = performance.now()) {
        const time = now / 1000;
        const sinX = Math.sin(time * 1.5) * dt * 0.6;
        const cosX = Math.cos(time * 1.5) * dt * 0.6;
        const sinY = Math.sin(time * 0.9) * dt * 0.15;
        const cosY = Math.cos(time * 0.9) * dt * 0.15;
        const lagX = this.anchorVelX * this.lagFactor;
        const lagY = this.anchorVelY * this.lagFactor;

        for (let i = 1; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            const nextX = node.x + (node.x - node.prevX) * this.damping;
            const nextY = node.y + (node.y - node.prevY) * this.damping;
            node.prevX = node.x;
            node.prevY = node.y;
            node.x = nextX + sinX * node.waveCosX + cosX * node.waveSinX - lagX * node.ratio;
            node.y = nextY + cosY * node.waveCosY - sinY * node.waveSinY - lagY * node.ratio;
        }
        this.solveConstraints();
    }

    solveConstraints(iterations = 5) {
        const nodes = this.nodes;
        for (let iteration = 0; iteration < iterations; iteration++) {
            nodes[0].x = nodes[0].prevX = this.anchorX;
            nodes[0].y = nodes[0].prevY = this.anchorY;

            for (let i = 1; i < nodes.length; i++) {
                const previous = nodes[i - 1];
                const current = nodes[i];
                const dx = current.x - previous.x;
                const dy = current.y - previous.y;
                const distance = Math.sqrt(dx * dx + dy * dy) || 0.0001;
                const correction = (distance - this.restLength) / distance * (i === 1 ? 1 : 0.5);
                current.x -= dx * correction;
                current.y -= dy * correction;
                if (i > 1) {
                    previous.x += dx * correction;
                    previous.y += dy * correction;
                }
            }
        }
    }

    draw(ctx) {
        const first = this.nodes[0];
        const last = this.nodes[this.nodes.length - 1];
        ctx.save();
        const gradient = ctx.createLinearGradient(first.x, first.y, last.x, last.y);
        gradient.addColorStop(0, "rgba(70, 110, 70, 0.65)");
        gradient.addColorStop(1, "rgba(70, 110, 70, 0)");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 4.5 * ResponsiveScale.getScale();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();
        ctx.moveTo(first.x, first.y);
        for (let i = 1; i < this.nodes.length - 1; i++) {
            const current = this.nodes[i];
            const next = this.nodes[i + 1];
            ctx.quadraticCurveTo(current.x, current.y, (current.x + next.x) * 0.5, (current.y + next.y) * 0.5);
        }
        ctx.lineTo(last.x, last.y);
        ctx.stroke();
        ctx.restore();
    }
}
