"use strict";

define(['assets', 'arscene', 'puzzle', 'strawman', 'tween.min', 'three.min'], function( assets, arscene, puzzle, strawman ){

    var scene;

    function animate() {
        requestAnimationFrame( animate );
        TWEEN.update();
        scene.update();
    }

    var holds = [];
    function start() {
        scene = new arscene.Scene( assets.get("clip2") );
        //scene = new sceneNoAR.Scene();

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

        scene.add( pz.AR_ID, straw );
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
        scene.add( ar_id, puzzleObject );


        return puzzleObject;
    }

    return {
        start: start,
    };
});
