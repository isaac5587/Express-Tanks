var tankWidth = 20;
var tankHeight = 30; class Tank {
  constructor(startPos, tankColor, tankid, playerName) {
    this.shots = [];
    this.bulletRadius = 10;
    this.pos = startPos;
    this.r = 20;
    this.heading = 0;
    this.rotation = 0;
    this.vel = createVector(0, 0);
    this.isBoosting = false;
    this.destroyed = false;
    this.tankColor = tankColor;
    this.tankid = tankid;
    this.playerName = playerName;
    this.damageTaken = 0;
    this.delay = 5;
    this.damage = 2;
    this.currentPowerup = false;
    this.assignPowerup = (powerup) => {
      this.currentPowerup = powerup
    }
    this.currentweapon = new machinegun(0, 0);
    this.assignWeapon = (weapon) => {
      this.currentweapon = weapon;
      this.damage = weapon.damage;
      this.delay = weapon.delay;
      this.bulletRadius = weapon.bulletRadius;
    }
    this.count = this.delay;
    this.damage = this.currentweapon.damage;
    this.show = true;
    setInterval(() => {
      this.count--;
    }, 100);
  }
  //Shoot function 
  shoot(t, index) {
    if (this.count <= 0) {
      this.count = this.delay;
      //process shot

    }
  }

  // For an optional boost feature
  boosting(b) {
    this.isBoosting = b;
  }

  boost() {
    var force = p5.Vector.fromAngle(this.heading);
    this.vel.add(force);
  }

  // Render - to render the tank to the screen
  render() {

    push();

    translate(this.pos.x, this.pos.y);
    rotate(this.heading + PI / 2);
    // if (this.destroyed && !this.show) return;
    if (this.destroyed && this.show) {
      // Show destroyed tank
      fill('red');
      ellipse(0, 0, 40, 40);
    } else {  // Draw Tank
      if (this.tankid == mytankid)
        stroke('white');
      else
        stroke('gray');
      strokeWeight(2);
      fill(this.tankColor);
      rect(0, 0, tankWidth, tankHeight);
      ellipse(0, -3, 14, 18);
      rect(0, -20, 4, 20);
      strokeWeight(6);
      point(0, 0);
      if (this.currentweapon.type == 'rpg') {
        stroke(230);
        rect(0, -30, 5, 10);
      }
      else if (this.currentweapon.type == 'machinegun') {
        stroke(255, 165, 0);
        rect(0, -30, 5, 10);
      }
      else if (this.currentweapon.type == 'sniper') {
        stroke(0, 240, 240);
        rect(0, -30, 5, 10);
      }

    }
    pop();

    push();
    translate(this.pos.x, this.pos.y);
    fill(this.tankColor);
    textAlign(CENTER);
    if (DEBUG && DEBUG == 1)
      text(this.tankid, 0, 30);
    else
      text(this.playerName, 0, 30);
    strokeWeight(4);
    strokeCap(ROUND);
    stroke(255, 0, 0);//red
    line(-13, 20, 17, 20);
    stroke(0, 255, 0);//green
    if (this.damageTaken >= 30) stroke(255, 0, 0);
    strokeCap(ROUND);
    line(-13, 20, 17 - (this.damageTaken), 20);
    pop();
  }

  // Moving tank
  moveForward(a) {
    var force = p5.Vector.fromAngle(this.heading);
    force.mult(a);
    this.vel.add(force);
  }

  stopMotion() {
    this.vel.x = 0;
    this.vel.y = 0;
    this.vel.z = 0;
  }

  setRotation(a) {
    this.rotation = a;
  }

  turn() {
    this.heading += this.rotation;
  }

  // Update its forward and backward motion
  update() {
    if (this.isBoosting) {
      this.boost();
    }
    this.pos.add(this.vel);
    if (this.currentPowerup != false) {
      if (this.currentPowerup.type = 'medkit') {
        this.currentPowerup = false;
        this.damageTaken = 0;
      }
    }
  }
}
