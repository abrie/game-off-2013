"use strict";
define([], function() {
    document.addEventListener( 'keydown', onDocumentKeyDown, false );
    document.addEventListener( 'keyup', onDocumentKeyUp, false );

    var states = {};
    var actions = {
        UP: [87, 38],
        LEFT: [65, 37],
        DOWN: [83, 40],
        RIGHT: [68, 39],
        TOOL: [84],
    };

    function onDocumentKeyDown( event ) {
        var keyCode = event.keyCode;
        if( !states[keyCode] ) {
            states[keyCode] = true;
            onPress(keyCode);
        }
    }

    function onDocumentKeyUp( event ) {
        var keyCode = event.keyCode;
        if( states[keyCode] ) {
            states[keyCode] = false;
            onRelease(keyCode);
        }
    }

    function onPress(keyCode) {
        function isKeycode(k) { return k === keyCode; }
        for( var dir in actions ) {
            if( actions[dir].some( isKeycode ) ) {
                result.fireEvent(dir, true);
            }
        }
    }

    function onRelease(keyCode) {
        function isKeycode(k) { return k === keyCode; }
        for( var dir in actions ) {
            if( actions[dir].some( isKeycode ) ) {
                result.fireEvent(dir, false);
            }
        }
    }

    var result = {
        fireEvent:undefined
    };

    return result;
});
