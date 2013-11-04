"use strict";
define(['scene', 'puzzle', 'tween.min', 'three.min'], function( scene, puzzle ){

    var sceneObject;

    function animate() {
        requestAnimationFrame( animate );
        TWEEN.update();
        sceneObject.update();
    }

    var hold;
    function start() {
        console.log("starting.");
        sceneObject = new scene.Scene();

        makePuzzle( 4 );
        hold = makePuzzle( 32 );

        requestAnimationFrame( animate );
    }

    function createThing() {
        var geometry = new THREE.SphereGeometry( 5 );

        var material = new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            side: THREE.DoubleSide,
        });

        var mesh = new THREE.Mesh( geometry, material );

        return mesh;
    }

    GLOBAL.test = function() {
        var position = hold.getHolePosition();
        var thing = createThing();
          
        var object = new THREE.Object3D();
        object.add(thing);
        object.position.x = position.x;
        object.position.y = position.y;
        object.position.z = position.z;

        var result = {
            model: object,
            pickables: [],
        };

        sceneObject.add( result );

        var tween = new TWEEN.Tween( { x:object.position.x, y:object.position.y, z:object.position.z } )
            .to( {x:Math.random()*0.25-0.5, y:Math.random()*0.25-0.5, z:-5 }, 2000 )
            .easing( TWEEN.Easing.Exponential.In)
            .onUpdate( function () {
                    object.position.x = this.x; 
                    object.position.y = this.y;
                    object.position.z = this.z;
                    } )
            .onComplete( function() {
                sceneObject.remove( result );
            })
        .start();
    };

    function makePuzzle( ar_id ) {
        // puzzleObject exposes an interface with: .model and .pickables
        var puzzleObject = new puzzle.Puzzle();

        // scene.add expectes an interface with .model and .pickables
        sceneObject.addToAR( ar_id, puzzleObject );
        return puzzleObject;
    }

    return {
        start: start,
        stop: stop,
    };
});
