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

    function addToolListener( callback ) {
        addKeyEventListener("TOOL", callback);
    }

    function addPlaceNextListener( callback ) {
        addKeyEventListener("RIGHT", callback);
    }

    function addPlacePreviousListener( callback ) {
        addKeyEventListener("LEFT", callback);
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

    function flash(message, color) {
        var element = document.getElementById("message");
        console.log(message);
        element.innerHTML = message;
        new TWEEN.Tween( {opacity:0} )
            .to( {opacity:1.0}, 250 )
            .easing( TWEEN.Easing.Circular.Out )
            .onStart( function() {
                element.style.background = color.background; 
                element.style.color = color.foreground; 
                element.style.display = "block";
            })
            .onComplete( function() {
                element.style.display = "none";
            })
            .onUpdate( function() {
                element.style.opacity = this.opacity;
            })
            .start();
    }

    return {
        addToolListener: addToolListener,
        addPlaceNextListener: addPlaceNextListener,
        addPlacePreviousListener: addPlacePreviousListener,
        shake:shake,
        flash:flash,
    };
});
