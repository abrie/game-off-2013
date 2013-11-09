"use strict";
define([], function() {
    var strawLength = 100;
    var launcherLength = strawLength/3;
    var strawRadius = 12;

    function Straw() {

        var points = new THREE.SplineCurve3([
            new THREE.Vector3(0, strawLength/2, 0),
            new THREE.Vector3(0, -strawLength, 0),
                   ]);
           
        // points, ?, radius, facets, ? ?
        var geometry = new THREE.TubeGeometry(points, 12,strawRadius,16, false, false);

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

        var material = new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            side: THREE.DoubleSide,
        });

        var mesh = new THREE.Mesh( geometry, material );
        var container = new THREE.Object3D();
        container.add(mesh);

        return container;
    }

    function Launcher() {

        var points = new THREE.SplineCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, -launcherLength, 0),
                   ]);
           
        // points, ?, radius, facets, ? ?
        var geometry = new THREE.TubeGeometry( points, 12, strawRadius, 16, false, false);

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

        geometry.applyMatrix( 
             new THREE.Matrix4()
                .makeTranslation( 0, 0, -strawRadius*2 ) );

        var material = new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            side: THREE.DoubleSide,
        });

        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.z = strawRadius*1.5;
        var container = new THREE.Object3D();
        container.add( mesh );

        var jointGeometry = new THREE.SphereGeometry( strawRadius, 50 );
        var jointMaterial = new THREE.MeshNormalMaterial( { color:0xFFFFFF } );
        var jointMesh = new THREE.Mesh( jointGeometry, jointMaterial );
        jointMesh.position.z = strawRadius*2;
        container.add( jointMesh );

        return container;
    }

    function Strawman() {
        var model = new THREE.Object3D();
        model.matrixAutoUpdate = false;

        var strawModel = new Straw();
        model.add( strawModel );
        strawModel.rotation.y = -Math.PI;

        var launcherModel = new Launcher();
        model.add( launcherModel );
        launcherModel.rotation.y = -Math.PI;
        launcherModel.position.z = -strawLength;

        var tracker = new THREE.Object3D();
        launcherModel.add( tracker );

        var strawTip = new THREE.Object3D();
        strawTip.position.z = launcherLength;
        launcherModel.add( strawTip );

        var uprightQuaternion = new THREE.Quaternion()
            .setFromEuler( launcherModel.rotation );

        function transform(m) {
            model.matrix.fromArray(m);
            model.matrixWorldNeedsUpdate = true;
        }
        
        var targetPosition = new THREE.Vector3();
        var m = new THREE.Matrix4();
        function setTarget( target, time ) {
            m.getInverse(model.matrix).multiply(target.matrix);
            targetPosition.getPositionFromMatrix(m);
            lookAtTarget( time ? time : 250*30 ).start();
        }

        function lookAtTarget( time ) {
            tracker.lookAt( targetPosition );
            var targetQuaternion = new THREE.Quaternion()
                .setFromEuler( tracker.rotation ); 
            var initialQuaternion = new THREE.Quaternion()
                .setFromEuler( launcherModel.rotation );

            return new TWEEN.Tween( { fraction:0.0 } )
                .to( {fraction:1.0}, time )
                .easing( TWEEN.Easing.Bounce.Out)
                .onUpdate( function () {
                    launcherModel.setRotationFromQuaternion( 
                        initialQuaternion.slerp( 
                            targetQuaternion, 
                            this.fraction 
                        )
                    ); 
                });
        }

        function withdraw() {
            var currentQuaternion = new THREE.Quaternion()
                .setFromEuler( launcherModel.rotation ); 
            return new TWEEN.Tween( {z:strawModel.position.z, lz:launcherModel.position.z, fraction:0.0 } )
                .to( { z:strawLength+launcherLength, lz:launcherLength, fraction:1.0 }, 150 )
                .easing( TWEEN.Easing.Linear.None )
                .onUpdate( function() {
                    strawModel.position.z = this.z;
                    launcherModel.position.z = this.lz;
                    launcherModel.setRotationFromQuaternion( 
                        currentQuaternion.slerp( 
                            uprightQuaternion, 
                            this.fraction 
                        )
                    ); 
                });
        }

        function insert() {
            return new TWEEN.Tween( {z:strawModel.position.z, lz:launcherModel.position.z } )
                .to( { z:0, lz:-strawLength }, 150 )
                .easing( TWEEN.Easing.Linear.None )
                .onUpdate( function() {
                    strawModel.position.z = this.z;
                    launcherModel.position.z = this.lz;
                });
        }

        function spin() {
            return new TWEEN.Tween( {y:launcherModel.rotation.y, x:launcherModel.rotation.x } )
                .to( { y:Math.random()*Math.PI, x:Math.random()*Math.PI }, 350 )
                .easing( TWEEN.Easing.Linear.None )
                .onUpdate( function() {
                    launcherModel.rotation.y = this.y;
                    launcherModel.rotation.x = this.x;
                });
        }

        function moveStraw( position ) {
            var t = withdraw();
            t.onComplete( function() {
                strawModel.position.x = position.x;
                strawModel.position.y = position.y;
                launcherModel.position.x = position.x;
                launcherModel.position.y = position.y;
                insert().chain( spin() ).start();
             });
             t.start();
        }

        function getStrawTip() {
            var position = new THREE.Vector3().getPositionFromMatrix( strawTip.matrixWorld );
            return position;
        }

        return {
            model: model,
            transform: transform,
            pickables: [],
            setTarget: setTarget,
            withdraw:withdraw,
            insert:insert,
            moveStraw:moveStraw,
            getStrawTip:getStrawTip,
        };
    }

    return {
        Strawman:Strawman,
    };
});
