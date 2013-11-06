"use strict";

define(["colors", "settings", "three.min"], function(colors, settings) {

    function createContainer() {
        var model = new THREE.Object3D();
        model.matrixAutoUpdate = false;
        return model;
    }

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

    function createMarkerObject(params) {
        var modelContainer = createContainer();

        var pitMesh = createMarkerMesh(params.color);
        modelContainer.add( pitMesh );

        var occluderContainer = createContainer();
        var occluderMesh = createMarkerOccluderMesh();
        occluderContainer.add( occluderMesh );

        function transform(matrix) {
            modelContainer.matrix.fromArray(matrix);
            modelContainer.matrixWorldNeedsUpdate = true;

            occluderContainer.matrix.fromArray(matrix);
            occluderContainer.matrixWorldNeedsUpdate = true;
        }

        function add( obj ) {
            obj.model.position.z = 0;
            modelContainer.add( obj.model );
        }

        return {
            transform: transform,
            model: modelContainer,
            occluder: occluderContainer,
            add: add,
        };
    }

    return {
        createMarkerObject: createMarkerObject,
    };
});
