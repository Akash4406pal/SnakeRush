let board= document.querySelector('.game-board');
let blockHeight=30;
let blockWidth=30;
let rows=Math.floor(board.clientHeight/blockHeight);
let cols=Math.floor(board.clientWidth/blockWidth);
let highscorespn=document.querySelector('#high-score')
let highscore=Number(localStorage.getItem('highscore')) || 1;
highscorespn.innerHTML=highscore;
let scorespn=document.querySelector('#score')
let score=scorespn.innerHTML;
let timeNow=performance.now();
let timer;
let gameTimeSpn=document.querySelector('#game-time');
let main=document.querySelector('main');
let congoDiv=document.createElement('div');
congoDiv.classList.add('congo-massage');
 main.appendChild(congoDiv);
console.log(highscorespn.innerHTML);
let boards=[];
let foodx,foody
let direction='left';
let snakes=[{x:Math.floor(rows/2),y:Math.floor(cols/2),}]
let snakeSpeed=300;
let startGameButton=document.querySelector('#start-button');
let modal=document.querySelector(".modals")
let restartGameButton=document.querySelector('#restart-button');
let startGame=document.querySelector(".start-game")
let restartGame=document.querySelector(".restart-game")
let finalScore=document.querySelector("#final-score")
for(let row=0;row<rows;row++){
    for(let col=0;col<cols;col++){
        let block=document.createElement('div');
        block.classList.add('block');
        board.appendChild(block);
        boards[`${row}-${col}`]=block;
    }
}
document.body.addEventListener('keydown',(e)=>{
    if (e.key === 'ArrowUp' && direction !== 'down') direction = 'up';
    if (e.key === 'ArrowDown' && direction !== 'up') direction = 'down';
    if (e.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
    if (e.key === 'ArrowRight' && direction !== 'left') direction = 'right';
})
function congoShow(){
            congoDiv.style.display='block';
            congoDiv.innerHTML=`New High Score ${score}!!!`;
            setTimeout(()=>{
                congoDiv.style.display='none';
            },2000);
}
function gameOver(){
        localStorage.setItem('highscore',highscore<score?score:highscore);
        highscore=score>highscore?score:highscore;
        highscorespn.innerHTML=highscore;
        modal.style.display='flex';
        startGame.style.display='none';
        restartGame.style.display='flex';
        finalScore.innerHTML=score;
        clearInterval(timer);
}
function foodGenerate(){
    do {
        foodx = Math.floor(Math.random() * rows);
        foody = Math.floor(Math.random() * cols);
    } while (boards[`${foodx}-${foody}`].classList.contains('fill'));
    boards[`${foodx}-${foody}`].classList.add('food');
}

function snakeStart(snakeSpeed){
    if (snakes.length > 10 && snakeSpeed !== 250) {
        if(snakes.length>20 && snakeSpeed!==200){
            snakeSpeed=200;
            startGameLoop(snakeSpeed);
        }
    snakeSpeed = 200;
    startGameLoop(snakeSpeed);
    }
    snakes.forEach(part=>{
    boards[`${part.x}-${part.y}`].classList.add('fill')})
    let head={};
    if(direction=='up'){
        head={x:snakes[0].x-1,y:snakes[0].y}}
    else if(direction=='down'){
        head={x:snakes[0].x+1,y:snakes[0].y}}
    else if(direction=='left'){
        head={x:snakes[0].x,y:snakes[0].y-1}}
    else if(direction=='right'){
    head={x:snakes[0].x,y:snakes[0].y+1}}
    if(head.x<0 || head.x>=rows || head.y<0 || head.y>=cols ||boards[`${head.x}-${head.y}`].classList.contains('fill')
    ){
        gameOver();
        return;
    }
    snakes.unshift(head);
    boards[`${head.x}-${head.y}`].classList.add('fill');
    if(head.x==foodx && head.y==foody){
        boards[`${foodx}-${foody}`].classList.remove('food');
        score++;
        scorespn.innerHTML = score;
        if(score==highscore+1){
            congoShow();
        }
        foodGenerate()
    }
    else{
        let tail = snakes.pop();
        boards[`${tail.x}-${tail.y}`].classList.remove('fill');
    }
    let currentTime = performance.now();
    let elapsedTime = currentTime - timeNow;
    let totalSeconds = Math.floor(elapsedTime / 1000);
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    let formattedTime = `${minutes}-${seconds.toString().padStart(2, '0')}`;
    gameTimeSpn.innerHTML = formattedTime;
    
}
function startGameLoop(speed) {
    clearInterval(timer);
    timer = setInterval(snakeStart, speed);
}
startGameButton.addEventListener('click',()=>{
    modal.style.display='none';
    foodGenerate()
    startGameLoop(snakeSpeed)
});
restartGameButton.addEventListener('click',()=>{
    modal.style.display='none';
    score=0;
    scorespn.innerHTML=score;
    boards[`${foodx}-${foody}`].classList.remove('food');
    snakes.forEach(part=>{
        boards[`${part.x}-${part.y}`].classList.remove('fill')});
    snakes=[{x:Math.floor(rows/2),y:Math.floor(cols/2),}];
    direction='left';
    snakeSpeed=300;
    timeNow=performance.now();
    foodGenerate();
    startGameLoop(snakeSpeed);
});