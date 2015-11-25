var app = angular.module(
  "app", ["ngRoute"]
).config(
  ["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider){
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });

    $routeProvider.when(
        "/gallery/:tag_name/:image_uuid", {
          templateUrl: "/pages/gallery.html"
        }
      ).when("/gallery/:tag_name", {
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
).service("metaService", function(){
    var imageUrl = "";

    return {
      set: function(url){
        imageUrl = url;
      }, 
      get: function(){
        return imageUrl;
      }
    }
  }
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
    scale: 0,
    contexts: {
      upload: null,
      hair: null,
      result: null
    }
  }

  return scope;
}).run(['$route', '$rootScope', '$location', function ($route, $rootScope, $location) {
    var original = $location.path;
    $location.path = function (path, reload) {
        if (reload === false) {
            var lastRoute = $route.current;
            var un = $rootScope.$on('$locationChangeSuccess', function () {
                $route.current = lastRoute;
                un();
            });
        }
        return original.apply($location, [path]);
    };
}])