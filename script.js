function Animation(rate) { // создаем класс для анимации
        this.LastTime = 0;
        this.Rate = rate; // этот параметр задает как часто мы будет обновлять нашу анимацю в мм сек
        this.update = function () {}; // update, render - это пустые объекты, у каждого объекта они будут свои
        this.render = function () {};
      }  

      Animation.prototype.run = function(time) { // создаем метод, который будет обновлять все в цикле - он будет один для всех видов анимации, поэтому задаем его через прототип
        if((time - this.LastTime) > this.Rate ) { // метод run обновляет нашу анимацию методом update через заданные rate промежутками времени и вызывает метод render
          this.LastTime = time;
          this.update();
        }
        this.render();
      };


      //layer 1 - это горы и луна, то есть самый задний слой
      var layer1 = new Animation(30); // мы будем задавать rate в 30 мм сек для всех анимаций заднего плана, так как этот слой статичный, то нам не нужен метод update
      layer1.render = function () { // здесь мы просто напишем вывод этого слоя и добавим нашу анимацию в цикл
        ctx.drawImage(art, 0,0,640,640,
                            0,0,640,640);
      }

      //layer2 - это горы, которые двигается - это самый медленный слой
      var layer2 = new Animation(30);
      layer2.sx = 640; // sx, sy - это координаты нашего слоя на файле art
      layer2.sy = 0;
      layer2.w = 1280; // ширина нашего слоя
      layer2.dx = 0; // перемещение слоя по экрану
      layer2.speed = 1; // скорость перемещения

      layer2.update = function () { // пробуем сместить слой вперед 
        this.dx += this.speed;
        if(this.dx > this.w) { // так как dx постоянно увеличивается, поэтому слой перемещаетсчя непрерывно и уходит за экран, для этого нам нужно вернуть его на место в определенный момент
          this.dx -= this.w; // создадим условие, в котором обнулим dx
        }
      };

      layer2.render = function () { // отрисовываем слой с учетом смещения
        ctx.drawImage(art,this.sx+this.dx,this.sy,640,640,
                          0,0,640,640);
        if(this.dx > (this.w - 640)) {
          ctx.drawImage(art, this.sx,this.sy,640,640,
                            this.w - this.dx,0,640,640);
        }
      };

      // layer3 - это слой травы, длиной он в 2 экрана
      var layer3 = new Animation(30);
      layer3.sx = 0;
      layer3.sy = 640;
      layer3.w = 1280;
      layer3.speed = 3;
      layer3.dx = 0;
      layer3.update = layer2.update; // update, render будут такие же как у предыдущего слоя
      layer3.render = layer2.render;

      // layer4 - это слой дороги, она длиной в 3 экрана
      var layer4 = new Animation(30);
      layer4.sx = 0;
      layer4.sy = 1280;
      layer4.w = 1920;
      layer4.dx = 0;
      layer4.speed = 6;
      layer4.update = layer2.update;
      layer4.render = layer2.render;

      // layer5 - это слой забора с надписью, это самый передний план, поэтому двигаться он должен быстрее
      var layer5 = new Animation(30);
      layer5.sx = 0;
      layer5.sy = 1920;
      layer5.w = 1920;
      layer5.dx = 0;
      layer5.speed = 10;
      layer5.update = layer2.update;
      layer5.render = layer2.render;

      var zombie = new Animation(100); // создаем новый экземпляр класса Animation для зомби

      zombie.frame_num = 0;

      zombie.get_frame = function() { // специальный метод для расчета координат 
        if(this.frame_num > 4) { 
          return {x:((this.frame_num -5)*300),y:2880 };
        } else {
          return {x:(this.frame_num*300),y:2560};
        }
      }

      zombie.update = function () {  // будем переключать номер спрайта, то есть frame от 0 до 9
        this.frame_num++;
        if(this.frame_num > 9) this.frame_num = 0;
      }

      zombie.render = function () { // отрисовка спрайта
          var frame = this.get_frame();
          ctx.drawImage(art,frame.x,frame.y,300,320,
                            150,200,300,320);
      }

      function MainLoop(time) { // функция получаем время в секундах, но перед циклом происходит загрузка графики слоев layer1-layer5
        layer1.run(time);
        layer2.run(time);
        layer3.run(time);
        layer4.run(time);
        zombie.run(time); // помещаем зомби именно на дороге, поэтому после слоя 4, но обязательно до 5 слоя
        layer5.run(time);
        requestAnimationFrame(MainLoop);
      }

      var canvas = document.getElementById('canvas'); // получаем канвас 
      var ctx = canvas.getContext('2d'); // создать 2d анимацию
      var art = new Image(); // загружаем файл графики
      art.onload = function() { // при загрузке страницы будет запускаться цикл
        requestAnimationFrame(MainLoop); // данная функция не фиксированная временем и вызывается когда браузер готов обновить наш канвас (60 кадров в секунду)
      }
      art.src = "art.png"; // указываем путь к картинке
