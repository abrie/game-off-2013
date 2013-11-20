"use strict";
define(['keys'], function( keys ) {
    function makeButton( name ) {
        var element = document.createElement("button");
        element.innerHTML = name; 
        document.body.appendChild( element );
        return element;
    }

    var filterPreviousButton = makeButton("previous filter");
    var filterNextButton = makeButton("next filter");
    var placePreviousButton = makeButton("previous place");
    var placeNextButton = makeButton("next place");

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
        filterNextButton.addEventListener( "click", callback );
        addKeyEventListener("UP", callback);
    }

    function addFilterPreviousListener( callback ) {
        filterPreviousButton.addEventListener( "click", callback );
        addKeyEventListener("DOWN", callback);
    }

    function addPlaceNextListener( callback ) {
        placeNextButton.addEventListener( "click", callback );
        addKeyEventListener("LEFT", callback);
    }

    function addPlacePreviousListener( callback ) {
        placePreviousButton.addEventListener( "click", callback );
        addKeyEventListener("RIGHT", callback);
    }

    return {
        addFilterNextListener: addFilterNextListener,
        addFilterPreviousListener: addFilterPreviousListener,
        addPlaceNextListener: addPlaceNextListener,
        addPlacePreviousListener: addPlacePreviousListener
    };
});
