let canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

document.body.appendChild(canvas);
let ctx = canvas.getContext('2d');
let keyPressed = false;
let keyUpPressed = false;
let keyDownPressed = false;
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

function kotak() {
    this.px = 50;
    this.py = 50;
    this.w = 50;
    this.h = 50;
    this.angle = 0;
    this.rotateSpeed = 0;
    this.gravity = 1;
    this.gravitySpeedy = 0;
    this.speedUp = 0;
    this.speedUpIncrement = 3;
    this.speedUp = 0;
    this.color = 'red';
    this.isGoUp = false;



    this.show = function () {
        this.cx = this.px + this.w / 2;
        this.cy = this.py + this.h / 2;
        ctx.save();
        ctx.translate(this.cx, this.cy);


        ctx.rotate(this.angle);
        ctx.translate(-this.cx, -this.cy);
        ctx.fillStyle = this.color;
        ctx.fillRect(this.px,
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

let flappy = new kotak();

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
}
let interval = setInterval(loop, 20);