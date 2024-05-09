
/* ДОПОЛНИТЕЛЬНЫЕ ФУНКЦИИ */

//Создаёт input
function createInput(type, value, placeholder){
    let input = document.createElement("input");
    input.type = type;
    input.value = value;
    input.placeholder = placeholder;
    return input;
}

//Создаёт fileInput
function createFileInput(inputId){
    let input = document.createElement("input");
    input.type = "file";
    input.id = inputId;
    return input;
}

//Создаёт button
function createButton(textContent){
    let button = document.createElement("button");
    button.textContent = textContent;
    return button;
}

//Создаёт checkbox
function createCheckbox(){
    let checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    return checkbox;
}

//Создаёт span с текстом
function createText(text){
    let span = document.createElement("span");
    span.textContent = text;
    return span;
}

//Затемняет пиксель на заданное число
function blurPixel(pixel){}

//Получить яркость пикселя
function getBrightness(pixel){}

//Умножает все значения пикселя на заданное число
function  multiplyPixel(pixel, factor){
    return {red:Math.floor(pixel.red*factor), green:Math.floor(pixel.green*factor), blue:Math.floor(pixel.blue*factor)};
}

//Суммирует значения двух пикселей
function sumTwoPixels(pixel1, pixel2){
    return {red:pixel1.red + pixel2.red, green:pixel1.green += pixel2.green, blue:pixel1.blue += pixel2.blue};
}

//Масштабировать изображение
function scaleImage(image, newHeight, newWidth){
    let height = image.length;
    let width = image[0].length;
    let newImage = [];
    for(let i=0;i<newHeight;i++){
        let tmpArray = [];
        let heightPos = (i*height)/newHeight;
        let i1 = Math.floor(heightPos);
        let i2 = i1+1;
        for(let j=0;j<newWidth;j++){
            let widthPos = (j*width)/newWidth;
            let j1 = Math.floor(widthPos);
            let j2 = j1+1;

            if((i2<height)&&(j2<width)){
                let pix1 = multiplyPixel(image[i1][j1],(1-(widthPos-j1)));
                let pix2 = multiplyPixel(image[i1][j2],(widthPos-j1));
                let resPix1 = sumTwoPixels(pix1,pix2);
    
                let pix3 = multiplyPixel(image[i2][j1],(1-(widthPos-j1)));
                let pix4 = multiplyPixel(image[i2][j2],(widthPos-j1));
                let resPix2 = sumTwoPixels(pix3,pix4);
    
                let pix5 = multiplyPixel(resPix1,(1-(heightPos-i1)));
                let pix6 = multiplyPixel(resPix2,(heightPos-i1));
                let resPix = sumTwoPixels(pix5,pix6);

                tmpArray.push(resPix);
            }
        }
        if(tmpArray.length>0) newImage.push(tmpArray);
    }
    return newImage;
}

//
//
//
//
//

/* МАКЕТ ДОПОЛНИТЕЛЬНОЙ ФУНКЦИИ */
/*
    document.querySelector("#container").innerHTML = [];
    let input = createInput("text", "1", "значение");
    let button = createButton("Зашумить изображение");
    button.onclick = function(){
        getCanvasPixels().then(function(image){
            let height = image.length;
            let width = image[0].length;
            for(let i=0;i<height;i++){
                for(let j=0;j<width;j++){
                    image[i][j].red = 0;
                    image[i][j].green = 0;
                    image[i][j].blue = 0;
                }
            }
            fillCanvas(image);
        });
    }
    let div = document.createElement("div");
    div.style.margin = "10px";
    div.appendChild(input);
    div.appendChild(button);
    document.querySelector("#container").appendChild(div);
*/


/* ФУНКЦИИ ОБРАБОТКИ ИЗОБРАЖЕНИЙ */

//Зашумляет изображение
function noisyImage(){
    document.querySelector("#container").innerHTML = [];
    let input = createInput("text","0.1","значение"); 
    let button = createButton("Зашумить изображение");
    button.onclick = function(){
        getCanvasPixels().then(function(image){
            let threshold = parseFloat(input.value);
            for(var i=0;i<image.length;i++){
                for(var j=0;j<image[0].length;j++){
                    if(Math.random()<threshold){
                        image[i][j].red = Math.floor(Math.random()*256);
                        image[i][j].green = Math.floor(Math.random()*256);
                        image[i][j].blue = Math.floor(Math.random()*256);
                    }
                }
            }
            fillCanvas(image);
        });
    }
    let div = document.createElement("div");
    div.style.margin = "10px";
    div.appendChild(input);
    div.appendChild(button);
    document.querySelector("#container").appendChild(div);
}

//Фильтрует изображение
function filterImage(){
    document.querySelector("#container").innerHTML = [];
    let button = createButton("Сделать фильтрацию изображения");
    button.onclick = function(){
        getCanvasPixels().then(function(image){
            let tmpImage = [];
            for(let i=0;i<image.length;i++){
                let tmpArray = [];
                for(let j=0;j<image[0].length;j++){
                    tmpArray.push(image[i][j]);
                }
                tmpImage.push(tmpArray);
            }
            for(let i=0;i<image.length;i++){
                for(let j=1;j<image[0].length-1;j++){
                    let red = [];
                    let green = [];
                    let blue = [];
                    let ids = [[i,j-1],[i,j],[i,j+1]];
                    let koefs = [2,3,2];
                    for(let g=0;g<ids.length;g++){
                        for(let u=0;u<koefs[g];u++)red.push(tmpImage[ids[g][0]][ids[g][1]].red);
                    }
                    for(let g=0;g<ids.length;g++){
                        for(let u=0;u<koefs[g];u++)green.push(tmpImage[ids[g][0]][ids[g][1]].green);
                    }
                    for(let g=0;g<ids.length;g++){ 
                        for(let u=0;u<koefs[g];u++)blue.push(tmpImage[ids[g][0]][ids[g][1]].blue);
                    }
                    red = red.sort();
                    green = green.sort();
                    blue = blue.sort();
                    image[i][j].red = red[3];
                    image[i][j].green = green[3];
                    image[i][j].blue = blue[3];
                }
            }
            fillCanvas(image);
        });
    }
    let div = document.createElement("div");
    div.style.margin = "10px";
    div.appendChild(button);
    document.querySelector("#container").appendChild(div);
}

