
var tankWidth = 20;
var tankHeight = 30;
class Tank {
  constructor(startPos, tankColor, newtankid, playerName) {
    this.shots = [];
    this.pos = startPos.copy();
    this.r = 20;
    this.heading = 0;
    this.rotation = 0;
    this.vel = createVector(0, 0);
    this.isBoosting = false;
    this.destroyed = false;
    this.tankColor = tankColor;
    this.tankid = newtankid;
    this.playerName = playerName;
    this.health = 100;
    this.damage = 0;
    this.currentweapon = new machinegun;
    this.assignWeapon = (weapon) => {
      this.currentweapon = weapon;
    }
    this.delay = this.currentweapon.delay;
    this.count = this.delay;
    this.damage = this.currentweapon.damage;
    setInterval(() => {
      this.count--;
    }, 100);
  }
  //Shoot function 

  shoot(t, index) {
    if (this.count <= 0) {
      this.count = this.delay;
      //process shot
      t[index].playerName += '+';
      return t;
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

    if (this.destroyed) {
      // Show destroyed tank
      fill('red');
      ellipse(0, 0, 40, 40);
    }
    else {  // Draw Tank
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
      fill(0, 255, 0);
      strokeCap(ROUND);
      rect(this.x, this.y - 30, 5, tankHeight);
      fill(255, 0, 0);
      rect(this.x, this.y - 10, 5, tankHeight / 2);
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
  }
}