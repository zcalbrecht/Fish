class SurfaceItem extends Item {
    constructor(x, y, size) {
        super(x, y);
        this.size = size;
        
        // Motion properties
        this.vx = 0;
        this.vy = 0;
        this.isDragging = false;
        this.momentumFriction = 8;
    }

    containsPoint(x, y) {
        return Math.hypot(x - this.x, y - this.y) <= this.size;
    }

    beginDrag() {
        this.isDragging = true;
        this.vx = 0;
        this.vy = 0;
    }

    releaseMomentum(vx, vy) {
        this.isDragging = false;
        this.vx = vx;
        this.vy = vy;
    }

    integrateMomentum(dt) {
        if (this.isDragging || !dt) return;
        this.x += this.vx * dt;
        this.y += this.vy * dt;

        const damping = Math.exp(-this.momentumFriction * dt);
        this.vx *= damping;
        this.vy *= damping;
    }

    static resolveAll(items) {
        for (let i = 0; i < items.length; i++) {
            for (let j = i + 1; j < items.length; j++) {
                const a = items[i];
                const b = items[j];
                
                // Skip if not SurfaceItems or don't have size
                if (!a.size || !b.size) continue;

                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const dist = Math.hypot(dx, dy) || 0.0001;
                const minDist = a.size + b.size;
                if (dist >= minDist) continue;

                const overlap = minDist - dist;
                const nx = dx / dist;
                const ny = dy / dist;

                const aFlex = a.isDragging ? 0.2 : 0.5;
                const bFlex = b.isDragging ? 0.2 : 0.5;
                const flexSum = aFlex + bFlex;

                const moveA = overlap * (bFlex / flexSum);
                const moveB = overlap * (aFlex / flexSum);

                a.x -= nx * moveA;
                a.y -= ny * moveA;
                b.x += nx * moveB;
                b.y += ny * moveB;

                const relativeNormalVel =
                    (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
                if (relativeNormalVel > 0) {
                    const impulse = relativeNormalVel * 0.5;
                    a.vx -= impulse * nx;
                    a.vy -= impulse * ny;
                    b.vx += impulse * nx;
                    b.vy += impulse * ny;
                }
            }
        }
    }
}

