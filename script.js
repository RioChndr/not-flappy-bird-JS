let canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.body.appendChild(canvas);
let ctx = canvas.getContext('2d');
let keyPressed = false;
let keyUpPressed = false;
let keyDownPressed = false;

let config = {
    frameRefreshObstacle: 700,
    marginObstacle: 300,
    offsetRadiusBird: 10,
}

function start() {
    window.addEventListener('keydown', function (e) {
        keyPressed = e.keyCode;

        keyDownPressed = e.keyCode;
    })
    window.addEventListener('keyup', function (e) {
        keyPressed = false;
        keyUpPressed = e.keyCode;
    })
}

function getKeyUpPressed() {
    let key = keyUpPressed;
    keyUpPressed = false;
    return key;
}
function getKeyDownPressed() {
    let key = keyDownPressed;
    keyDownPressed = false;
    return key;
}
function getKeyPressed() {
    let key = keyPressed;
    keyPressed = false;
    return key;
}


start();

function Bird(assetImg) {
    this.init = function(){
        this.px = 100;
        this.py = 100;
        this.w = 100;
        this.h = 100;
        this.cx = 0;
        this.cy = 0;
        this.radius = (this.w / 2) - config.offsetRadiusBird;
        this.angle = 0;
        this.rotateSpeed = 0;
        this.gravity = 1;
        this.gravitySpeedy = 0;
        this.speedUp = 0;
        this.speedUpIncrement = 3;
        this.speedUp = 0;
        this.color = 'red';
        this.isGoUp = false;
        this.birdImg = new Image();
        this.birdImg.src = assetImg;
    }
    this.init();
    
    this.show = function () {

        ctx.save();
        ctx.translate(this.cx, this.cy);
        ctx.rotate(this.angle);
        ctx.translate(-this.cx, -this.cy);
        ctx.fillStyle = this.color;
        ctx.drawImage(this.birdImg, this.px,
            this.py,
            this.w,
            this.h);
        ctx.restore();
    };
    this.move = function () {
        if (this.isGoUp) {
            this.up();
        } else {
            this.fly();
        }
        this.cx = this.px + (this.w / 2);
        this.cy = this.py + (this.h / 2);
    }
    this.fly = function () {
        this.speedUp = 0;
        if (this.angle < Math.PI / 4) {
            this.angle += 3 * Math.PI / 180;
        }
        this.gravitySpeedy += this.gravity;
        this.py += this.gravitySpeedy;

    };
    this.up = function () {
        if (this.angle > -Math.PI / 4) {
            this.angle -= 10 * Math.PI / 180;
        }
        if (this.speedUp > 20) {
            this.isGoUp = false;
        }
        this.gravitySpeedy = 0;
        this.speedUp += this.speedUpIncrement;
        this.py -= this.speedUp;
    }
    this.reset = function () {
        this.init();
    }
}

function Obstacle(assetImg) {
    this.px = 0;
    this.py = 0;
    this.img = new Image();
    this.img.src = assetImg;
    this.scale = 2;
    this.w = this.img.width * this.scale;
    this.h = this.img.height * this.scale;
    this.show = function () {
        // ctx.fillStyle = 'black';
        // ctx.fillRect(this.px, this.py, this.w, this.h);
        ctx.drawImage(this.img, this.px, this.py, this.w, this.h);
    }
}

function getDotCoordinate(objek) {
    return {
        lt: [objek.px, objek.py],
        rt: [objek.px + objek.w, objek.py],
        lb: [objek.px, objek.py + objek.h],
        rb: [objek.px + objek.w, objek.py + objek.h],
        px: objek.px,
        py: objek.py,
        w: objek.w,
        h: objek.h
    }
}

