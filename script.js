const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.body.appendChild(canvas);

// Function to resize the canvas and fill the screen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Initialize canvas and listen for resize
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// Loading assets
const birdImg = new Image();
birdImg.src = "assets/bird.png";

const bgImg = new Image();
bgImg.src = "assets/bg.png";

const upperPipeImg = new Image();
upperPipeImg.src = "assets/upperPipe.png";

const lowerPipeImg = new Image();
lowerPipeImg.src = "assets/lowerPipe.png";

// Bird properties
const bird = {
    x: 100,
    y: 100,
    size: 30,
    gravity: 0.3,
    lift: -5,
    velocity: 0,
    termainalVelocity: 0.4
};

// Pipe properties
const pipeWidth = 75;
const gapHeight = 150;
const pipeSpeed = 3;
let upperPipes = [];
let lowerPipes = [];

// Game state
let isGameOver = false;
let  score = 0;
let gameFrameId

function init() {
    // Reset bird properties
    bird.y = 100;  // Set bird's vertical position to the starting position
    bird.velocity = 0;  // Reset bird's velocity to 0
    bird.gravity = 0.3;  // Reset gravity (optional if it's being changed dynamically)
    bird.lift = -5;  // Reset lift (optional if it's being changed dynamically)
  
    // Reset pipes and score
    upperPipes = [];
    lowerPipes = [];
    score = 0;  // Reset score to 0
  
    // Reset game state
    isGameOver = false;  // Game over flag is reset
}


// Spawn new pipes
function spawnPipe() {
    const topHeight = Math.random() * (canvas.height - gapHeight - 200) + 100;
    const bottomY = topHeight + gapHeight;

    upperPipes.push({
        x: canvas.width,
        y: 0,
        width: pipeWidth,
        height: topHeight,
    });

    lowerPipes.push({
        x: canvas.width,
        y: bottomY,
        width: pipeWidth,
        height: canvas.height - bottomY,
    });
}

// Update bird and pipes
function update() {
    if (isGameOver) return;

    // Bird physics
    bird.velocity += bird.gravity;
    // Limit velocity to terminal velocity (to prevent bird falling too fast)
    if (bird.velocity > bird.terminalVelocity) {
        bird.velocity = bird.terminalVelocity;
    }

    bird.y += bird.velocity;

    // Prevent the bird from going off the screen
    if (bird.y + bird.size > canvas.height || bird.y < 0) {
        gameOver();
    }

    // Update pipes
    upperPipes.forEach(pipe => (pipe.x -= pipeSpeed));
    lowerPipes.forEach(pipe => (pipe.x -= pipeSpeed));

    // Remove pipes that go off-screen
    upperPipes = upperPipes.filter(pipe => pipe.x + pipeWidth > 0);
    lowerPipes = lowerPipes.filter(pipe => pipe.x + pipeWidth > 0);

    // Spawn new pipes
    if (upperPipes.length === 0 || upperPipes[upperPipes.length - 1].x < canvas.width - 300) {
        spawnPipe();
    }

      // Check for score
      upperPipes.forEach(pipe => {
        if (pipe.x + pipeWidth < bird.x && !pipe.passed) {
            pipe.passed = true;
            score += 50;
        }
    });


    checkCollisions();
}

// Check for collisions
function checkCollisions() {
    upperPipes.forEach(pipe => {
        const isCollidingX = bird.x + bird.size > pipe.x && bird.x < pipe.x + pipe.width;
        const isCollidingY = bird.y < pipe.height;

        if (isCollidingX && isCollidingY) {
            gameOver();
        }
    });

    lowerPipes.forEach(pipe => {
        const isCollidingX = bird.x + bird.size > pipe.x && bird.x < pipe.x + pipe.width;
        const isCollidingY = bird.y + bird.size > pipe.y;

        if (isCollidingX && isCollidingY) {
            gameOver();
        }
    });
}

// gameover case
function gameOver() {
    isGameOver = true;
    showGameOverModal();
    cancelAnimationFrame(gameFrameId); // Stop the game loop when game over
}

// Show the game over modal and score
function showGameOverModal() {
    const modal = document.getElementById('gameOverModal');
    const scoreElement = document.getElementById('finalScore');
    scoreElement.textContent = `${Math.floor(score)}`;
    $('#gameOverModal').modal('show');
}

// Hide the game over modal
function hideGameOverModal() {
    $('#gameOverModal').modal('hide');
}

// Handle game restart
function restartGame() {
    hideGameOverModal(); // Hide the modal
    init();  // Reset game state (reset bird, pipes, score)
    console.log(`Bird Gravity: ${bird.gravity}, Bird Y Position: ${bird.y}`);

    
}

// Draw bird, pipes, and background
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);


    // Draw "Flappy Bird" text
    ctx.font = "bold 50px Arial";  // Set font size and style
    ctx.fillStyle = "white";  // Set text color
    ctx.textAlign = "left";  // Align text to the left
    ctx.textBaseline = "top";  // Align text to the top
    ctx.fillText("Flappy Bird", 20, 20);  // Draw the text at coordinates (20, 20)

    // Draw bird
    ctx.drawImage(birdImg, bird.x, bird.y, bird.size, bird.size);

    // Draw upper pipes
    upperPipes.forEach(pipe => {
        ctx.drawImage(upperPipeImg, pipe.x, pipe.y, pipe.width, pipe.height);
    });

    // Draw lower pipes
    lowerPipes.forEach(pipe => {
        ctx.drawImage(lowerPipeImg, pipe.x, pipe.y, pipe.width, pipe.height);
    });

     // Draw score
     ctx.font = "bold 30px Arial";
     ctx.fillText("Score: " + score, canvas.width - 180, 50);

}

// Main game loop
function loop() {
    update();
    draw();
    gameFrameId = requestAnimationFrame(loop); 
}

// Handle bird jump
window.addEventListener("keydown", e => {
    if (e.code === "Space" && !isGameOver) {
        bird.velocity = bird.lift;
    }
});

// Handle bird double jump
window.addEventListener("keydown", e => {
    if (e.code === "KeyE" && !isGameOver) {
        bird.velocity = bird.lift * 2;
    }
});

window.addEventListener("touchstart", e => {
    e.preventDefault(); // Prevents the default action of the touch event (e.g., scrolling)
    if (!isGameOver) {
        bird.velocity = bird.lift; // Makes the bird jump
    }
});

// prevent scrolling on touch hold and move
window.addEventListener("touchmove", e => {
    e.preventDefault(); // Prevents touch move scrolling
});

// Start the game
init();
loop();
