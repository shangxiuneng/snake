// 把地图分成小格子
var gridData = []
var tr = 30;
var td = 30; //

var snakeBody = 20;  // 蛇的身体大小

var directionNum = {
    left: {x: -1, y: 0, flag: "left"},
    right: {x: 1, y: 0, flag: "right"},
    top: {x: 0, y: -1, flag: "top"},
    bottom: {x: 0, y: 1, flag: "bottom"}
}


var snake = {
    direction: directionNum.right,
    snakePos: [
        {x: 0, y: 0, domContent: "", flag: "body"},
        {x: 1, y: 0, domContent: "", flag: "body"},
        {x: 2, y: 0, domContent: "", flag: "body"},
        {x: 3, y: 0, domContent: "", flag: "head"}  // 蛇的头
    ]
}

var food = {
    x: 0,
    y: 0,
    domContent: "",
}

var score = 0; // 得分

var timerStop = null;

// 绘制蛇的方法
function drawSnake(snake) {
    for (var i = 0; i < snake.snakePos.length; i++) {
        if (!snake.snakePos[i].domContent) {
            // 说明第一次绘制蛇
            snake.snakePos[i].domContent = document.createElement("div");
            snake.snakePos[i].domContent.style.position = "absolute";
            snake.snakePos[i].domContent.style.width = snakeBody + "px";
            snake.snakePos[i].domContent.style.height = snakeBody + "px";
            snake.snakePos[i].domContent.style.left = snake.snakePos[i].x * snakeBody + "px";
            snake.snakePos[i].domContent.style.top = snake.snakePos[i].y * snakeBody + "px";

            if (snake.snakePos[i].flag === "head") {
                // 说明是蛇的头
                snake.snakePos[i].domContent.style.background = `url('./images/snakeHead.png') center/contain no-repeat`;

                // 旋转蛇头
                switch (snake.direction.flag) {
                    case "top":
                        snake.snakePos[i].domContent.style.transform = "rotate(180deg)";
                        break;
                    case "bottom":
                        snake.snakePos[i].domContent.style.transform = "rotate(0deg)";
                        break;
                    case "left":
                        snake.snakePos[i].domContent.style.transform = "rotate(90deg)";
                        break;
                    case "right":
                        snake.snakePos[i].domContent.style.transform = "rotate(-90deg)";
                        break;
                }
            } else {
                // 说明是蛇的身体
                snake.snakePos[i].domContent.style.background = "#9ddbb1";
                snake.snakePos[i].domContent.style.borderRadius = '50%';
            }

            // 创建好的dome元素添加到页面上
            document.querySelector(".container").appendChild(snake.snakePos[i].domContent);

        }
    }
}

// 绘制食物
function drawFood() {
    // 食物的位置随机 不能生成在外面 不能生成在蛇身上
    while (true) {
        var isRepeat = false;

        food.x = Math.floor(Math.random() * (tr - 1));
        food.y = Math.floor(Math.random() * (td - 1));

        console.log(food)

        for (var i = 0; i < snake.snakePos; i++) {
            if (food.x === snake.snakePos[i].x && food.y === snake.snakePos[i].y) {
                isRepeat = true;
                break;
            }
        }
        if (!isRepeat) {
            break;
        }
    }

    if (!food.domContent) {
        food.domContent = document.createElement("div");
        food.domContent.style.width = snakeBody + "px";
        food.domContent.style.height = snakeBody + "px";
        food.domContent.style.position = "absolute";
        food.domContent.style.background = `url('./images/food.png') center/contain no-repeat`
    }

    food.domContent.style.left = food.x * snakeBody + "px";
    food.domContent.style.top = food.y * snakeBody + "px";

    // 创建好的dome元素添加到页面上
    document.querySelector(".container").appendChild(food.domContent);
}

function initGame() {

    console.log("initGame");

    // 初始化地图
    for (var i = 0; i < tr; i++) {
        for (var j = 0; j < td; j++) {
            gridData.push({
                x: j,
                y: i
            })
        }
    }
    // 绘制蛇
    drawSnake(snake);

    // 绘制食物
    drawFood();
}

