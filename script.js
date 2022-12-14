const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const moles = document.querySelectorAll('.mole');
const allTimeScoreBoard = document.querySelector(".scores-tbl-content");
let lastHole, timeUp = false, started = false, score = 0;
let allPlayers = JSON.parse(localStorage.getItem("items")) || [];
let slider = document.getElementById("difficultyRange");

let currentPlayer = {};
let difficulty;
let timeout = 12500;
let maxTime = 3500;
let minTime = 1500;
let max, min;
document.nameForm.addEventListener("submit", submitted);

moles.forEach(mole => mole.addEventListener("click", bonk));
function submitted(e) {
    e.preventDefault();
    difficulty = slider.value;
    max = maxTime/difficulty;
    min = minTime/difficulty;
    console.log(slider.value);
    currentPlayer.name = this.playerName.value;
    currentPlayer.score = 0;
    currentPlayer.difficulty = difficulty;
    currentPlayer.date = new Date();
    startGame();
    this.reset();
}

function startGame() {
    if (started) return;
    started = true;
    score = 0;
    scoreBoard.textContent = score;
    timeUp = false;
    peep();
    setTimeout(endGame, timeout);
}

function randTime(max, min) {
    return Math.round(Math.random() * (max - min) + min);
}

function randHole(holes) {
    const index = Math.floor(Math.random() * 6);
    const hole = holes[index];
    if (hole === lastHole) return randHole(holes);
    lastHole = hole;

    return hole;
}

function peep() {
    const time = randTime(max, min);
    const hole = randHole(holes);

    const mole = hole.querySelector(".mole");
    mole.classList.add("up");
    setTimeout(() => {
        mole.classList.remove("up");
        if (!timeUp) peep();
    }, time);
}

function bonk(e) {
    if (!e.isTrusted) return;

    this.classList.remove("up");
    score++;
    scoreBoard.textContent = score;
    currentPlayer.score = score;
}

function endGame() {
    timeUp = true;
    started = false;
    setTimeout(updateScoreBoard, max);
}

function updateScoreBoard() {
    allPlayers.push(currentPlayer);
    allPlayers.sort((a, b) => a.score > b.score ? -1 : 1);
    allPlayers = allPlayers.slice(0, 3);
    localStorage.setItem("items", JSON.stringify(allPlayers));
    populateAllScoreBoard();
    scoreBoard.textContent = `0`;
    currentPlayer = {};
}

function populateAllScoreBoard() {
    let i = 1;
    allTimeScoreBoard.innerHTML = allPlayers.map(player => {
        return `<tr>
                <td>${i++}</td>
                <td>${player.name}</td>
                <td>${player.score}</td>
            </tr>`
    }).join("");
}
