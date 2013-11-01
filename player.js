"use strict";
define(['colors','three.min'], function(colors) {
    function Player() {
        var geometry = new THREE.CubeGeometry(
            20,20,20
        );

        var material = new THREE.MeshPhongMaterial({
            color: colors.palette[0],
        });

        var mesh = new THREE.Mesh( geometry, material );
        var object = new THREE.Object3D();
        object.add(mesh);
        
        return {
            model:object,
        }
    }

    return {
        Player:Player,
    }
});