// 碰撞检测
function isCollide(newHead) {

    var collideCheckInfo = {
        isCollide: false,
        isEat: false
    }

    // 是否碰到墙壁
    if (newHead.x < 0 || newHead.x >= td || newHead.y < 0 || newHead.y >= tr) {
        console.log("碰墙")
        collideCheckInfo.isCollide = true
        return collideCheckInfo
    }

    // 是否碰到自己
    for (var i = 0; i < snake.snakePos.length; i++) {
        if (snake.snakePos[i].x === newHead.x && snake.snakePos[i].y === newHead.y) {
            console.log("碰到自己")
            collideCheckInfo.isCollide = true
            return collideCheckInfo
        }
    }

    // 是否吃到
    if (newHead.x === food.x && newHead.y === food.y) {
        score++;
        document.querySelector(`.score`).innerHTML = "得分:" + score;
        collideCheckInfo.isEat = true
    }

    return collideCheckInfo
}

function snakeMove() {

    var oldHead = snake.snakePos[snake.snakePos.length - 1];

    var newHead = {
        document: "",
        x: oldHead.x + snake.direction.x,
        y: oldHead.y + snake.direction.y,
        flag: "head"
    }

    // 碰撞检测
    var collideCheckRes = isCollide(newHead);

    if (collideCheckRes.isCollide) {

        if (window.confirm(`游戏结束 是否要重新开始游戏 得分为${score}`)) {
            // 重置信息
            document.querySelector(`.container`).innerHTML = ""
            socre = 0;
            snake = {
                direction: directionNum.right,
                snakePos: [
                    {x: 0, y: 0, domContent: "", flag: "body"},
                    {x: 1, y: 0, domContent: "", flag: "body"},
                    {x: 2, y: 0, domContent: "", flag: "body"},
                    {x: 3, y: 0, domContent: "", flag: "head"}  // 蛇的头
                ]
            }

            food = {
                x: 0,
                y: 0,
                domContent: "",
            }
            initGame()
        } else {
            document.onkeydown = null;
            // 清除定时器
            clearInterval(timerStop);
        }

    }

    // 将旧的头修改身体
    oldHead.flag = "body";
    oldHead.domContent.style.background = "#9ddbb1";
    oldHead.domContent.style.borderRadius = '50%';

    snake.snakePos.push(newHead);

    // 判断是否吃到东西
    if (collideCheckRes.isEat) {
        // 重新生成食物
        drawFood();
    } else {
        // 移除最后一个元素
        document.querySelector('.container').removeChild(snake.snakePos[0].domContent);
        snake.snakePos.shift();
    }

    drawSnake(snake);
}

function startGame() {
    timerStop = setInterval(function () {
        snakeMove()
    }, 1000)
}

function bindEvent() {
    document.onkeydown = function (e) {
        console.log("键盘被按下");
        if (e.key === "ArrowUp" && snake.direction.flag !== "bottom") {
            snake.direction = directionNum.top
        }
        if (e.key === "ArrowDown" && snake.direction.flag !== "top") {
            snake.direction = directionNum.bottom
        }
        if (e.key === "ArrowLeft" && snake.direction.flag !== "right") {
            snake.direction = directionNum.left
        }
        if (e.key === "ArrowRight" && snake.direction.flag !== "left") {
            snake.direction = directionNum.right
        }

        //snakeMove();
    }

    startGame();

}

function main() {
    let startBtn = document.getElementById("startBtn");
    startBtn.onclick = function (e) {
        console.log("startBtn 点击")
        // 阻止冒泡
        initGame();
        bindEvent();
    }

    let pauseBtn = document.getElementById("pauseBtn");
    startBtn.onclick = function (e) {
        console.log("startBtn 点击")
        // 阻止冒泡
        initGame();
        bindEvent();
    }


}


// 调用主方法
main();