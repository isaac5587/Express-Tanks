class shield extends boosters {
    constructor(x, y) {
        super(true);
        this.type = 'shield'
        this.xpos = x;
        this.ypos = y;
        this.fill = { r: 0, g: 0, b: 255 }
        this.text = 'Shield'
    }
}
class medkit extends boosters {
    constructor(x, y) {
        super(true);
        this.type = 'medkit';
        this.xpos = x;
        this.ypos = y;
        this.fill = { r: 0, g: 255, b: 0 }
        this.text = 'Medkit'
    }
}