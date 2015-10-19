var app = angular.module(
  "app", ["ngRoute"]
).config(
  ["$routeProvider", function($routeProvider){
    $routeProvider.when(
        "/gallery/:image_id", {
          templateUrl: "/pages/gallery.html"
        }
      ).when(
        "/gallery", {
          templateUrl: "/pages/gallery.html"
        }
      ).when(
        "/create", {
          templateUrl: "pages/trumper.html"
        }
      ).otherwise(
        {
          redirectTo: "/gallery"
        }
      )
  }]
).factory("galleryConfig", function($rootScope){
    var scope = $rootScope.$new();

    scope.config = {
      api_root: "/",
      api_key: "",
      selected_album: null,
      selected_image: null
    }

    return scope;
  }
).factory("hairConfig", function($rootScope){
  var scope = $rootScope.$new();

  scope.config = {
    api_root: "/",
    api_key: "",
    selected_hair: 0,
    upload: null,
    position: { x: 0, y: 0, w: 1024, h: 720, a: 0, x_offset: 0, y_offset: 0 },
    angleOffset: 0,
    originalLength: 0,
    scale: 0
  }

  return scope;
})