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
      .when("/register", {
        templateUrl: "views/register.html",
        controller: "registerController",
      })
      .when("/detect", {
        templateUrl: "views/detector.html",
        controller: "detectorController",
      })
      .when("/upload", {
        templateUrl: "views/upload.html",
        controller: "uploadController",
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
          $scope.errorMsg = err.message;
        }
      );
    }
  },
]);

MyApp.controller("registerController", function($scope){
  $scope.fact = "Deepfakes use deep learning artificial intelligence to replace the likeness of one person with another in video and other digital media. There are concerns that deepfake technology can be used to create fake news and misleading, counterfeit videos.";
  $scope.factHead = "Did you know?";
  
  $scope.submitForm = ()=> {
    console.log($scope.firstName);
  }
});

MyApp.controller("uploadController", function($scope,BlockVidAuth,$location){
  /*const init = () => {
    const loadAccount = () => {
        ethereum.request({ method: 'eth_requestAccounts' })
        .then(userAddress => {
          $scope.userAddress=userAddress[0];
          console.log(userAddress);
        })
        .catch((error) => {
            if (error.code === 4001) {
            // EIP-1193 userRejectedRequest error
                console.log('Please connect to MetaMask.');
            } else {
                console.error(error);
            }
        });
    }
    window.onload = loadAccount;
    ethereum.on('accountsChanged', loadAccount);
  };
  init()*/

  $scope.submit = () => {
    console.log($scope.video.userAddress);
    BlockVidAuth.getUser($scope.video.userAddress).then(
      (response) => {
        if (response.data !== null){
          $scope.uploadVideo(); 
        }
        $location.path("/register");
      },
      (err) => {
        $scope.errorMsg = err.message;
      }
    );
  };
  $scope.uploadVideo = () => {
    BlockVidAuth.addVideo($scope.video).then(
      (response) => {
        if (response.data.video !== null){
          $location.path("/video"); 
        }
        console.log("500:error");
      },
      (err) => {
        console.log("500: err")
        $scope.errorMsg = err.message;
      }
    );
  }
});

