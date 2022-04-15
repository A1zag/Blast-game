class Cube {
  constructor (options){
    this.img = new Image();
    this.img.src = options.path + options.images[Math.floor(Math.random() * options.images.length)];
    this.img.xp = options.xp;
    this.img.yp = options.yp;
    this.img.sizeX = options.sizeX;
    this.img.sizeY = options.sizeY;
    this.img.paramY0 = options.paramY0;
    this.img.paramX0 = options.paramX0;
    this.img.paramYMAX = options.paramYMAX;
    this.img.paramXMAX = options.paramXMAX;
    this.img.canvasId = options.canvasId;
  }
  create(){
    this.img.onload = function(){
      document.querySelector(this.canvasId).getContext("2d").drawImage(this, this.paramY0, this.paramX0, this.paramYMAX, this.paramXMAX, this.xp, this.yp, this.sizeX, this.sizeY);
    };
  }//конец метода create
  draw(){
    document.querySelector(this.img.canvasId).getContext("2d").drawImage(this.img, this.img.paramY0, this.img.paramX0, this.img.paramYMAX, this.img.paramXMAX, this.img.xp, this.img.yp, this.img.sizeX, this.img.sizeY);
  }//конец метода drawCube
  clearBlock(){
    document.querySelector(this.img.canvasId).getContext("2d").clearRect(this.img.xp, this.img.yp, this.img.sizeX, this.img.sizeY);
  }//конец метода clear
};//класс Cube
