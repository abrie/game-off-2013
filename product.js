"use strict";
define(['assets','three.min'],function(assets){
    function Battery() {
        var geometry = new THREE.CubeGeometry(50,50,50);
        var texture = assets.get("texture").get("battery.png");
        var material = new THREE.MeshPhongMaterial({transparent:true, opacity:0.95, side:THREE.DoubleSide, map:texture});
        var mesh = new THREE.Mesh( geometry, material );
        return {
            model:mesh,
            image: assets.get("inventory").get("battery.png"),
            type:"BATTERY",
        };
    }

    return {
        Battery:Battery
    };
});
