var sidebar = angular.module("app").controller("sidebarController", ["$scope", '$http', "galleryConfig", function($scope, $http, galleryConfig){
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
      $http.get("/albums/" + $scope.selected.id).then(function(resp){
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
        for (var i=0; i<resp.data.length; i++){
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
      })
    }
  });

  $scope.loadAlbums();
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

