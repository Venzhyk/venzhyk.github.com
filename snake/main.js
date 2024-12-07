const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

window.game = {
  speed: 100,
  snake: [{ x: 10, y: 10 }],
  direction: { x: 0, y: 0 },
  food: { x: 15, y: 15, img: "food1.png" },
  pause: false,
  gameover: false,
};

const boxSize = 20;

let Assests = {};
function initAssests() {
  Assests.head = {
    left: new Image(),
    right: new Image(),
    up: new Image(),
    down: new Image(),
  };
  Assests.head.left.src = "img/head-lf.png";
  Assests.head.right.src = "img/head-rg.png";
  Assests.head.up.src = "img/head-up.png";
  Assests.head.down.src = "img/head-dn.png";

  Assests.body = {
    horizontal: new Image(),
    vertical: new Image(),
    turnupleft: new Image(),
    turnupright: new Image(),
    turndownleft: new Image(),
    turndownright: new Image(),
  };
  Assests.body.horizontal.src = "img/body-hor.png";
  Assests.body.vertical.src = "img/body-ver.png";
  Assests.body.turnupleft.src = "img/body-turn-up-lf.png";
  Assests.body.turnupright.src = "img/body-turn-up-rg.png";
  Assests.body.turndownleft.src = "img/body-turn-dn-lf.png";
  Assests.body.turndownright.src = "img/body-turn-dn-rg.png";

  Assests.tail = {
    left: new Image(),
    right: new Image(),
    up: new Image(),
    down: new Image(),
  };
  Assests.tail.left.src = "img/tail-rg.png";
  Assests.tail.right.src = "img/tail-lf.png";
  Assests.tail.up.src = "img/tail-dn.png";
  Assests.tail.down.src = "img/tail-up.png";

  Assests.food = [];
  let food = new Image();
  food.src = "img/food4.png";
  Assests.food.push(food);
  food = new Image();
  food.src = "img/food5.png";
  Assests.food.push(food);
  food = new Image();
  food.src = "img/food6.png";
  Assests.food.push(food);

  Assests.gameover = new Image();
  Assests.gameover.src = "img/gameover.png";
}


function initGame() {
  game.snake = [{ x: 10, y: 10 }];
  game.direction = { x: 0, y: 0 };
  game.food = { x: 15, y: 15, img: "food1.png" };
  game.pause = false;
  game.speed = 100;
}

function gameOver() {
  game.pause = true;
  ctx.drawImage(Assests.gameover, 0, 0, canvas.width, canvas.height);
  clearInterval(game.id);
  game.gameover = true;
}

function draw() {
  if (game.pause) {
    return;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if(!moveSnake()){
    gameOver();
    return;
  }
  drawSnake();
  drawFood();
  drawScore();
}

function moveSnake() {
  let head = { x: game.snake[0].x + game.direction.x, y: game.snake[0].y + game.direction.y };
  if (
    head.x < 0 ||
    head.x > canvas.width / boxSize - 1 ||
    head.y < 0 ||
    head.y > canvas.height / boxSize - 1
  ) {
    return false;
    // if (head.x < 0) {
    //   head.x = canvas.width / boxSize - 1;
    // } else if (head.x > canvas.width / boxSize - 1) {
    //   head.x = 0;
    // } else if (head.y < 0) {
    //   head.y = canvas.height / boxSize - 1;
    // } else if (head.y > canvas.height / boxSize - 1) {
    //   head.y = 0;
    // }
  }
  game.snake.unshift(head);

  if (game.snake.length > 2) {
    for (let i = 1; i < game.snake.length; i++) {
      if (game.snake[i].x === head.x && game.snake[i].y === head.y) {
        return false;
      }
    }
  }
  if (!checkFoodCollision()) {
    game.snake.pop();
  }
  return true;
}


function drawSnake() {
  for (let i = 0; i < game.snake.length; i++) {
    let segment = game.snake[i];
    let img = Assests.body.horizontal; // Default to horizontal

    // Determine the direction of the segment
    if (i === 0) {
      // Head of the snake
      if (game.direction.x > 0) {
        img = Assests.head.right;
      } else if (game.direction.x < 0) {
        img = Assests.head.left;
      } else if (game.direction.y > 0) {
        img = Assests.head.down;
      } else if (game.direction.y < 0) {
        img = Assests.head.up;
      }
    } else if (i === game.snake.length - 1) {
      // Tail of the snake
      let prevSegment = game.snake[i - 1];
      if (prevSegment.x < segment.x) {
        img = Assests.tail.right;
      } else if (prevSegment.x > segment.x) {
        img = Assests.tail.left;
      } else if (prevSegment.y < segment.y) {
        img = Assests.tail.down;
      } else if (prevSegment.y > segment.y) {
        img = Assests.tail.up;
      }
    } else {
      // Body segments
      let prevSegment = game.snake[i - 1];
      let nextSegment = game.snake[i + 1] || segment; // Handle last segment case

      if (prevSegment.x === nextSegment.x) {
        img = Assests.body.vertical; // Vertical body
      } else if (prevSegment.y === nextSegment.y) {
        img = Assests.body.horizontal; // Horizontal body
      }
      //  else {
      //     // Determine the turn direction
      //     if (prevSegment.x < segment.x && nextSegment.y < segment.y) {
      //         img = Assests.body.turnupright; // Turn right
      //     } else if (prevSegment.x < segment.x && nextSegment.y > segment.y) {
      //         img = Assests.body.turndownright; // Turn down
      //     } else if (prevSegment.x > segment.x && nextSegment.y < segment.y) {
      //         img = Assests.body.turnupleft; // Turn left
      //     } else if (prevSegment.x > segment.x && nextSegment.y > segment.y) {
      //         img = Assests.body.turndownleft; // Turn down
      //     }
      // }
    }

    // Draw the segment
    ctx.drawImage(
      img,
      segment.x * boxSize,
      segment.y * boxSize,
      boxSize,
      boxSize
    );
  }
}

function drawFood() {
  let foodImage = new Image();
  foodImage.src = `img/${game.food.img}`;
  ctx.drawImage(
    foodImage,
    game.food.x * boxSize,
    game.food.y * boxSize,
    boxSize,
    boxSize
  );
}

function drawScore() {
  document.getElementById("score").innerText = game.snake.length;
}

function checkFoodCollision() {
  let collision = game.snake[0].x === game.food.x && game.snake[0].y === game.food.y;
  if (collision) {
    game.food = {
      x: Math.floor(Math.random() * (canvas.width / boxSize)),
      y: Math.floor(Math.random() * (canvas.height / boxSize)),
      img: `food${Math.floor(Math.random() * 3) + 1 + 3}.png`,
    };
  }
  return collision;
}

document.addEventListener("keydown", (event) => {
  let step = 1;
  switch (event.code) {
    case "ArrowUp":
      game.direction = { x: 0, y: -step };
      break;
    case "ArrowDown":
      game.direction = { x: 0, y: step };
      break;
    case "ArrowLeft":
      game.direction = { x: -step, y: 0 };
      break;
    case "ArrowRight":
      game.direction = { x: step, y: 0 };
      break;
    case "Space":
      if (game.gameover) {
        startGame();
      } else {
        game.pause = !game.pause;
      }
      break;
    default:
      console.log("Unknown key: ", event);
      break;
  }
});


function startGame() {
  initAssests();
  initGame();
  game.id = setInterval(draw, game.speed);
}

startGame();
