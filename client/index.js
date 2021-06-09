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
  $scope.msg = "Hello, user!";
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
          $scope.videosList.forEach((el) => {
            el.vidPath = "http://127.0.0.1:8080/" + el.vidPath.split("/").pop();
          });
        },
        (err) => {
          $scope.errorMsg = err.message;
        }
      );
    }
  },
]);

MyApp.controller("usersListController", [
  "$scope",
  "BlockVidAuth",
  function ($scope, BlockVidAuth) {
    init();

    function init() {
      BlockVidAuth.getUsers().then(
        (response) => {
          $scope.usersList = response.data.users;
        },
        (err) => {
          $scope.errorMsg = err.message;
        }
      );
    }
  },
]);

MyApp.controller(
  "registerController",
  function ($scope, BlockVidAuth, $location) {
    $scope.fact =
      "It seems that you are a new user and haven't been registered yet. Please complete your registration to use this feature.";
    $scope.factHead = "Register to Continue";

    const loadAccount = () => {
      ethereum
        .request({ method: "eth_requestAccounts" })
        .then((userAddress) => {
          $scope.user = {
            ethAddress: userAddress[0],
          };
          $scope.$apply();
        })
        .catch((error) => {
          if (error.code === 4001) {
            // EIP-1193 userRejectedRequest error
            console.log("Please connect to MetaMask.");
          } else {
            console.error(error);
          }
        });
    };

    if (window.ethereum === undefined) {
      $scope.isMetamaskInstalled = false;
    } else {
      $scope.isMetamaskInstalled = true;
      loadAccount();
      ethereum.on("accountsChanged", loadAccount);
    }

    $scope.submitForm = () => {
      console.log($scope.user);
      const requestBody = {
        user: $scope.user,
      };
      BlockVidAuth.addUser(requestBody).then(
        (response) => {
          if (response.data) {
            console.log(response.data);
            return $location.path("/upload");
          }
          console.log(response);
        },
        (err) => {
          console.log(err.message);
          $scope.errorMsg = err.message;
        }
      );
    };
  }
);

MyApp.controller(
  "uploadController",
  function ($scope, BlockVidAuth, $location) {
    const loadAccount = () => {
      ethereum
        .request({ method: "eth_requestAccounts" })
        .then((userAddress) => {
          $scope.video = {
            userAddress: userAddress[0],
          };
          $scope.$apply();
          BlockVidAuth.getUser($scope.video.userAddress).then(
            (response) => {
              if (response.data.user === null) {
                $location.path("/register");
              }
            },
            (err) => {
              $scope.errorMsg = err.message;
              $location.path("/register");
            }
          );
        })
        .catch((error) => {
          if (error.code === 4001) {
            // EIP-1193 userRejectedRequest error
            console.log("Please connect to MetaMask.");
          } else {
            console.error(error);
          }
        });
    };

    if (window.ethereum === undefined) {
      $scope.isMetamaskInstalled = false;
    } else {
      $scope.isMetamaskInstalled = true;
      loadAccount();
      ethereum.on("accountsChanged", loadAccount);
    }

    $scope.submit = () => {
      BlockVidAuth.getUser($scope.video.userAddress).then(
        (response) => {
          if (response.data.user !== null) {
            return $scope.uploadVideo();
          }
          $location.path("/register");
        },
        (err) => {
          $scope.errorMsg = err.message;
          $location.path("/register");
        }
      );
    };

    $scope.uploadVideo = () => {
      // const file = document.getElementById("videoFile").files[0];
      // const fileReader = new FileReader();

      $scope.video.file = document.getElementById("videoFile").files[0];
      let formData = new FormData();

      formData.append("file", $scope.video.file);
      formData.append("title", $scope.video.title);
      formData.append("userAddress", $scope.video.userAddress);

      BlockVidAuth.addVideo(formData).then(
        (response) => {
          if (response.data.video !== null) {
            return $location.path("/video");
          }
          console.log("500:error");
        },
        (err) => {
          console.log("500: err");
          $scope.errorMsg = err.message;
        }
      );

      // fileReader.onloadend = (vidFile) => {
      //   $scope.video.file = document.getElementById("videoFile").files[0];
      //   let formData = new FormData();

      //   formData.append("file", $scope.video.file);
      //   formData.append("title", $scope.video.title);
      //   formData.append("userAddress", $scope.video.userAddress);

      //   BlockVidAuth.addVideo(formData).then(
      //     (response) => {
      //       if (response.data.video !== null) {
      //         return $location.path("/video");
      //       }
      //       console.log("500:error");
      //     },
      //     (err) => {
      //       console.log("500: err");
      //       $scope.errorMsg = err.message;
      //     }
      //   );
      // };

      // fileReader.readAsArrayBuffer(file);
    };
  }
);
