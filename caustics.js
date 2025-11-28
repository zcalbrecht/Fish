class Caustics {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.time = 0;
        this.speed = 0.3;
        
        // Use a smaller pattern resolution for performance, then scale up
        this.patternSize = Math.min(512, Math.max(width, height) * 0.5);
        this.patternCanvas = document.createElement("canvas");
        this.patternCanvas.width = this.patternSize;
        this.patternCanvas.height = this.patternSize;
        this.patternCtx = this.patternCanvas.getContext("2d");
        
        // Caustics pattern parameters
        this.intensity = 0.35; // Overall brightness
        this.contrast = 1.4; // Pattern contrast
        
        // Multiple wave layers for complexity
        this.layers = [
            { offsetX: Math.random() * 1000, offsetY: Math.random() * 1000, speed: 0.3, scale: 0.008 },
            { offsetX: Math.random() * 1000, offsetY: Math.random() * 1000, speed: 0.2, scale: 0.012 },
            { offsetX: Math.random() * 1000, offsetY: Math.random() * 1000, speed: 0.25, scale: 0.006 },
        ];
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        // Update pattern size if needed
        const newPatternSize = Math.min(512, Math.max(width, height) * 0.5);
        if (newPatternSize !== this.patternSize) {
            this.patternSize = newPatternSize;
            this.patternCanvas.width = this.patternSize;
            this.patternCanvas.height = this.patternSize;
        }
    }

    update(dt) {
        this.time += dt * this.speed;
    }

    // Simple noise function using sine waves
    noise(x, y, time, scale, offsetX, offsetY) {
        const nx = (x * scale) + offsetX + time;
        const ny = (y * scale) + offsetY + time * 0.7;
        
        // Combine multiple sine waves for organic pattern
        const n1 = Math.sin(nx) * Math.cos(ny);
        const n2 = Math.sin(nx * 1.3 + time * 0.5) * Math.cos(ny * 1.3);
        const n3 = Math.sin(nx * 0.7 - time * 0.3) * Math.cos(ny * 0.7);
        
        return (n1 + n2 * 0.5 + n3 * 0.3) / 1.8;
    }

    draw(ctx) {
        ctx.save();
        
        // Draw pattern to smaller canvas first
        const imageData = this.patternCtx.createImageData(this.patternSize, this.patternSize);
        const data = imageData.data;
        const scale = this.patternSize / Math.max(this.width, this.height);
        
        for (let y = 0; y < this.patternSize; y++) {
            for (let x = 0; x < this.patternSize; x++) {
                // Map to world coordinates
                const worldX = (x / this.patternSize) * this.width;
                const worldY = (y / this.patternSize) * this.height;
                
                let value = 0;
                
                // Combine multiple layers
                for (const layer of this.layers) {
                    const noiseValue = this.noise(
                        worldX, worldY, this.time,
                        layer.scale,
                        layer.offsetX,
                        layer.offsetY
                    );
                    value += noiseValue * (1 / this.layers.length);
                }
                
                // Normalize and enhance
                value = (value + 1) * 0.5; // Normalize to 0-1
                value = Math.pow(value, this.contrast); // Apply contrast
                
                // Calculate alpha based on pattern intensity
                const alpha = Math.max(0, Math.min(1, value * this.intensity));
                
                // Light blue/cyan caustics color
                const idx = (y * this.patternSize + x) * 4;
                data[idx] = 180 + value * 40;     // R
                data[idx + 1] = 220 + value * 30;  // G
                data[idx + 2] = 255;                // B
                data[idx + 3] = alpha * 255;       // A
            }
        }
        
        this.patternCtx.putImageData(imageData, 0, 0);
        
        // Use screen blend mode for additive lighting effect
        ctx.globalCompositeOperation = "screen";
        
        // Draw the pattern scaled up to full size
        ctx.drawImage(this.patternCanvas, 0, 0, this.width, this.height);
        
        // Add subtle radial gradient for depth variation
        ctx.globalCompositeOperation = "overlay";
        const gradient = ctx.createRadialGradient(
            this.width * 0.3,
            this.height * 0.2,
            0,
            this.width * 0.5,
            this.height * 0.5,
            Math.max(this.width, this.height) * 0.8
        );
        
        gradient.addColorStop(0, "rgba(200, 240, 255, 0.2)");
        gradient.addColorStop(0.5, "rgba(150, 200, 255, 0.1)");
        gradient.addColorStop(1, "rgba(120, 180, 255, 0.05)");
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);
        
        ctx.restore();
    }
}
