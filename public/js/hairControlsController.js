var hairControls = angular.module("app").controller(
  "hairControlsController", ["$scope", "hairConfig", function($scope, $hairConfig){
    $scope.config = $hairConfig.config;

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
    templateUrl: "/templates/hair-controls.html"
  }
})