//Выделяет контуры на изображении
function greyImage(){
    document.querySelector("#container").innerHTML = [];
    let button = createButton("Выделить контуры изображения");
    button.onclick = function(){
        getCanvasPixels().then(function(image){
            let brightness = [];
            let tmpBrightness = [];
            for(var i=0;i<image.length;i++){
                let tmpArray1 = [];
                let tmpArray2 = [];
                for(var j=0;j<image[0].length;j++){
                    tmpArray1.push(Math.round(image[i][j].red * 0.1 + image[i][j].green * 0.6 + image[i][j].blue * 0.3));
                    tmpArray2.push(Math.round(image[i][j].red * 0.1 + image[i][j].green * 0.6 + image[i][j].blue * 0.3));
                }
                brightness.push(tmpArray1);
                tmpBrightness.push(tmpArray2);
            }
            for(let i=1;i<image.length-1;i++){
                for(let j=1;j<image[0].length-1;j++){
                let newX = 0;
                let ids = [{id:[i-1,j-1], koef:1},{id:[i-1,j], koef:1},{id:[i-1,j+1], koef:1},
                {id:[i,j-1], koef:1},{id:[i,j], koef:-2},{id:[i,j+1], koef:1},
                {id:[i+1,j-1], koef:-1},{id:[i+1,j], koef:-1},{id:[i+1,j+1], koef:-1},];
                
                for(let q=0;q<ids.length;q++){
                    newX += tmpBrightness[ids[q].id[0]][ids[q].id[1]]*ids[q].koef;
                }
                brightness[i][j]=newX;
                }
            }
            let thresholdArray = [];
            for(let i=0;i<image.length;i++){
                for(let j=0;j<image[0].length;j++){
                    thresholdArray.push(brightness[i][j]);
                }
            }
            thresholdArray.sort();
            let threshold = thresholdArray[Math.floor(thresholdArray.length*0.8)];
            for(let i=0;i<image.length;i++){
                for(let j=0;j<image[0].length;j++){
                    if(brightness[i][j]>threshold) {
                        brightness[i][j]=0;
                    }
                    else {
                        brightness[i][j] = 255;
                    }
                    image[i][j].red = brightness[i][j];
                    image[i][j].green = brightness[i][j];
                    image[i][j].blue = brightness[i][j];
                }
            }
            fillCanvas(image);
        });
    }
    let div = document.createElement("div");
    div.style.margin = "10px";
    div.appendChild(button);
    document.querySelector("#container").appendChild(div);
}

//1 Добавляет источник света по заданным координатам.
function addingLightSouce(){
    document.querySelector("#container").innerHTML = [];
    let input = createInput("text","0.1","значение"); 
    let button = createButton("Выделить контуры изображения");
    button.onclick = function(){
        getCanvasPixels().then(function(image){

            fillCanvas(image);
        });
    }
    let div = document.createElement("div");
    div.style.margin = "10px";
    div.appendChild(input);
    div.appendChild(button);
    document.querySelector("#container").appendChild(div);
}

//2 Заменяет на черный преобладающий на изображении цвет
function replaceWithBlack(){
    document.querySelector("#container").innerHTML = [];
    let button = createButton("Заменить на чёрный преобладающий на изображении цвет");
    button.onclick = function(){
        getCanvasPixels().then(function(image){
            let counter = new Array(256);
            for(let i=0;i<256;i++){
                counter[i]=new Array(256);
                for(let j=0;j<256;j++){
                    counter[i][j]=new Array(256);
                    for(let g=0;g<256;g++){
                        counter[i][j][g]=0;
                    }
                }
            }
            for(let i=0;i<image.length;i++){
                for(let j=0;j<image[0].length;j++){
                    counter[image[i][j].red][image[i][j].green][image[i][j].blue]++;
                }
            }
            let maxId = 0;
            let maxCount = counter[0][0][0];
            let maxRed = 0;
            let maxGreen = 0;
            let maxBlue = 0;
            for(let i=1;i<counter.length;i++){
                for(let j=1;j<counter[i].length;j++){
                    for(let g=1;g<counter[i][j].length;g++){
                        if(counter[i][j][g]>maxCount){
                            maxId = i;
                            maxCount = counter[i][j][g];
                            maxRed = i;
                            maxGreen = j;
                            maxBlue = g;
                        }
                    }
                }
            }
            let maxCountPixel = { red:maxRed, green:maxGreen, blue:maxBlue };
            console.log(`${maxCountPixel.red} ${maxCountPixel.green} ${maxCountPixel.blue}`);
            for(let i=0;i<image.length;i++){
                for(let j=0;j<image[0].length;j++){
                    if(image[i][j].red==maxCountPixel.red && image[i][j].green==maxCountPixel.green && image[i][j].blue==maxCountPixel.blue){
                        image[i][j].red = 0;
                        image[i][j].green = 0;
                        image[i][j].blue = 0;
                    }
                }
            }
            fillCanvas(image);
        });
    }
    let div = document.createElement("div");
    div.style.margin = "10px";
    div.appendChild(button);
    document.querySelector("#container").appendChild(div);
}

//3 Эффект сепия с коэффициентом усиления.
function sepiaEffect(){

}

