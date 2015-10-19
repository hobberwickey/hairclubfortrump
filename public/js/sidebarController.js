var sidebar = angular.module("app").controller("sidebarController", ["$scope", "galleryConfig", function($scope, galleryConfig){
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
      $scope.selectImage(0);
    },

    selectImage: function(index){
      $scope.selected_image = $scope.config.selected_image = $scope.selected.images[index];
    },

    addAlbum: function(album){
      $scope.albums.push(album);
    },

    loadAlbums: function(){
      //TODO: Remove Hardcoded albums
      var albums = [
        { 
          title: "Originals",
          images: ["/images/owl.jpg", "/images/bernie.jpg", "/images/fat-dog.jpg"]
        },
        {
          title: "Trumped",
          images: ["/images/owl-trumped.png", "/images/bernie-trumped.png", "/images/fat-dog-trumped.png"]
        }
      ]

      for (var i=0; i<albums.length; i++){
        $scope.addAlbum(albums[i]);
      }
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

