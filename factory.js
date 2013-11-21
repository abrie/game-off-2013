"use strict";
define(['colors','utility','three.min','tween.min'], function(colors, utility) {
    function CityMesh( params ) {
        var block = new THREE.Object3D();
        var w = params.width/2;
        var h = params.height/2;
        var cx = w/2;
        var cy = h/2;
        for( var x = 0; x < 2; x++ ) {
            for( var y = 0; y < 2; y++ ) {
                var depth = Math.floor( Math.random()*3+1 ) * 25;
                var g = new THREE.CubeGeometry( w-1, h-1, depth );
                var m = new THREE.MeshLambertMaterial({side:THREE.DoubleSide, color:colors.randomColor()});
                var mesh = new THREE.Mesh( g, m );
                mesh.position.x = w*x-cx;
                mesh.position.y = h*y-cy;
                mesh.position.z = -depth/2;
                block.add( mesh );
                if( Math.random()*100 > 50 ) {
                    var g = new THREE.CylinderGeometry( 1, 5, 25 );
                    var m = new THREE.MeshPhongMaterial({side:THREE.DoubleSide, color:colors.randomColor()});
                    g.applyMatrix( 
                         new THREE.Matrix4()
                            .makeTranslation( 10, 0, 0 ) );

                    g.applyMatrix( 
                         new THREE.Matrix4()
                            .makeRotationFromQuaternion(
                                new THREE.Quaternion()
                                    .setFromAxisAngle( 
                                        new THREE.Vector3( 1, 0, 0), 
                                        -Math.PI/2 )));
                    var mesh = new THREE.Mesh(g,m);
                    mesh.position.x = w*x-cx;
                    mesh.position.y = h*y-cy;
                    mesh.position.z = -depth-25/2;
                    block.add( mesh );
                }
            }
        }

        return block;
    }


    function HammerMesh( params ) {
        var points = [];
        var shape;

        if( params.type === "corner" ) {
            points.push( new THREE.Vector2 ( -params.width/2, -params.height/2) );
            points.push( new THREE.Vector2 ( -params.width/2, params.height/2 ) );
            points.push( new THREE.Vector2 ( params.width/2, -params.height/2 ) );
            shape = new THREE.Shape( points );
        }
        else if( params.type === "edge" ) {
            points.push( new THREE.Vector2 ( 0, -params.height/2) );
            points.push( new THREE.Vector2 ( -params.width/2, params.height/2 ) );
            points.push( new THREE.Vector2 ( params.width/2, params.height/2 ) );
            shape = new THREE.Shape( points );
        }

        var extrusionSettings = {
            amount: -params.depth/2,
            curveSegments: 3,
            bevelThickness: 4, bevelSize: 2, bevelEnabled: false,
            material: 0, extrudeMaterial: 1
        };

        var geometry = new THREE.ExtrudeGeometry( shape, extrusionSettings );

        var materialFront = new THREE.MeshBasicMaterial( { color: 0xffff00, side:THREE.DoubleSide } );
        var materialSide = new THREE.MeshBasicMaterial( { color: 0xff8800, side:THREE.DoubleSide } );
        var materialArray = [ materialFront, materialSide ];
        var material = new THREE.MeshFaceMaterial(materialArray);

        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.set(0,0,0);
        mesh.rotation.z = params.rotation;

        return mesh;
    }

    function City( params ) {
        var model = new CityMesh( params );
        model.position.z = 0;

        function activate() {
        }

        function deactivate() {
        }

        return {
            model:model,
            activate:activate,
            deactivate:deactivate
        };
    }

    function RefineryMesh( params ) {
        var radius = 15;
        var block = new THREE.Object3D();
        for( var index = 0; index < params.solvedIndex; index++ ) {
            var depth = 100;
            var g = new THREE.CubeGeometry( 10, 10, depth );
            var m = new THREE.MeshLambertMaterial({side:THREE.DoubleSide, color:colors.randomColor()});
            var mesh = new THREE.Mesh( g, m );
            mesh.position.x = Math.sin(index*2*Math.PI/params.solvedIndex)*radius;
            mesh.position.y = Math.cos(index*2*Math.PI/params.solvedIndex)*radius;
            mesh.position.z = -depth/2;
            block.add( mesh );
        }

        return block;
    }

    function Refinery( params ) {
        var model = new RefineryMesh( params );
        model.position.z = 0;

        var tween;
        function activate() {
            if( tween ) { tween.stop(); }
            tween = new TWEEN.Tween( {z:model.position.z, r:0} )
                .to( { z:-0.01, r:Math.PI }, 500 )
                .easing( TWEEN.Easing.Exponential.In )
                .repeat(Infinity)
                .yoyo(true)
                .onUpdate( function() {
                    model.position.z = this.z;
                    model.rotation.z = this.r;
                })
            .start();
        }

        function deactivate() {
            if( tween ) { tween.stop(); }
            tween = new TWEEN.Tween( { z:model.position.z, r:model.rotation.z } )
                .to( { z:70, r:0 }, 500 )
                .easing( TWEEN.Easing.Exponential.Out )
                .onUpdate( function() {
                    model.position.z = this.z;
                    model.rotation.z = this.r;
                })
                .start();
        }

        return {
            model:model,
            activate:activate,
            deactivate:deactivate
        };
    }

    function Hammer( params ) {
        var hammer = new HammerMesh( params );
        hammer.position.z = 0;

        var hammerTween;
        function activate() {
            if( hammerTween ) { hammerTween.stop(); }
            hammerTween = new TWEEN.Tween( { z:hammer.position.z } )
                .to( { z:-8 }, 500 )
                .easing( TWEEN.Easing.Exponential.In )
                .onUpdate( function () {
                    hammer.position.z = this.z;
                })
            .start();
        }

        function deactivate() {
            if( hammerTween ) { hammerTween.stop(); }
            hammerTween = new TWEEN.Tween( { z:hammer.position.z } )
                .to( { z:-0.1 }, 500 )
                .easing( TWEEN.Easing.Exponential.Out )
                .onUpdate( function () {
                        hammer.position.z = this.z;
                        } )
            .start();
        }

        return {
            model:hammer,
            activate:activate,
            deactivate:deactivate
        };
    }

    return {
        Hammer:Hammer,
        City:City,
        Refinery:Refinery,
    };
});
