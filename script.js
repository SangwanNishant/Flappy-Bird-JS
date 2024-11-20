const canvas = document.getElementById("gameCanvas")
document.body.appendChild(canvas)
const ctx = canvas.getContext("2d");

// Function to resize canvas to fit the window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Initial canvas size
resizeCanvas();

// Update canvas size on window resize
window.addEventListener('resize', () => {
    resizeCanvas();
});

// setting game variables

let birdY = 140
let birdVelocity = 0
let gravity = 0.2
let isGameOver = false

// drawing a basic bird object

function drawBird(){
    ctx.fillStyle = "lightblue"
    ctx.fillRect(200,birdY,30,30) // bird is square here 30x30 and 50 birdY are position
}

// working on pipes

let pipes=[]
let pipeWidth = 50
let gapHeight = 150
let pipeSpeed = 2

// generate pipes
function generatePipe(){
    const topHeight = Math.random() * (canvas.height - gapHeight - 200) + 50;
    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: topHeight + gapHeight,
    });
}

// Draw Pipes
function drawPipes() {
    ctx.fillStyle = 'green';
    pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, pipeWidth, pipe.top); // Top pipe
        ctx.fillRect(pipe.x, pipe.bottom, pipeWidth, canvas.height - pipe.bottom); // Bottom pipe
    });
}

// Update Pipes
function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= pipeSpeed;

        // Check for collision
        if (50 + 30 > pipe.x && 50 < pipe.x + pipeWidth &&
            (birdY < pipe.top || birdY + 30 > pipe.bottom)) {
            isGameOver = true;
        }
    });

    // Remove pipes that go off-screen
    pipes = pipes.filter(pipe => pipe.x + pipeWidth > 0);
}

// Add pipe generation every 2 seconds
setInterval(generatePipe, 2000);


// update game state

function update(){
    if(!isGameOver){
        birdVelocity += gravity
        birdY += birdVelocity

        // check if bird fell of the canvas
        if(birdY + 30 > canvas.height){
            isGameOver = true
        }

    updatePipes()

    }
}  

// draw bird

function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    drawBird()
    drawPipes()
}

// GAME LOOP    

function gameLoop(){

    update()
    draw()
    if(!isGameOver){
        requestAnimationFrame(gameLoop)
    }else {
        alert('Game Over! Refresh to try again.');
    }

}

gameLoop()

// event listener for flap

document.addEventListener('keydown',(e)=>{
    if(e.code === 'Space'){
        birdVelocity = -8
    }
})


