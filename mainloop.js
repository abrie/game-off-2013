"use strict";

define(['assets', 'arscene', 'puzzle', 'strawman', 'tween.min', 'three.min'], function( assets, arscene, puzzle, strawman ) {

    var scene;
    var updateFrequency = 10; 
    var updateCount = 0;

    function animate() {
        requestAnimationFrame( animate );
        TWEEN.update();
        //if( updateCount++ % updateFrequency === 0 ){
            imageSources[0].update();
            scene.update();
        //}
        scene.render();
    }

    GLOBAL.target = function() {
        groups.forEach( function(group) { 
            group.strawman.setTarget( playerObject ); 
        });
    };

    GLOBAL.fire = function() {
        groups.forEach( function(group) { 
            var projectile = group.strawman.fire();
            scene.add( projectile );
            projectile.launch();
            group.strawman.setTarget( playerObject );
        });
    };

    function Group( theScene, arId, thePuzzle, theStrawman ) {
        thePuzzle.setOnSwap( function() { 
            theStrawman.move( thePuzzle.getHolePosition() );
        });

        theScene.add( thePuzzle, arId );
        theScene.add( theStrawman, arId );
        return {
            strawman:theStrawman,
        };
    }

    var playerObject = new THREE.Object3D();
    var groups = [];
    var imageSources = [];
    function start() {
        imageSources.push( new arscene.ImageSource( assets.get("clip1") ) );
        imageSources.push( new arscene.ImageSource( assets.get("clip2") ) );

        scene = new arscene.Scene( document.body, imageSources[0] );

        groups.push( new Group( scene, 32, new puzzle.Puzzle(), new strawman.Strawman() ) ); 
        groups.push( new Group( scene, 4, new puzzle.Puzzle(), new strawman.Strawman() ) );

        requestAnimationFrame( animate );
    }

    return {
        start: start,
    };
});
