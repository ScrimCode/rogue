const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 800;
canvas.height = 640;
document.body.appendChild(canvas);

const player = {
  x: 50,
  y: 50,
  width: 20,
  height: 20,
  hp: 100,
  speed: 1,
  weapon: null,
};

const goalObject = {
  x: canvas.width - 50,
  y: canvas.height - 50,
  width: 30,
  height: 30,
  isPickedUp: false,
};

const walls = [];
const enemies = [];
const food = [];
const weapons = [];

let gameOver = false;

function generateWalls() {
  walls.length = 0;

  const buildingMinWidth = 80;
  const buildingMaxWidth = 120;
  const buildingMinHeight = 50;
  const buildingMaxHeight = 100;
  const detailMinSize = 20;
  const detailMaxSize = 40;
  const spaceSize = 10;
  const numRows = Math.floor(
    (canvas.height - spaceSize) / (buildingMaxHeight + spaceSize)
  );
  const numCols = Math.floor(
    (canvas.width - spaceSize) / (buildingMaxWidth + spaceSize)
  );

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      const buildingWidth =
        Math.floor(Math.random() * (buildingMaxWidth - buildingMinWidth + 1)) +
        buildingMinWidth;
      const buildingHeight =
        Math.floor(
          Math.random() * (buildingMaxHeight - buildingMinHeight + 1)
        ) + buildingMinHeight;

      const buildingX =
        col * (buildingMaxWidth + spaceSize) + Math.random() * spaceSize;
      const buildingY =
        row * (buildingMaxHeight + spaceSize) + Math.random() * spaceSize;

      walls.push({
        x: buildingX,
        y: buildingY,
        width: buildingWidth,
        height: buildingHeight,
      });

      for (
        let detailX = buildingX;
        detailX < buildingX + buildingWidth;
        detailX += detailMaxSize + spaceSize
      ) {
        for (
          let detailY = buildingY;
          detailY < buildingY + buildingHeight;
          detailY += detailMaxSize + spaceSize
        ) {
          const detailSize =
            Math.floor(Math.random() * (detailMaxSize - detailMinSize + 1)) +
            detailMinSize;
          walls.push({
            x: detailX,
            y: detailY,
            width: detailSize,
            height: detailSize,
          });
        }
      }
    }
  }
}

function generateEnemies() {
  for (let i = 0; i < 5; i++) {
    enemies.push({
      x: Math.random() * (canvas.width - 20),
      y: Math.random() * (canvas.height - 20),
      width: 20,
      height: 20,
      hp: 100,
      speed: 1,
    });
  }
}

function generateFood() {
  const numFoodItems = 10;

  for (let i = 0; i < numFoodItems; i++) {
    let foodX, foodY;

    do {
      foodX = Math.random() * (canvas.width - 20);
      foodY = Math.random() * (canvas.height - 20);
    } while (isColliding(foodX, foodY));

    food.push({ x: foodX, y: foodY, width: 20, height: 20 });
  }
}

function isColliding(x, y) {
  for (const wall of walls) {
    if (
      x < wall.x + wall.width &&
      x + 20 > wall.x &&
      y < wall.y + wall.height &&
      y + 20 > wall.y
    ) {
      return true;
    }
  }

  for (const enemy of enemies) {
    if (
      x < enemy.x + enemy.width &&
      x + 20 > enemy.x &&
      y < enemy.y + enemy.height &&
      y + 20 > enemy.y
    ) {
      return true;
    }
  }

  if (
    x < player.x + player.width &&
    x + 20 > player.x &&
    y < player.y + player.height &&
    y + 20 > player.y
  ) {
    return true;
  }

  for (const foodItem of food) {
    if (
      x < foodItem.x + foodItem.width &&
      x + 20 > foodItem.x &&
      y < foodItem.y + foodItem.height &&
      y + 20 > foodItem.y
    ) {
      return true;
    }
  }

  return false;
}

