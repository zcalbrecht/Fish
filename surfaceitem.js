class SurfaceItem extends Item {
    constructor(x, y, size) {
        super(x, y);
        this.size = size;
        this.isDragging = false;
        this.momentumFriction = 8;
        this.layer = 0;
        this.collisionScale = 1;
    }

    containsPoint(x, y) {
        const dx = x - this.x;
        const dy = y - this.y;
        return dx * dx + dy * dy <= this.size * this.size;
    }

    beginDrag() {
        this.isDragging = true;
        this.vx = this.vy = 0;
    }

    releaseMomentum(vx, vy) {
        this.isDragging = false;
        this.vx = vx;
        this.vy = vy;
    }

    integrateMomentum(dt) {
        if (this.isDragging || !dt || (!this.vx && !this.vy)) return;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
        const damping = Math.exp(-this.momentumFriction * dt);
        this.vx *= damping;
        this.vy *= damping;
    }

    static resolveAll(items) {
        for (let i = 0; i < items.length; i++) {
            const a = items[i];
            if (!a.size) continue;
            const radius = (a.collisionScale || 1) * a.size;

            for (let j = i + 1; j < items.length; j++) {
                const b = items[j];
                if (!b.size) continue;
                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const minDist = radius + (b.collisionScale || 1) * b.size;
                const distanceSquared = dx * dx + dy * dy;
                if (distanceSquared >= minDist * minDist) continue;

                const distance = Math.sqrt(distanceSquared) || 0.0001;
                const overlap = minDist - distance;
                const nx = dx / distance;
                const ny = dy / distance;
                const moveA = a.isDragging ? 0 : b.isDragging ? overlap : overlap * 0.5;
                const moveB = b.isDragging ? 0 : a.isDragging ? overlap : overlap * 0.5;
                a.x -= nx * moveA;
                a.y -= ny * moveA;
                b.x += nx * moveB;
                b.y += ny * moveB;

                if (a.isDragging || b.isDragging) continue;
                const velocity = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
                if (velocity <= 0) continue;
                const impulseX = velocity * 0.5 * nx;
                const impulseY = velocity * 0.5 * ny;
                a.vx -= impulseX;
                a.vy -= impulseY;
                b.vx += impulseX;
                b.vy += impulseY;
            }
        }
    }
}
