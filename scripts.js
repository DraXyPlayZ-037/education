document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    canvas.width = 600;
    canvas.height = 600;

    let scale = 20;
    let rows = canvas.height / scale;
    let columns = canvas.width / scale;
    let snake, apple, gameRunning = false;
    let score = 0,
        highScore = localStorage.getItem("highScore") || 0;

    function drawBackground() {
        ctx.fillStyle = "#222";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function drawStartScreen() {
        drawBackground();
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText("Press Any Key to Start", 150, 300);
    }

    function startGame() {
        snake = new Snake();
        apple = new Apple();
        score = 0;
        gameRunning = true;
        gameLoop();
    }

    function gameLoop() {
        if (!gameRunning) return;
        setTimeout(() => {
            drawBackground();
            apple.draw();
            snake.update();
            snake.draw();
            drawScore();
            gameLoop();
        }, 1000 / 10);
    }

    function drawScore() {
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText(`Score: ${score}`, 20, 30);
        ctx.fillText(`High Score: ${highScore}`, 450, 30);
    }

    function Snake() {
        this.snakeArray = [{ x: 5, y: 5 }];
        this.direction = "right";

        this.update = function() {
            let head = {...this.snakeArray[0] };

            if (this.direction === "right") head.x++;
            else if (this.direction === "left") head.x--;
            else if (this.direction === "up") head.y--;
            else if (this.direction === "down") head.y++;

            this.snakeArray.unshift(head);
            if (head.x === apple.x && head.y === apple.y) {
                score++;
                apple = new Apple();
                if (score > highScore) {
                    highScore = score;
                    localStorage.setItem("highScore", highScore);
                }
            } else {
                this.snakeArray.pop();
            }

            if (this.checkCollision()) {
                gameRunning = false;
                drawStartScreen();
            }
        };

        this.draw = function() {
            ctx.fillStyle = "lime";
            this.snakeArray.forEach((segment, index) => {
                ctx.fillRect(segment.x * scale, segment.y * scale, scale, scale);
                if (index === 0) drawSnakeEyes(segment);
            });
        };

        function drawSnakeEyes(head) {
            ctx.fillStyle = "black";
            ctx.fillRect(head.x * scale + 5, head.y * scale + 5, 5, 5);
            ctx.fillRect(head.x * scale + 12, head.y * scale + 5, 5, 5);
        }

        this.checkCollision = function() {
            let head = this.snakeArray[0];
            if (head.x < 0 || head.y < 0 || head.x >= columns || head.y >= rows) return true;
            return this.snakeArray.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
        };
    }

    function Apple() {
        this.x = Math.floor(Math.random() * columns);
        this.y = Math.floor(Math.random() * rows);

        this.draw = function() {
            ctx.fillStyle = "red";
            ctx.beginPath();
            ctx.arc(this.x * scale + scale / 2, this.y * scale + scale / 2, scale / 2, 0, Math.PI * 2);
            ctx.fill();
        };
    }

    window.addEventListener("keydown", function(event) {
        if (!gameRunning) return startGame();
        let keyMap = {
            "ArrowLeft": "left",
            "a": "left",
            "ArrowRight": "right",
            "d": "right",
            "ArrowUp": "up",
            "w": "up",
            "ArrowDown": "down",
            "s": "down"
        };
        let newDirection = keyMap[event.key];
        if (newDirection &&
            ((newDirection === "left" && snake.direction !== "right") ||
                (newDirection === "right" && snake.direction !== "left") ||
                (newDirection === "up" && snake.direction !== "down") ||
                (newDirection === "down" && snake.direction !== "up"))) {
            snake.direction = newDirection;
        }
    });

    drawStartScreen();
});