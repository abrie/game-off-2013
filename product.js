"use strict";

define(['assets', 'utility', 'three.min'],function( assets, utility ){
    function Animator( product ) {
        var state = {z:100};

        function activate( rate ) {
            var tween = new TWEEN.Tween( state )
                .to( {z:-100}, rate )
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
            var tween = new TWEEN.Tween( state )
                .to( {z:100}, rate )
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
            color: 0xFFFFFF,
            size: 64,
            map: assets.get("texture").get("music"),
            blending: THREE.AdditiveBlending,
            transparent: true
          });
        particles.sortParticles = true;

        for(var p = 0; p < particleCount; p++) {
            var radius = Math.random()*35;
            var theta = Math.random()*2*Math.PI;
            var phi = Math.random()*Math.PI;
            var pX = radius*Math.cos( theta )*Math.sin( phi );
            var pY = radius*Math.sin( theta )*Math.sin( phi );
            var pZ = radius*Math.cos( phi );
            var particle = new THREE.Vector3( pX, pY, pZ );

            particles.vertices.push( particle );
        }

        var particleSystem = new THREE.ParticleSystem( particles, pMaterial );

        var tween = new TWEEN.Tween( {r:-Math.PI} )
            .to( {r:Math.PI}, 10000 )
            .easing( TWEEN.Easing.Bounce.In )
            .repeat( Infinity )
            .yoyo( true )
            .onStart( function() {
            })
            .onUpdate( function() {
                particleSystem.rotation.set(this.r,this.r,this.r);
            })
            .onComplete( function() {
            });

        tween.start();

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
