class LightRay extends Effect {
    constructor(width, height) {
        const x = Math.random() * width;
        super(x, 0);
        this.width = width;
        this.height = height;
        this.rayWidth = ResponsiveScale.scaleValue(30 + Math.random() * 50);
        this.speed = 0.1 + Math.random() * 0.2;
        this.opacity = 0.08 + Math.random() * 0.12;
        this.offset = (Math.random() - 0.5) * width * 0.3;
        this.phase = Math.random() * Math.PI * 2;
    }

    update(dt = 0.016) {
        this.phase += this.speed * dt;
        this.x = this.width * 0.5 + this.offset + Math.sin(this.phase) * this.width * 0.1;
    }

    draw(ctx) {
        const gradient = ctx.createLinearGradient(
            this.x - this.rayWidth * 0.5,
            0,
            this.x + this.rayWidth * 0.5,
            this.height
        );
        
        gradient.addColorStop(0, `rgba(255, 255, 200, ${this.opacity})`);
        gradient.addColorStop(0.3, `rgba(200, 230, 255, ${this.opacity * 0.6})`);
        gradient.addColorStop(0.7, `rgba(150, 200, 255, ${this.opacity * 0.3})`);
        gradient.addColorStop(1, 'rgba(100, 150, 200, 0)');
        
        ctx.save();
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(this.x - this.rayWidth * 0.5, 0);
        ctx.lineTo(this.x + this.rayWidth * 0.5, 0);
        ctx.lineTo(this.x + this.rayWidth * 0.3, this.height);
        ctx.lineTo(this.x - this.rayWidth * 0.3, this.height);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }
}

class LightRaySystem {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.rays = [];
        this.rayCount = 3 + Math.floor(Math.random() * 4);
        this.init();
    }

    init() {
        this.rays = [];
        for (let i = 0; i < this.rayCount; i++) {
            this.rays.push(new LightRay(this.width, this.height));
        }
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        for (const ray of this.rays) {
            ray.width = width;
            ray.height = height;
        }
    }

    update(dt) {
        for (const ray of this.rays) {
            ray.update(dt);
        }
    }

    draw(ctx) {
        for (const ray of this.rays) {
            ray.draw(ctx);
        }
    }
}
