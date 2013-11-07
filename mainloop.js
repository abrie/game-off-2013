"use strict";

define(['assets', 'arscene', 'puzzle', 'strawman', 'tween.min', 'three.min'], function( assets, arscene, puzzle, strawman ){

    var scene;

    function animate() {
        requestAnimationFrame( animate );
        TWEEN.update();
        scene.update();
        scene.render();
        holds[0].strawman.lookAt( playerObject );
    }

    function Group( theScene, arId, thePuzzle, theStrawman ) {
        theScene.add( arId, thePuzzle );
        theScene.add( arId, theStrawman );
        return {
            strawman:theStrawman,
        };
    }

    var holds = [];
    var playerObject = new THREE.Object3D();
    function start() {
        scene = new arscene.Scene( document.body, assets.get("clip2") );
        //scene = new sceneNoAR.Scene();

        holds.push( new Group( scene, 4, new puzzle.Puzzle(), new strawman.Strawman() ) );
        holds.push( new Group( scene, 32, new puzzle.Puzzle(), new strawman.Strawman() ) );

        requestAnimationFrame( animate );
    }

    return {
        start: start,
    };
});
