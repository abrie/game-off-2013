"use strict";
define(['assets','utility','three.min'],function(assets,utility){
    function Battery() {
        var geometry = new THREE.CubeGeometry(50,50,50);
        var texture = assets.get("texture").get("battery");
        var material = new THREE.MeshPhongMaterial({transparent:true, opacity:0.95, side:THREE.DoubleSide, map:texture});
        var mesh = new THREE.Mesh( geometry, material );

        function start() {
            mesh.rotation.set(0,0,0);
        }

        function update() {
            mesh.rotation.y += Math.PI/90; 
            mesh.rotation.z += Math.PI/90; 
            mesh.rotation.x -= Math.PI/90; 
        }

        return {
            model:mesh,
            image: assets.get("inventory").get("battery"),
            type:"BATTERY",
            update:update,
            start:start,
        };
    }

    function Music() {
        var particleCount = 1000;
        var particles = new THREE.Geometry();
        var pMaterial = new THREE.ParticleBasicMaterial({
            color: 0x999999,
            size: 64,
            map: assets.get("texture").get("note"),
            blending: THREE.AdditiveBlending,
            transparent: true
          });
        particles.sortParticles = true;

        var radius = 25;
        for(var p = 0; p < particleCount; p++) {
            var theta = Math.random()*2*Math.PI;
            var phi = Math.random()*Math.PI;
            var pX = radius*Math.cos(theta)*Math.sin(phi);
            var pY = radius*Math.sin(theta)*Math.sin(phi);
            var pZ = radius*Math.cos(phi);
            var particle = new THREE.Vector3(pX, pY, pZ);

            particles.vertices.push(particle);
        }

        var particleSystem = new THREE.ParticleSystem( particles, pMaterial);

        function update() {
            particleSystem.rotation.y += Math.PI/90; 
            particleSystem.rotation.z += Math.PI/90; 
            particleSystem.rotation.x -= Math.PI/90; 
        }

        function start() {
            particleSystem.rotation.set(0,0,0);
        }

         return {
             model: particleSystem,
             update: update,
             start: start,
             image: assets.get("inventory").get("note"),
             type: "MUSIC"
         };
    }

    return {
        Battery:Battery,
        Music:Music
    };
});