//4 Преобразовывает фрагмент изображения NxN по заданным координатам в оттенки серого изображение
function convertFragmentToGrayscale(){
    document.querySelector("#container").innerHTML = [];
    let inputFirst = createInput("text","10","x1"); 
    let inputSecond = createInput("text","10","y1"); 
    let inputThird = createInput("text","200","x2"); 
    let inputFourth = createInput("text","200","y2"); 
    let button = createButton("Преобразовать в чёрно-белое изоражение");
    button.onclick = function(){
        getCanvasPixels().then(function(image){
            let height = image.length;
            let width = image[0].length;
            let x1 = parseInt(inputFirst.value);
            let y1 = parseInt(inputSecond.value);
            let x2 = parseInt(inputThird.value);
            let y2 = parseInt(inputFourth.value);
            let newImage = [];
            for(let i=y1-1;i<y2-1;i++){
                for(let j=x1-1;j<x2-1;j++){
                    let brightness = Math.round(image[i][j].red * 0.1 + image[i][j].green * 0.6 + image[i][j].blue * 0.3);
                    image[i][j].red = brightness;
                    image[i][j].green = brightness;
                    image[i][j].blue = brightness;
                }
            }
            fillCanvas(image);
        });
    }
    let div = document.createElement("div");
    div.style.margin = "10px";
    div.appendChild(inputFirst);
    div.appendChild(inputSecond);
    div.appendChild(inputThird);
    div.appendChild(inputFourth);
    div.appendChild(button);
    document.querySelector("#container").appendChild(div);
}

//5 Поворачивает на N градусов.
function rotate(){

}

//6 Изменяет насыщенности изображения.
function changeImageSaturation(){

}

//7 Отражает по горизонтали
function reflectHorizontally(){
    document.querySelector("#container").innerHTML = [];
    let button = createButton("Отразить по горизонтали");
        button.onclick = function(){
            getCanvasPixels().then(function(image){
                let half = Math.floor(image[0].length/2);
                for(let i=0;i<image.length;i++){
                    for(let j=0;j<half;j++){
                        let tmpPix = image[i][j];
                        image[i][j] = image[i][image[0].length-j-1];
                        image[i][image[0].length-j-1] = tmpPix;
                    }
                }
                fillCanvas(image);
            });
        }
        let div = document.createElement("div");
        div.style.margin = "10px";
        div.appendChild(button);
        document.querySelector("#container").appendChild(div);
}

//8 Переходит к оттенкам серого по выбранному каналу или яркости.
function convertToGrayscaleByChannelOrBrightness(){

}

//9 Накладывает по заданным координатам копию другого изображения.
function overlayImage(){
    document.querySelector("#container").innerHTML = [];
    let fileInput = createFileInput("overlayImage");
    let inputFirst = createInput("text", "200", "x");
    let inputSecond = createInput("text", "200", "y");
    let button = createButton("Наложить изображение");
    button.onclick = function(){
        getCanvasPixels().then(function(image){
            let height = image.length;
            let width = image[0].length;
            let x = parseInt(inputFirst.value);
            let y = parseInt(inputSecond.value);
            fileRaster("#overlayImage").then(function(inputImage){
                for(let i=y;i<height;i++){
                    for(let j=x;j<width;j++){
                        image[i][j].red = inputImage[i-y][j-x].red;
                        image[i][j].green = inputImage[i-y][j-x].green;
                        image[i][j].blue = inputImage[i-y][j-x].blue;
                    }
                }
                fillCanvas(image);
            });
        });
    }
    let div = document.createElement("div");
    div.style.margin = "10px";
    div.appendChild(fileInput);
    div.appendChild(inputFirst);
    div.appendChild(inputSecond);
    div.appendChild(button);
    document.querySelector("#container").appendChild(div);
}

//10 Прямоугольная текстурированная рамка заданным фрагментом изображения.
function texturedFrameWithGivenImageFragment(){

}

//11 Заменяет фоновый цвет на другой цвет и изображение.
function replacingBackgroundColor(){
    document.querySelector("#container").innerHTML = [];
    let fileInput = createFileInput("overlayImage");
    let span = createText("На выбранный цвет");
    let checkbox = createCheckbox();
    let button = createButton("Заменить фон");
    button.onclick = function(){
        getCanvasPixels().then(function(image){
            let height = image.length;
            let width = image[0].length;
            let chosenColor = (document.querySelector("#chosenColor").textContent).split(" ");
            let counter = new Array(256);
            for(let i=0;i<256;i++){
                counter[i]=new Array(256);
                for(let j=0;j<256;j++){
                    counter[i][j]=new Array(256);
                    for(let g=0;g<256;g++){
                        counter[i][j][g]=0;
                    }
                }
            }
            for(let i=0;i<image.length;i++){
                for(let j=0;j<image[0].length;j++){
                    counter[image[i][j].red][image[i][j].green][image[i][j].blue]++;
                }
            }
            let maxId = 0;
            let maxCount = counter[0][0][0];
            let maxRed = 0;
            let maxGreen = 0;
            let maxBlue = 0;
            for(let i=1;i<counter.length;i++){
                for(let j=1;j<counter[i].length;j++){
                    for(let g=1;g<counter[i][j].length;g++){
                        if(counter[i][j][g]>maxCount){
                            maxId = i;
                            maxCount = counter[i][j][g];
                            maxRed = i;
                            maxGreen = j;
                            maxBlue = g;
                        }
                    }
                }
            }
            let maxCountPixel = { red:maxRed, green:maxGreen, blue:maxBlue };
            if(checkbox.checked){
                for(let i=0;i<height;i++){
                    for(let j=0;j<width;j++){
                        if(image[i][j].red==maxCountPixel.red && image[i][j].green==maxCountPixel.green && image[i][j].blue==maxCountPixel.blue){
                            image[i][j].red = chosenColor[0];
                            image[i][j].green = chosenColor[1];
                            image[i][j].blue = chosenColor[2];
                        }
                    }
                }
                fillCanvas(image);
            } else {
                fileRaster("#overlayImage").then(function(inputImage){
                    for(let i=0;i<height;i++){
                        for(let j=0;j<width;j++){
                            if(image[i][j].red==maxCountPixel.red && image[i][j].green==maxCountPixel.green && image[i][j].blue==maxCountPixel.blue){
                                image[i][j].red = inputImage[i][j].red;
                                image[i][j].green = inputImage[i][j].green;
                                image[i][j].blue = inputImage[i][j].blue;
                            }
                        }
                    }
                    fillCanvas(image);
                });
            }
        });
    }
    let div = document.createElement("div");
    div.style.margin = "10px";
    div.appendChild(fileInput);
    div.appendChild(span);
    div.appendChild(checkbox);
    div.appendChild(button);
    document.querySelector("#container").appendChild(div);
}

