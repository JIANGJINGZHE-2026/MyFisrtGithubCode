const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const gridSize = 20; // 每行/列格子数
const cell = canvas.width / gridSize; // 单元格像素大小

let snake, dir, food, running, score, timer;

function reset() {
  snake = [ {x: 8, y: 10}, {x:7,y:10}, {x:6,y:10} ];
  dir = {x:1, y:0};
  spawnFood();
  score = 0;
  running = true;
  scoreEl.textContent = score;
  if (timer) clearInterval(timer);
  timer = setInterval(loop, 100);
}

function spawnFood(){
  while (true){
    const p = { x: Math.floor(Math.random()*gridSize), y: Math.floor(Math.random()*gridSize) };
    if (!snake.some(s=>s.x===p.x && s.y===p.y)){ food = p; break; }
  }
}

function loop(){
  if (!running) return;
  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
  // 碰墙判断（游戏结束）
  if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) return gameOver();
  // 自己碰到自己
  if (snake.some(s=>s.x===head.x && s.y===head.y)) return gameOver();
  snake.unshift(head);
  // 吃到食物
  if (head.x === food.x && head.y === food.y){
    score += 1; scoreEl.textContent = score; spawnFood();
  } else {
    snake.pop();
  }
  draw();
}

function draw(){
  // 清屏
  ctx.fillStyle = '#111';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  // 食物
  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(food.x*cell+1, food.y*cell+1, cell-2, cell-2);
  // 蛇
  ctx.fillStyle = '#2ecc71';
  for (let i=0;i<snake.length;i++){
    const s = snake[i];
    ctx.fillStyle = i===0 ? '#27ae60' : '#2ecc71';
    ctx.fillRect(s.x*cell+1, s.y*cell+1, cell-2, cell-2);
  }
}

function gameOver(){
  running = false;
  clearInterval(timer);
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = '#fff';
  ctx.font = '20px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('游戏结束 - 得分: '+score, canvas.width/2, canvas.height/2 - 10);
  ctx.fillText('按空格或点击画布重新开始', canvas.width/2, canvas.height/2 + 20);
}

// 键盘控制
window.addEventListener('keydown', e => {
  const key = e.key;
  if (key === 'ArrowUp' || key === 'w' || key === 'W') tryChangeDir(0,-1);
  if (key === 'ArrowDown' || key === 's' || key === 'S') tryChangeDir(0,1);
  if (key === 'ArrowLeft' || key === 'a' || key === 'A') tryChangeDir(-1,0);
  if (key === 'ArrowRight' || key === 'd' || key === 'D') tryChangeDir(1,0);
  if (key === ' '){ if (!running) reset(); }
});

function tryChangeDir(x,y){
  // 禁止向相反方向直接掉头
  if (snake.length>1 && snake[0].x + x === snake[1].x && snake[0].y + y === snake[1].y) return;
  dir = {x,y};
}

// 画布点击重启
canvas.addEventListener('click', ()=>{ if (!running) reset(); });

// 屏幕按钮（触屏友好）
document.getElementById('up').addEventListener('click', ()=> tryChangeDir(0,-1));
document.getElementById('down').addEventListener('click', ()=> tryChangeDir(0,1));
document.getElementById('left').addEventListener('click', ()=> tryChangeDir(-1,0));
document.getElementById('right').addEventListener('click', ()=> tryChangeDir(1,0));

// 初始化
reset();
