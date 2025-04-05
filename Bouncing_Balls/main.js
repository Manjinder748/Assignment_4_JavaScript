const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const ballCountText = document.getElementById('ballCount');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function random(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function Shape(x, y, velX, velY, exists) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = exists;
}

function Ball(x, y, velX, velY, color, size) {
  Shape.call(this, x, y, velX, velY, true);
  this.color = color;
  this.size = size;
}
Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

Ball.prototype.draw = function () {
  if (!this.exists) return;
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
};

Ball.prototype.update = function () {
  if (!this.exists) return;

  if ((this.x + this.size) >= canvas.width || (this.x - this.size) <= 0) {
    this.velX = -this.velX;
  }

  if ((this.y + this.size) >= canvas.height || (this.y - this.size) <= 0) {
    this.velY = -this.velY;
  }

  this.x += this.velX;
  this.y += this.velY;
};

Ball.prototype.collisionDetect = function () {
  for (let j = 0; j < balls.length; j++) {
    if (!(this === balls[j]) && balls[j].exists) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        this.color = balls[j].color = `rgb(${random(0,255)}, ${random(0,255)}, ${random(0,255)})`;
      }
    }
  }
};

function EvilCircle(x, y) {
  Shape.call(this, x, y, 20, 20, true);
  this.color = 'white';
  this.size = 20;
}
EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;

EvilCircle.prototype.draw = function () {
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
};

EvilCircle.prototype.checkBounds = function () {
  if ((this.x + this.size) >= canvas.width) this.x = canvas.width - this.size;
  if ((this.x - this.size) <= 0) this.x = this.size;
  if ((this.y + this.size) >= canvas.height) this.y = canvas.height - this.size;
  if ((this.y - this.size) <= 0) this.y = this.size;
};

EvilCircle.prototype.setControls = function () {
  let _this = this;
  window.addEventListener('keydown', function (e) {
    switch (e.key) {
      case 'a': _this.x -= _this.velX; break;
      case 'd': _this.x += _this.velX; break;
      case 'w': _this.y -= _this.velY; break;
      case 's': _this.y += _this.velY; break;
    }
  });
};

EvilCircle.prototype.collisionDetect = function () {
  for (let j = 0; j < balls.length; j++) {
    if (balls[j].exists) {
      const dx = this.x - balls[j].x;
      const dy = this.y - balls[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].exists = false;
        ballCount--;
        ballCountText.textContent = ballCount;
      }
    }
  }
};

let balls = [];
let ballCount = 25;

while (balls.length < ballCount) {
  const size = random(10, 20);
  let ball = new Ball(
    random(size, canvas.width - size),
    random(size, canvas.height - size),
    random(-7, 7),
    random(-7, 7),
    `rgb(${random(0,255)}, ${random(0,255)}, ${random(0,255)})`,
    size
  );
  balls.push(ball);
}
ballCountText.textContent = ballCount;

let evil = new EvilCircle(canvas.width / 2, canvas.height / 2);
evil.setControls();

function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let ball of balls) {
    if (ball.exists) {
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }
  }

  evil.draw();
  evil.checkBounds();
  evil.collisionDetect();

  requestAnimationFrame(loop);
}

loop();
