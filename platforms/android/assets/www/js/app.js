var online = true;
var rootServer = "http://10.0.3.2/mock/";
var app = angular.module("GI-app", []);
app.controller("appCtrl", function($scope) {
  document.addEventListener('deviceready', function() {
    $scope.lastSync = localStorage.getItem('lastSync');
    if ($scope.lastSync === null) {
      localStorage.setItem('lastSync', 0);
    }

    if (online) {
      $.post(rootServer + "sync.php", {
          time: 2
        },
        function(d, status) {
          alert(d);
          if (d !== "null") {
            result = jQuery.parseJSON(d);
            $scope.adder(result, 0);
          }else {
            updater();
          }
        });
      localStorage.setItem('lastSync', Math.floor(Date.now() / 1000));
    }
  }, false);

  $scope.adder = function(result, i) {
    var exist = false;
    db.transaction(function(tx) {
      tx.executeSql("SELECT * FROM user WHERE id=?", [result[i].id], function(tx, res) {
        alert("insertId: " + res.rows.item(0).name);
        if (res.rows.item(0) !== null) {
          alert("update query");
          exist = true;
          db.transaction(function(tx) {
            tx.executeSql("UPDATE user SET name=?, salary=?, synced=? WHERE id=?", [result[i].name, result[i].salary, 1, result[i].id], function(tx, res) {
              alert("insertId: " + res.rowsAffected);
            });
          });
        }
      });
    });
    if (!exist){
      db.transaction(function(tx) {
        tx.executeSql("INSERT INTO user (id, name, salary, synced) VALUES (?,?,?,?)", [result[i].id, result[i].name, result[i].salary, 1], function(tx, res) {
          alert("insertId: " + res.insertId + " -- probably 1");
        });
      });
    }
    if (i < result.length) {
      $scope.adder(result, i + 1);
    } else {
      updater();
    }
  }

  $scope.search = true;
  $scope.results = [];
  $scope.searchText = "";
  $scope.getMyCtrlScope = function() {
    return $scope;
  }
  $scope.currentResult = {};
  $scope.searchUsers = function() {
    $scope.results = [];
    // $scope.$apply();
    if (online) {
      $.post(rootServer + "search.php", {
          name: $scope.searchText
        },
        function(d, status) {
          $scope.results = jQuery.parseJSON(d);
          $scope.$apply();
        });
    } else {
      db.transaction(function(tx) {
        tx.executeSql("SELECT * FROM user WHERE name=?", [$scope.searchText], function(tx, res) {
          alert("insertId: " + res.rows.item(0).name);
          var arr = [];
          for (var i = 0; i < res.rows.length; ++i) arr.push(res.rows.item(i));
          $scope.results = arr;
          $scope.$apply();
        });
      });
    }
  }

  $scope.submitUser = function() {
    if (online) {
      $.post(rootServer + "add.php", {
          name: $scope.currentResult.name,
          id: $scope.currentResult.id,
          salary: $scope.currentResult.salary
        },
        function(d, status) {
          // $scope.results[$scope.currentResult.id] = jQuery.parseJSON(d);
          // $scope.$apply();
        });
    } else {
      db.transaction(function(tx) {
        tx.executeSql("UPDATE user SET name=?, salary=?, synced=0 WHERE id=?", [$scope.currentResult.name, $scope.currentResult.salary, $scope.currentResult.id], function(tx, res) {
          alert("insertId: " + res.rowsAffected);
        });
      });
    }
  }
});
