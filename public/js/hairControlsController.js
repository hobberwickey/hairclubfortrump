var hairControls = angular.module("app").controller(
  "hairControlsController", ["$scope", "hairConfig", "$http", function($scope, $hairConfig, $http){
    $scope.config = $hairConfig.config;
    $scope.http = $http;

    $scope.handleUpload = function(uploader){
      if (uploader.files.length > 0) {
        var reader = new FileReader();
        reader.onloadend = function(){
          $scope.config.upload = reader.result;
          $scope.config.position = { x: 0, y: 0, w: 1024, h: 720, a: 0, x_offset: 0, y_offset: 0 };
          $scope.config.angleOffset = 0;
          $scope.config.originalLength = 0;
          $hairConfig.$emit("upload-changed")
        }

        reader.readAsDataURL(uploader.files[0]);
      } else {
        $scope.upload = null;
        $hairConfig.$emit("upload-changed")
      }
    }
  }]
).directive("hairControls", function(){
  return {
    templateUrl: "/templates/hair-controls.html",
    link: function($scope, $element, $attrs){
      var form = $element[0].querySelector("#save_form"),
          image = $element[0].querySelector("#image_data"),
          tagger = $element[0].querySelector("#image_tags"),
          title = $element[0].querySelector("#image_title"),
          save = $element[0].querySelector("#save_image");

      save.addEventListener("click", function(){
        title.value = title.value.replace(/^\s+|\s+$/g, '');
        image.value = $scope.config.contexts.result.canvas.toDataURL("image/jpeg");
        
        if (title.value === "") return; //TODO: Errors
        if (angular.element(tagger).isolateScope().tags.length === 0) return;

        var formData = new FormData(form);
            
        $scope.http.post("/image", formData, {
            transformRequest: angular.identity,
            headers: {'Content-Type': void(0)}
        }).then(function(resp){
          console.log("SUCCESS")
        })

      })
    }
  }
})