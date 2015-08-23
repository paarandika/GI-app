var db;
var loc = window.localStorage;
var init = {
  // Application Constructor
  initialize: function() {
    this.bindEvents();
  },

  bindEvents: function() {
    document.addEventListener('deviceready', this.onDeviceReady, false);
  },

  onDeviceReady: function() {
    document.addEventListener("offline", onOffline, false);
    document.addEventListener("online", onOnline, false);
    db = window.sqlitePlugin.openDatabase({
      name: "DB"
    });
    db.transaction(function(tx) {
      // tx.executeSql('DROP TABLE IF EXISTS user');
      tx.executeSql('CREATE TABLE IF NOT EXISTS user (id integer primary key, name text, salary REAL, synced integer)');
    });
  },
};

function onOnline() {
  online = true;
  $("#state").addClass("online");
  $("#state").removeClass("offline");
  updater();
}

function onOffline() {
  online = false;
  $("#state").addClass("offline");
  $("#state").removeClass("online");
}

function updater() {
  alert("updater");
  db.transaction(function(tx) {
    tx.executeSql("SELECT * FROM user WHERE synced=0", [], function(tx, res) {
      alert("insertId: " + res.rows.item(0).name);
      for (var i = 0; i < res.rows.length; ++i){
        alert("syncing");
        var us= res.rows.item(i);
        $.post(rootServer + "add.php", {
            id: us.id,
            name: us.name,
            salary:us.salary
          },
          function(d, status) {
            alert(d);
          });
      }
    });
  });
  db.transaction(function(tx) {
    tx.executeSql("UPDATE user synced=1 WHERE synced=?", [0], function(tx, res) {
      alert("insertId: " + res.rowsAffected);
    });
  });
}
