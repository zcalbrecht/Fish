class Effect extends Item {
    constructor(x, y) {
        super(x, y);
        this.active = true;
    }

    update(dt) {
        // Override in subclass
    }

    draw(ctx) {
        // Override in subclass
    }
}

