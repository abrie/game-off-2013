"use strict";
define(['colors','utility','three.min','tween.min'], function( colors, utility ) {
    function PointerMesh( size ) {
        var points = [];
        var shape;

        points.push( new THREE.Vector2( 0, -size*2 ) );
        points.push( new THREE.Vector2( 0, -size ) );
        points.push( new THREE.Vector2( -size*3, -size ) );
        points.push( new THREE.Vector2( -size*3, size ) );
        points.push( new THREE.Vector2( 0, size ) );
        points.push( new THREE.Vector2( 0, size*2 ) );
        points.push( new THREE.Vector2( size*2, 0 ) );
        shape = new THREE.Shape( points );

        var extrusionSettings = {
            amount: -3,
            curveSegments: 3,
            bevelThickness: 4, bevelSize: 2, bevelEnabled: false,
            material: 0, extrudeMaterial: 1
        };

        var geometry = new THREE.ExtrudeGeometry( shape, extrusionSettings );
        var material = new THREE.MeshPhongMaterial( { color: colors.palette[0], side:THREE.DoubleSide } );
        var mesh = new THREE.Mesh( geometry, material );

        mesh.rotation.z = -Math.PI/2;
        return mesh;
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
        var material = new THREE.MeshFaceMaterial( materialArray );

        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.set( 0, 0, 0 );
        mesh.rotation.z = params.rotation;

        return mesh;
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
        Hammer: Hammer,
        PointerMesh: PointerMesh,
    };
});
