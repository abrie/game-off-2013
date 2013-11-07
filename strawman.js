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

        return new THREE.Mesh( geometry, material );
    }

    function Strawman() {
        var model = new THREE.Object3D();
        model.matrixAutoUpdate = false;

        var strawModel = new Straw();
        model.add( strawModel );

        function transform(m) {
            model.matrix.fromArray(m);
            model.matrixWorldNeedsUpdate = true;
        }
        
        function lookAt( target ) {
            var m = new THREE.Matrix4().getInverse(model.matrix).multiply(target.matrix);
            var rel_pos = new THREE.Vector3().getPositionFromMatrix(m, 'XYZ');
            strawModel.lookAt( rel_pos );
        }

        return {
            model: model,
            transform: transform,
            pickables: [],
            lookAt: lookAt,
        };
    }

    return {
        Strawman:Strawman,
    };
});
