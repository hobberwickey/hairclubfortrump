var sidebar = angular.module("app").controller("sidebarController", ["$scope", '$http', "$route", "$location", "galleryConfig", function($scope, $http, $route, $location, galleryConfig){
  /**
   * Scope Vars
   * @type {Array}
   */
  angular.extend($scope, {
    albums: [],
    selected: null,
    selected_image: null,
    config: galleryConfig.config
  });

  /**
   * Scope Methods
   */

  angular.extend($scope, {
    isAlbumSelected: function(album){
      return $scope.selected === album;
    },

    isImageSelected: function(image){
      return $scope.selected_image === image;
    },

    selectAlbum: function(index){
      $scope.selected = $scope.config.selected_album = $scope.albums[index];
      
      return $http.get("/albums/" + $scope.selected.id).then(function(resp){
        $scope.selected.images = resp.data
        $scope.selectImage(0);
      });
    },

    selectImage: function(index){
      $scope.selected_image = $scope.config.selected_image = $scope.selected.images[index];
    },

    addAlbum: function(album){
      $scope.albums.push(album);
    },

    loadAlbums: function(){
      return $http.get("/albums").then(function(resp){
        for (var i=0; i<1; i++){
          var album = resp.data[i];

          $scope.addAlbum(
            {
              id: album.id,
              title: album.name,
              thumb: album.thumb,
              count: album.count,
              images: []
            }
          )
        }

        $scope.selectAlbum(0);
      })
    }
  });
  
  //Load initial
  $scope.loadAlbums().then(function(){
    if (!!$route.current.params.tag_name){
      var match = $scope.albums.filter(function(a){
        return a.title.toLowerCase() === $route.current.params.tag_name.toLowerCase();
      })

      if (!!match[0]){
        $scope.selectAlbum($scope.albums.indexOf( match[0]  )).then(function(){
          if (!!$route.current.params.image_uuid){
            var match = $scope.selected.images.filter(function(i){
              return i.uuid === $route.current.params.image_uuid;
            })

            if (!!match[0]){
              $scope.selectImage($scope.selected.images.indexOf( match[0] ));
            }
          }
        })
      }
    }
  })
}]).directive("albumsSidebar", function(){
  return {
    transpose: true,
    templateUrl: "/templates/albums-template.html"
  }
}).directive("albumSidebar", function(){
  return {
    templateUrl: "/templates/album-template.html"
  }
})

