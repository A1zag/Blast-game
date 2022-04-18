"use strict"

var canvas = document.getElementById("canvasId"),
    w = 9,//количество столбиков
    h = 7,//количество рядов
    lvl = 1,//текущий уровень
    quantityMix = 1,//количество перемешиваний
    quantitySwap = 1,//количество порталов
    maxScore = 15,//нужное количество очков для победы
    moveBalance = 5,//остаток ходов
    qmx = quantityMix,
    tp = quantitySwap,
    mbc = moveBalance,
    toggle = 1,
    num = 2,//необходимое количество для разрушения
    setCubes = 0,//количество кубиков в сэте
    cubes = [],//массив кубиков первый уровень (столбци)
    destroyItems = [],//список кубиков для разрушения
    swapElem = [],//элементы для телепорта
    sizeY = 64,// размер ячейки
    sizeX = 64,// размер ячейки
    margin = 1,// промежутки между кубами
    images = ["blue.png","green.png","purple.png","red.png","yellow.png"],//* список используемых изображений
    path = "assets/img/cubes/",//* располажение изображений
    paramY0 = 0,//*параметр отрисовки изображений, начальная точка Y
    paramX0 = 22,//*параметр отрисовки изображений, начальная точка X
    paramYMAX = 170,//*параметр отрисовки изображений, конечная точка Y
    paramXMAX = 170,//*параметр отрисовки изображений, конечная точка X
    quantityMove = 0,//возможные ходы
    canvasId = "#canvasId",
    posCreateElem,
    swapCount,
    shiftElem = new Map();

function generateLevel() {//создает поле
  document.querySelector("#canvasId").width = sizeX*w-margin;
  document.querySelector("#canvasId").height = sizeY*h-margin;
  document.querySelector('header').setAttribute('data-toggle', 1);
  document.querySelector('.score_balance').innerHTML = 0;
  document.querySelector('#quantityMix').innerHTML = qmx;
  document.querySelector('#quantitySwap').innerHTML = tp;
  document.querySelector('.progress').max = maxScore;
  document.querySelector('.progress').value = 0;
  document.querySelector('.max_score').innerHTML = maxScore;
  document.querySelector('.balance_of_moves').innerHTML = mbc;
  document.querySelector('#lvl').innerHTML = lvl;

  for (let column = 0; column < w; column++){
    cubes[column] = [];//массив кубиков второй уровень (ряды)
    for (let row = 0; row < h; row++){
      cubes[column][row] = new Cube({
        path: path,
        images: images,
        xp: column*sizeX,
        yp: row*sizeY,
        sizeX: sizeX-margin,
        sizeY: sizeY-margin,
        paramY0: paramY0,
        paramX0: paramX0,
        paramYMAX: paramYMAX,
        paramXMAX: paramXMAX,
        canvasId: canvasId
      });
      cubes[column][row].create();
    };
  };
  checkMove();
}//конец функции generateLevel

function destroyCubes(x, y){//разрушение однотипных кубиков и создание замены
  destroyItems = [];
  destroyItems.push(cubes[x][y]);
  checkSet(x,y);
  if (destroyItems.length>=num){
    toggle = 0;
    document.querySelector('.score_balance').innerHTML = destroyItems.length + Number(document.querySelector('.score_balance').textContent);
    document.querySelector('.progress').value = Number(document.querySelector('.score_balance').textContent);
    document.querySelector('.balance_of_moves').innerHTML = --mbc;
    if (document.querySelector('.score_balance').textContent >= maxScore){
      document.querySelector('header').setAttribute('data-toggle', 3);
    } else if (document.querySelector('.balance_of_moves').textContent <= 0){
      document.querySelector('header').setAttribute('data-toggle', 2);
    };
    for (let column = 0; column < w; column++){
      posCreateElem = -1;
      for (let row = 0; row < h; row++){
        if (destroyItems.includes(cubes[column][row])){
          cubes[column][row].clearBlock();
          replacement(column,row);
        };
      };
    };
  };
  let tik = setInterval((function () {
    for(let item of shiftElem.keys()) {
      if (shiftElem.get(item)[0]>shiftElem.get(item)[1].img.yp){
        shiftElem.get(item)[1].clearBlock();
        shiftElem.get(item)[1].img.yp+=2;
        shiftElem.get(item)[1].draw();
      } else {
        shiftElem.delete(item);
      };
    };
    if (shiftElem.size === 0) {
      clearInterval(tik);
      toggle = 1;
    };
  }), 4);
};//конец функции destroyCubes

function replacement(cm, rw){//заменяет живые и новые элементы за место старых в массиве
  if (rw>0){
    cubes[cm][rw] = cubes[cm][rw-1];
    shiftElem.set(rw*10+cm, [sizeY*rw, cubes[cm][rw]]);
    replacement(cm, rw-1);
  } else {
    cubes[cm][rw] = new Cube({
      path: path,
      images: images,
      xp: cm*sizeX,
      yp: posCreateElem*sizeY,
      sizeX: sizeX-margin,
      sizeY: sizeY-margin,
      paramY0: paramY0,
      paramX0: paramX0,
      paramYMAX: paramYMAX,
      paramXMAX: paramXMAX,
      canvasId: canvasId
    });
    shiftElem.set(rw*10+cm, [sizeY*rw, cubes[cm][rw]]);
    posCreateElem--;
  };
};//конец функции replacement

