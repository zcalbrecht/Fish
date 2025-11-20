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
        this.length = length;
        this.segmentCount = Math.max(segmentCount, 2);
        this.phase = phase;
        this.size = size;
        this.restLength = this.length / (this.segmentCount - 1);

        this.damping = damping;
        this.lagFactor = lagFactor;

        this.anchorX = anchor.x;
        this.anchorY = anchor.y;
        this.prevAnchorX = anchor.x;
        this.prevAnchorY = anchor.y;
        this.anchorVelX = 0;
        this.anchorVelY = 0;

        this.nodes = [];
        this.initNodes();
    }

    initNodes() {
        this.nodes = [];
        const lateralRange = this.size * 0.25;
        const baseX = this.anchorX;
        const baseY = this.anchorY;

        for (let i = 0; i < this.segmentCount; i++) {
            const depth = i * this.restLength;
            const swayFactor = i / (this.segmentCount - 1);
            const lateral =
                Math.sin(this.phase + i * 0.7) * lateralRange * swayFactor;
            const x = baseX + lateral;
            const y = baseY + depth;
            this.nodes.push({
                x,
                y,
                prevX: x,
                prevY: y,
                waveOffset: Math.random() * Math.PI * 2,
                waveStrength: 4 + swayFactor * 8 + Math.random() * 2,
            });
        }
    }

    setAnchor(x, y) {
        const lastX = this.anchorX ?? x;
        const lastY = this.anchorY ?? y;
        this.anchorX = x;
        this.anchorY = y;
        this.anchorVelX = this.anchorX - lastX;
        this.anchorVelY = this.anchorY - lastY;
    }

    update(dt, now = this.getNow()) {
        this.updateNodes(dt, now);
    }

    getNow() {
        return typeof performance !== "undefined" ? performance.now() : Date.now();
    }

    updateNodes(dt, now) {
        if (!this.nodes.length) return;
        const nodes = this.nodes;
        const time = now / 1000;

        for (let i = 1; i < nodes.length; i++) {
            const node = nodes[i];
            const nextX = node.x + (node.x - node.prevX) * this.damping;
            const nextY = node.y + (node.y - node.prevY) * this.damping;

            node.prevX = node.x;
            node.prevY = node.y;

            node.x =
                nextX +
                Math.sin(time * 1.5 + node.waveOffset) *
                    node.waveStrength *
                    dt *
                    0.6;
            node.y =
                nextY +
                Math.cos(time * 0.9 + node.waveOffset * 0.7) *
                    node.waveStrength *
                    dt *
                    0.15;

            const distanceRatio = i / (nodes.length - 1);
            node.x -= this.anchorVelX * distanceRatio * this.lagFactor;
            node.y -= this.anchorVelY * distanceRatio * this.lagFactor;
        }

        this.solveConstraints();
    }

    solveConstraints(iterations = 5) {
        if (!this.nodes.length) return;
        const nodes = this.nodes;

        for (let iter = 0; iter < iterations; iter++) {
            nodes[0].x = this.anchorX;
            nodes[0].y = this.anchorY;
            nodes[0].prevX = this.anchorX;
            nodes[0].prevY = this.anchorY;

            for (let i = 1; i < nodes.length; i++) {
                const prev = nodes[i - 1];
                const curr = nodes[i];
                const dx = curr.x - prev.x;
                const dy = curr.y - prev.y;
                const dist = Math.hypot(dx, dy) || 0.0001;
                const diff = (dist - this.restLength) / dist;

                if (i === 1) {
                    curr.x -= dx * diff;
                    curr.y -= dy * diff;
                } else {
                    const adjust = 0.5;
                    curr.x -= dx * diff * adjust;
                    curr.y -= dy * diff * adjust;
                    prev.x += dx * diff * adjust;
                    prev.y += dy * diff * adjust;
                }
            }
        }
    }

    draw(ctx) {
        if (!this.nodes.length) return;
        const first = this.nodes[0];
        const last = this.nodes[this.nodes.length - 1];

        ctx.save();
        const gradient = ctx.createLinearGradient(
            first.x,
            first.y,
            last.x,
            last.y
        );
        gradient.addColorStop(0, "rgba(70, 110, 70, 0.65)");
        gradient.addColorStop(1, "rgba(70, 110, 70, 0)");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 4.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        ctx.beginPath();
        ctx.moveTo(first.x, first.y);
        for (let i = 1; i < this.nodes.length - 1; i++) {
            const curr = this.nodes[i];
            const next = this.nodes[i + 1];
            const midX = (curr.x + next.x) * 0.5;
            const midY = (curr.y + next.y) * 0.5;
            ctx.quadraticCurveTo(curr.x, curr.y, midX, midY);
        }
        ctx.lineTo(last.x, last.y);
        ctx.stroke();
        ctx.restore();
    }
}

