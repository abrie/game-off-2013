"use strict";

define(["settings", "three.min"], function( settings ) {

    function createMarkerMesh(color) {
        var geometry = new THREE.CubeGeometry( 
            settings.arMarkerSize,
            settings.arMarkerSize,
            settings.arMarkerSize 
        );

        var materials = [
            new THREE.MeshPhongMaterial( {color:color, side:THREE.DoubleSide } ),
            new THREE.MeshBasicMaterial( {visible:false} ),
        ];

        for( var i = 0; i < geometry.faces.length; i++ ) {
            geometry.faces[ i ].materialIndex = 0;
        }
        geometry.faces[ 10 ].materialIndex = 1;
        geometry.faces[ 11 ].materialIndex = 1;

        var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
        mesh.position.z = settings.arMarkerSize/2;

        return mesh;
    }

    function createMarkerOccluderMesh() {
        var geometry = new THREE.CubeGeometry( 
            settings.arMarkerSize + 0.1, 
            settings.arMarkerSize + 0.1, 
            settings.arMarkerSize + 0.1 
        );

        var materials = [
            new THREE.MeshBasicMaterial( {color:0x0000FF, side:THREE.DoubleSide } ),
            new THREE.MeshBasicMaterial( {visible:false } ),
        ];

        for( var i = 0; i < geometry.faces.length; i++ ) {
            geometry.faces[ i ].materialIndex = 0;
        }
        geometry.faces[ 10 ].materialIndex = 1;
        geometry.faces[ 11 ].materialIndex = 1;

        var mesh = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial( materials ) );
        mesh.position.z = (settings.arMarkerSize+0.1)/2;

        return mesh;
    }

    function PitObject(params) {
        var model = new THREE.Object3D();
        model.matrixAutoUpdate = false;
        model.add( createMarkerMesh( params.color ) );

        var occluder = new THREE.Object3D();
        occluder.matrixAutoUpdate = false;
        occluder.add( createMarkerOccluderMesh() );

        function transform(matrix) {
            model.matrix.fromArray(matrix);
            model.matrixWorldNeedsUpdate = true;

            occluder.matrix.fromArray(matrix);
            occluder.matrixWorldNeedsUpdate = true;
        }

        return {
            transform: transform,
            model: model,
            occluder: occluder,
        };
    }

    return {
        PitObject: PitObject,
    };
});