function generateWeapons() {
  const numWeapons = 2;

  for (let i = 0; i < numWeapons; i++) {
    let weaponX, weaponY;
    do {
      weaponX = Math.random() * (canvas.width - 20);
      weaponY = Math.random() * (canvas.height - 20);
    } while (
      isCollidingWithWeapons(weaponX, weaponY) ||
      isCollidingWithOtherItems(weaponX, weaponY)
    );
    weapons.push({ x: weaponX, y: weaponY, width: 20, height: 20 });
  }
}

function isCollidingWithWeapons(x, y) {
  for (const weapon of weapons) {
    if (
      x < weapon.x + weapon.width &&
      x + 20 > weapon.x &&
      y < weapon.y + weapon.height &&
      y + 20 > weapon.y
    ) {
      return true;
    }
  }
  return false;
}

function isCollidingWithOtherItems(x, y) {
  for (const wall of walls) {
    if (
      x < wall.x + wall.width &&
      x + 20 > wall.x &&
      y < wall.y + wall.height &&
      y + 20 > wall.y
    ) {
      return true;
    }
  }

  for (const enemy of enemies) {
    if (
      x < enemy.x + enemy.width &&
      x + 20 > enemy.x &&
      y < enemy.y + enemy.height &&
      y + 20 > enemy.y
    ) {
      return true;
    }
  }

  if (
    x < player.x + player.width &&
    x + 20 > player.x &&
    y < player.y + player.height &&
    y + 20 > player.y
  ) {
    return true;
  }

  for (const foodItem of food) {
    if (
      x < foodItem.x + foodItem.width &&
      x + 20 > foodItem.x &&
      y < foodItem.y + foodItem.height &&
      y + 20 > foodItem.y
    ) {
      return true;
    }
  }

  return false;
}

function drawPlayer() {
  const playerImage = new Image();
  playerImage.src = "tile-P.png";
  ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
  ctx.fillStyle = "black";
  ctx.fillText(`Player HP: ${player.hp}`, player.x, player.y - 5);
}

function drawEnemies() {
  ctx.fillStyle = "red";
  enemies.forEach((enemy) => {
    const enemyImage = new Image();
    enemyImage.src = "tile-E.png";
    ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
    ctx.fillStyle = "black";
    ctx.fillText(`Enemy HP: ${enemy.hp}`, enemy.x, enemy.y - 5);
  });
}

function drawFood() {
  ctx.fillStyle = "green";
  food.forEach((foodItem) => {
    const foodImage = new Image();
    foodImage.src = "tile-HP.png";
    ctx.drawImage(
      foodImage,
      foodItem.x,
      foodItem.y,
      foodItem.width,
      foodItem.height
    );
  });
}

function drawWeapons() {
  weapons.forEach((weapon) => {
    const weaponImage = new Image();
    weaponImage.src = "tile-SW.png";
    ctx.drawImage(weaponImage, weapon.x, weapon.y, weapon.width, weapon.height);
  });
}

function drawGoalObject() {
  if (!goalObject.isPickedUp) {
    ctx.fillStyle = "gold";
    ctx.fillRect(
      goalObject.x,
      goalObject.y,
      goalObject.width,
      goalObject.height
    );
  }
}

