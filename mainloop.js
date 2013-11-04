"use strict";
define(['scene', 'puzzle', 'tween.min', 'three.min'], function( scene, puzzle ){

    var sceneObject;

    function animate() {
        requestAnimationFrame( animate );
        TWEEN.update();
        sceneObject.update();
    }

    var holds = [];
    function start() {
        console.log("starting.");
        sceneObject = new scene.Scene();

        holds.push( makePuzzle( 4 ) );
        holds.push( makePuzzle( 32 ) );

        requestAnimationFrame( animate );
    }

    function createThing() {
        var geometry = new THREE.SphereGeometry( 0.5,100,100 );

        var material = new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            side: THREE.DoubleSide,
        });

        var mesh = new THREE.Mesh( geometry, material );

        return mesh;
    }

    var index = 0;
        function calculateTime( position ) {
            return Math.sqrt( Math.pow(position.x, 2) + Math.pow(position.y, 2) + Math.pow(position.z, 2) );
        }
    GLOBAL.test = function() {
        var position = holds[index++%holds.length].getHolePosition();
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

        var vary = function() {
            var v = 0.5;
            return Math.random()*v/2-v;
        };

        var time = calculateTime( object.position )*3;
        var tx = vary();
        var ty = vary();
        var tween = new TWEEN.Tween( { x:object.position.x, y:object.position.y, z:object.position.z } )
            .to( {x:tx, y:ty, z:0 }, time )
            .easing( TWEEN.Easing.Quintic.Out)
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
