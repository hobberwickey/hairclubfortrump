var mainPanel = angular.module("app").controller(
  "mainPanelController", ["$scope", '$rootScope', '$location', "galleryConfig", "metaService", function($scope, $rootScope, $location, galleryConfig, metaService){
    $scope.config = galleryConfig.config;
    $rootScope.metaService = metaService;

    angular.extend($scope, {
      share: function(type){
        var types = {
          fb: function(href){ return 'https://www.facebook.com/sharer/sharer.php?u=' + href },
          twitter: function(href){ return 'https://twitter.com/intent/tweet?url=' + href },
          pinterest: function(href, image_url, image_title) { return 'http://pinterest.com/pin/create/button/?url=' + href + "&media=" + image_url + "&description=" + image_title }
        }

        var image = $scope.config.selected_image,
            url = types[type]($location.absUrl(), image.gallery, image.title);

        window.open(url, 'facebook-share', 'width=580,height=296');
      }
    });

    $scope.$watch( function(){ return $scope.config.selected_image }, function(){
      if (!!$scope.config.selected_image){
        var selected = $scope.config.selected_image;

        $rootScope.metaService.set( selected.gallery );
        $location.path("/gallery/" + $scope.config.selected_album.title + "/" + $scope.config.selected_image.uuid, false);
      }
    })
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