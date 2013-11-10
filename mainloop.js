"use strict";

define(['assets', 'arscene', 'puzzle', 'strawman', 'pitobject', 'tween.min', 'three.min'], function( assets, arscene, puzzle, strawman, pitobject ) {

    var scene, imageSource;

    function animate() {
        requestAnimationFrame( animate );
        TWEEN.update();
        imageSource.update();
        scene.update();
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

    function Group( view, arId, thePuzzle, theStrawman ) {
        thePuzzle.setOnSwap( function() { 
            theStrawman.move( thePuzzle.getHolePosition() );
        });

        var thePit = new pitobject.PitObject({color:0x00FF00}); 
        view.markers.add( arId, thePit );
        view.markers.add( arId, thePuzzle );
        view.markers.add( arId, theStrawman );

        return {
            strawman:theStrawman,
        };
    }

    var playerObject = new THREE.Object3D();
    var groups = [];
    var view;
    function start() {
        imageSource = new arscene.ImageSource( {width:480, height:360} );
        imageSource.setVideo( assets.get("clip2") );

        view = new arscene.View();

        scene = new arscene.Scene( document.body, imageSource );
        scene.setView( view );

        groups.push( new Group( view, 32, new puzzle.Puzzle(), new strawman.Strawman() ) ); 
        groups.push( new Group( view, 4, new puzzle.Puzzle(), new strawman.Strawman() ) );

        requestAnimationFrame( animate );
    }

    return {
        start: start,
    };
});
