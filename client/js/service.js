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
  };

  BlockVidAuth.getUser = (userAddress) => {
    return $http.get(baseURL + "/users/" + userAddress);
  };

  BlockVidAuth.addVideo = (video) => {
    const url = baseURL + "/videos";
    return $http({
      url: url,
      method: "POST",
      data: video,
      headers: { "Content-Type": undefined },
      transformRequest: angular.identity,
    });
  };

  BlockVidAuth.addUser = (requestBody) => {
    const url = baseURL + "/users";
    return $http({
      url: url,
      method: "POST",
      data: requestBody,
    });
  };

  return BlockVidAuth;
});
