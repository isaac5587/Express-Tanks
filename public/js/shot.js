// Shot class - represents shots by the tank
class Shot {
  constructor(shotid, tankid, spos, angle, color, damage) {
    this.pos = createVector(spos.x, spos.y);
    this.vel = p5.Vector.fromAngle(angle);
    this.vel.mult(3);
    this.color = color;
    this.shotid = shotid;
    this.tankid = tankid;
    this.damage = damage;
    this.used = false;
  }
  update() {
    this.pos.add(this.vel);
  }

  // Render the shot to the screen
  render(radius) {
    push();

    // Original shots
    //      stroke(this.color);
    //      strokeWeight(8);
    //      point(this.pos.x, this.pos.y);

    // New and improved shots
    stroke(255);
    fill(this.color);
    strokeWeight(1);
    ellipse(this.pos.x - 2, this.pos.y - 2, radius, radius);
    point(this.pos.x, this.pos.y);
    pop();
  }

  // Check if the tank hits another tank
  hits(enemyTank) {
    var d = dist(this.pos.x, this.pos.y, enemyTank.pos.x, enemyTank.pos.y);
    if (d < 60) {
      return true;
    } else {
      return false;
    }
  }

  // Check if the shot moves off screen.  In which case, kill it
  offscreen() {
    if (this.pos.x > width || this.pos.x < 0) {
      socket.emit('ClientRemoveShot', this.shotid);
      return true;
    }
    if (this.pos.y > height || this.pos.y < 0) {
      socket.emit('ClientRemoveShot', this.shotid);
      return true;
    }
    return false;
  }
}