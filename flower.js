class Flower extends LilyPad {
    constructor(x, y, size) {
        super(x, y, size);
        // Flower overrides
        this.isFlower = true;
        this.notchWidth = 0; // No notch
        this.hasFlower = true; // Always has visual flower parts
        
        // Initialize flower-specific visuals immediately
        // (Logic taken from LilyPad constructor/randomization)
        const isPink = Math.random() < 0.3;
        if (isPink) {
            this.flowerColor = `hsl(${300 + Math.random() * 40}, 80%, 70%)`;
            this.flowerCenter = '#ffeb3b';
        } else {
            this.flowerColor = '#f0f0f0';
            this.flowerCenter = '#ffd700';
        }
        this.flowerSize = this.size * (0.8 + Math.random() * 0.2); // Slightly larger relative to "pad"
        this.petalCount = 8 + Math.floor(Math.random() * 4);
        this.flowerOffsetAngle = Math.random() * Math.PI * 2;
        
        // Center the visual flower on the "pad" body
        this.flowerOffset = { x: 0, y: 0 };

        // Flowers float freely without a long stem rope
        // We disable the stem visual or give it a tiny anchor-only stem
        this.stem = {
            update: () => {},
            draw: () => {},
            setAnchor: () => {}
        };
    }

    draw(ctx) {
        // Skip stem drawing
        
        ctx.save();
        ctx.translate(this.anchorX, this.anchorY);
        ctx.rotate(this.currentRotation);

        // Skip drawing the green pad base, just draw the flower
        // But we need hit detection... actually the prompt implies
        // it's a "flower instance" that moves and can be bumped.
        // So it acts like a round object. We can draw a faint shadow or small base?
        // Let's draw just the flower parts centered.
        
        this.drawFlower(ctx);

        ctx.restore();
    }

    // Re-use drawFlower from LilyPad (inherited), but we need to make sure
    // LilyPad doesn't try to draw a flower on itself anymore.
}

