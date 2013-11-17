"use strict";

define(["settings", "three.min"], function( settings ) {

    function LinerMesh(color) {
        var linerDepth = settings.arMarkerSize;
        var geometry = new THREE.CubeGeometry( 
            settings.arMarkerSize,
            settings.arMarkerSize,
            linerDepth
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
        mesh.position.z = linerDepth/2;

        return mesh;
    }

    function OccluderMesh() {
        var occluderDepth = settings.arMarkerSize*3;
        var geometry = new THREE.CubeGeometry( 
            settings.arMarkerSize + 0.1, 
            settings.arMarkerSize + 0.1, 
            occluderDepth 
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
        mesh.position.z = occluderDepth/2;

        return mesh;
    }

    function PitObject(params) {
        var model = new THREE.Object3D();
        model.matrixAutoUpdate = false;
        model.add( new LinerMesh( params.color ) );

        var occluder = new THREE.Object3D();
        occluder.matrixAutoUpdate = false;
        occluder.add( new OccluderMesh() );

        function transform(matrix) {
            model.matrix.fromArray(matrix);
            model.matrixWorldNeedsUpdate = true;

            occluder.matrix.fromArray(matrix);
            occluder.matrixWorldNeedsUpdate = true;
        }

        return {
            transform: transform,
            model: model,
            pickables: [],
            occluder: occluder,
        };
    }

    return {
        PitObject: PitObject,
    };
});
