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
    marginObstacle: 300
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
    this.px = 50;
    this.py = 50;
    this.w = 100;
    this.h = 100;
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



    this.show = function () {
        this.cx = this.px + this.w / 2;
        this.cy = this.py + this.h / 2;
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

let flappy = new Bird('assets/bird.png');

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
                let isInsideTop = this.isInside(bird, this.Obstacles[i].top);
                let isInsideBot = this.isInside(bird, this.Obstacles[i].bottom);
                if (isInsideTop || isInsideBot) {
                    this.isCollideToBird = true;
                }
            }
            this.Obstacles[i].top.show();
            this.Obstacles[i].bottom.show();

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
    this.isInside = function (obj1, obj2) {
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
}

let obstacleController = new ObstacleController()
let last;
let frames = 0;
function loop(timestamp) {
    frames++;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!last || timestamp - last > config.frameRefreshObstacle) {
        // console.log("pop");
        obstacleController.createObs();
        last = timestamp;
    }

    if ((keyDownPressed == 38 || keyDownPressed == 87) && flappy.isGoUp == false) {
        flappy.isGoUp = true;
        keyDownPressed = false;
    }
    if (keyUpPressed == 38 || keyUpPressed == 87) {
        flappy.isGoUp = false;
        keyUpPressed = false;
    }
    flappy.move();
    flappy.show();
    obstacleController.setBird(flappy);
    obstacleController.moveObstacles();
    // obstacleController.showObstacles();
    if (obstacleController.isCollide()) {
        alert("you FUCKING LOSE");
        // console.log("kalah")
    };

    window.requestAnimationFrame(loop);
}
window.requestAnimationFrame(loop);