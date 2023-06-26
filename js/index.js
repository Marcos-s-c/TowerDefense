const canvas = document.querySelector("canvas");
// c = context
const c = canvas.getContext("2d");

canvas.width = 1280;
canvas.height = 768;
c.fillStyle = "white";
c.fillRect(0, 0, canvas.width, canvas.height);

const placementTilesData2D = [];

for (let i = 0; i < placementTilesData.length; i += 20) {
  placementTilesData2D.push(placementTilesData.slice(i, i + 20));
}

const placementTiles = [];

placementTilesData2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if (symbol === 14) {
      // add building placement tile here
      placementTiles.push(
        new PlacementTile({
          position: {
            x: x * 64,
            y: y * 64,
          },
        })
      );
    }
  });
});

const image = new Image();

// this will make the image show after its load
image.onload = () => {
  // its better to load the function first before the image so it can be ready to show after the image is read
  animate();
};

image.src = "img/gameMap.png";

const enemies = [];
function spawnEnemies(spawnCount) {
  for (let i = 1; i < spawnCount + 1; i++) {
    const xOffset = i * 150;
    enemies.push(
      new Enemy({
        position: { x: waypoints[0].x - xOffset, y: waypoints[0].y },
      })
    );
  }
}

const buildings = [];
let activeTile = undefined;
let enemyCount = 3;

spawnEnemies(enemyCount);

//recursive function
function animate() {
  requestAnimationFrame(animate);
  c.drawImage(image, 0, 0);

  enemies.forEach((enemy) => {
    enemy.update();
  });

  placementTiles.forEach((tile) => {
    tile.update(mouse);
  });

  buildings.forEach((building) => {
    building.update();
    building.target = null;
    const validEnemies = enemies.filter((enemy) => {
      const xDifference = enemy.center.x - building.center.x;
      const yDifference = enemy.center.y - building.center.y;

      const distance = Math.hypot(xDifference, yDifference);

      return distance < enemy.radius + building.radius;
    });

    building.target = validEnemies[0];
    // this reads the projectiles array from last projectile to the first projectile to avoid visual bugs
    for (let i = building.projectiles.length - 1; i >= 0; i--) {
      const projectile = building.projectiles[i];

      projectile.update();

      const xDifference = projectile.enemy.center.x - projectile.position.x;
      const yDifference = projectile.enemy.center.y - projectile.position.y;

      // Calculate the distance between two points in a two-dimensional coordinate system using the Math.hypot() function.
      const distance = Math.hypot(xDifference, yDifference);
      // this is when a projectile hits a enemy
      //remove the red dot from the screen
      if (distance < projectile.enemy.radius + projectile.radius) {
        projectile.enemy.health -= 20;

        if (projectile.enemy.health <= 0) {
          const enemyIndex = enemies.findIndex((enemy) => {
            return projectile.enemy === enemy;
          });
          if (enemyIndex > -1) enemies.splice(enemyIndex, 1);
        }

        //tracking total amount of enemies
        if (enemies.length === 0) {
          enemyCount += 2;
          spawnEnemies(enemyCount);
        }
        console.log(projectile.enemy.health);
        building.projectiles.splice(i, 1);
      }
    }
  });
}

const mouse = {
  x: undefined,
  y: undefined,
};

canvas.addEventListener("click", (event) => {
  if (activeTile && !activeTile.isOccupied) {
    buildings.push(
      new Building({
        position: {
          x: activeTile.position.x,
          y: activeTile.position.y,
        },
      })
    );
    activeTile.isOccupied = true;
  }
});

window.addEventListener("mousemove", (event) => {
  mouse.x = event.clientX;
  mouse.y = event.clientY;

  activeTile = null;

  // this check if the mouse is near the available tile
  for (let i = 0; i < placementTiles.length; i++) {
    const tile = placementTiles[i];
    if (
      mouse.x > tile.position.x &&
      mouse.x < tile.position.x + tile.size &&
      mouse.y > tile.position.y &&
      mouse.y < tile.position.y + tile.size
    ) {
      activeTile = tile;
      break;
    }
  }
});
