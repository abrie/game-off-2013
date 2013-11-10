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

    function Group( view, arId ) {
        var pitObject = new pitobject.PitObject({color:0x00FF00});
        var puzzleObject = new puzzle.Puzzle();
        var strawmanObject = new strawman.Strawman();

        puzzleObject.setOnSwap( function() { 
            strawmanObject.move( puzzleObject.getHolePosition() );
        });

        view.objects.add( arId, pitObject );
        view.objects.add( arId, puzzleObject );
        view.objects.add( arId, strawmanObject );

        return {
            strawman: strawmanObject,
        };
    }

    var playerObject = new THREE.Object3D();
    var groups = [];
    var view;
    function start() {
        imageSource = new arscene.ImageSource( {width:480, height:360} );
        imageSource.setVideo( assets.get("clip2") );

        view = new arscene.View();

        groups.push( new Group( view, 32) ); 
        groups.push( new Group( view, 4) );

        scene = new arscene.Scene( document.body, imageSource );
        scene.setView( view );

        requestAnimationFrame( animate );
    }

    return {
        start: start,
    };
});
