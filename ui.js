"use strict";
define(['keys'], function( keys ) {
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

    return {
        addFilterNextListener: addFilterNextListener,
        addFilterPreviousListener: addFilterPreviousListener,
        addPlaceNextListener: addPlaceNextListener,
        addPlacePreviousListener: addPlacePreviousListener
    };
});
