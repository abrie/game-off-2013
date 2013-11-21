"use strict";
define(['keys','utility'], function( keys, utility ) {
    var keyEventListeners = {};
    function addKeyEventListener(event, callback) {
        if( !keyEventListeners[event] ) {
            keyEventListeners[event] = [];
        }
        keyEventListeners[event].push(callback);
    }

    keys.fireEvent = function(event, isDown) {
        if( isDown && keyEventListeners[event] ) {
            keyEventListeners[event].forEach( function(callback) {
                callback();
            });
        }
    };

    function addFilterNextListener( callback ) {
        addKeyEventListener("UP", callback);
    }

    function addFilterPreviousListener( callback ) {
        addKeyEventListener("DOWN", callback);
    }

    function addPlaceNextListener( callback ) {
        addKeyEventListener("LEFT", callback);
    }

    function addPlacePreviousListener( callback ) {
        addKeyEventListener("RIGHT", callback);
    }

    function shake() {
        var element = document.getElementById("scene");
        var timeoutID = window.setTimeout(shiftBody, utility.random(5));
        var times = 60;
        function shiftBody() {
            element.style.left = utility.random(times)+"px";
            element.style.bottom = utility.random(times)+"px";
            if( --times >= 0 ){
                timeoutID = window.setTimeout(shiftBody, utility.random(5));
            }
        }
    }

    return {
        addFilterNextListener: addFilterNextListener,
        addFilterPreviousListener: addFilterPreviousListener,
        addPlaceNextListener: addPlaceNextListener,
        addPlacePreviousListener: addPlacePreviousListener,
        shake:shake
    };
});