//12 Прямоугольная рамка с градиентной заливкой выбранных цветов.
function frameWithGradientFillOfSelectedColors(){

}

//13 Добавляет на изображение затемнение\осветление от углов к центру черным\белым цветом (виньетирование)
function lighteningFromTheCornersToTheCenter(){
    document.querySelector("#container").innerHTML = [];
    let button = createButton("Добавить виньетирование");
    button.onclick = function(){
        getCanvasPixels().then(function(image){
            let height = image.length;
            let width = image[0].length;
            let radius = Math.floor((height<width?height:width)/2);
            let delta = Math.floor(Math.abs((height-width)/2));
            let halfh = Math.floor(height/2);
            let halfw = Math.floor(width/2);
            for(let i=0;i<halfh;i++){
                for(let j=0;j<halfw;j++){
                    let change = 0;
                    if(height>width){
                        if(i<(j*(halfh/halfw))){
                            let h1 = i;
                            let h2 = radius+delta-i;
                            let w2 = radius-j;
                            let w1 = (w2*h1)/h2;
                            let l1 = Math.floor(Math.pow(w1,2)+Math.pow(h1,2));
                            let l2 = Math.floor(Math.pow(w2,2)+Math.pow(h2,2));
                            change = Math.floor((l2-radius)/(l2-radius+l1)*255);
                        } else {
                            let h1 = j;
                            let h2 = radius-j;
                            let w2 = radius-(i-delta);
                            let w1 = (w2*h1)/h2;
                            let l1 = Math.floor(Math.pow(w1,2)+Math.pow(h1,2));
                            let l2 = Math.floor(Math.pow(w2,2)+Math.pow(h2,2));
                            change = Math.floor((l2-radius)/(l2-radius+l1)*255);
                        }
                    } else {
                        if(i<(j*(halfh/halfw))){
                            let h1 = i;
                            let h2 = radius-i;
                            let w2 = radius-(j-delta);
                            let w1 = (w2*h1)/h2;
                            let l1 = Math.floor(Math.pow(w1,2)+Math.pow(h1,2));
                            let l2 = Math.floor(Math.pow(w2,2)+Math.pow(h2,2));
                            change = Math.floor((l2-radius)/(l2-radius+l1)*255);
                        } else {
                            let h1 = j;
                            let h2 = radius+delta-j;
                            let w2 = radius-i;
                            let w1 = (w2*h1)/h2;
                            let l1 = Math.floor(Math.pow(w1,2)+Math.pow(h1,2));
                            let l2 = Math.floor(Math.pow(w2,2)+Math.pow(h2,2));
                            change = Math.floor((l2-radius)/(l2-radius+l1)*255);
                        }
                    }
                    image[i][j].red -= change;
                    if(image[i][j].red<0) image[i][j].red = 0;
                    image[i][j].green -= change;
                    if(image[i][j].green<0) image[i][j].green = 0;
                    image[i][j].blue  -= change;
                    if(image[i][j].blue<0) image[i][j].blue = 0;

                    image[i][width-1-j].red -= change;
                    if(image[i][width-1-j].red<0) image[i][width-1-j].red = 0;
                    image[i][width-1-j].green -= change;
                    if(image[i][width-1-j].green<0) image[i][width-1-j].green = 0;
                    image[i][width-1-j].blue  -= change;
                    if(image[i][width-1-j].blue<0) image[i][width-1-j].blue = 0;

                    image[height-1-i][j].red -= change;
                    if(image[height-1-i][j].red<0) image[height-1-i][j].red = 0;
                    image[height-1-i][j].green -= change;
                    if(image[height-1-i][j].green<0) image[height-1-i][j].green = 0;
                    image[height-1-i][j].blue  -= change;
                    if(image[height-1-i][j].blue<0) image[height-1-i][j].blue = 0;

                    image[height-1-i][width-1-j].red -= change;
                    if(image[height-1-i][width-1-j].red<0) image[height-1-i][width-1-j].red = 0;
                    image[height-1-i][width-1-j].green -= change;
                    if(image[height-1-i][width-1-j].green<0) image[height-1-i][width-1-j].green = 0;
                    image[height-1-i][width-1-j].blue -= change;
                    if(image[height-1-i][width-1-j].blue<0) image[height-1-i][width-1-j].blue = 0;
                }
            }
            fillCanvas(image);
        });
    }
    let div = document.createElement("div");
    div.style.margin = "10px";
    div.appendChild(button);
    document.querySelector("#container").appendChild(div);
}

