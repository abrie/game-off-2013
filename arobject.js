"use strict";

define(["colors", "three.min"], function(colors) {

    var markerSize = 150;

    THREE.Object3D.prototype.transformFromArray = function(m) {
        this.matrix.fromArray(m);
        this.matrixWorldNeedsUpdate = true;
    }

    function createContainer() {
        var model = new THREE.Object3D();
        model.matrixAutoUpdate = false;
        return model;
    }

    function createMarkerMesh(color) {
        var geometry = new THREE.CubeGeometry( markerSize,markerSize,markerSize );
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
        mesh.position.z = markerSize/2;

        return mesh;
    }

    function createMarkerOccluderMesh() {
        var geometry = new THREE.CubeGeometry( markerSize + 0.1, markerSize + 0.1, markerSize + 0.1 );
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
        mesh.position.z = (markerSize+0.1)/2;

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
            modelContainer.transformFromArray( matrix );
            occluderContainer.transformFromArray( matrix );
        }

        function add( obj ) {
            // a rotation adjustment for the idiosyncratic AR camera
            obj.model.rotation.y = Math.PI;
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
        createMarkerObject:createMarkerObject,
        getMarkerSize: function() { return markerSize; },
    };
});
