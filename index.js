/* ДОПОЛНИТЕЛЬНЫЕ ОБЪЕКТЫ */

//Хранит пояснение к байтовым последовательностям файла
let BMPImageInfo = {
  //BITMAPFILEHEADER
  formatType: ["Идентификатор типа файла",1,2],
  fileSize: ["Размер файла",3,6],
  reservedBytes: ["Зарезервированные байты",7,10],
  pixelDataPos: ["Положение пиксельных данных",11,14],
  //BITMAPINFO
  bitmapinfoSize: ["Размер BITMAPINFO",15,18],
  rasterWidth: ["Ширина растра",19,22],
  rasterHeight: ["Высота растра и порядок строк",23,26],
  justOne: ["Тут 1",27,28],
  pixelSize: ["Кол-во бит на пиксель",29,30],
  pixelStoreMethod: ["Способ хранения пикселей",31,34],
  pixelDataSize: ["Размер пиксельных данных",35,38],
  pixelMeterHorizontal: ["Кол-во пикселей на метр по горизонтали",39,42],
  pixelMeterVertical: ["Кол-во пикселей на метр по вертикали",43,46],
  colorTableSize: ["Размер таблицы цветов в ячейках",47,50],
  colorTableCellNum: ["Кол-во используемых ячеек таблицы",51,54]
}

//Хранит пояснение к байтовым последовательностям файла
let SMVImageInfo = {
  idType: ["Идентификатор типа файла",1,2],
  imageWidth: ["Ширина изображения в пикселях",3,6],
  imageHeight: ["Высота изображения в пикселях",7,10],
  pixelSize: ["Глубина цвета (количество бит на один пиксель)",11,11],
  headerSize: ["Размер заголовка в байтах",12,13],
  fileSize: ["Размер файла в байтах",14,17],
  colorNum: ["Количество различных цветов на изображении",18,21]
}

//
//
//
//
//

/* ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ */

//Создаёт промис на получение файла в виде массива байтов
let getfile = function(inputId){
return new Promise(function(resolve){
  var file = document.querySelector(inputId).files[0];
  file.arrayBuffer().then((arrayBuffer) => {resolve(new Uint8ClampedArray(arrayBuffer));});
});
}

//Создаёт промис на получение массива цветовых пикселей и данных о ширине и высоте картинки из файла
let fileRaster = function(inputId){
return new Promise(function(resolve){
getfile(inputId).then(function(file){
var headerSize=54;
let width = 0;
let height = 0;
if(parseInt(byteInfo(file,BMPImageInfo.formatType,10))==1)headerSize=21;
if(headerSize==54){
  width = parseInt(byteInfo(file,BMPImageInfo.rasterWidth,10));
  height = parseInt(byteInfo(file,BMPImageInfo.rasterHeight,10));
} else {
  width = parseInt(byteInfo(file,SMVImageInfo.imageWidth,10));
  height = parseInt(byteInfo(file,SMVImageInfo.imageHeight,10));
}
var tmpArray = new Uint8ClampedArray(width*height*3);
var iterator = 0;
var stroka = height-1;
for(var i=0;i<tmpArray.length;i+=3){
  tmpArray[stroka*width*3+iterator++]=file[i+headerSize];
  tmpArray[stroka*width*3+iterator++]=file[i+headerSize+1];
  tmpArray[stroka*width*3+iterator++]=file[i+headerSize+2];
  if(iterator==width*3){iterator=0;stroka--;}
}
let array = [];
for(var i=0;i<height;i++){
  let arr = [];
  for(var j=0;j<width;j++){
    arr.push({blue:tmpArray[i*width*3+j*3],green:tmpArray[i*width*3+j*3+1],red:tmpArray[i*width*3+j*3+2]});
  }
  array.push(arr);
}
resolve(array);
});
});
}

//Получает представление нескольких байтов из файла
function byteInfo(array, info, intSystem){
var output = "";
for(var i = info[2]-1; i>info[1]-2;i--) output += array[i].toString(2).padStart(8, '0');
output = parseInt(output,2).toString(intSystem);
return output;
}

