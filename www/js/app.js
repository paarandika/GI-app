var online = true;
var app = angular.module("GI-app", []);
app.controller("appCtrl", function($scope, $http) {
  $scope.search = true;
  $scope.results = [];
  $scope.searchText = "";
  $scope.getMyCtrlScope = function() {
    return $scope;
  }
  $scope.currentResult = {};
  $scope.searchUsers = function() {
    if (online) {
      $.post("http://192.168.0.102/mock/search.php", {
          name: $scope.searchText
        },
        function(d, status) {
          $scope.results = jQuery.parseJSON(d);
          $scope.$apply();
        });
    }
  }

  $scope.submitUser = function() {
    $.post("http://192.168.0.102/mock/add.php", {
        name: $scope.currentResult.name,
        id: $scope.currentResult.id,
        salary: $scope.currentResult.salary
      },
      function(d, status) {
        alert(d);
        // $scope.results[$scope.currentResult.id] = jQuery.parseJSON(d);
        // $scope.$apply();
      });
  }

});
