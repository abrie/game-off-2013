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
        sceneObject = new scene.Scene( assets.get("clip1") );
        //sceneObject = new sceneNoAR.Scene();

        holds.push( makePuzzle( 4 ) );
        holds.push( makePuzzle( 32 ) );

        requestAnimationFrame( animate );
    }

    function createThing( ) {
        var geometry = new THREE.CylinderGeometry( 3.0, 3.0, 200 );

        var quaternion = new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3(1,0,0), -Math.PI/2 );

        var tMatrix = new THREE.Matrix4();
        tMatrix.makeTranslation( 0, 100, 0);
        geometry.applyMatrix( tMatrix );

        var rMatrix = new THREE.Matrix4();
        rMatrix.makeRotationFromQuaternion( quaternion );
        geometry.applyMatrix( rMatrix );

        var material = new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
        });

        var mesh = new THREE.Mesh( geometry, material );

        return mesh;
    }

    function addThing( pz ) {

        function addInternal() {
            var position = new THREE.Vector3(0,0,0);
            var object = createThing();
            object.position.x = position.x;
            object.position.y = position.y;
            object.position.z = position.z;
            //object.lookAt( sceneObject.getCameraPosition() );

            var thing = {
                model: object,
                pickables: [],
            };

            pz.model.add( thing.model );
        }

        function addExternal() {
            sceneObject.updateMatrixWorld(); // caused an update so we can get the world position from inside it
            var position = pz.getHolePosition();
            var object = createThing();
            object.position.x = position.x;
            object.position.y = position.y;
            object.position.z = position.z;
            //object.lookAt( sceneObject.getCameraPosition() );

            var thing = {
                model: object,
                pickables: [],
            };

            sceneObject.add( -1, thing );
        }

        addInternal();
    }

    GLOBAL.add = function() {
        addThing( holds[0] );
        addThing( holds[1] );
    }

    var index = 0;
    function calculateTime( position ) {
        return Math.sqrt( Math.pow(position.x, 2) + Math.pow(position.y, 2) + Math.pow(position.z, 2) );
    }

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
