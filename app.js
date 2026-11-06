const player = document.getElementById('player');
const pekka = document.getElementById('pekka');
const gameArea = document.getElementById('game-area');
const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');
const timerDisplay = document.getElementById('timer');

const muteCheckbox = document.getElementById('mute-checkbox');
const playerSpeedRange = document.getElementById('player-speed-range');
const pekkaSpeedRange = document.getElementById('pekka-speed-range');
const playerSpeedVal = document.getElementById('player-speed-val');
const pekkaSpeedVal = document.getElementById('pekka-speed-val');

const pekkaSound = new Audio('audio/pekka-audio.mp3');
pekkaSound.loop = true;
pekkaSound.volume = 0.5;

let playerPosition = { x: 100, y: 100 };
let pekkaPosition = { x: 300, y: 300 };
let playerSpeed = parseFloat(playerSpeedRange.value);
let pekkaSpeed = parseFloat(pekkaSpeedRange.value);
let gameRunning = false;

const keysPressed = {};

let seconds = 0;
let timerInterval = null;

function resetKeys() {
    for (let key in keysPressed) {
        keysPressed[key] = false;
    }
}

muteCheckbox.addEventListener('change', (e) => {
    pekkaSound.muted = e.target.checked;
    e.target.blur();
});

playerSpeedRange.addEventListener('input', (e) => {
    playerSpeed = parseFloat(e.target.value);
    playerSpeedVal.textContent = playerSpeed;
});

playerSpeedRange.addEventListener('change', (e) => {
    e.target.blur();
});

pekkaSpeedRange.addEventListener('input', (e) => {
    pekkaSpeed = parseFloat(e.target.value);
    pekkaSpeedVal.textContent = pekkaSpeed;
});

pekkaSpeedRange.addEventListener('change', (e) => {
    e.target.blur();
});

startBtn.addEventListener('click', () => {
    startScreen.style.display = 'none';
    pekkaSound.play().catch(error => console.log(error));
    gameRunning = true;
    resetKeys();
    
    seconds = 0;
    timerDisplay.textContent = 'Tiempo: 0s';
    timerInterval = setInterval(() => {
        seconds++;
        timerDisplay.textContent = `Tiempo: ${seconds}s`;
    }, 1000);

    gameLoop();
});

window.addEventListener('keydown', (event) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
        keysPressed[event.key] = true;
    }
});

window.addEventListener('keyup', (event) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        keysPressed[event.key] = false;
    }
});

window.addEventListener('blur', resetKeys);

function movePlayer() {
    if (keysPressed['ArrowUp'] && playerPosition.y > 0) {
        playerPosition.y -= playerSpeed;
    }
    if (keysPressed['ArrowDown'] && playerPosition.y < gameArea.clientHeight - 50) {
        playerPosition.y += playerSpeed;
    }
    if (keysPressed['ArrowLeft'] && playerPosition.x > 0) {
        playerPosition.x -= playerSpeed;
    }
    if (keysPressed['ArrowRight'] && playerPosition.x < gameArea.clientWidth - 50) {
        playerPosition.x += playerSpeed;
    }
}

function movePekka() {
    if (pekkaPosition.x < playerPosition.x) {
        pekkaPosition.x += Math.min(pekkaSpeed, playerPosition.x - pekkaPosition.x);
    } else if (pekkaPosition.x > playerPosition.x) {
        pekkaPosition.x -= Math.min(pekkaSpeed, pekkaPosition.x - playerPosition.x);
    }

    if (pekkaPosition.y < playerPosition.y) {
        pekkaPosition.y += Math.min(pekkaSpeed, playerPosition.y - pekkaPosition.y);
    } else if (pekkaPosition.y > playerPosition.y) {
        pekkaPosition.y -= Math.min(pekkaSpeed, pekkaPosition.y - playerPosition.y);
    }
}

function updatePositions() {
    player.style.transform = `translate(${playerPosition.x}px, ${playerPosition.y}px)`;
    pekka.style.transform = `translate(${pekkaPosition.x}px, ${pekkaPosition.y}px)`;
}

function checkCollision() {
    if (Math.abs(playerPosition.x - pekkaPosition.x) < 40 && 
        Math.abs(playerPosition.y - pekkaPosition.y) < 40) {
        
        pekkaSound.pause();
        pekkaSound.currentTime = 0;
        gameRunning = false;
        clearInterval(timerInterval);
        resetKeys();

        alert(`¡La pekka te atrapó! Aguantaste ${seconds} segundos.`);
        
        playerPosition = { x: 100, y: 100 };
        pekkaPosition = { x: 300, y: 300 };
        updatePositions();
        startScreen.style.display = 'flex';
    }
}

function gameLoop() {
    if (gameRunning) {
        movePlayer();
        movePekka();
        updatePositions();
        checkCollision();
        requestAnimationFrame(gameLoop);
    }
}