//14 Ослабляет заданный цветовой канал на N
function attenuateColorChannel(){
    document.querySelector("#container").innerHTML = [];
    let inputRed = createInput("text","0","красный"); 
    let inputGreen = createInput("text","0","зелёный"); 
    let inputBlue = createInput("text","0","синий"); 
    let button = createButton("Ослабить каналы");
    button.onclick = function(){
        getCanvasPixels().then(function(image){
            let height = image.length;
            let width = image[0].length;
            let redDecrement = parseInt(inputRed.value);
            let greenDecrement = parseInt(inputGreen.value);
            let blueDecrement = parseInt(inputBlue.value);
            for(let i=0;i<height;i++){
                for(let j=0;j<width;j++){
                    image[i][j].red -= redDecrement;
                    if(image[i][j].red<0) image[i][j].red = 0;
                    image[i][j].green -= greenDecrement;
                    if(image[i][j].green<0) image[i][j].green = 0;
                    image[i][j].blue -= blueDecrement;
                    if(image[i][j].blue<0) image[i][j].blue = 0;
                }
            }
            fillCanvas(image);
        });
    }
    let div = document.createElement("div");
    div.style.margin = "10px";
    div.appendChild(inputRed);
    div.appendChild(inputGreen);
    div.appendChild(inputBlue);
    div.appendChild(button);
    document.querySelector("#container").appendChild(div);
}

//15 Настраивает оттенки на изображении.
function adjustingImageTones(){

}

//16 Рисует рамку в виде сердца цветом, который преобладает на изображении.
function drawHeartFrame(){

}

//17 Затемняет изображение на заданное N
function dimmingImage(){
    document.querySelector("#container").innerHTML = [];
    let input = createInput("text","0","значение"); 
    let button = createButton("Затемнить изображение");
    button.onclick = function(){
        getCanvasPixels().then(function(image){
            let height = image.length;
            let width = image[0].length;
            let decrement = parseInt(input.value)*3;
            for(let i=0;i<height;i++){
                for(let j=0;j<width;j++){
                    let sum = image[i][j].red + image[i][j].green + image[i][j].blue;
                    image[i][j].red -= Math.floor(decrement*(image[i][j].red/sum));
                    if(image[i][j].red<0) image[i][j].red = 0;
                    image[i][j].green -= Math.floor(decrement*(image[i][j].green/sum));
                    if(image[i][j].green<0) image[i][j].green = 0;
                    image[i][j].blue -= Math.floor(decrement*(image[i][j].blue/sum));
                    if(image[i][j].blue<0) image[i][j].blue = 0;
                }
            }
            fillCanvas(image);
        });
    }
    let div = document.createElement("div");
    div.style.margin = "10px";
    div.appendChild(input);
    div.appendChild(button);
    document.querySelector("#container").appendChild(div);
}

//18 Растягивает в ширину в M раз, M — может быть дробным числом.
function stretchingImageInWidth(){

}

//19 Копирует фрагмент NxM из левого верхнего угла в область по заданным координатам
function copyFragmentToTheArea(){
    document.querySelector("#container").innerHTML = [];
    let inputFirst = createInput("text","50","N"); 
    let inputSecond = createInput("text","100","M"); 
    let inputThird = createInput("text","100","x"); 
    let inputFourth = createInput("text","100","y"); 
    let button = createButton("Копировать фрагмент");
    button.onclick = function(){
        getCanvasPixels().then(function(image){
            let height = image.length;
            let width = image[0].length;
            let n = parseInt(inputFirst.value);
            let m = parseInt(inputSecond.value);
            let x = parseInt(inputThird.value);
            let y = parseInt(inputFourth.value);
            let newImage = [];
            for(let i=0;i<n;i++){
                let tmpArray = []
                for(let j=0;j<m;j++){
                    tmpArray.push(image[i][j]);
                }
                newImage.push(tmpArray);
            }
            for(let i=y-1;i<y-1+n;i++){
                for(let j=x-1;j<x-1+m;j++) image[i][j] = newImage[i-y+1][j-x+1];
            }
            fillCanvas(image);
        });
    }
    let div = document.createElement("div");
    div.style.margin = "10px";
    div.appendChild(inputFirst);
    div.appendChild(inputSecond);
    div.appendChild(inputThird);
    div.appendChild(inputFourth);
    div.appendChild(button);
    document.querySelector("#container").appendChild(div);
}

//20 Наносит сетку с размерностью клетки NxN пикселей выбранным цветом.
function drawGrid(){
    document.querySelector("#container").innerHTML = [];
    let button = createButton("Арестовать");
    button.onclick = function(){
        getCanvasPixels().then(function(image){
            let height = image.length;
            let width = image[0].length;
            let step = 80;
            for(let i=0;i<height;i+=step){
            for(let j=0;j<width;j++){
                    for(let s=0;s<20;s++){
                    if((j+s)<width){
                    image[i+s][j].red = 0;
                    image[i+s][j].green = 0;
                    image[i+s][j].blue = 0;
                    }
                    }
            }
            }
            for(let i=0;i<height;i++){
            for(let j=0;j<width;j+=step){
                    for(let s=0;s<20;s++){
                    if((j+s)<width){
                    image[i][j+s].red = 0;
                    image[i][j+s].green = 0;
                    image[i][j+s].blue = 0;
                    }
                    }
            }
            }
            fillCanvas(image);
        });
    }
    let div = document.createElement("div");
    div.style.margin = "10px";
    div.appendChild(button);
    document.querySelector("#container").appendChild(div);
}

//21 Усиляет резкость на изображении.
function sharpenImage(){

}

//22 Перестанавливает цветовые каналы
function reshuffleChannels(){
    document.querySelector("#container").innerHTML = [];
    let inputFirst = createInput("text","red","первый"); 
    let inputSecond = createInput("text","green","второй"); 
    let inputThird = createInput("text","blue","третий"); 
    let button = createButton("Переставить каналы");
    button.onclick = function(){
        getCanvasPixels().then(function(image){
            let height = image.length;
            let width = image[0].length;
            let first = inputFirst.value;
            let second = inputSecond.value;
            let third = inputThird.value;
            for(let i=0;i<height;i++){
                for(let j=0;j<width;j++){
                    let red = image[i][j].red;
                    let green = image[i][j].green;
                    let blue = image[i][j].blue;
                    if(first=="green") image[i][j].red = green;
                    else if(first=="blue") image[i][j].red = blue;
                    if(second=="red") image[i][j].green = red;
                    else if(second=="blue") image[i][j].green = blue;
                    if(third=="red") image[i][j].blue = red;
                    else if(third=="green") image[i][j].blue = green;
                }
            }
            fillCanvas(image);
        });
    }
    let div = document.createElement("div");
    div.style.margin = "10px";
    div.appendChild(inputFirst);
    div.appendChild(inputSecond);
    div.appendChild(inputThird);
    div.appendChild(button);
    document.querySelector("#container").appendChild(div);
}

