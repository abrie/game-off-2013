"use strict";
define(['settings','spitball'], function(settings, spitball) {
    function StrawModel() {

        var points = new THREE.SplineCurve3([
            new THREE.Vector3(0, settings.strawLength/2, 0),
            new THREE.Vector3(0, -settings.strawLength, 0),
                   ]);
           
        // points, ?, radius, facets, ? ?
        var geometry = new THREE.TubeGeometry(points, 12,settings.strawRadius,16, false, false);

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

    function LauncherModel() {

        var points = new THREE.SplineCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, -settings.launcherLength, 0),
                   ]);
           
        // points, ?, radius, facets, ? ?
        var geometry = new THREE.TubeGeometry( points, 12, settings.strawRadius, 16, false, false);

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
                .makeTranslation( 0, 0, 0 ) );

        var material = new THREE.MeshPhongMaterial({
            color: 0xFFFFFF,
            side: THREE.DoubleSide,
        });

        var mesh = new THREE.Mesh( geometry, material );
        var container = new THREE.Object3D();
        container.add( mesh );

        var jointGeometry = new THREE.SphereGeometry( settings.launcherRadius*1.05, 25 );
        var jointMaterial = new THREE.MeshPhongMaterial( { color:0xFFFFFF, side:THREE.DoubleSide } );
        var jointMesh = new THREE.Mesh( jointGeometry, jointMaterial );
        container.add( jointMesh );

        var eyeGeometry = new THREE.SphereGeometry( settings.launcherRadius, 50 );
        var eyeMaterial = new THREE.MeshNormalMaterial( { color:0xFFFFFF } );
        var eyeMesh = new THREE.Mesh( eyeGeometry, eyeMaterial );
        eyeMesh.position.z = settings.launcherLength*0.9;
        container.add( eyeMesh );

        return container;
    }

    function StrawmanObject() {
        var model = new THREE.Object3D();
        model.matrixAutoUpdate = false;

        var strawModel = new StrawModel();
        model.add( strawModel );
        strawModel.rotation.y = -Math.PI;

        var launcherModel = new LauncherModel();
        model.add( launcherModel );
        launcherModel.rotation.y = -Math.PI;
        launcherModel.position.z = -settings.strawLength;

        var tracker = new THREE.Object3D();
        launcherModel.add( tracker );

        var strawTip = new THREE.Object3D();
        strawTip.position.z = settings.launcherLength;
        launcherModel.add( strawTip );

        strawModel.position.z = settings.strawLength+settings.launcherLength-20;
        launcherModel.position.z = settings.launcherLength-20;

        var uprightQuaternion = new THREE.Quaternion()
            .setFromEuler( launcherModel.rotation );

        function transform(m) {
            model.matrix.fromArray(m);
            model.matrixWorldNeedsUpdate = true;
        }
        
        function errorTerm(a) { return Math.random()*a - a/2; }
        var targetPosition = new THREE.Vector3();
        var m = new THREE.Matrix4();
        var errorVector;
        function setTarget( target ) {
            var cloned = target.clone();
            errorVector = new THREE.Vector3( errorTerm(25), errorTerm(25), errorTerm(25) );
            cloned.position.add( errorVector );
            cloned.updateMatrix();
            m.getInverse(model.matrix).multiply(cloned.matrix);
            targetPosition.getPositionFromMatrix(m);
            lookAtTarget().start();
        }

        function lookAtTarget( time ) {
            tracker.lookAt( targetPosition );
            var targetQuaternion = new THREE.Quaternion()
                .setFromEuler( tracker.rotation ); 
            var initialQuaternion = new THREE.Quaternion()
                .setFromEuler( launcherModel.rotation );

            return new TWEEN.Tween( { fraction:0.0 } )
                .to( {fraction:1.0}, time ? time : 250*30 )
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

        function fire() {
            return new spitball.Spitball( getStrawTip(), errorVector );
        }

        function withdraw() {
            var currentQuaternion = new THREE.Quaternion()
                .setFromEuler( launcherModel.rotation ); 
            return new TWEEN.Tween( {z:strawModel.position.z, lz:launcherModel.position.z, fraction:0.0 } )
                .to( { z:settings.strawLength+settings.launcherLength, lz:settings.launcherLength, fraction:1.0 }, 150 )
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
                .to( { z:0, lz:-settings.strawLength }, 1500 )
                .easing( TWEEN.Easing.Elastic.Out )
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

        function setPosition( position ) {
            strawModel.position.x = position.x;
            strawModel.position.y = position.y;
            launcherModel.position.x = position.x;
            launcherModel.position.y = position.y;
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
            fire: fire,
            spin: spin,
            setPosition:setPosition,
            insert:insert,
            withdraw: withdraw,
        };
    }

    function Strawman() {
        return {
            object:new StrawmanObject(),
            spinTween:undefined,
            moveTween:undefined,
            withdrawn:true,
            coordinate: undefined,
        };
    }

    return {
        Strawman:Strawman,
    };
});
