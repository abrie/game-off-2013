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
        mesh.matrixAutoUpdate = false;

        function r(a) { return Math.random()*a-a/2; }

        function transform(m) {
            mesh.matrix.fromArray(m);
            var target = new THREE.Vector3();
            target.getPositionFromMatrix( mesh.matrix );
            var eye = new THREE.Vector3(0,0,0);
            var up = mesh.up.clone();
            mesh.matrix.lookAt( eye, target, up );
            mesh.matrixWorldNeedsUpdate = true;
        }

        return {
            model: mesh,
            pickables: [],
            transform: transform,
        };
    }

    return {
        Straw:Straw,
    };
});