//23 Накладывает изображения с коэффициентом прозрачности.
function overlayImagesWithTransparency(){

}

//24 Регулирует теплоту тонов на изображении.
function adjustingImageWarmth(){

}

//25 Обрезает изображение по заданным координатам
function cutImage(){
    document.querySelector("#container").innerHTML = [];
    let inputFirst = createInput("text","10","x1"); 
    let inputSecond = createInput("text","10","y1"); 
    let inputThird = createInput("text","200","x2"); 
    let inputFourth = createInput("text","200","y2"); 
    let button = createButton("Обрезать изображение");
    button.onclick = function(){
        getCanvasPixels().then(function(image){
            let height = image.length;
            let width = image[0].length;
            let x1 = parseInt(inputFirst.value);
            let y1 = parseInt(inputSecond.value);
            let x2 = parseInt(inputThird.value);
            let y2 = parseInt(inputFourth.value);
            let newImage = [];
            for(let i=y1-1;i<y2-1;i++){
                let tmpArray = [];
                for(let j=x1-1;j<x2-1;j++) tmpArray.push(image[i][j]);
                newImage.push(tmpArray);
            }
            fillCanvas(newImage);
        });
    }
    let div = document.createElement("div");
    div.style.margin = "10px";
    div.appendChild(inputFirst);
    div.appendChild(inputSecond);
    div.appendChild(inputThird);
    div.appendChild(inputFourth);
    div.appendChild(button);
    document.querySelector("#container").appendChild(div);
}

//26 Преобразовывает фрагмент изображения NxN по заданным координатам в черно-белое изображение
function convertInBlackWhite(){
    document.querySelector("#container").innerHTML = [];
    let inputFirst = createInput("text","10","x1"); 
    let inputSecond = createInput("text","10","y1"); 
    let inputThird = createInput("text","200","x2"); 
    let inputFourth = createInput("text","200","y2"); 
    let button = createButton("Преобразовать в чёрно-белое изоражение");
    button.onclick = function(){
        getCanvasPixels().then(function(image){
            let height = image.length;
            let width = image[0].length;
            let x1 = parseInt(inputFirst.value);
            let y1 = parseInt(inputSecond.value);
            let x2 = parseInt(inputThird.value);
            let y2 = parseInt(inputFourth.value);
            for(let i=y1-1;i<y2-1;i++){
                for(let j=x1-1;j<x2-1;j++){
                    let brightness = Math.round(image[i][j].red * 0.1 + image[i][j].green * 0.6 + image[i][j].blue * 0.3);
                    if(brightness>122){
                        image[i][j].red = 255;
                        image[i][j].green = 255;
                        image[i][j].blue = 255;
                    } else {
                        image[i][j].red = 0;
                        image[i][j].green = 0;
                        image[i][j].blue = 0;
                    }
                }
            }
            fillCanvas(image);
        });
    }
    let div = document.createElement("div");
    div.style.margin = "10px";
    div.appendChild(inputFirst);
    div.appendChild(inputSecond);
    div.appendChild(inputThird);
    div.appendChild(inputFourth);
    div.appendChild(button);
    document.querySelector("#container").appendChild(div);
}

//27 Измененяет яркость изображения.
function changeBrightness(){

}

//28 Преобразует в негатив
function convertToNegative(){
    document.querySelector("#container").innerHTML = [];
    let button = createButton("Преобразовать в негатив");
    button.onclick = function(){
        getCanvasPixels().then(function(image){
            let height = image.length;
            let width = image[0].length;
            for(let i=0;i<height;i++){
                for(let j=0;j<width;j++){
                    image[i][j].red = 255 - image[i][j].red;
                    image[i][j].green = 255 - image[i][j].green;
                    image[i][j].blue = 255 - image[i][j].blue;
                }
            }
            fillCanvas(image);
        });
    }
    let div = document.createElement("div");
    div.style.margin = "10px";
    div.appendChild(button);
    document.querySelector("#container").appendChild(div);
}

//29 Раскрашивает область одинакового цвета в случайные цвета.
function colorAreasInRandomColors(){

}

//30 Отражает по диагонали.
function reflectDiagonally(){
    document.querySelector("#container").innerHTML = [];
    let text1 = createText("Слева направо, сверху вниз");
    let checkbox1 = createCheckbox();
    let text2 = createText("Слева направо, снизу вверх");
    let checkbox2 = createCheckbox();
    let text3 = createText("Справа налево, сверху вниз");
    let checkbox3 = createCheckbox();
    let text4 = createText("Справа налево, снизу вверх");
    let checkbox4 = createCheckbox();
    let button = createButton("Отразить по диагонали");
    button.onclick = function(){
        getCanvasPixels().then(function(image){
            	let half = Math.floor(image[0].length/2);
		for(let i=0;i<image.length;i++){
		    for(let j=0;j<half;j++){
		        let tmpPix = image[i][j];
		        image[i][j] = image[i][image[0].length-j-1];
		        image[i][image[0].length-j-1] = tmpPix;
		    }
		}
		half = Math.floor(image.length/2);
		for(let j=0;j<image[0].length;j++){
		    for(let i=0;i<half;i++){
		        let tmpPix = image[i][j];
		        image[i][j] = image[image.length-i-1][j];
		        image[image.length-i-1][j] = tmpPix;
		    }
		}
            fillCanvas(image);
        });
    }
    let div = document.createElement("div");
    div.style.margin = "10px";
    div.appendChild(text1);
    div.appendChild(checkbox1);
    div.appendChild(text2);
    div.appendChild(checkbox2);
    div.appendChild(text3);
    div.appendChild(checkbox3);
    div.appendChild(text4);
    div.appendChild(checkbox4);
    div.appendChild(button);
    document.querySelector("#container").appendChild(div);
}

