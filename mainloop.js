"use strict";
define(['scene', 'tween.min'],function( scene ){

    function animate() {
        requestAnimationFrame( animate );
        TWEEN.update();
        scene.update();
    }

    function start() {
        console.log("starting.");
        requestAnimationFrame( animate );
    }

    return {
        start: start,
        stop: stop,
    }
});
