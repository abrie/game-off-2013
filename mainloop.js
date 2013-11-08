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
    }

    GLOBAL.track = function() {
        groups.forEach( function(group) { 
            group.strawman.trackTarget( playerObject ); 
        });
    };

    GLOBAL.withdraw = function() {
        groups.forEach( function(group) { 
            group.strawman.withdraw(); 
        });
    };

    GLOBAL.insert = function() {
        groups.forEach( function(group) { 
            group.strawman.insert(); 
        });
    };

    GLOBAL.ready = function() {
        groups.forEach( function(group) { 
            group.strawman.ready(); 
        });
    };

    function Group( theScene, arId, thePuzzle, theStrawman ) {
        thePuzzle.setOnSwap( function() { 
            theStrawman.moveStraw( thePuzzle.getHolePosition() );
        });

        theScene.add( arId, thePuzzle );
        theScene.add( arId, theStrawman );
        return {
            strawman:theStrawman,
        };
    }

    var playerObject = new THREE.Object3D();
    var groups = [];
    function start() {
        scene = new arscene.Scene( document.body, assets.get("clip2") );

        groups.push( new Group( scene, 32, new puzzle.Puzzle(), new strawman.Strawman() ) ); 
        groups.push( new Group( scene, 4, new puzzle.Puzzle(), new strawman.Strawman() ) );

        requestAnimationFrame( animate );
    }

    return {
        start: start,
    };
});
