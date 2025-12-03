// const board = document.querySelector(".board");
// const startButton = document.querySelector(".btn-start");
// const restartButton = document.querySelector(".btn-restart");
// const modal = document.querySelector(".modal");
// const startGameModal = document.querySelector(".start-game");
// const gameOverModal = document.querySelector(".game-over");

// const highScoreElement = document.querySelector("#high-score");
// const scoreElement = document.querySelector("#score");
// const timeElement = document.querySelector("#time");

// const blockHeight = 30;
// const blockWidth = 30;

// let highScore = JSON.parse(localStorage.getItem("highScore")) || 0;

// highScoreElement.textContent = highScore;
// let score = 0;
// let time = `00:00`;

// const cols = Math.floor(board.clientWidth / blockWidth);
// const rows = Math.floor(board.clientHeight / blockHeight);
// let intervalId = null;
// let timerIntervalId = null;
// let food = {
//     x: Math.floor(Math.random() * rows),
//     y: Math.floor(Math.random() * cols),
// };

// let blocks = [];
// let snake = [
//     {
//         x: 1,
//         y: 3,
//     },
// ];
// let direction = "right";

// // block adding loop
// for (let row = 0; row < rows; row++) {
//     for (let col = 0; col < cols; col++) {
//         const div = document.createElement("div");
//         div.setAttribute("class", "block");
//         board.appendChild(div);
//         blocks[`${row},${col}`] = div;
//     }
// }

// function render() {
//     let head = null;
//     blocks[`${food.x},${food.y}`]?.classList.add("food");
//     if (direction === "left") {
//         head = { x: snake[0].x, y: snake[0].y - 1 };
//     } else if (direction === "right") {
//         head = { x: snake[0].x, y: snake[0].y + 1 };
//     } else if (direction === "up") {
//         head = { x: snake[0].x - 1, y: snake[0].y };
//     } else if (direction === "down") {
//         head = { x: snake[0].x + 1, y: snake[0].y };
//     }

//     // wall collision logic
//     if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
//         clearInterval(intervalId);
//         modal.style.display = "flex";
//         startGameModal.style.display = "none";
//         gameOverModal.style.display = "flex";
//         return;
//     }

//     // food consume logic
//     if (head.x == food.x && head.y == food.y) {
//         blocks[`${food.x},${food.y}`]?.classList.remove("food");
//         food = {
//             x: Math.floor(Math.random() * rows),
//             y: Math.floor(Math.random() * cols),
//         };
//         blocks[`${food.x},${food.y}`]?.classList.add("food");
//         snake.unshift(head);

//         score += 10;
//         scoreElement.textContent = score;

//         if (score > highScore) {
//             highScore = score;
//             localStorage.setItem("highScore", JSON.stringify(highScore));
//         }
//     }

//     snake.forEach((seg) => {
//         blocks[`${seg.x},${seg.y}`].classList.remove("fill");
//     });
//     snake.unshift(head);
//     snake.pop();
//     snake.forEach((seg) => {
//         blocks[`${seg.x},${seg.y}`].classList.add("fill");
//     });
// }

// // intervalId = setInterval(() => {
// //     render();
// // }, 300);

// startButton.addEventListener("click", () => {
//     modal.style.display = "none";
//     intervalId = setInterval(() => {
//         render();
//     }, 200);
//     timerIntervalId = setInterval(() => {
//         let [min, sec] = time.split(":").map(Number);
//         if (sec == 59) {
//             min += 1;
//             sec = 0;
//         } else {
//             sec += 1;
//         }

//         time = `${min}:${sec}`;
//         timeElement.textContent = time;
//     }, 1000);
// });

// restartButton.addEventListener("click", restartGame);

// // game Restart Logic
// function restartGame() {
//     blocks[`${food.x},${food.y}`].classList.remove("food");
//     snake.forEach((seg) => {
//         blocks[`${seg.x},${seg.y}`].classList.remove("fill");
//     });

//     score = 0;
//     time = `00:00`;
//     scoreElement.textContent = score;
//     timeElement.textContent = time;
//     highScoreElement.textContent = highScore;
//     direction = "down";

//     modal.style.display = "none";
//     snake = [{ x: 1, y: 3 }];
//     food = {
//         x: Math.floor(Math.random() * rows),
//         y: Math.floor(Math.random() * cols),
//     };
//     intervalId = setInterval(() => {
//         render();
//     }, 200);
// }

// addEventListener("keydown", (e) => {
//     // console.log(e.key)
//     if (e.key == "ArrowUp") {
//         direction = "up";
//     } else if (e.key == "ArrowDown") {
//         direction = "down";
//     } else if (e.key == "ArrowRight") {
//         direction = "right";
//     } else if (e.key == "ArrowLeft") {
//         direction = "left";
//     }
// });


