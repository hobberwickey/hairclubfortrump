var hair = angular.module("app").controller(
  "hairController", ["$scope", "hairConfig", function($scope, $hairConfig){
    $scope.config = $hairConfig.config;
    $scope.hairs = [
      {name: "standard-don", title: "Standard Don", src: "/images/trump-hair-1.png" },
      {name: "golden-don", title: "Golden Don", src: "/images/trump-hair-2.png" }
    ]

    //Contexts
    $scope.uploadCtx = null;
    $scope.hairCtx = null;
    $scope.resultCtx = null;
    $scope.stage = null;

    //Flags
    $scope.active = false;

    $scope.isHairSelected = function(hair){
      if (!$scope.config.upload) return false;
      return $scope.config.selected_hair === hair;
    }

    $scope.selectHair = function(index){
      $scope.config.selected_hair = $scope.hairs[index]
      $scope.loadHair();
    }
      
    $scope.setContexts = function(stage){
      $scope.stage = stage;
      $scope.uploadCtx = stage.querySelector("#image").getContext('2d');
      $scope.hairCtx = stage.querySelector("#hair").getContext("2d");
      $scope.resultCtx = stage.querySelector("#result").getContext("2d");

      $scope.selectHair(0);
    }

    $scope.loadHair = function(){
      var hair = this.hairCtx,
          image = new Image();

      image.src = $scope.config.selected_hair.src;
      image.onload = function(){
        if (image.width / hair.canvas.width > image.height / hair.canvas.height){
          scale = hair.canvas.width / image.width;
        } else {
          scale = hair.canvas.height / image.height;
        }

        var top = (hair.canvas.height - (image.height * scale)) / 2,
            left = (hair.canvas.width - (image.width * scale)) / 2;

        hair.clearRect(0, 0, hair.canvas.width, hair.canvas.height);
        hair.drawImage(image, 0, 0, image.width, image.height, left, top, image.width * scale, image.height * scale);         
      }
    }

    // Below is where all the real work is done
    
    $scope.resize = function(){
      var config = $scope.config,
          upload = $scope.uploadCtx,
          result = $scope.resultCtx;
          hair   = $scope.hairCtx;

      var img = new Image();
          img.src = config.upload;
          
      img.onload = function(){
        var w = (Math.min(1024, Math.max(512, img.width))),
            h = (Math.min(720, Math.max(720, img.height)));

        config.scale = img.height < img.width ? h / img.height : w / img.width;

        upload.canvas.width = result.canvas.width = (img.width * config.scale) | 0;
        upload.canvas.height = result.canvas.height = (img.height * config.scale) | 0;

        upload.drawImage(img, 0, 0, upload.canvas.width, upload.canvas.height)

        if (img.width > img.height){
          var scale = hair.canvas.height / (h * 0.5);
        } else {
          var scale = hair.canvas.width / (w * 0.5);
        }

        var coords = result.canvas.getBoundingClientRect();
        
        config.position.w = hair.canvas.width / scale;
        config.position.h = hair.canvas.height / scale;
        config.position.x = ((result.canvas.width - config.position.w) / 2);
        config.position.y = ((result.canvas.height - config.position.h) / 2);
        if (!!config.upload) $scope.draw();

        var data = $scope.calcAngle({x: coords.left + config.position.x, y: coords.top + config.position.y});
        config.angleOffset = config.position.a = data.angle;
        config.originalLength = data.length * scale;  

        $scope.$apply();     
      }

      $scope.setupRotate();
      $scope.setupTranslate();
    }

    $scope.calcAngle = function(pnt){
      var config = $scope.config,
          result = $scope.resultCtx,
          coords = result.canvas.getBoundingClientRect();
          center = {
            y: coords.top + (result.canvas.height / 2) + config.position.y_offset,
            x: coords.left + (result.canvas.width / 2) + config.position.x_offset,
          } 

      var angle = Math.atan2(pnt.y - center.y, pnt.x - center.x),
          length = Math.sqrt(Math.pow(pnt.x - center.x, 2) + Math.pow(pnt.y - center.y, 2));

      return {length: length, angle: angle};
    }

    $scope.draw = function(){
      var config = $scope.config,
          result = $scope.resultCtx,
          upload = $scope.uploadCtx,
          hair   = $scope.hairCtx;

      result.clearRect(0, 0, result.canvas.width, result.canvas.height);
      result.drawImage(upload.canvas, 0, 0, upload.canvas.width, upload.canvas.height);
      
      result.save();
      result.translate((result.canvas.width / 2) + config.position.x_offset, (result.canvas.height / 2) + config.position.y_offset)
      result.rotate(-(config.position.a - config.angleOffset));
      result.translate(-((result.canvas.width / 2) + config.position.x_offset), -((result.canvas.height / 2) + config.position.y_offset))
      result.drawImage(hair.canvas, config.position.x, config.position.y, config.position.w, config.position.h)
      result.restore();

      $scope.adjust();
      $scope.setTransform();
    }

    $scope.adjust = function(){
      var config = $scope.config,
          result = $scope.resultCtx,
          wrapper = $scope.stage.querySelector(".hair-wrapper");

      wrapper.style.top = (config.position.y + parseInt(result.canvas.offsetTop, 10)) + "px";
      wrapper.style.left = (config.position.x + parseInt(result.canvas.offsetLeft, 10)) + "px";
    },

    $scope.setTransform = function(){
      var config = $scope.config,
          wrapper = $scope.stage.querySelector(".hair-wrapper");

      wrapper.style.transform = "rotate(" + (config.angleOffset - config.position.a) + "rad)";
      wrapper.style.width = config.position.w + "px";
      wrapper.style.height = config.position.h + "px";

      $scope.adjust();
    },

    $scope.setupTranslate = function(){
      var wrapper = $scope.stage.querySelector("#hair-wrapper"),
          config = $scope.config,
          result = $scope.resultCtx;

      if ($scope.active) return;
      wrapper.addEventListener("mousedown", function(e){
        e.preventDefault();
        e.stopPropagation();

        if (e.target.classList.contains("translate")){
          var last = { x: e.clientX, y: e.clientY }

          var translate = function(e){
            config.position.x_offset += e.clientX - last.x;
            config.position.y_offset += e.clientY - last.y;

            config.position.x = config.position.x_offset + ((result.canvas.width - config.position.w) / 2);
            config.position.y = config.position.y_offset + ((result.canvas.height - config.position.h) / 2);

            last = { x: e.clientX, y: e.clientY };
            $scope.draw();
          }.bind(this)

          window.addEventListener("mousemove", translate, false)

          window.addEventListener("mouseup", function stop(e){
            window.removeEventListener("mousemove", translate);
            window.removeEventListener("mouseup", stop);
          }, false)
        }
      }.bind(this), false)
    },

    $scope.setupRotate = function(){
      var wrapper = $scope.stage.querySelector("#hair-wrapper"),
          config = $scope.config,
          result = $scope.resultCtx,
          hair = $scope.hairCtx;

      if ($scope.active) return;
      wrapper.addEventListener("mousedown", function(e){
        e.preventDefault();
        e.stopPropagation();

        if (e.target.classList.contains("rotate")){
          var data = $scope.calcAngle({ x: e.clientX, y: e.clientY }),
              startAngle = data.angle,
              startLength = data.length,
              originalAngle = config.position.a,
              originalX = config.position.x_offset,
              originalY = config.position.y_offset;
        

          var calc = function(e){
            e.preventDefault();
            e.stopPropagation();

            var data = $scope.calcAngle({x: e.clientX, y: e.clientY});
            config.position.a = originalAngle + (startAngle - data.angle);
            
            var dif = (data.length / config.originalLength);

            config.position.w = hair.canvas.width * dif; 
            config.position.h = hair.canvas.height * dif; 
            config.position.x = originalX + ((result.canvas.width - config.position.w) / 2);
            config.position.y = originalY + ((result.canvas.height - config.position.h) / 2);
            
            $scope.draw();
            //Polymer.dom(this.root).querySelector("#test").innerHTML = this.position.w + " " + this.position.h
          }.bind(this);

          window.addEventListener("mousemove", calc, false);
          window.addEventListener("mouseup", function stop(){
            window.removeEventListener("mousemove", calc);
            window.removeEventListener("mouseup", stop);
          }, false)
        }
      }.bind(this), false);    
    }

    $hairConfig.$on("upload-changed", $scope.resize);
  }]
).directive("hairSelector", function(){
  return {
    templateUrl: "/templates/hair-selector.html"
  }
}).directive("hairStage", function(){
  return {
    templateUrl: "/templates/hair-stage.html",
    link: function($scope, $element, $attrs){
      $scope.setContexts($element[0])
    }
  }
})