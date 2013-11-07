"use strict";
define([], function() {
    function Straw() {
        var geometry = new THREE.CylinderGeometry( 5.0, 30.0, 100*2, 100 );

        var quaternion = new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3(1,0,0), -Math.PI/2 );

        var tMatrix = new THREE.Matrix4();
        tMatrix.makeTranslation( 0, -50*2, 0);
        geometry.applyMatrix( tMatrix );

        var rMatrix = new THREE.Matrix4();
        rMatrix.makeRotationFromQuaternion( quaternion );
        geometry.applyMatrix( rMatrix );

        var material = new THREE.MeshNormalMaterial({
            color: 0xFFFFFF,
            side: THREE.DoubleSide,
       });

        var mesh = new THREE.Mesh( geometry, material );
        return mesh;
    }

    function Strawman() {
        var model = new THREE.Object3D();
        model.matrixAutoUpdate = false;

        var strawModel = new Straw();
        model.add( strawModel );
        strawModel.rotation.y = Math.PI;

        var tracker = new THREE.Object3D();
        model.add( tracker );

        function transform(m) {
            model.matrix.fromArray(m);
            model.matrixWorldNeedsUpdate = true;
        }
        
        var rel_pos = new THREE.Vector3();
        var m = new THREE.Matrix4();
        var targetQuaternion;
        function lookAt( target ) {
            m.getInverse(model.matrix).multiply(target.matrix);
            rel_pos.getPositionFromMatrix(m);
            tracker.lookAt( rel_pos );
            targetQuaternion = new THREE.Quaternion().setFromEuler( tracker.rotation ); 
        }

        function updateTracking() {
            var currentQuaternion = new THREE.Quaternion().setFromEuler( strawModel.rotation );
            strawModel.setRotationFromQuaternion( currentQuaternion.slerp( targetQuaternion, 0.01 ) ); 
        }

        return {
            model: model,
            transform: transform,
            pickables: [],
            trackTarget: lookAt,
            updateTracking: updateTracking,
        };
    }

    return {
        Strawman:Strawman,
    };
});