function checkGoalObjectPickup() {
  if (
    player.x < goalObject.x + goalObject.width &&
    player.x + player.width > goalObject.x &&
    player.y < goalObject.y + goalObject.height &&
    player.y + player.height > goalObject.y
  ) {
    goalObject.isPickedUp = true;
    gameOver = true;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawEnemies();
  drawFood();
  drawWeapons();
  drawGoalObject();
  ctx.fillStyle = "black";
  ctx.fillText(`Player HP: ${player.hp}`, player.x, player.y - 5);

  walls.forEach((wall) => {
    const wallImage = new Image();
    wallImage.src = "tile-W.png";
    ctx.drawImage(wallImage, wall.x, wall.y, wall.width, wall.height);
  });

  if (gameOver) {
    ctx.fillStyle = "red";
    ctx.font = "30px Arial";
    ctx.fillText("Игра закончена", canvas.width / 2 - 100, canvas.height / 2);
    if (goalObject.isPickedUp) {
      ctx.fillText(
        "Ты прошел игру",
        canvas.width / 2 - 200,
        canvas.height / 2 + 40
      );
    }
  }
}
function generateEnemies() {
  for (let i = 0; i < 10; i++) {
    enemies.push({
      x: Math.random() * (canvas.width - 20),
      y: Math.random() * (canvas.height - 20),
      width: 20,
      height: 20,
      hp: 100,
      speed: 1,
      targetX: Math.random() * canvas.width,
      targetY: Math.random() * canvas.height,
    });
  }
}

function updateEnemyTargets() {
  enemies.forEach((enemy) => {
    if (Math.random() < 0.01) {
      enemy.targetX = Math.random() * canvas.width;
      enemy.targetY = Math.random() * canvas.height;
    }
  });
}

function moveEnemiesToTargets() {
  enemies.forEach((enemy) => {
    const dx = enemy.targetX - enemy.x;
    const dy = enemy.targetY - enemy.y;

    const distance = Math.sqrt(dx * dx + dy * dy);

    const directionX = dx / distance;
    const directionY = dy / distance;

    enemy.x += directionX * enemy.speed;
    enemy.y += directionY * enemy.speed;

    if (enemy.x < 0) {
      enemy.x = 0;
    }
    if (enemy.x + enemy.width > canvas.width) {
      enemy.x = canvas.width - enemy.width;
    }
    if (enemy.y < 0) {
      enemy.y = 0;
    }
    if (enemy.y + enemy.height > canvas.height) {
      enemy.y = canvas.height - enemy.height;
    }
  });
}

function update() {
  updateEnemyTargets();
  moveEnemiesToTargets();

  if (gameOver) {
    return;
  }

  walls.forEach((wall) => {
    if (
      player.x < wall.x + wall.width &&
      player.x + player.width > wall.x &&
      player.y < wall.y + wall.height &&
      player.y + player.height > wall.y
    ) {
      stopPlayerOnWallCollision(wall);
    }

    enemies.forEach((enemy) => {
      if (
        enemy.x < wall.x + wall.width &&
        enemy.x + enemy.width > wall.x &&
        enemy.y < wall.y + wall.height &&
        enemy.y + enemy.height > wall.y
      ) {
        reverseEnemyDirection(enemy, wall);
      }
    });
  });

  enemies.forEach((enemy, enemyIndex) => {
    if (
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.y + player.height > enemy.y
    ) {
      player.hp -= 0.5;

      if (player.hp <= 0) {
        gameOver = true;
      }
    }

    weapons.forEach((weapon, weaponIndex) => {
      if (
        weapon.x < enemy.x + enemy.width &&
        weapon.x + weapon.width > enemy.x &&
        weapon.y < enemy.y + enemy.height &&
        weapon.y + weapon.height > enemy.y
      ) {
        enemies.splice(enemyIndex, 1);
      }
    });
  });

  food.forEach((foodItem, index) => {
    if (
      player.x < foodItem.x + foodItem.width &&
      player.x + player.width > foodItem.x &&
      player.y < foodItem.y + foodItem.height &&
      player.y + player.height > foodItem.y
    ) {
      player.hp += 10;
      food.splice(index, 1);
    }
  });

  weapons.forEach((weapon, index) => {
    if (
      player.x < weapon.x + weapon.width &&
      player.x + player.width > weapon.x &&
      player.y < weapon.y + weapon.height &&
      player.y + player.height > weapon.y
    ) {
      player.weapon = weapon;
      weapons.splice(index, 1);
    }
  });
  checkGoalObjectPickup();

  updatePlayer();

  updateEnemies();

  updatePlayer();

  updateEnemies();
}

function updatePlayer() {
  if (isKeyPressed("w")) {
    player.y -= player.speed;
  }
  if (isKeyPressed("s")) {
    player.y += player.speed;
  }
  if (isKeyPressed("a")) {
    player.x -= player.speed;
  }
  if (isKeyPressed("d")) {
    player.x += player.speed;
  }

  if (player.x < 0) {
    player.x = 0;
  }
  if (player.x + player.width > canvas.width) {
    player.x = canvas.width - player.width;
  }
  if (player.y < 0) {
    player.y = 0;
  }
  if (player.y + player.height > canvas.height) {
    player.y = canvas.height - player.height;
  }
}

function isKeyPressed(key) {
  return keyState[key] === true;
}

function stopPlayerOnWallCollision(wall) {
  if (player.x + player.width > wall.x && player.x < wall.x + wall.width) {
    if (player.y < wall.y) {
      player.y = wall.y - player.height;
    } else {
      player.y = wall.y + wall.height;
    }
  } else if (
    player.y + player.height > wall.y &&
    player.y < wall.y + wall.height
  ) {
    if (player.x < wall.x) {
      player.x = wall.x - player.width;
    } else {
      player.x = wall.x + wall.width;
    }
  }
}

function updateEnemies() {
  enemies.forEach((enemy, enemyIndex) => {
    if (player.x < enemy.x) {
      enemy.x -= enemy.speed;
    } else if (player.x > enemy.x) {
      enemy.x += enemy.speed;
    }

    if (player.y < enemy.y) {
      enemy.y -= enemy.speed;
    } else if (player.y > enemy.y) {
      enemy.y += enemy.speed;
    }

    walls.forEach((wall) => {
      if (
        enemy.x < wall.x + wall.width &&
        enemy.x + enemy.width > wall.x &&
        enemy.y < wall.y + wall.height &&
        enemy.y + enemy.height > wall.y
      ) {
        reverseEnemyDirection(enemy, wall);
      }
    });

    enemies.forEach((otherEnemy, otherEnemyIndex) => {
      if (enemyIndex !== otherEnemyIndex) {
        if (
          enemy.x < otherEnemy.x + otherEnemy.width &&
          enemy.x + enemy.width > otherEnemy.x &&
          enemy.y < otherEnemy.y + otherEnemy.height &&
          enemy.y + enemy.height > otherEnemy.y
        ) {
          reverseEnemyDirection(enemy, otherEnemy);
        }
      }
    });

    if (
      player.x < enemy.x + enemy.width &&
      player.x + player.width > enemy.x &&
      player.y < enemy.y + enemy.height &&
      player.y + player.height > enemy.y
    ) {
      enemy.hp -= 1;

      if (enemy.hp <= 0) {
        enemies.splice(enemyIndex, 1);
      }
    }
  });
}

function reverseEnemyDirection(enemy, wall) {
  if (enemy.x + enemy.width > wall.x && enemy.x < wall.x + wall.width) {
    if (enemy.y < wall.y) {
      enemy.y = wall.y - enemy.height;
    } else {
      enemy.y = wall.y + wall.height;
    }
  } else if (
    enemy.y + enemy.height > wall.y &&
    enemy.y < wall.y + wall.height
  ) {
    if (enemy.x < wall.x) {
      enemy.x = wall.x - enemy.width;
    } else {
      enemy.x = wall.x + wall.width;
    }
  }
}

const keyState = {};

window.addEventListener("keydown", (e) => {
  keyState[e.key] = true;
});

window.addEventListener("keyup", (e) => {
  keyState[e.key] = false;
});

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  update();
  draw();

  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  }
}

canvas.addEventListener("mousedown", handleMouseDown);

function handleMouseDown(event) {
  if (event.button === 0) {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    attack(mouseX, mouseY);
  }
}

function attack(mouseX, mouseY) {
  if (player.weapon) {
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      if (
        mouseX >= enemy.x &&
        mouseX <= enemy.x + enemy.width &&
        mouseY >= enemy.y &&
        mouseY <= enemy.y + enemy.height
      ) {
        enemy.hp -= 10;

        if (enemy.hp <= 0) {
          enemies.splice(i, 1);
        }

        break;
      }
    }
  }
}
generateWalls();
generateEnemies();
generateFood();
generateWeapons();
gameLoop();
