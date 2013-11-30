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
        addKeyEventListener("RIGHT", callback);
    }

    function addFilterPreviousListener( callback ) {
        addKeyEventListener("LEFT", callback);
    }

    function addPlaceNextListener( callback ) {
        addKeyEventListener("UP", callback);
    }

    function addPlacePreviousListener( callback ) {
        addKeyEventListener("DOWN", callback);
    }

    function shake() {
        var element = document.getElementById("scene");
        var timeoutID = window.setTimeout(shiftScene, utility.random(5));
        var times = 30;
        function shiftScene() {
            element.style.left = utility.random(times)+"px";
            element.style.bottom = utility.random(times)+"px";
            if( --times >= 0 ){
                timeoutID = window.setTimeout(shiftScene, utility.random(5));
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
