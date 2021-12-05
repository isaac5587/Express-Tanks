//base class
class boosters {
    constructor() {
    }
    show() {
        push();
        fill(this.fill.r, this.fill.g, this.fill.b);
        rectMode(CENTER);
        text(this.text, this.xpos - 10, this.ypos + 30, 40, 40);
        rect(this.xpos, this.ypos, 40, 40);
        pop()
    }
}

class machinegun extends boosters {
    constructor(x, y) {
        super();
        this.type = 'machinegun'; 
        this.damage = 5;
        this.bulletRadius = 8;
        this.delay = 2;
        this.xpos = x;
        this.ypos = y;
        this.bulletColor = { r: 255, g: 0, b: 0 };
        this.text = 'Machine Gun'
        this.fill = { r: 255, g: 165, b: 0 }
    }
}

class sniper extends boosters {
    constructor(x, y) {
        super();
        this.type = 'sniper'; 
        this.damage = 10;
        this.bulletRadius = 26;
        this.delay = 10;
        this.xpos = x;
        this.ypos = y;
        this.bulletColor = { r: 0, g: 240, b: 240 };
        this.text = 'Sniper';
        this.fill = { r: 0, g: 240, b: 240 }
    }
    // show() {
    //     push()
    //     fill(0,255,0);
    //     rectMode(CENTER);
    //     text('sniper',this.xpos-10,this.ypos+20,40,40);
    //     rect(this.xpos, this.ypos, 40, 40); 
    //     pop()
    // }
}


class rpg extends boosters {
    constructor(x, y) {
        super();
        this.type = 'rpg'; 
        this.damage = 35;
        this.bulletRadius = 50;
        this.delay = 20;
        this.xpos = x;
        this.ypos = y;
        this.bulletColor = { r: 0, g: 0, b: 255 };
        this.text = 'RPG';
        this.fill = { r: 230, b: 230, g: 250 }
    }
    // show() {
    //     push()
    //     fill(230,230,250);
    //     rectMode(CENTER);
    //     text('rpg',this.xpos,this.ypos+20,40,40);
    //     rect(this.xpos-5, this.ypos, 40, 40);
    //     pop() 
    // }
}