"use strict";
define([], function() {
    var strawLength = 100;
    function Straw() {

        var points = new THREE.SplineCurve3([
                     new THREE.Vector3(0, 0, 0),
                     new THREE.Vector3(0, -strawLength, 0),
                   ]);
           
        // points, ?, radius, facets, ? ?
        var geometry = new THREE.TubeGeometry(points, 12,12,16, false, false);

        geometry.applyMatrix( 
             new THREE.Matrix4()
                .makeTranslation( 0, 0, 0 ) );

        geometry.applyMatrix( 
             new THREE.Matrix4()
                .makeRotationFromQuaternion(
                    new THREE.Quaternion()
                        .setFromAxisAngle( 
                            new THREE.Vector3( 1, 0, 0), 
                            -Math.PI/2 )));

        var material = new THREE.MeshNormalMaterial({
            color: 0xFFFFFF,
            side: THREE.DoubleSide,
        });

        var mesh = new THREE.Mesh( geometry, material );
        var container = new THREE.Object3D();
        container.add(mesh);

        return container;
    }

    function Strawman() {
        var model = new THREE.Object3D();
        model.matrixAutoUpdate = false;

        var strawModel = new Straw();
        model.add( strawModel );
        strawModel.rotation.y = Math.PI;
        var uprightQuaternion = new THREE.Quaternion()
            .setFromEuler( strawModel.rotation );
        var readyQuaternion = new THREE.Quaternion()
            .setFromEuler( strawModel.rotation );

        var tracker = new THREE.Object3D();
        model.add( tracker );

        function transform(m) {
            model.matrix.fromArray(m);
            model.matrixWorldNeedsUpdate = true;
        }
        
        var rel_pos = new THREE.Vector3();
        var m = new THREE.Matrix4();
        function lookAt( target ) {
            m.getInverse(model.matrix).multiply(target.matrix);
            rel_pos.getPositionFromMatrix(m);
            tracker.lookAt( rel_pos );
            var targetQuaternion = new THREE.Quaternion()
                .setFromEuler( tracker.rotation ); 
            var initialQuaternion = new THREE.Quaternion()
                .setFromEuler( strawModel.rotation );

            var trackTween = new TWEEN.Tween( { fraction:0.0 } )
                .to( {fraction:1.0}, 250 )
                .easing( TWEEN.Easing.Bounce.Out)
                .onUpdate( function () {
                    strawModel.setRotationFromQuaternion( 
                        initialQuaternion.slerp( 
                            targetQuaternion, 
                            this.fraction 
                        )
                    ); 
                });

            trackTween.start();
        }

        function withdraw() {
            var thisQuaternion = new THREE.Quaternion()
                .setFromEuler( strawModel.rotation );

            var readyTween = new TWEEN.Tween( { fraction:0.0 } )
                .to( {fraction:1.0}, 250 )
                .easing( TWEEN.Easing.Linear.None)
                .onUpdate( function () {
                    strawModel.setRotationFromQuaternion( 
                        thisQuaternion.slerp( 
                            uprightQuaternion, 
                            this.fraction 
                        )
                    ); 
                });

            var withdrawTween = new TWEEN.Tween( {z:0} )
                .to( { z:strawLength }, 250 )
                .easing( TWEEN.Easing.Linear.None )
                .onUpdate( function() {
                    strawModel.position.z = this.z;
                });

                readyTween.chain( withdrawTween ).start();
        }

        function ready() {
            var thisQuaternion = new THREE.Quaternion()
                .setFromEuler( strawModel.rotation );

            var readyTween = new TWEEN.Tween( { fraction:0.0 } )
                .to( {fraction:1.0}, 250 )
                .easing( TWEEN.Easing.Linear.None)
                .onUpdate( function () {
                    strawModel.setRotationFromQuaternion( 
                        thisQuaternion.slerp( 
                            readyQuaternion, 
                            this.fraction 
                        )
                    ); 
                });

                readyTween.start();
        }

        function insert() {
            var insertTween = new TWEEN.Tween( {z:strawLength} )
                .to( {z:0}, 250 )
                .easing( TWEEN.Easing.Linear.None )
                .onUpdate( function() {
                    strawModel.position.z = this.z;
                });

                insertTween.start();
        }

        return {
            model: model,
            transform: transform,
            pickables: [],
            trackTarget: lookAt,
            withdraw:withdraw,
            insert:insert,
            ready:ready,
        };
    }

    return {
        Strawman:Strawman,
    };
});
