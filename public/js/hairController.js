var hair = angular.module("app").controller(
  "hairController", ["$scope", "hairConfig", "imageMovement", function($scope, $hairConfig, $imageMovement){
    /**
     * Messy Image drawing and movement methods
     */
    angular.extend($scope, $imageMovement);

    /**
     * Scope Vars
     */
    angular.extend($scope, {
      config: $hairConfig.config,
      hairs: [
        {name: "standard-trump", title: "Standard Trump", src: "/images/trump-hair-1.png" },
        {name: "golden-don", title: "Golden Don", src: "/images/trump-hair-2.png" }
      ],

      //Contexts
      uploadCtx: null,
      hairCtx: null,
      resultCtx: null,
      stage: null,

      //Flags
      active: false
    })
    
    /**
     * Scope methods
     */
    angular.extend($scope, {
      isHairSelected: function(hair){
        if (!$scope.config.upload) return false;
        return $scope.config.selected_hair === hair;
      },

      selectHair: function(index){
        $scope.config.selected_hair = $scope.hairs[index]
        $scope.loadHair();
      },
        
      setContexts: function(stage){
        $scope.stage = stage;
        $scope.uploadCtx = $scope.config.contexts.upload = stage.querySelector("#image").getContext('2d');
        $scope.hairCtx = $scope.config.contexts.hair = stage.querySelector("#hair").getContext("2d");
        $scope.resultCtx = $scope.config.contexts.result = stage.querySelector("#result").getContext("2d");

        $scope.selectHair(0);
      },

      loadHair: function(){
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
        
          if (!!$scope.config.upload) $scope.draw();
        }
      }
    });

    $hairConfig.$on("upload-changed", function(){
      $scope.resize($scope);
    });
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