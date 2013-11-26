"use strict";

define(['assets', 'utility', 'three.min'],function( assets, utility ){
    function Animator( product ) {
        var up = {z:-100};
        var down = {z:100};

        function activate( rate ) {
            var tween = new TWEEN.Tween( {z:100} )
                .to( up, rate )
                .easing( TWEEN.Easing.Bounce.Out )
                .onStart( function() {
                })
                .onUpdate( function() {
                    product.model.position.z = this.z;
                })
                .onComplete( function() {
                });

            tween.start();
        } 

        function deactivate( rate, onComplete ) {
            var tween = new TWEEN.Tween( {z:-100} )
                .to( down, rate )
                .easing( TWEEN.Easing.Quintic.In )
                .onStart( function() {
                })
                .onUpdate( function() {
                    product.model.position.z = this.z;
                })
                .onComplete( function() {
                    if( onComplete ) {
                        onComplete();
                    }
                });

            tween.start();
        } 

        var result = {
            activate: activate,
            deactivate: deactivate,
        };

        return result;
    }

    function Battery() {
        var geometry = new THREE.CubeGeometry( 50, 50, 50 );
        var texture = assets.get("texture").get("battery");
        var material = new THREE.MeshPhongMaterial({ transparent:true, opacity:0.95, side:THREE.DoubleSide, map:texture });
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
            map: assets.get("texture").get("music"),
            blending: THREE.AdditiveBlending,
            transparent: true
          });
        particles.sortParticles = true;

        var radius = 25;
        for(var p = 0; p < particleCount; p++) {
            var theta = Math.random()*2*Math.PI;
            var phi = Math.random()*Math.PI;
            var pX = radius*Math.cos( theta )*Math.sin( phi );
            var pY = radius*Math.sin( theta )*Math.sin( phi );
            var pZ = radius*Math.cos( phi );
            var particle = new THREE.Vector3( pX, pY, pZ );

            particles.vertices.push( particle );
        }

        var particleSystem = new THREE.ParticleSystem( particles, pMaterial );

        function update() {
            particleSystem.rotation.y += Math.PI/90; 
            particleSystem.rotation.z += Math.PI/90; 
            particleSystem.rotation.x -= Math.PI/90; 
        }

        return {
            model: particleSystem,
            update: update,
            type: "MUSIC"
        };
    }

    return {
        Animator: Animator,
        Battery: Battery,
        Music: Music,
    };
});
