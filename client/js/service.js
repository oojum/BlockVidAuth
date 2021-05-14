const BlockVidService = angular.module("BlockVidService", []);

BlockVidService.factory("BlockVidAuth", function ($http) {
  const baseURL = "http://localhost:3000/api";
  const BlockVidAuth = {};

  BlockVidAuth.getUsers = () => {
    return $http.get(baseURL + "/users");
  };

  BlockVidAuth.getVideos = () => {
    return $http.get(baseURL + "/videos");
  };

  BlockVidAuth.getRegister = () => {
    return $http.get(baseURL + "/register");
  }
  BlockVidAuth.getUser = (userAddress) => {
    return $http.get(baseURL + "/users/"+userAddress);
  }
  BlockVidAuth.addVideo = (video) => {
    return $http.post(baseURL + "/videos",video);
  }

  return BlockVidAuth;
});
