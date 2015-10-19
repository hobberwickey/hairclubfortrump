var sidebar = angular.module("app").controller("sidebarController", ["$scope", "galleryConfig", function($scope, galleryConfig){
  $scope.albums = [];
  $scope.selected = null;
  $scope.selected_image = null;
  $scope.config = galleryConfig.config;

  $scope.isAlbumSelected = function(album){
    return $scope.selected === album;
  }
  $scope.isImageSelected = function(image){
    return $scope.selected_image === image;
  }
  $scope.selectAlbum = function(index){
    $scope.selected = $scope.config.selected_album = $scope.albums[index];
    $scope.selectImage(0);
  }
  $scope.selectImage = function(index){
    $scope.selected_image = $scope.config.selected_image = $scope.selected.images[index];
  }
  $scope.addAlbum = function(album){
    $scope.albums.push(album);
  }
  $scope.loadAlbums = function(){
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