function checkMove(){//проверка количества возможных ходов
  quantityMove = 0;//возможные ходы
  for (let column = 0; column < w; column++){
    for (let row = 0; row < h; row++){
      if (checkSet(column,row, 1)){
        if(setCubes>=num){
          quantityMove++;
        }
        setCubes = 0;
      };
    };
  };
  document.querySelector('.moves').innerHTML = quantityMove;
  if (quantityMove===0 && qmx===0 && tp===0){
    document.querySelector('header').setAttribute('data-toggle', 2);
  };
  destroyItems = [];
};//конец функции checkMove

function checkSet(x,y,z){//собирает список однотипных соседей
  let vector = [
    {x: x-1, y: y, condition: x-1>=0},
    {x: x+1, y: y, condition: x+1<w},
    {x: x, y: y-1, condition: y-1>=0},
    {x: x, y: y+1, condition: y+1<h},
  ];
  for (let i in vector){
    if (vector[i].condition && cubes[vector[i].x][vector[i].y].img.src === cubes[x][y].img.src && !destroyItems.includes(cubes[vector[i].x][vector[i].y])){
      destroyItems.push(cubes[vector[i].x][vector[i].y]);
      checkSet(vector[i].x,vector[i].y)
      setCubes++;
      if (z){
        return true;
      };
    };
  };
};//конец функции checkSet

function mix() {//кнопка перемешать
  if (qmx>0){
    var result = [];
    for (let column in cubes){
       result = result.concat(cubes[column]);
    };
    result.sort(() => Math.random() - 0.5);
    for (let column = 0; column < w; column++){
      cubes[column] = [];//массив кубиков второй уровень (ряды)
      for (let row = 0; row < h; row++){
        cubes[column][row] = result.pop();
        cubes[column][row].img.yp = row*sizeY;
        cubes[column][row].img.xp = column*sizeX;
        cubes[column][row].draw();
      };
    };
    document.querySelector('#quantityMix').innerHTML = --qmx;
    checkMove();
  } else {
    alert(`У вас закончилось количество попыток перемешать, но у вас ещё есть ${quantityMove} ` + `${quantityMove > 9 & quantityMove < 15 ? 'ходов' :
    quantityMove.toString().slice(-1) === 1 ? "ход" :
    quantityMove.toString().slice(-1) > 4 ||
    quantityMove.toString().slice(-1) === 0 ? 'ходов' : "хода"}`);
  };
};//конец функции mix

function swap(event){
  if (tp>0){
    let posx = event.pageX - this.offsetLeft,
      	posy = event.pageY - this.offsetTop,
      	mouseY = Math.floor(posy/(canvas.height/h)),
      	mouseX = Math.floor(posx/(canvas.width/w));
    swapElem.push(cubes[mouseX][mouseY]);
    document.querySelector('html').classList.remove('portal');
    document.querySelector('html').classList.add('portal2');
    swapCount++;
    if (swapCount===2){
      let ji = swapElem[0].img.src;
      swapElem[0].img.src = swapElem[1].img.src
      swapElem[1].img.src = ji;
      for(let item of swapElem) {
        item.draw();
      };

      document.querySelector('html').classList.remove('portal2');
      canvas.removeEventListener("click", swap);
      canvas.addEventListener("click", play);
      swapElem = [];
      document.querySelector('#quantitySwap').innerHTML = --tp;
    };
    checkMove();
  } else {
    alert(`У вас закончилось количество попыток для телепортации, но у вас ещё есть ${quantityMove} ` + `${quantityMove > 9 & quantityMove < 15 ? 'ходов' :
    quantityMove.toString().slice(-1) === 1 ? "ход" :
    quantityMove.toString().slice(-1) > 4 ||
    quantityMove.toString().slice(-1) === 0 ? 'ходов' : "хода"}`);
  };
};//конец функции swap

function play(event) {//определяет кубик по которому кликнули
  if (toggle == 1){
  	let posx = event.pageX - this.offsetLeft,
      	posy = event.pageY - this.offsetTop,
      	mouseY = Math.floor(posy/(canvas.height/h)),
      	mouseX = Math.floor(posx/(canvas.width/w));
    destroyCubes(mouseX, mouseY);
    checkMove();
  };
};//конец функции play

generateLevel ();

canvas.addEventListener("click", play);

document.querySelector('#mix').addEventListener('click', function() {
  if (toggle == 1){
  mix()};
});

document.querySelector('#swap').addEventListener('click', function() {
  if (toggle == 1){
  document.querySelector('html').classList.add('portal');
  canvas.removeEventListener("click", play);
  swapCount = 0;
  canvas.addEventListener("click", swap)};
});

var dt = 0;
document.querySelector('#pause__btn').addEventListener('click', function() {
	document.querySelector('header').setAttribute('data-toggle', dt);
  if (dt == 1) {dt = 0} else {dt = 1};
});

document.querySelector('.Next').addEventListener('click', function() {
  maxScore += 11;//нужное количество очков для победы
  quantityMix += 1;//количество перемешиваний
  quantitySwap += 1;//количество порталов
  moveBalance += 2;//остаток ходов
  qmx = quantityMix;
  tp = quantitySwap;
  mbc = moveBalance;
  dt = 0;//убрать паузу
  lvl++;
  generateLevel ();
});

document.querySelector('.Replay').addEventListener('click', function() {
  qmx = quantityMix;
  tp = quantitySwap;
  mbc = moveBalance;
  generateLevel ();
});

document.querySelector('.Exit').addEventListener('click', function() {
  window.close();
});
