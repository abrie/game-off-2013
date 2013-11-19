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
    var scenePreviousButton = makeButton("previous scene");
    var sceneNextButton = makeButton("next scene");

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

    function addSourceNextListener( callback ) {
        sceneNextButton.addEventListener( "click", callback );
        addKeyEventListener("LEFT", callback);
    }

    function addSourcePreviousListener( callback ) {
        scenePreviousButton.addEventListener( "click", callback );
        addKeyEventListener("RIGHT", callback);
    }

    return {
        addFilterNextListener: addFilterNextListener,
        addFilterPreviousListener: addFilterPreviousListener,
        addSourceNextListener: addSourceNextListener,
        addSourcePreviousListener: addSourcePreviousListener
    };
});
