class Weapon {
    constructor(onGround) {
        this.isPowerup = true;
    }
}

class machinegun extends Weapon {
    constructor(x,y) {
        super(true);
        this.damage = 10;
        this.delay = 2;
        this.xpos = x;
        this.ypos = y;
        this.bulletColor = {r:255,g:0,b:0}

    }
    show() {
        push();
        fill(255,165,0);
        rectMode(CENTER);
        text('machinegun',this.xpos-10,this.ypos+30,40,40);
        rect(this.xpos, this.ypos, 40, 40); 
        pop()
    }
}

class sniper extends Weapon{
    constructor(x,y) {
        super(true);
        this.damage = 50;
        this.delay = 10;
        this.xpos = x;
        this.ypos = y;
        this.bulletColor = {r:0,g:255,b:0}
    }
    show() {
        push()
        fill(0,255,0);
        rectMode(CENTER);
        text('sniper',this.xpos-10,this.ypos+20,40,40);
        rect(this.xpos, this.ypos, 40, 40); 
        pop()
    }
}    


class rpg extends Weapon {
    constructor(x,y) {
        super(true);
        this.damage = 100
        this.delay = 20;
        this.xpos = x;
        this.ypos = y;
        this.bulletColor = {r:0,g:0,b:255}
    }
    show() {
        push()
        fill(230,230,250);
        rectMode(CENTER);
        text('rpg',this.xpos,this.ypos+20,40,40);
        rect(this.xpos-5, this.ypos, 40, 40);
        pop() 
    }
}