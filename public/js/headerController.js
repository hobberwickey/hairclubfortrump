var header = angular.module("app").controller(
  "headerController", ["$scope", "$location", function($scope, $location){

  }]
).directive("trumpHeader", function(){
  return {
    templateUrl: "/templates/header-template.html"
  }
})