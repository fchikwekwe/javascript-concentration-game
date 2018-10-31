var resetButton = document.getElementById("reset-button");
var gameSquares = [];
var firstSquare = null;

var colors = [];
for (var i=0; i < 10; i++) {
    colors.push('square-' + i);
}

function random(n) {
    return Math.floor(Math.random() * n);
}

function getSomeColors() {
    var colorscopy = colors.slice();
    var randomColors = [];
    for (var i = 0; i < 8; i++) {
        var index = random(colorscopy.length);
        randomColors.push(colorscopy.splice(index, 1)[0]);
    }
    return  randomColors.concat(randomColors.slice());
}

function randomizeColors() {
    var randomColors = getSomeColors();
    gameSquares.forEach(function(gameSquare) {
        var color = randomColors.splice(random(randomColors.length), 1)[0];
        gameSquare.setColor(color);
    });
}

function GameSquare(el, color) {
    this.el = el;
    this.isOpen = false;
    this.isLocked = false;
    this.el.addEventListener("click", this, false);
    this.setColor(color);
}
function setupGame() {
    var array = document.getElementsByClassName("game-square");
    var randomColors = getSomeColors();
    for (var i = 0; i < array.length; i++) {
        var index = random(randomColors.length);
        var color = randomColors.splice(index, 1)[0];
        gameSquares.push(new GameSquare(array[i], color));
    }
}

function checkGame(gameSquare) {
    if (firstSquare === null) {
        firstSquare = gameSquare;
        return
    }

    if (firstSquare.color === gameSquare.color) {
        firstSquare.lock();
        gameSquare.lock();
    } else {
        var a = firstSquare;
        var b = gameSquare;
        setTimeout(function() {
            a.reset();
            b.reset();
            firstSquare = null;
        }, 400);
    }
    firstSquare = null;
}

function clearGame() {
    gameSquares.forEach(function(gameSquare) {
        gameSquare.reset();
    });
    setTimeout(function() {
        randomizeColors();
    }, 300)
}

resetButton.onclick = function() {
    clearGame();
}

GameSquare.prototype.handleEvent = function(e) {
    switch (e.type) {
        case "click":
        if (this.isOpen || this.isLocked) {
            return;
        }
        this.isOpen = true;
        this.el.classList.add('flip');
        checkGame(this);
    }
}
GameSquare.prototype.reset = function() {
    this.isOpen = false;
    this.isLocked = false;
    this.el.classList.remove('flip');
}
GameSquare.prototype.lock = function() {
    this.isLocked = true;
    this.isOpen = true;
}
GameSquare.prototype.setColor = function(color) {
    this.el.children[0].children[1].classList.remove(this.color);
    this.color = color;
    this.el.children[0].children[1].classList.add(color);
}
setupGame();
