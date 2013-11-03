"use strict";
define(['scene', 'puzzle', 'tween.min'], function( scene, puzzle ){

    var sceneObject;

    function animate() {
        requestAnimationFrame( animate );
        TWEEN.update();
        sceneObject.update();
    }

    function start() {
        console.log("starting.");
        sceneObject = new scene.Scene();

        makePuzzle( 4 );
        makePuzzle( 32 );

        requestAnimationFrame( animate );
    }

    function makePuzzle( ar_id ) {
        // puzzleObject exposes an interface with: .model and .pickables
        var puzzleObject = new puzzle.Puzzle();

        // scene.add expectes an interface with .model and .pickables
        sceneObject.add( ar_id, puzzleObject );
    }

    return {
        start: start,
        stop: stop,
    };
});
