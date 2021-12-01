class Weapon {
    constructor(onGround) {
        this.isPowerup = true;
    }
}

class machinegun extends Weapon {
    constructor() {
        super(true);
        this.damage = 10;
        this.delay = 2;
        this.xpos = random(0,600);
        this.ypos = random(0,600);
        this.bulletColor = {r:255,g:0,b:0}

    }
    show() {
        fill(255,165,0);
        text('machinegun',this.xpos,this.ypos,40,40);
        rect(this.xpos, this.ypos, 40, 40); 
    }
}

class sniper extends Weapon{
    constructor() {
        super(true);
        this.damage = 50;
        this.delay = 10;
        this.xpos = random(0, win.width);
        this.ypos = random(0, win.height);
        this.bulletColor = {r:0,g:255,b:0}
    }
    show() {
        fill(0,255,0);
        text('sniper',this.xpos,this.ypos,40,40);
        rect(this.xpos, this.ypos, 40, 40); 
    }
}    


class rpg extends Weapon {
    constructor() {
        super(true);
        this.damage = 100
        this.delay = 20;
        this.xpos = random(0, win.width);
        this.ypos = random(0, win.height);
        this.bulletColor = {r:0,g:0,b:255}
    }
    show() {
        fill(230,230,250);
        text('rpg',this.xpos,this.ypos,40,40);
        rect(this.xpos, this.ypos, 40, 40); 
    }
}