//Получает представление нескольких байтов
function getByteInfo(num){
let str = num.toString(2).padStart(32,'0');
let array = [parseInt(str.slice(0,8),2), parseInt(str.slice(8,16),2), parseInt(str.slice(16,24),2), parseInt(str.slice(24,32),2)];
return array;
}

//Добавляет в файл изображение из канвы и сохраняет его
function saveImage(file,headSize){
var canvas = document.querySelector("#canvas");
var imageData = canvas.getContext("2d").getImageData(0,0,canvas.width,canvas.height);
var array = imageData.data;
var width = canvas.width;
var height = canvas.height;
var rowId = height - 1;
var iterator = 0;
let newFile = new Uint8ClampedArray(headSize+width*height*3);
for(let i=0;i<newFile.length;i++)newFile[i] = file[i];
for(var i=0;i<array.length;i+=4){
  rowPosition = headSize + rowId * width * 3;
  newFile[rowPosition + iterator++]=array[i + 2];
  newFile[rowPosition + iterator++]=array[i + 1];
  newFile[rowPosition + iterator++]=array[i];
  if(iterator == width * 3){iterator = 0; rowId--;}
}
let newWidth = getByteInfo(width);
newFile[18]=newWidth[3];
newFile[19]=newWidth[2];
newFile[20]=newWidth[1];
newFile[21]=newWidth[0];
let newHeight = getByteInfo(height);
newFile[22]=newHeight[3];
newFile[23]=newHeight[2];
newFile[24]=newHeight[1];
newFile[25]=newHeight[0];
let newFileSize = getByteInfo(newFile.length);
newFile[2] = newFileSize[3];
newFile[3] = newFileSize[2];
newFile[4] = newFileSize[1];
newFile[5] = newFileSize[0];
var a = document.createElement("a");
var imageType={type:'image/smv'};
if(headSize == 54) imageType={type:'image/bmp'};
let saveFile = new Blob([newFile], imageType);
a.href = URL.createObjectURL(saveFile);
a.download = "image.smv";
a.click();
}

//Заполняет canvas пикселями
function fillCanvas(image) {
var canvas = document.querySelector("#canvas");
let width = image[0].length;
let height = image.length;
let array = image;
var tmpArray = new Uint8ClampedArray(width*height*4);
var iterator = 0;
for(var i=0;i<height;i++){
  for(var j=0;j<width;j++){
    tmpArray[iterator++]=array[i][j].red;
    tmpArray[iterator++]=array[i][j].green;
    tmpArray[iterator++]=array[i][j].blue;
    tmpArray[iterator++]=255;
  }
}
var imageData = new ImageData(tmpArray,width,height);
canvas.height = height.toString();
canvas.width = width.toString();
var ctx = canvas.getContext("2d");
ctx.putImageData(imageData,0,0);
}

//Создаёт промис на получение массива цветовых пикселей и данных о ширине и высоте картинки из канвы
let getCanvasPixels = function(){
return new Promise(function(resolve){
var canvas = document.querySelector("#canvas");
let width = canvas.width;
let height = canvas.height;
var imageData = canvas.getContext("2d").getImageData(0,0,width,height);
var channelArray = imageData.data;

let array = [];
for(var i=0;i<height;i++){
  let arr = [];
  for(var j=0;j<width;j++){
    arr.push({red:channelArray[i*4*width+j*4],green:channelArray[i*4*width+j*4+1],blue:channelArray[i*4*width+j*4+2]});
  }
  array.push(arr);
}
resolve(array);
});
}

//
//
//
//
//

/* ФУНКЦИИ ДЛЯ ИНТЕРФЕЙСА */

