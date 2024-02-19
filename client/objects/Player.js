class Player {
  constructor(userId = 'Player', color="#ffffff") {
    this.userId = userId
    this.color = color;
    this.pos = createVector(width/2, height/2);
    this.namePlate = new NamePlate(this.userId, this.pos, this.color);
    this.bullets = [];
    this.angle = 0;
    this.speed = 2;
  }

  draw() {
    rectMode(CENTER);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.angle);
    image(playerImg, 0, 0, 30 * zoom, 30 * zoom);
    pop();
    
    
    for (let bullet of this.bullets) {
      bullet.draw();
      bullet.update();
    }
    
    if (this.bullets.length > 20) {
      this.bullets.splice(0, 1);
    }
  }

  drawNamePlate() {
    this.namePlate.draw();
  }
  
  update(playerSide) {
    let sidewaysSpeed = 0;
    let forwardSpeed = 0;
    
    if (keyIsDown(65)) sidewaysSpeed = -this.speed; // A
    if (keyIsDown(68)) sidewaysSpeed = this.speed; // D
    if (keyIsDown(87)) forwardSpeed = -this.speed; // S
    if (keyIsDown(83)) forwardSpeed = this.speed; // W

    this.pos.add(sidewaysSpeed, forwardSpeed);
    this.angle = atan2(mouseY - this.pos.y, mouseX - this.pos.x);
  }
  
  shot(zombie) {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      if (dist(this.bullets[i].x, this.bullets[i].y, zombie.pos.x, zombie.pos.y) < 10) {
        this.bullets.splice(i, 1);
        return true;
      }
    }
    return false;
  }
  
  shoot() {
    this.bullets.push(new Bullet(this.pos.x, this.pos.y, this.angle));
  }
}
