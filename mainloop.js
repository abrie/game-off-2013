"use strict";

define(['assets', 'arscene', 'puzzle', 'strawman', 'tween.min', 'three.min'], function( assets, arscene, puzzle, strawman ){

    var scene;
    var updateFrequency = 10; 
    var updateCount = 0;

    function animate() {
        requestAnimationFrame( animate );
        TWEEN.update();
        if( updateCount++ % updateFrequency === 0 ){
            scene.update();
        }
        scene.render();
        if( tracking ) {
            groups.forEach( function(group) { 
                group.strawman.updateTracking(); 
            });
        }
    }

    var tracking = false;
    GLOBAL.track = function() {
        groups.forEach( function(group) { 
            group.strawman.trackTarget( playerObject ); 
        });
        tracking = true;
    };

    function Group( theScene, arId, thePuzzle, theStrawman ) {
        theScene.add( arId, thePuzzle );
        theScene.add( arId, theStrawman );
        return {
            strawman:theStrawman,
        };
    }

    var playerObject = new THREE.Object3D();
    var groups = [];
    function start() {
        scene = new arscene.Scene( document.body, assets.get("clip1") );

        groups.push( new Group( scene, 32, new puzzle.Puzzle(), new strawman.Strawman() ) ); 
        groups.push( new Group( scene, 4, new puzzle.Puzzle(), new strawman.Strawman() ) );

        requestAnimationFrame( animate );
    }

    return {
        start: start,
    };
});
