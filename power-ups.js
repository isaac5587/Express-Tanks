

//classes for the shield and medkit

class shield extends boosters {
    constructor(x, y) {
        this.xpos = x;
        this.ypos = y;
        this.fill = { r: 0, g: 0, b: 255 }
        this.text = 'shield'
    }
}
class medkit extends boosters {
    constructor(x, y) {
        this.xpos = x;
        this.ypos = y;
        this.fill = { r: 0, g: 255, b: 0 }
        this.text = 'medkit'
    }
}