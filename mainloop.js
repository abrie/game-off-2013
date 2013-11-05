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
        var geometry = new THREE.CylinderGeometry( 30.0, 30.0, 100 );

        var quaternion = new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3(1,0,0), -Math.PI/2 );

        var tMatrix = new THREE.Matrix4();
        tMatrix.makeTranslation( 0, -200, 0);
        geometry.applyMatrix( tMatrix );

        var rMatrix = new THREE.Matrix4();
        rMatrix.makeRotationFromQuaternion( quaternion );
        geometry.applyMatrix( rMatrix );

        var material = new THREE.MeshNormalMaterial({
            color: 0xFFFFFF,
       });

        var mesh = new THREE.Mesh( geometry, material );
        mesh.matrixAutoUpdate = false;

        function r(a) { return Math.random()*a-a/2; }

        mesh.transform = function(m) {
            mesh.matrix.fromArray(m);
            var target = new THREE.Vector3();
            target.getPositionFromMatrix( mesh.matrix );
            target.x += r(20);
            target.y += r(20);
            target.z += r(20);
            var eye = new THREE.Vector3(0,0,0);
            mesh.matrix.lookAt( eye, target, mesh.up );
            mesh.matrixWorldNeedsUpdate = true;
        };

        console.log( mesh.matrix );
        return mesh;
    }

    function addThing( pz ) {

        function addInternal() {
            var position = new THREE.Vector3( 0, 0, -40);
            var object = createThing();
            object.position = position;
            //object.lookAt( sceneObject.getCameraPosition() );

            var thing = {
                model: object,
                transform: object.transform,
                pickables: [],
            };

            //pz.model.add( thing.model );
            sceneObject.add( pz.AR_ID, thing );
        }

        function addExternal() {
            sceneObject.updateMatrixWorld();
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
    };

    function makePuzzle( ar_id ) {
        // puzzleObject exposes an interface with: .model and .pickables
        var puzzleObject = new puzzle.Puzzle();

        // DEVELOPMENT
        puzzleObject.AR_ID = ar_id;

        // scene.add expectes an interface with .model and .pickables
        sceneObject.add( ar_id, puzzleObject );


        return puzzleObject;
    }

    return {
        start: start,
    };
});
