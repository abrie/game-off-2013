"use strict";

define(['assets', 'scene', 'puzzle', 'strawman', 'tween.min', 'three.min'], function( assets, scene, puzzle, strawman ){

    var sceneObject;

    function animate() {
        requestAnimationFrame( animate );
        TWEEN.update();
        sceneObject.update();
    }

    var holds = [];
    function start() {
        sceneObject = new scene.Scene( assets.get("clip2") );
        //sceneObject = new sceneNoAR.Scene();

        holds.push( makePuzzle( 4 ) );
        holds.push( makePuzzle( 32 ) );

        requestAnimationFrame( animate );
    }

    function addThing( pz ) {
        var model = new strawman.Straw(); 

        var straw = {
            model: model,
            transform: model.transform,
            pickables: [],
        };

        sceneObject.add( pz.AR_ID, straw );
    }

    GLOBAL.add = function() {
        addThing( holds[0] );
        addThing( holds[1] );
    };

    function makePuzzle( ar_id ) {
        // puzzleObject exposes an interface with: .model and .pickables
        var puzzleObject = new puzzle.Puzzle();

        // DEVELOPMENT
        puzzleObject.AR_ID = ar_id;

        // scene.add expectes an interface with .model and .pickables
        sceneObject.add( ar_id, puzzleObject );


        return puzzleObject;
    }

    return {
        start: start,
    };
});
