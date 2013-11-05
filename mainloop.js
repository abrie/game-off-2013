"use strict";

define(['assets', 'scene', 'sceneNoAR', 'puzzle', 'tween.min', 'three.min'], function( assets, scene, sceneNoAR, puzzle ){

    var sceneObject;

    function animate() {
        requestAnimationFrame( animate );
        TWEEN.update();
        sceneObject.update();
    }

    var holds = [];
    function start() {
        //sceneObject = new scene.Scene( assets.get("clip1") );
        sceneObject = new sceneNoAR.Scene();

        holds.push( makePuzzle( 4 ) );
        holds.push( makePuzzle( 32 ) );

        requestAnimationFrame( animate );
    }

    function createThing() {
        var geometry = new THREE.CylinderGeometry( 10.0, 1.0, 100 );

        var quaternion = new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3(1,0,0), Math.PI/2 );

        var rMatrix = new THREE.Matrix4();
        rMatrix.makeRotationFromQuaternion( quaternion );
        geometry.applyMatrix( rMatrix );

        var tMatrix = new THREE.Matrix4();
        tMatrix.makeTranslation( 0, 0, -50);
        geometry.applyMatrix( tMatrix );

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
        var object = createThing();
        object.position.x = position.x;
        object.position.y = position.y;
        object.position.z = position.z;

        var result = {
            model: object,
            pickables: [],
        };

        sceneObject.add( -1, result );

        var targetPosition = sceneObject.getCameraPosition();
        var timeToTarget = 2000;
        var tween = new TWEEN.Tween( { x:object.position.x, y:object.position.y, z:object.position.z, r:0 } )
        .to( {x:targetPosition.x, y:targetPosition.y, z:targetPosition.z, r:2*Math.PI }, timeToTarget )
        .easing( TWEEN.Easing.Quintic.Out)
        .onUpdate( function () {
            object.position.x = this.x; 
            object.position.y = this.y;
            object.position.z = this.z;
            object.rotation.x = this.r;
        } )
        .onComplete( function() {
            sceneObject.remove( -1, result );
        })
        .start();
    };

    function makePuzzle( ar_id ) {
        // puzzleObject exposes an interface with: .model and .pickables
        var puzzleObject = new puzzle.Puzzle();

        // scene.add expectes an interface with .model and .pickables
        sceneObject.add( ar_id, puzzleObject );
        return puzzleObject;
    }

    return {
        start: start,
        stop: stop,
    };
});
