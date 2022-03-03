class GameArea {
  constructor (options){
    this.destroyItems = [];//список кубиков для разрушения
    this.images = options.images;//список используемых изображений
    this.path = options.path;//располажение изображений
    this.w = options.w;//количество столбиков
    this.h = options.h;//количество рядов
    this.num = 2;//необходимое количество для разрушения
    this.setCubes = 0;//количество кубиков в сэте
    this.cubes = [];//массив кубиков первый уровень (столбци)
    this.size = 64;// размер ячейки
    this.margin = 1;// промежутки между кубами
    this.header = options.header;//селектор игрового статуса передает в data-toggle: 0 - пауза, 1 - активный, 2 - при поражении, 3 - при победе
    this.canvasId = options.canvasId;//id канваса
    this.quantityMixId = options.quantityMixId;//id количества перемешиваний
    this.progressId = options.progressId;//id полосы прогресса
    this.maxScoreId = options.maxScoreId;//id нужного количество очков для победы
    this.moveBalanceId = options.moveBalanceId;//id остатка ходов
    this.scoreBalanceId = options.scoreBalanceId;//id количества очков
    this.levelId = options.levelId;//id уровня
    this.toggleAttribute = options.toggleAttribute;//id переключателя сцен
    this.movesId = options.movesId;//id количества возможных ходов
  }
  generateLevel (qmx, mbc, mxs, lvl) {//создает поле
    this.quantityMix = qmx;//количество перемешиваний
    this.moveBalance = mbc;//остаток ходов
    this.maxScore = mxs;//нужное количество очков для победы
    this.lvl = lvl;//текущий уровень

    document.querySelector(this.canvasId).width = this.size*this.w-this.margin;
    document.querySelector(this.canvasId).height = this.size*this.h-this.margin;
    document.querySelector(this.header).setAttribute(this.toggleAttribute, 1);
    document.querySelector(this.scoreBalanceId).innerHTML = 0;

    if (this.quantityMixId!=undefined){//проверка блока "перемешать"
      document.querySelector(this.quantityMixId).innerHTML = this.quantityMix;
    };
    if (this.progressId!=undefined){//проверка полосы прогресса
      document.querySelector(this.progressId).max = this.maxScore;
      document.querySelector(this.progressId).value = 0;
    };
    if (this.maxScoreId!=undefined){//проверка наличаия очков для победы
      document.querySelector(this.maxScoreId).innerHTML = this.maxScore;
    };
    if (this.moveBalanceId!=undefined){//проверка блока возможных ходов
      document.querySelector(this.moveBalanceId).innerHTML = this.moveBalance;
    };
    if (this.levelId!=undefined){//проверка наличия уровней
      document.querySelector(this.levelId).innerHTML = this.lvl;
    };

    for (let column = 0; column < this.w; column++){
      this.cubes[column] = [];//массив кубиков второй уровень (ряды)
      for (let row = 0; row < this.h; row++){
        this.cubes[column][row] = this.cube();
        this.cubes[column][row].yp = row*this.size;
        this.cubes[column][row].xp = column*this.size;
        this.cubes[column][row].size = this.size-this.margin;
        this.cubes[column][row].canvas = this.canvasId;
        this.cubes[column][row].onload = function(){
      		document.querySelector(this.canvas).getContext("2d").drawImage(this, 0, 22, 170, 170, this.xp, this.yp, this.size, this.size);
      	};
      };
    };
    if (this.movesId!=undefined){
      this.checkMove();
    };
  }//конец функции generateLevel

  cube(){//функция отбирает рандомный кубик
    let image = new Image();
    image.src = this.path+this.images[Math.floor(Math.random()*this.images.length)];
    return image;
  }//конец функции cube

  checkMove(){//проверка количества возможных ходов
    this.quantityMove = 0;//возможные ходы
    for (let column = 0; column < this.w; column++){
      for (let row = 0; row < this.h; row++){
        if (this.checkSet(column,row, 1)){
          if(this.setCubes>=this.num){
            this.quantityMove++;
          }
          this.setCubes = 0;
        };
      };
    };
    document.querySelector(this.movesId).innerHTML = this.quantityMove;
    if (this.quantityMove==0 && this.quantityMix==0){
      document.querySelector(this.header).setAttribute(this.toggleAttribute, 2);
    };
    this.destroyItems = [];
  }//конец функции checkMove

  destroyCubes(x, y){//разрушение однотипных кубиков
    this.destroyItems.push(this.cubes[x][y]);
    this.checkSet(x,y);
    if (this.destroyItems.length>=this.num){
      document.querySelector(this.scoreBalanceId).innerHTML = this.destroyItems.length + Number(document.querySelector(this.scoreBalanceId).textContent);
      if (this.progressId!=undefined){//проверка полосы прогресса
        document.querySelector(this.progressId).value = Number(document.querySelector(this.scoreBalanceId).textContent);
      };
      if (this.moveBalanceId!=undefined){//проверка блока возможных ходов
        document.querySelector(this.moveBalanceId).innerHTML = --this.moveBalance;
      };
      if (document.querySelector(this.scoreBalanceId).textContent >= this.maxScore){
        document.querySelector(this.header).setAttribute(this.toggleAttribute, 3);
      } else if (this.moveBalanceId!=undefined && document.querySelector(this.moveBalanceId).textContent <= 0){
        document.querySelector(this.header).setAttribute(this.toggleAttribute, 2);
      };
      for (let column = 0; column < this.w; column++){
        this.posCreateElem = -1;
        for (let row = 0; row < this.h; row++){
          if (this.destroyItems.includes(this.cubes[column][row])){
            this.replacement(column,row);
            document.querySelector(this.canvasId).getContext("2d").clearRect(column*this.size, row*this.size, this.size, this.size);
          };
        };
      };
    };
    this.tik = setInterval((function () { this.shift(); }).bind(this), 1);
  }//конец функции destroyCubes

  shift (){//анимация падения
    let i = 0;
    for (let column = 0; column < this.w; column++){
      for (let row = 0; row < this.h; row++){
        if ((row*this.size)>this.cubes[column][row].yp){
          document.querySelector(this.canvasId).getContext("2d").clearRect(column*this.size, this.cubes[column][row].yp, this.size, this.size);
          document.querySelector(this.canvasId).getContext("2d").drawImage(this.cubes[column][row], 0, 22, 170, 170, column*this.size, this.cubes[column][row].yp+=2, this.size-this.margin, this.size-this.margin);
        } else {
          i++;
        };
      };
    };
    if (i==this.w*this.h){
      clearInterval(this.tik);
      toggle = 1;
      this.destroyItems = [];
    };
  };//конец функции shift

  checkSet(x,y,z){//собирает список однотипных соседей
    let vector = [
      {x: x-1, y: y, condition: x-1>=0},
      {x: x+1, y: y, condition: x+1<this.w},
      {x: x, y: y-1, condition: y-1>=0},
      {x: x, y: y+1, condition: y+1<this.h},
    ];
    for (let i in vector){
      if (vector[i].condition && this.cubes[vector[i].x][vector[i].y].src == this.cubes[x][y].src && !this.destroyItems.includes(this.cubes[vector[i].x][vector[i].y])){
        this.destroyItems.push(this.cubes[vector[i].x][vector[i].y]);
        this.checkSet(vector[i].x,vector[i].y)
        this.setCubes++;
        if (z){
          return true;
        };
      };
    };
  }//конец функции checkSet

  replacement(cm, rw){//заменяет живые и новые элементы за место старых в массиве
    if (rw>0){
      this.cubes[cm][rw] = this.cubes[cm][rw-1];
      this.replacement(cm, rw-1);
    } else {
      this.cubes[cm][rw] = this.cube();
      this.cubes[cm][rw].yp = this.posCreateElem*this.size;
      document.querySelector(this.canvasId).getContext("2d").drawImage(this.cubes[cm][rw], 0, 22, 170, 170, this.cubes[cm][rw].xp, this.cubes[cm][rw].yp, this.size-this.margin, this.size-this.margin);
      this.posCreateElem--;
    };
  }//конец функции replacement

  mix() {//кнопка перемешать
    if (this.quantityMix>0){
      var result = [];
      for (let column in this.cubes){
         result = result.concat(this.cubes[column]);
      };
      result.sort(() => Math.random() - 0.5);
      for (let column = 0; column < this.w; column++){
        this.cubes[column] = [];//массив кубиков второй уровень (ряды)
        for (let row = 0; row < this.h; row++){
          this.cubes[column][row] = result.pop();
          this.cubes[column][row].yp = row*this.size;
          this.cubes[column][row].xp = column*this.size;
          document.querySelector(this.canvasId).getContext("2d").drawImage(this.cubes[column][row], 0, 22, 170, 170, this.cubes[column][row].xp, this.cubes[column][row].yp, this.size-this.margin, this.size-this.margin);
        };
      };
      if (this.quantityMixId!=undefined){//проверка блока "перемешать"
        document.querySelector(this.quantityMixId).innerHTML = --this.quantityMix;
      };
      if (this.movesId!=undefined){
        this.checkMove();
      };
    } else {
      alert(`У вас закончилось количество попыток перемешать, но у вас ещё есть ${this.quantityMove} ` + `${this.quantityMove > 9 & this.quantityMove < 15 ? 'ходов' :
      this.quantityMove.toString().slice(-1) == 1 ? "ход" :
      this.quantityMove.toString().slice(-1) > 4 ||
      this.quantityMove.toString().slice(-1) == 0 ? 'ходов' : "хода"}`);
    };
  }//конец функции mix
};//класс GameArea