//Выводит загруженное изображение и информацию о нём на экран
function loadImage(){
fileRaster("#input1").then(function(image){
  fillCanvas(image);
});
getfile("#input1").then(function(byteFile){
let output = "";
if(parseInt(byteInfo(byteFile,BMPImageInfo.formatType,10))==1){
  for(key in SMVImageInfo) output+= SMVImageInfo[key][0] +" - "+ byteInfo(byteFile,SMVImageInfo[key],10)+"\n";
}
else{
  for(key in BMPImageInfo) output+= BMPImageInfo[key][0] +" - "+ byteInfo(byteFile,BMPImageInfo[key],10)+"\n";
}
document.querySelector("#output").innerText = output;
});
}

//Выводит зашумленное изображение на экран
function showNoisyImage(){
getCanvasPixels().then(function(image){
  image = noisyImage(image);
  fillCanvas(image);
});
}

//Выводит отфильрованное изображение на экран
function showFilteredImage(){
getCanvasPixels().then(function(image){
  image = filterImage(image);
  fillCanvas(image);
});
}

//Выводит монохромное изображение на экран
function showGreyImage(){
getCanvasPixels().then(function(image){
  image = imageProcessingFunctions.greyImage(image);
  fillCanvas(image);
});
}

//Сохраняет изображение в моём формате
function saveCanvasImageSpecial(){
getfile("#input1").then(function(file){
   var fileSMV = new Uint8ClampedArray(file.length-(54-21));
   var iterator=0;
  //идентификатор типа файла (2 байта)
  fileSMV[iterator++] = 1; fileSMV[iterator++] = 0;
  //ширина изображения в пикселях (4 байта)
  for(var i=BMPImageInfo.rasterWidth[1]-1;i<BMPImageInfo.rasterWidth[2];i++)fileSMV[iterator++]=file[i];
  //высота изображения в пикселях (4 байта)
  for(var i=BMPImageInfo.rasterHeight[1]-1;i<BMPImageInfo.rasterHeight[2];i++)fileSMV[iterator++]=file[i];
  //глубина цвета (количество бит на один пиксель) (1 байт)
  fileSMV[iterator++] = 24;
  //размер заголовка в байтах (2 байта)
  fileSMV[iterator++] = 21;
  fileSMV[iterator++] = 0;
  //размер файла в байтах (4 байта)
  for(var i=BMPImageInfo.fileSize[1]-1;i<BMPImageInfo.fileSize[2];i++)fileSMV[iterator++]=file[i];
  //количество различных цветов на изображении (4 байта)
  fileSMV[iterator++]=0;
  fileSMV[iterator++]=0;
  fileSMV[iterator++]=0;
  fileSMV[iterator++]=0;
  //итого заголовок - 21 байт
  saveImage(fileSMV,21);
});
}

//Сохраняет изображение в обычном формате
function saveCanvasImageNormal(){
getfile("#input1").then(function(file){
  var headerSize=54;
  if(parseInt(byteInfo(file,BMPImageInfo.formatType,10))==1)headerSize=21;
  saveImage(file,headerSize);
});
}

//
//
//
//
//

/* НАСТРОЙКА ИНТЕРФЕЙСА */
let but1 = document.querySelector("#button1");
but1.onclick = loadImage;

let but5 = document.querySelector("#button5");
but5.onclick = saveCanvasImageSpecial;

let but6 = document.querySelector("#button6");
but6.onclick = saveCanvasImageNormal;

let select = document.querySelector('#select');

for(func of imageProcessingFunctions){
let option = document.createElement("option");
option.value = func.value;
option.textContent = func.value;
select.appendChild(option);
}
imageProcessingFunctions.find(e=>{return (e.value == select.value);}).name();
select.oninput = function(e){
imageProcessingFunctions.find(e=>{return (e.value == select.value);}).name();
}

document.querySelector("#canvas").onclick = function(e) {
const x = e.offsetX;
const y = e.offsetY;
const ctx = document.querySelector("#canvas").getContext("2d");
const img_data = ctx.getImageData(x, y, 1, 1);
const pix = img_data.data;
document.querySelector("#chosenColor").textContent = `${pix[0]} ${pix[1]} ${pix[2]}`
document.querySelector("#color").style.backgroundColor = `rgba(${pix.join(',')})`
}
