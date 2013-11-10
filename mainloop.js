"use strict";

define(['assets', 'arscene', 'puzzle', 'strawman', 'pitobject', 'tween.min', 'three.min'], function( assets, arscene, puzzle, strawman, pitobject ) {

    var scene, imageSource;
    var updateFrequency = 10; 
    var updateCount = 0;

    function animate() {
        requestAnimationFrame( animate );
        TWEEN.update();
        //if( updateCount++ % updateFrequency === 0 ){
            imageSource.update();
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

    GLOBAL.set = function(name) {
        imageSource.setVideo( assets.get(name) );
    };

    function Group( markerSet, arId, thePuzzle, theStrawman ) {
        thePuzzle.setOnSwap( function() { 
            theStrawman.move( thePuzzle.getHolePosition() );
        });

        var thePit = new pitobject.PitObject({color:0x00FF00}); 
        markerSet.add( arId, thePit );
        markerSet.add( arId, thePuzzle );
        markerSet.add( arId, theStrawman );

        return {
            strawman:theStrawman,
        };
    }

    var playerObject = new THREE.Object3D();
    var groups = [];
    function start() {
        imageSource = new arscene.ImageSource( {width:480, height:360} );
        imageSource.setVideo( assets.get("clip2") );

        var markerSet = new arscene.MarkerSet();

        scene = new arscene.Scene( document.body, imageSource, markerSet );

        groups.push( new Group( markerSet, 32, new puzzle.Puzzle(), new strawman.Strawman() ) ); 
        groups.push( new Group( markerSet, 4, new puzzle.Puzzle(), new strawman.Strawman() ) );

        requestAnimationFrame( animate );
    }

    return {
        start: start,
    };
});
