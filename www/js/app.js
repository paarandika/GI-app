var online = true;
var app = angular.module("GI-app", []);
app.controller("appCtrl", function($scope) {
  $scope.search = true;
  $scope.results = data;
  $scope.getMyCtrlScope = function() {
    return $scope;
  }
  $scope.currentResult;

});

var data = [{
  "id": "1",
  "name": "rand",
  "salary": "34.5",
  "update_t": "1440256944"
}, {
  "id": "2",
  "name": "nemo",
  "salary": "340",
  "update_t": "1440312486"
}];
