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
    },
};

function onOnline(){
    online=true;
    $("#state").addClass("online");
    $("#state").removeClass("offline");
}

function onOffline(){
    online=false;
    $("#state").addClass("offline");
    $("#state").removeClass("online");
}
