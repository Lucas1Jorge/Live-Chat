class Zombie {
  
  constructor(speed) {
    this.player = players[Math.floor(Math.random() * players.length)];
    this.id = currZombieId.toString();

    if (random(1) > 0.5) {
      this.x = width * (1 + random(1));
    } else {
      this.x = width * (-random(1));
    }

    if (random(1) > 0.5) {
      this.y = height * (1 + random(1));
    } else {
      this.y = height * (-random(1));
    }

    this.pos = createVector(this.x, this.y);
    this.speed = speed;
    this.angle = 0;
  }
  
  
  draw() {
    angleMode(degrees);
    rectMode(CENTER);
    push();
    translate(this.pos.x, this.pos.y);
    this.angle = atan2(this.player.pos.y - this.pos.y, this.player.pos.x - this.pos.x);
    rotate(this.angle);
    fill(100, 255, 100);
    image(zombieImg, 0, 0, 30 * zoom, 30 * zoom);
    pop();
  }
  
  update() {
    let difference = p5.Vector.sub(this.player.pos, this.pos);
    difference.limit(this.speed);
    this.pos.add(difference);
  }
  
}