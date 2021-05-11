const MyApp = angular.module("MyApp", ["ngRoute", "BlockVidService"]);

MyApp.config([
  "$routeProvider",
  function ($routeProvider) {
    $routeProvider
      .when("/about", {
        templateUrl: "views/about.html",
        controller: "aboutController",
      })
      .when("/videos", {
        templateUrl: "views/videos.html",
        controller: "videosListController",
      })
      .when("/users", {
        templateUrl: "views/users.html",
        controller: "usersListController",
      })
      .when("/watch", {
        templateUrl: "views/videoPlayer.html",
        controller: "videoPlayerController",
      })
      .otherwise({
        redirectTo: "/about",
      });
  },
]);

MyApp.config([
  "$locationProvider",
  function ($locationProvider) {
    $locationProvider.hashPrefix("");
  },
]);

MyApp.controller("aboutController", function ($scope) {
  $scope.msg = "hi ssxsdadasdg";
});

MyApp.controller("videosListController", [
  "$scope",
  "BlockVidAuth",
  function ($scope, BlockVidAuth) {
    init();

    function init() {
      BlockVidAuth.getVideos().then(
        (response) => {
          $scope.videosList = response.data.videos;
        },
        (err) => {
          $scope.errorMsg = error.message;
        }
      );
    }
  },
]);
