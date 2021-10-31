let canvas = document.getElementById('paper')
let pen = canvas.getContext('2d')
let scoregame = document.getElementById('gameScore')


let bird = new Image();
bird.src = "image/bird1.png"
let background = new Image();
background.src = "image/avata.jpg"
let topButton = new Image()
topButton.src = "image/ongtren.png"
let bottomButton = new Image()
bottomButton.src = "image/ongduoi.png"
let start_screen = new Image()
start_screen.src = "image/screen.jpeg"
let fly = new Audio()
fly.src = "image/jump.mp3"
let winM = new Audio()
winM.src = "image/winmusic.mp3"
let end = new Audio()
end.src = "image/thua.mp3"
//Tạo lớp con chim
function FlappyBird(x,y) {
    this.x = x
    this.y = y
    this.width = 40
    this.height = 40
    this.speed = 2
    this.render = function() {
        pen.beginPath()
        pen.drawImage(background,0,0,500,500)
        pen.drawImage(bird,this.x,this.y,this.width,this.height)
        pen.closePath()
    }
    this.move = function() {
        this.y += this.speed
    }
}

// tạo lớp vật cản
function Pipe(xx,yy) {
    this.xx = xx
    this.yy = yy
    this.space = 150
    this.width = topButton.width
    this.height = topButton.height
    this.speed = -2

    this.draw = function(canvas) {
        let pen = canvas.getContext('2d')
        pen.drawImage(topButton,this.xx,this.yy,this.width,this.height)
        pen.drawImage(bottomButton,this.xx,this.yy + this.space + this.height,this.width,bottomButton.height)
    }
    this.move = function(){
        this.xx += this.speed
    }
}


let score = 0
let gameOver = false;
let pipes = []


let flappyBird = new FlappyBird(120,canvas.height/2)
function flap_bird() {
    if(gameOver === false) {
        flappyBird.render()
        flappyBird.move()
    }
}
function topMove() {
    flappyBird.y -= 50
}
document.addEventListener("keydown",topMove)

console.log(topButton.height + "," + bottomButton.height)



//thêm vào mảng
function addArrPipes() {
    for (let i = 0; i < 1 ; i++) {
        let pipe = new Pipe(canvas.width,0)
        pipe.draw(canvas)
        pipes.push(pipe)
    }
}
addArrPipes()

function movePipes() {
    if(gameOver === false) {
        for (let i = 0; i < pipes.length; i++) {
            pipes[i].draw(canvas)
            pipes[i].move()
            if (pipes[i].xx === canvas.width / 2) {
                pipes.push(new Pipe(canvas.width, randomNumber(250, 500)))
            }
            if (flappyBird.y + flappyBird.height === canvas.height ||  flappyBird.y === 0) {
                fly.play()
                gameOver = true
            }else if(flappyBird.x + flappyBird.width >= pipes[i].xx && flappyBird.x <= pipes[i].xx +  pipes[i].width &&
                flappyBird.y  <= pipes[i].height + pipes[i].yy) {
                fly.play()
                gameOver = true
            }else if(flappyBird.x + flappyBird.width >= pipes[i].xx && flappyBird.x <= pipes[i].xx +
                pipes[i].width && flappyBird.y + flappyBird.height >= pipes[i].height + pipes[i].yy + 150) {
                fly.play()
                gameOver = true
            }
            if(flappyBird.x === pipes[i].xx + pipes[i].width ) {
                score += 10
            }
            if(score === 300) {
                winM.play()
                alert("YOUR WIN")
                return
            }
            scoregame.innerHTML = "Score : " + score
        }
    }

}

function randomNumber(min,max) {
    return  Math.floor(Math.random()*(max - min) - min)
}

function drawScreen() {
    if(gameOver === false) {
        pen.drawImage(start_screen, 0, 0, 500, 500)
        requestAnimationFrame(drawScreen)
    } else{
        end.play()
        pen.beginPath()
        pen.font = "50px Verdana";
        pen.fillStyle = "orange"
        pen.fillText("GAME OVER",100,150)
        pen.font = "30px Verdana";
        pen.fillText("your score : " + score,130,180)
        score = 0
        pipes = []
        flappyBird.speed = 0
    }
}
drawScreen()


function runGame() {
    flap_bird()
    movePipes()
    requestAnimationFrame(runGame)
}
function screenStart() {

    runGame()
}
canvas.addEventListener("click",screenStart,false)