const
    btnStartGame = document.querySelector('#startGame'),
    startMenu = document.querySelector('.startMenu'),
    game = document.querySelector('.game'),
    road = document.querySelector('.road'),
    player = document.querySelector('.player'),
    counterHP = document.querySelector('#counter-hp'),
    counterScore = document.querySelector('#counter-score'),
    gameOver = document.querySelector('.game-over'),
    goMenu = document.querySelector('#goMenu');
const settings = {
    speed : 5,
    speedStep : 0.001
};
const Arrow = {
    ArrowLeft : false,
    ArrowRight : false
}
const counter = {
    hp : 10,
    score : 0
}
let timer = setInterval(()=>{
    scrollMenu();
}, 1000/60);
window.onload = function (){
    btnStartGame.addEventListener('click',  start);
}
window.addEventListener('keydown', (event)=>{
    if(event.code === 'ArrowRight'){
        Arrow.ArrowRight = true;
    }else if(event.code === 'ArrowLeft'){
        Arrow.ArrowLeft = true;
    }
});
window.addEventListener('keyup', (event)=>{
    if(event.code === 'ArrowRight'){
        Arrow.ArrowRight = false;
    }else if(event.code === 'ArrowLeft'){
        Arrow.ArrowLeft = false;
    }
});
goMenu.addEventListener('click', ()=>{
    window.location.reload();
});
function start(){
    clearInterval(timer)
    changeDisplay(startMenu, game);
    spawnEnemy('robot', 1300);
    spawnEnemy('barrel', 1700);
    spawnEnemy('coin', 2000);
    requestAnimationFrame(startGame)
}
function scrollMenu(){
    startMenu.style.backgroundPositionX = parseInt(startMenu.style.backgroundPositionX) + 2 + 'px';
}
function scrollRoad(){
    if(settings.speedStep < 10){
        settings.speedStep += 0.001;
        road.style.backgroundPositionY = parseInt(road.style.backgroundPositionY) + settings.speed + settings.speedStep + 'px';
    }else {
        road.style.backgroundPositionY = parseInt(road.style.backgroundPositionY) + settings.speed + settings.speedStep + 'px';
    }
}
function changeDisplay(froms, to){
    froms.style.display = 'none';
    to.style.display = 'block';
}
function startGame(){
    scrollRoad();
    if(Arrow.ArrowRight && player.offsetLeft < road.offsetWidth - player.offsetWidth - 40){
        goRightAndLeft(10)
    }
    if(Arrow.ArrowLeft && player.offsetLeft > 40){
        goRightAndLeft(-10)
    }
    goDown();
    goEnemyRightAndLeft(5);
    isCollision();
    counted();
    gameover();
    requestAnimationFrame(startGame);
}
function goRightAndLeft(speed){
    player.style.left = player.offsetLeft + speed + 'px';
}
function spawnEnemy(clsName, timeSpawn){
    setInterval(()=>{
        let enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.classList.add(`enemy-${clsName}`);
        enemy.classList.add('right');
        enemy.style.left = getRandomInt(40, 1100) + 'px';
        road.append(enemy);
        if(settings.speedStep > 5){
            timeSpawn = timeSpawn - 300;
        }else if(settings.speedStep > 7){
            timeSpawn = timeSpawn - 450;
        }else if(settings.speedStep > 10){
            timeSpawn = timeSpawn - 550;
        }
    }, timeSpawn);
}
function goDown(){
    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach((item)=>{
        if(item.className.split(' ')[1] === 'enemy-robot' || item.className.split(' ')[1] === 'enemy-barrel' || item.className.split(' ')[1] === 'enemy-coin'){
            item.style.top = item.offsetTop + settings.speed + settings.speedStep + 'px';
        }
        if(item.offsetTop > document.documentElement.clientHeight){
            item.remove();
        }
    })
}
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
function goEnemyRightAndLeft(speed){
    let enemyRobots = document.querySelectorAll('.enemy-robot');
    enemyRobots.forEach((item)=>{
        if(item.offsetLeft > road.offsetWidth - item.offsetWidth - 40){
            item.classList.add('left');
            item.classList.remove('right');
        }else if(item.offsetLeft < 40){
            item.classList.add('right');
            item.classList.remove('left');
        }
        if(item.classList.contains('left')){
            item.style.left = item.offsetLeft - speed + 'px';
        }
        if(item.classList.contains('right')){
            item.style.left = item.offsetLeft + speed + 'px';
        }
    });
}
function isCollision(){
    let enemies = document.querySelectorAll('.enemy');
    enemies.forEach((item)=>{
        if(player.offsetLeft + player.offsetWidth >= item.offsetLeft && item.offsetLeft + item.offsetWidth >= player.offsetLeft
            && player.offsetTop <= item.offsetTop + item.offsetHeight && player.offsetTop + player.offsetHeight >= item.offsetTop)
        {
            if(item.classList.contains('enemy-coin')){
                counter.score++;
            }else {
                counter.hp--;
            }
            item.remove();
        }
    });
}
function counted(){
    counterHP.innerHTML = counter.hp;
    counterScore.innerHTML = counter.score;
}
function gameover(){
    if(counter.hp === 0){
        changeDisplay(game, gameOver);
    }
}