function ObstacleController() {
    this.Obstacles = [];
    this.bird = null;
    this.isCollideToBird = false;
    this.createObs = function () {
        let randomPosY = (Math.floor(Math.random() * canvas.height / 3)) + (canvas.height / 3) + 200;

        let obsTop = new Obstacle('assets/obstacle_top.png');
        let obsBot = new Obstacle('assets/obstacle_bot.png');

        obsTop.px = canvas.width - 100;
        obsTop.py = randomPosY - obsTop.h - config.marginObstacle;
        obsBot.px = canvas.width - 100;
        obsBot.py = randomPosY;
        this.Obstacles.push({
            'top': obsTop,
            'bottom': obsBot
        });
    }

    this.moveObstacles = function () {
        let bird = this.bird;
        for (let i = 0; i < this.Obstacles.length; i++) {
            this.Obstacles[i].top.px -= 10;
            this.Obstacles[i].bottom.px -= 10;
            if (this.Obstacles[i].top.px < -100) {
                this.Obstacles.splice(i, 1);
            }
            if (this.Obstacles[i].top.px < bird.px + bird.w + 100) {
                console.log(i);
                let isInsideTop = this.isCollideCircleBox(bird, this.Obstacles[i].top);
                let isInsideBot = this.isCollideCircleBox(bird, this.Obstacles[i].bottom);
                if (isInsideTop || isInsideBot) {
                    this.isCollideToBird = true;
                }
            }
            // this.Obstacles[i].top.show();
            // this.Obstacles[i].bottom.show();

        }
        // console.log("jumlah obstacle = " + this.Obstacles.length);
    }
    this.setBird = function (bird) {
        this.bird = bird;
    }

    this.showObstacles = function () {
        this.Obstacles.forEach(obs => {
            obs.top.show();
            obs.bottom.show();
        });
    }

    this.isCollide = function () {
        return this.isCollideToBird
    }
    this.isCollideBox = function (obj1, obj2) {
        function isInsideBox(dot, box) {
            return dot[0] > box.px && dot[0] < box.px + box.w &&
                dot[1] > box.py && dot[1] < box.py + box.h;
        }
        let dotObj1 = getDotCoordinate(obj1);
        // let dotObj2 = getDotCoordinate(obj2);
        let dotToDetect = ['rt', 'rb', 'lb', 'lt'];
        for (let i = 0; i < dotToDetect.length; i++) {
            const dotPos = dotToDetect[i];
            let isCOLL = isInsideBox(dotObj1[dotPos], obj2);
            if (isCOLL) {
                return true;
            }
            break;
        };
        return false;
    }

    this.isCollideCircleBox = function (circle, box) {
        let testX = circle.cx;
        let testY = circle.cy;

        if (circle.cx < box.px) testX = box.px;
        else if (circle.cx > box.px + box.w) testX = box.px + box.w;
        if (circle.cy < box.py) testY = box.py;
        else if (circle.cy > box.py + box.h) testY = box.py + box.h;

        // get Distance from closest edges;
        let distX = circle.cx - testX;
        let distY = circle.cy - testY;
        let distance = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));
        if (distance <= circle.radius) {
            return true;
        }
        return false;
    }

    this.reset = function () {
        this.Obstacles = [];
        this.bird = null;
        this.isCollideToBird = false;
    }
}
let flappy = new Bird('assets/bird.png');;
let obstacleController = new ObstacleController()
let last;
let frames = 0;

function Game() {
    this.score = 0;
    this.isRunning = false;
    this.isLose = false;

    this.newGame = function () {
        this.score = 0;
        this.isRunning = false;
    }

    this.start = function () {
        this.score = 0;
        this.isRunning = true;
        this.isLose = false;
    }

    this.showUI = function () {
        if (!this.isRunning && !this.isLose) {
            this.showStartInfo();
        } else if (this.isRunning && !this.isLose) {
            this.showScore();
        } else if (this.isLose === true && !this.isRunning) {
            this.showLoseInfo();
            this.showStartInfo();
        }
    }
    this.showStartInfo = function () {
        ctx.font = "50px Arial";
        ctx.fillStyle = 'green';
        ctx.textAlign = 'center';
        ctx.fillText("Tekan ENTER untuk Mulai !! 😊😊", canvas.width / 2, canvas.height / 2);
    }
    this.showScore = function () {

        ctx.font = "50px Arial";
        ctx.fillStyle = 'green';
        ctx.textAlign = 'center';
        ctx.fillText(this.score, canvas.width / 2, canvas.height / 4);
    }
    this.showLoseInfo = function () {
        ctx.font = "50px Arial";
        ctx.fillStyle = 'red';
        ctx.textAlign = 'center';
        ctx.fillText("Yah.. Anda Kalah 😭. Score anda adalah : " + this.score, canvas.width / 2, canvas.height / 2 - 100);

    }
    this.playerLose = function () {
        this.isRunning = false;
        this.isLose = true;
    }
}

let game = new Game();

function loop(timestamp) {
    frames++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if ((!last || timestamp - last > config.frameRefreshObstacle) && game.isRunning == true) {
        // console.log("pop");
        obstacleController.createObs();
        last = timestamp;
        game.score++;
    }

    if (game.isRunning === true) {
        if (keyDownPressed == 38 || keyDownPressed == 87) {
            flappy.isGoUp = true;
            keyDownPressed = false;
        }
        if (keyUpPressed == 38 || keyUpPressed == 87) {
            flappy.isGoUp = false;
            keyUpPressed = false;
        }
        flappy.move();

        obstacleController.setBird(flappy);
        obstacleController.moveObstacles();
        // obstacleController.showObstacles();
        if (obstacleController.isCollide() || flappy.cy > canvas.height) {
            console.log('you lose');
            game.playerLose();
        }
    } else {
        if (keyUpPressed == 13) {
            game.start();
            obstacleController.reset();
            flappy.reset();
            keyUpPressed = null;
        }
    }
    flappy.show();
    obstacleController.showObstacles();
    game.showUI();

    window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);