//31 Растягивает в высоту в M раз, M — может быть дробным числом.
function stretchingImageInHeight(){
    document.querySelector("#container").innerHTML = [];
    let input = createInput("text","2","значение"); 
    let button = createButton("Растянуть изображение в высоту");
    button.onclick = function(){
        getCanvasPixels().then(function(image){
            let height = image.length;
            let width = image[0].length;
            let factor = parseFloat(input.value);
            let newHeight = Math.floor(height*factor);
            image = scaleImage(image,newHeight,width);
            fillCanvas(image);
        });
    }
    let div = document.createElement("div");
    div.style.margin = "10px";
    div.appendChild(input);
    div.appendChild(button);
    document.querySelector("#container").appendChild(div);
}

//32 Регулирует контрастность.
function adjustingImageContrast(){

}

//33 Сжимает по ширине в М раз.
function widthCompression(){
    document.querySelector("#container").innerHTML = [];
    let input = createInput("text","2","значение"); 
    let button = createButton("Сжать изображение по ширине");
    button.onclick = function(){
        getCanvasPixels().then(function(image){
            let height = image.length;
            let width = image[0].length;
            if(Number.isNaN(parseFloat(input.value))) alert("Введено не числовое значение!!!");
            else if(parseFloat(input.value)<0) alert("Введено отрицательное значение!!!");
            else if(parseFloat(input.value)==0) alert("Введено нулевое значение!!!");
            else{
            let factor = parseFloat(input.value);
            let newWidth = Math.floor(width/factor);
            image = scaleImage(image,height,newWidth);
            fillCanvas(image);
            }
        });
    }
    let div = document.createElement("div");
    div.style.margin = "10px";
    div.appendChild(input);
    div.appendChild(button);
    document.querySelector("#container").appendChild(div);
}

//34 Накладывает изображения с по принципу Darken Color*.
function overlayImagesUsingDarkenColorPrinciple(){

}

//35 Увеличивает в M раз, M — может быть дробным числом.
function magnification(){
    document.querySelector("#container").innerHTML = [];
    let input = createInput("text","2","значение"); 
    let button = createButton("Увеличить изображение");
    button.onclick = function(){
        getCanvasPixels().then(function(image){
            let height = image.length;
            let width = image[0].length;
            let factor = parseFloat(input.value);
            let newHeight = Math.floor(height*factor);
            let newWidth = Math.floor(width*factor);
            image = scaleImage(image,newHeight,newWidth);
            fillCanvas(image);
        });
    }
    let div = document.createElement("div");
    div.style.margin = "10px";
    div.appendChild(input);
    div.appendChild(button);
    document.querySelector("#container").appendChild(div);
}

//36 Накладывает изображения с по принципу Dissolve*.
function overlayImagesUsingDissolvePrinciple(){

}

//37 Горизонтальная штриховка с зазором N пикселей выбранным на изображении цветом.
function horizontalHatchingWithImageColor(){

}

//38 Обрезает изображение по заданным координатам (более 4 точек).
function cutImageMoreFourPoints(){

}

//39 Накладывает два изображения в шахматном порядке, размером клетки NxN.
function overlayImagesInCheckerboard(){

}

//40 Накладывает изображения с по принципу Screen*.
function overlayImagesUsingScreenPrinciple(){

}

//41 Фильтрация Гаусса с использованием библиотеки OpenCV.
function openCVFilterGaussian(){
    document.querySelector("#container").innerHTML = [];
    let button = createButton("Выполнить фильтрацию");
    button.onclick = function(){
        let imgElement = document.getElementById('imageSrc');
        imgElement.src = URL.createObjectURL(document.querySelector('#input1').files[0]);
        imgElement.onload = function() {
         let src = cv.imread(imgElement);
         let dst = new cv.Mat();
         let ksize = new cv.Size(3, 3);
         cv.GaussianBlur(src, dst, ksize, 0, 0, cv.BORDER_DEFAULT);
         cv.imshow('canvas', dst);
         src.delete();
         dst.delete();
        }
    }
    let div = document.createElement("div");
    div.style.margin = "10px";
    div.appendChild(button);
    document.querySelector("#container").appendChild(div);
}

//42 Выделения контура методом Собеля с использованием библиотеки OpenCV.
function openCVContouringSobel(){
    document.querySelector("#container").innerHTML = [];
    let button = createButton("Выделить контур");
    button.onclick = function(){
        let imgElement = document.getElementById('imageSrc');
        imgElement.src = URL.createObjectURL(document.querySelector('#input1').files[0]);
        imgElement.onload = function() {
            let src = cv.imread(imgElement);
            let dst = new cv.Mat();
            cv.Sobel(src, dst, -1, 1, 0, 3, 1, 90, cv.BORDER_DEFAULT);
            cv.imshow('canvas', dst);
            src.delete();
            dst.delete();
        }
    }
    let div = document.createElement("div");
    div.style.margin = "10px";
    div.appendChild(button);
    document.querySelector("#container").appendChild(div);
}

//43 Изменение цветового тона с использованием библиотеки OpenCV.
function changeColorTone(){
    document.querySelector("#container").innerHTML = [];
    let button = createButton("Изменить тон");
    button.onclick = function(){
        let imgElement = document.getElementById('imageSrc');
        imgElement.src = URL.createObjectURL(document.querySelector('#input1').files[0]);
        imgElement.onload = function() {
            let src = cv.imread(imgElement);
            let dst = new cv.Mat();
            let contrast = 1.5;
            let brightness = 0;
            cv.convertScaleAbs(src, dst, contrast, brightness);
            cv.imshow('canvas', dst);
            src.delete();
            dst.delete();
        }
    }
    let div = document.createElement("div");
    div.style.margin = "10px";
    div.appendChild(button);
    document.querySelector("#container").appendChild(div);
}

