class Enemy {
  constructor({ position = { x: 0, y: 0 } }) {
    this.position = position;
    this.width = 100;
    this.height = 100;
    this.waypointIndex = 0;
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };
    this.radius = 50;
    this.health = 100;
    this.velocity = {
      x: 0,
      y: 0,
    };
  }

  draw() {
    //draw enemy
    c.fillStyle = "red";
    // c.fillRect(this.position.x, this.position.y, this.width, this.height);
    c.beginPath();
    c.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2);
    c.fill();

    // health bar
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y - 15, this.width, 10);

    c.fillStyle = "green";
    c.fillRect(
      this.position.x,
      this.position.y - 15,
      (this.width * this.health) / 100,
      10
    );
  }

  update() {
    this.draw();

    const waypoint = waypoints[this.waypointIndex];
    // this help calculate the distance of the triangle in this case X & Y so we can use it on the angle formula
    const yDistance = waypoint.y - this.center.y;
    const xDistance = waypoint.x - this.center.x;

    // this helps the enemy unit to be at the center of the path
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2,
    };

    //this will calculate the angle in radiants
    const angle = Math.atan2(yDistance, xDistance);

    const speed = 3;

    this.velocity.x = Math.cos(angle) * speed;
    this.velocity.y = Math.sin(angle) * speed;

    // after we calculate the angle in radiants this will give the speed of x & y, cos for x speed, and sin for y speed
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // when the position of x and y hits the cordinates in waypoint array, it will change to the next waypoint

    // adjustment was made to be able increase the speed of the targets
    if (
      Math.abs(Math.round(this.center.x) - Math.round(waypoint.x)) <
        Math.abs(this.velocity.x) &&
      Math.abs(Math.round(this.center.y) - Math.round(waypoint.y)) <
        Math.abs(this.velocity.y) &&
      this.waypointIndex < waypoints.length - 1
    ) {
      this.waypointIndex++;
    }
  }
}
