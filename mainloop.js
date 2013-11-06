"use strict";

define(['assets', 'arscene', 'puzzle', 'strawman', 'tween.min', 'three.min'], function( assets, arscene, puzzle, strawman ){

    var scene;

    function animate() {
        requestAnimationFrame( animate );
        TWEEN.update();
        scene.update();
    }

    function Group( theScene, arId, thePuzzle, theStrawman ) {
        theScene.add( arId, thePuzzle );
        theScene.add( arId, theStrawman );
    }

    var holds = [];
    function start() {
        scene = new arscene.Scene( document.body, assets.get("clip2") );
        //scene = new sceneNoAR.Scene();

        holds.push( new Group( scene, 4, new puzzle.Puzzle(), new strawman.Straw() ) );
        holds.push( new Group( scene, 32, new puzzle.Puzzle(), new strawman.Straw() ) );

        requestAnimationFrame( animate );
    }

    return {
        start: start,
    };
});
