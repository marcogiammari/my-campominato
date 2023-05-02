const gridContainer = document.getElementById("grid");
const playBtn = document.getElementById("play-btn");
main = document.querySelector("main");
result = document.getElementById("result");
let bombs = [];
let numbers = [];
let points = 0;
let squares = [];

window.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  }, false);

playBtn.addEventListener("click", function () {
  let gridNum = document.querySelector("select").value;
  let numberOfBombs = Math.floor(gridNum / 5); 
  createGrid(gridNum);
  placeBombs(numberOfBombs, gridNum);
  getNums(gridNum);
  generateNodes(gridNum);
  startGame(gridNum, nodes);
});

function createGrid(gridNum) {
  gridContainer.innerHTML = "";
  gridContainer.style.display = "grid";
  gridContainer.style.gridTemplateColumns = `repeat(${Math.sqrt(
    gridNum
  )}, 1fr)`;
}

function placeBombs(num, gridNum) {
  bombs = [];
  bombsJoined = [];
  for (let i = 0; i < num; i++) {
    var bombX = Math.floor(Math.random() * Math.sqrt(gridNum));
    for (let j = 0; j < num; j++) {
      var bombY = Math.floor(Math.random() * Math.sqrt(gridNum));
    }
    let bomb = [bombX, bombY];
    let bombJoined = [bombX.toString() + bombY.toString()].toString();
    if (!bombsJoined.includes(bombJoined)) {
      bombsJoined.push(bombJoined);
      bombs.push(bomb);
    } else {
      i -= 1;
    }
  }
  bombsJoined.sort(function (a, b) {
    return a - b;
  });
  console.log(bombsJoined);
}

function getNums(gridNum) {
  for (let i = 0; i < Math.sqrt(gridNum); i++) {
    numbers.push(i.toString());
  }
}

function startGame(gridNum, nodesArray) {
  for (let i = 0; i < gridNum; i++) {
    let el = document.createElement("div");
    el.classList.add("square");
    newArr = [].concat.apply([], nodesArray);
    // el.innerText = newArr[i];
    el.num = newArr[i];
    el.addEventListener("click", clickSquare);
    el.addEventListener("contextmenu", function() {
        el.classList.toggle("flagged");
    })
    gridContainer.appendChild(el);
    squares = document.querySelectorAll(".square");
  }
}

function generateNodes(gridNum) {
  num = Math.sqrt(gridNum);
  nodes = [];
  for (let i = 0; i < num; i++) {
    let prova = new Array();
    for (let j = 0; j < num; j++) {
      let el = numbers[i] + j;
      prova.push(el);
    }
    nodes.push(prova);
  }
  return nodes;
}

function clickSquare() {
  console.log("casella cliccata: " + this.num);
  let num = parseInt(document.querySelector("select").value);
  hasBomb = false;
  for (let j = 0; j < bombs.length; j++) {
    const bomb = bombs[j].join().replace(",", "");
    if (bomb == this.num) {
      hasBomb = true;
    }
  }
  if (hasBomb) {
    this.classList.add("exploded");
    endGame("defeat");
  } else {
    this.classList.add("clicked");
    n = getNeighbours(nodes, this.num[0], this.num[1]);
    this.innerHTML = calcBombs(n);
    points += 1;
    if (points == num - bombs.length) {
      endGame("win");
    }
  }
  this.removeEventListener("click", clickSquare);
}

function getNeighbours(nodes, column, row) {
  let neighbours = [];
  column = parseInt(column);
  row = parseInt(row);

  //top
  if (column > 0 && nodes[column - 1][row]) {
    neighbours.push(nodes[column - 1][row]);
  }

  //bottom
  if (column < nodes.length - 1 && nodes[column + 1][row]) {
    neighbours.push(nodes[column + 1][row]);
  }

  //left
  if (row > 0 && nodes[column][row - 1]) {
    neighbours.push(nodes[column][row - 1]);
  }

  //right
  if (row < nodes.length - 1 && nodes[column][row + 1]) {
    neighbours.push(nodes[column][row + 1]);
  }

  //top-left
  if (column > 0 && nodes[column - 1][row - 1]) {
    neighbours.push(nodes[column - 1][row - 1]);
  }

  //top-right
  if (column > 0 && nodes[column - 1][row + 1]) {
    neighbours.push(nodes[column - 1][row + 1]);
  }

  //bottom-left
  if (column < nodes.length - 1 && nodes[column + 1][row - 1]) {
    neighbours.push(nodes[column + 1][row - 1]);
  }

  //bottom-right
  if (column < nodes.length - 1 && nodes[column + 1][row + 1]) {
    neighbours.push(nodes[column + 1][row + 1]);
  }

  return neighbours;
}

function calcBombs(neighbours) {
  console.log("caselle adiacenti: " + neighbours);
  let bombsNum = 0;
  for (let i = 0; i < neighbours.length; i++) {
    const neighbour = neighbours[i];
    for (let j = 0; j < bombs.length; j++) {
      const bomb = bombs[j];
      if (bomb.join().replace(",", "") == neighbour) {
        console.log(bomb);
        bombsNum += 1;
      }
    }
  }
  console.log("numero bombe vicine: " + bombsNum);
  return bombsNum;
}

function endGame(outcome) {
  squares = document.querySelectorAll(".square");
  for (let i = 0; i < squares.length; i++) {
    squares[i].removeEventListener("click", clickSquare);
  }
  control = false;
  for (let i = 0; i < squares.length; i++) {
    for (let j = 0; j < bombs.length; j++) {
      if (squares[i].num == bombs[j].join().replace(",", "")) {
        squares[i].style.backgroundColor = "red";
      }
    }
  }
  if (outcome == "defeat") {
    result.innerText = `Game over. Punti totalizzati: ${points}`;
  } else if (outcome == "win") {
    result.innerText = `Congratulazioni, hai vinto! Punti totalizzati: ${points}`;
  }
}
