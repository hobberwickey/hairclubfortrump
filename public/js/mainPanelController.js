var mainPanel = angular.module("app").controller(
  "mainPanelController", ["$scope", "galleryConfig", function($scope, galleryConfig){
    $scope.config = galleryConfig.config;
  }]
).directive("mainPanel", function(){
  return {
    templateUrl: "/templates/main-panel-template.html"
  }
})