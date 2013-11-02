"use strict";

define(["colors", "three.min"], function(colors) {

    THREE.Matrix4.prototype.setFromArray = function(m) {
        return this.set(
          m[0], m[4], m[8], m[12],
          m[1], m[5], m[9], m[13],
          m[2], m[6], m[10], m[14],
          m[3], m[7], m[11], m[15]
        );
    }

    var markerSize = 150;

    THREE.Object3D.prototype.transformFromArray = function(m) {
        this.matrix.setFromArray(m);
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

    function createMarkerHitboxMesh() {
        var geometry = new THREE.PlaneGeometry( markerSize, markerSize );
        var material = new THREE.MeshBasicMaterial({
            visible:false,
            side:THREE.DoubleSide
        });
        var mesh = new THREE.Mesh( geometry, material );

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

        var pitMesh = createMarkerMesh(colors.palette[4]);
        modelContainer.add( pitMesh );

        var hitboxMesh = createMarkerHitboxMesh();
        modelContainer.add( hitboxMesh );

        var occluderContainer = createContainer();
        var occluderMesh = createMarkerOccluderMesh();
        occluderContainer.add( occluderMesh );

        function transform(matrix) {
            modelContainer.transformFromArray( matrix );
            occluderContainer.transformFromArray( matrix );
        }

        function add( obj ) {
            obj.model.rotation.y = Math.PI;
            obj.model.position.z = 0;
            modelContainer.add( obj.model );
        }

        return {
            transform: transform,
            model: modelContainer,
            occluder: occluderContainer,
            hitbox: hitboxMesh,
            add: add,
        }
    }

    return {
        createMarkerObject:createMarkerObject,
        getMarkerSize: function() { return markerSize; },
    }
});