/* 
    This is the Optimised version of these above code.
*/


const board = document.querySelector(".board");
const startButton = document.querySelector(".btn-start");
const restartButton = document.querySelector(".btn-restart");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");

const highScoreElement = document.querySelector("#high-score");
const scoreElement = document.querySelector("#score");
const timeElement = document.querySelector("#time");

const blockSize = 30;

// GAME STATE
let highScore = Number(localStorage.getItem("highScore")) || 0;
let score = 0;
let time = 0;
let intervalId = null;
let timerIntervalId = null;

let rows = Math.floor(board.clientHeight / blockSize);
let cols = Math.floor(board.clientWidth / blockSize);

let blocks = [];
let snake = [{ x: 1, y: 3 }];
let direction = "right";
let nextDirection = "right";
let food = null;

// Direction mapping
const DIR = {
    up: { x: -1, y: 0 },
    down: { x: 1, y: 0 },
    left: { x: 0, y: -1 },
    right: { x: 0, y: 1 },
};

// Prevent reversing direction
const OPPOSITE = {
    up: "down",
    down: "up",
    left: "right",
    right: "left",
};

// Initialize UI
highScoreElement.textContent = highScore;

// Build board once
function initBoard() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const div = document.createElement("div");
            div.classList.add("block");
            board.appendChild(div);
            blocks[`${r},${c}`] = div;
        }
    }
}

initBoard();

// Place food at an empty spot
function spawnFood() {
    let x, y;
    do {
        x = Math.floor(Math.random() * rows);
        y = Math.floor(Math.random() * cols);
    } while (snake.some((seg) => seg.x === x && seg.y === y));

    food = { x, y };
    blocks[`${x},${y}`].classList.add("food");
}

// Update time display
function formatTime(sec) {
    let m = Math.floor(sec / 60)
        .toString()
        .padStart(2, "0");
    let s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

// GAME RENDER LOOP
function render() {
    direction = nextDirection;

    const head = {
        x: snake[0].x + DIR[direction].x,
        y: snake[0].y + DIR[direction].y,
    };

    // Wall collision
    if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
        return endGame();
    }

    // Self-collision
    if (snake.some((seg) => seg.x === head.x && seg.y === head.y)) {
        return endGame();
    }

    // Check food
    const ateFood = head.x === food.x && head.y === food.y;

    // Remove old snake blocks first for speed
    snake.forEach((seg) =>
        blocks[`${seg.x},${seg.y}`].classList.remove("fill")
    );

    snake.unshift(head);

    if (ateFood) {
        blocks[`${food.x},${food.y}`].classList.remove("food");
        spawnFood();
        score += 10;
        scoreElement.textContent = score;

        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore);
            highScoreElement.textContent = highScore;
        }
    } else {
        snake.pop();
    }

    // Draw updated snake
    snake.forEach((seg) => blocks[`${seg.x},${seg.y}`].classList.add("fill"));
}

function endGame() {
    clearInterval(intervalId);
    clearInterval(timerIntervalId);
    gameOverModal.style.display = "flex";
    startGameModal.style.display = "none";
    modal.style.display = "flex";
}

// START GAME
startButton.addEventListener("click", () => {
    modal.style.display = "none";

    spawnFood();

    intervalId = setInterval(render, 150);

    timerIntervalId = setInterval(() => {
        time++;
        timeElement.textContent = formatTime(time);
    }, 1000);
});

// RESTART
function restartGame() {
    // Clear board
    blocks[`${food.x},${food.y}`]?.classList.remove("food");
    snake.forEach((seg) =>
        blocks[`${seg.x},${seg.y}`]?.classList.remove("fill")
    );

    // Reset state
    snake = [{ x: 1, y: 3 }];
    direction = "right";
    nextDirection = "right";
    score = 0;
    time = 0;

    scoreElement.textContent = score;
    timeElement.textContent = "00:00";
    highScoreElement.textContent = highScore;

    modal.style.display = "none";

    spawnFood();
    intervalId = setInterval(render, 150);
    timerIntervalId = setInterval(() => {
        time++;
        timeElement.textContent = formatTime(time);
    }, 1000);
}

restartButton.addEventListener("click", restartGame);

// CONTROLS
window.addEventListener("keydown", (e) => {
    const keyMap = {
        ArrowUp: "up",
        ArrowDown: "down",
        ArrowLeft: "left",
        ArrowRight: "right",
    };
    if (!keyMap[e.key]) return;

    if (OPPOSITE[keyMap[e.key]] !== direction) {
        nextDirection = keyMap[e.key];
    }
});

