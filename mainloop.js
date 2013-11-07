"use strict";

define(['assets', 'arscene', 'puzzle', 'strawman', 'tween.min', 'three.min'], function( assets, arscene, puzzle, strawman ){

    var scene;

    function animate() {
        requestAnimationFrame( animate );
        TWEEN.update();
        scene.update();
        scene.render();
        if( tracking ) {
            p.strawman.updateTracking();
            q.strawman.updateTracking();
        }
    }

    var tracking = false;
    GLOBAL.track = function() {
        p.strawman.trackTarget( playerObject );
        q.strawman.trackTarget( playerObject );
        tracking = true;
    }

    function Group( theScene, arId, thePuzzle, theStrawman ) {
        theScene.add( arId, thePuzzle );
        theScene.add( arId, theStrawman );
        return {
            strawman:theStrawman,
        };
    }

    var playerObject = new THREE.Object3D();
    var p,q;
    function start() {
        scene = new arscene.Scene( document.body, assets.get("clip2") );

        p = new Group( scene, 32, new puzzle.Puzzle(), new strawman.Strawman() );
        q = new Group( scene, 4, new puzzle.Puzzle(), new strawman.Strawman() );

        requestAnimationFrame( animate );
    }

    return {
        start: start,
    };
});
