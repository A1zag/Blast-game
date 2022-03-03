"use strict"

var canvas = document.getElementById("canvasId"),
    w = 9,//количество столбиков
    h = 7,//количество рядов
    lvl =1,//текущий уровень
    quantityMix = 1,//количество перемешиваний
    maxScore = 15,//нужное количество очков для победы
    moveBalance = 5,//остаток ходов
    toggle = 1;

const blast = new GameArea({// * -обязательный параметр
  w: w,//* количество столбиков
  h: h,//* количество рядов
  images: ["blue.png","green.png","purple.png","red.png","yellow.png"],//* список используемых изображений
  path: "assets/img/cubes/",//* располажение изображений
  header: 'header',//* селектор игрового статуса передает в data-toggle: 0 - пауза, 1 - активный, 2 - при поражении, 3 - при победе
  canvasId: "#canvasId",//* id канваса
  quantityMixId: '#quantityMix',//id количества перемешиваний
  progressId: '.progress',//id полосы прогресса
  maxScoreId: '.max_score',//id нужного количество очков для победы
  moveBalanceId: '.balance_of_moves',//id остатка ходов
  scoreBalanceId: '.score_balance',//* id количества очков
  levelId: '#lvl',//id уровня
  toggleAttribute: 'data-toggle',//* id переключателя сцен
  movesId: '.moves'//id количества возможных ходов
});

blast.generateLevel (quantityMix, moveBalance, maxScore, lvl);

canvas.addEventListener("click", function(e) {//определяет кубик по которому кликнули
  if (toggle == 1){
    toggle = 0;
  	let posx = e.pageX - this.offsetLeft,
      	posy = e.pageY - this.offsetTop,
      	mouseY = Math.floor(posy/(canvas.height/h)),
      	mouseX = Math.floor(posx/(canvas.width/w));
    blast.destroyCubes(mouseX, mouseY);
    blast.checkMove();
  };
});

document.querySelector('#mix').addEventListener('click', function(e) {blast.mix()});

var dt = 0;
document.querySelector('#pause__btn').addEventListener('click', function() {
	document.querySelector('header').setAttribute('data-toggle', dt);
  if (dt == 1) {dt = 0} else {dt = 1};
});

document.querySelector('.Next').addEventListener('click', function() {
  maxScore += 11;//нужное количество очков для победы
  quantityMix += 1;//количество перемешиваний
  moveBalance += 2;//остаток ходов
  dt = 0;//убрать паузу
  lvl++;
  blast.generateLevel (quantityMix, moveBalance, maxScore, lvl);
});

document.querySelector('.Replay').addEventListener('click', function() {
  blast.generateLevel (quantityMix, moveBalance, maxScore, lvl);
});

document.querySelector('.Exit').addEventListener('click', function() {
  window.close();
});
