var mainPanel = angular.module("app").controller(
  "mainPanelController", ["$scope", '$location', "galleryConfig", function($scope, $location, galleryConfig){
    $scope.config = galleryConfig.config;

    angular.extend($scope, {
      share: function(type){
        var types = {
          fb: function(href){ return 'https://www.facebook.com/sharer/sharer.php?u=' + href },
          twitter: function(href){ return 'https://twitter.com/intent/tweet?url=' + href },
          pinterest: function(href) { return 'http://pinterest.com/pin/create/button/?url=' + href }
        }

        var url = types[type]($location.absUrl());
        window.open(url, 'facebook-share', 'width=580,height=296');
      }
    });
  }]
).directive("mainPanel", function(){
  return {
    templateUrl: "/templates/main-panel-template.html"
  }
}).directive("fbShare", function(){
  return {
    templateUrl: "/templates/share/fb.html"
  }
}).directive("twitterShare", function(){
  return {
    templateUrl: "/templates/share/twitter.html"
  }
}).directive("pinterestShare", function(){
  return {
    templateUrl: "/templates/share/pinterest.html"
  }
})