//
//
//
//
//

  /* ДОПОЛНИТЕЛЬНЫЕ ОБЪЕКТЫ */
  
  //Хранит функции обработки изображения
  let imageProcessingFunctions = [
    {
        value: "Ввести импульсное зашумление.",
        name: noisyImage
    },
    {
        value: "Сделать фильтрацию изображения.",
        name: filterImage
    },
    {
        value: "Выделить контуры изображения.",
        name: greyImage
    },
    {
        value: "Добавить источник света по заданным координатам.",
        name: addingLightSouce
    },
    {
        value: "Заменить на черный преобладающий на изображении цвет.",
        name: replaceWithBlack
    },
    {
        value: "Эффект сепия с коэффициентом усиления.",
        name: sepiaEffect
    },
    {
        value: "Преобразовать фрагмент изображения NxN по заданным координатам в оттенки серого изображение.",
        name: convertFragmentToGrayscale
    },
    {
        value: "Поворот на N градусов.",
        name: rotate
    },
    {
        value: "Изменение насыщенности изображения.",
        name: changeImageSaturation
    },
    {
        value: "Отражение по горизонтали.",
        name: reflectHorizontally
    },
    {
        value: "Переход к оттенкам серого по выбранному каналу или яркости.",
        name: convertToGrayscaleByChannelOrBrightness
    },
    {
        value: "Наложить по заданным координатам копию другого изображения.",
        name: overlayImage
    },
    {
        value: "Прямоугольная текстурированная рамка заданным фрагментом изображения.",
        name: texturedFrameWithGivenImageFragment
    },
    {
        value: "Замена фонового цвета на другой цвет и изображение.",
        name: replacingBackgroundColor
    },
    {
        value: "Прямоугольная рамка с градиентной заливкой выбранных цветов.",
        name: frameWithGradientFillOfSelectedColors
    },
    {
        value: "Добавить на изображении затемнение\осветление от углов к центру черным\белым цветом (виньетирование).",
        name: lighteningFromTheCornersToTheCenter
    },
    {
        value: "Ослабить заданный цветовой канал на N.",
        name: attenuateColorChannel
    },
    {
        value: "Настройка оттенков на изображении.",
        name: adjustingImageTones
    },
    {
        value: "Нарисовать рамку в виде сердца цветом, который преобладает на изображении.",
        name: drawHeartFrame
    },
    {
        value: "Затемнение изображения на заданное N.",
        name: dimmingImage
    },
    {
        value: "Растягивание в ширину в M раз, M — может быть дробным числом.",
        name: stretchingImageInWidth
    },
    {
        value: "Скопировать фрагмент NxM из левого верхнего угла в область по заданным координатам.",
        name: copyFragmentToTheArea
    },
    {
        value: "Нанести сетку с размерностью клетки NxN пикселей выбранным цветом.",
        name: drawGrid
    },
    {
        value: "Усиление резкости на изображении.",
        name: sharpenImage
    },
    {
        value: "Перестановка цветовых каналов.",
        name: reshuffleChannels
    },
    {
        value: "Наложение изображений с коэффициентом прозрачности.",
        name: overlayImagesWithTransparency
    },
    {
        value: "Регулировка теплоты тонов на изображении.",
        name: adjustingImageWarmth
    },
    {
        value: "Обрезать изображение по заданным координатам.",
        name: cutImage
    },
    {
        value: "Преобразовать фрагмент изображения NxN по заданным координатам в черно-белое изображение.",
        name: convertInBlackWhite
    },
    {
        value: "Изменение яркости изображения.",
        name: changeBrightness
    },
    {
        value: "Преобразование в негатив.",
        name: convertToNegative
    },
    {
        value: "Раскрасить области одинакового цвета в случайные цвета.",
        name: colorAreasInRandomColors
    },
    {
        value: "Отражение по диагонали.",
        name: reflectDiagonally
    },
    {
        value: "Растягивание в высоту в M раз, M — может быть дробным числом.",
        name: stretchingImageInHeight
    },
    {
        value: "Регулировка контрастности.",
        name: adjustingImageContrast
    },
    {
        value: "Сжатие по ширине в М раз.",
        name: widthCompression
    },
    {
        value: "Наложение изображений с по принципу Darken Color*.",
        name: overlayImagesUsingDarkenColorPrinciple
    },
    {
        value: "Увеличение в M раз, M — может быть дробным числом.",
        name: magnification
    },
    {
        value: "Наложение изображений с по принципу Dissolve*.",
        name: overlayImagesUsingDissolvePrinciple
    },
    {
        value: "Горизонтальная штриховка с зазором N пикселей выбранным на изображении цветом.",
        name: horizontalHatchingWithImageColor
    },
    {
        value: "Обрезать изображение по заданным координатам (более 4 точек).",
        name: cutImageMoreFourPoints
    },
    {
        value: "Наложение двух изображений в шахматном порядке, размером клетки NxN.",
        name: overlayImagesInCheckerboard
    },
    {
        value: "Наложение изображений с по принципу Screen*.",
        name: overlayImagesUsingScreenPrinciple
    },
    {
        value: "Фильтрация Гаусса с использованием библиотеки OpenCV.",
        name: openCVFilterGaussian
    },
    {
        value: "Выделения контура методом Собеля с использованием библиотеки OpenCV.",
        name: openCVContouringSobel
    },
    {
        value: "Изменение цветового тона с использованием библиотеки OpenCV.",
        name: changeColorTone
    }
    ]
