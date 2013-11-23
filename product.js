"use strict";
define(['assets','utility','three.min'],function( assets, utility ){
    function Animator( product ) {
        var raiseTween, scaleTween;
        function activate() {
            if( raiseTween ) { raiseTween.stop(); }
            if( scaleTween ) { scaleTween.stop(); }
            var raiseStart = {r:100};
            var raiseEnd = {r:-100};
            var scaleStart = {r:1};
            var scaleEnd = {r:10.0};
            function restart() {
                raiseStart.r = 100;
                scaleStart.r = 1.0;
                product.start();
                raiseTween.start();
            }
            scaleTween = new TWEEN.Tween( scaleStart )
                .to( scaleEnd, 1000 )
                .easing( TWEEN.Easing.Exponential.In )
                .onUpdate( function() {
                    product.model.scale.set( this.r, this.r, this.r );
                    product.update();
                })
                .onComplete( function() {
                    result.onProductProduced( product );
                    product.model.visible = false;
                    restart();
                });

            raiseTween = new TWEEN.Tween( raiseStart )
                .to( raiseEnd, 5000 )
                .delay( 250 )
                .easing( TWEEN.Easing.Bounce.In )
                .onStart( function() {
                    product.model.visible = true;
                    product.model.scale.set( 1, 1, 1 );
                })
                .onUpdate( function() {
                    product.model.position.z = this.r;
                })
                .chain( scaleTween );


            restart();
        } 

        function deactivate() {
            product.model.visible = false;
            if( scaleTween ) { scaleTween.stop(); }
            if( raiseTween ) { raiseTween.stop(); }
        }

        var result = {
            activate: activate,
            deactivate: deactivate,
            onProductProduced: undefined,
        };

        return result;
    }

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

    function Molecule() {
        var container = new THREE.Object3D();
        for( var index = 0; index < 10; index++ ) {
            var geometry = new THREE.SphereGeometry( Math.random()*7 );
            var material = new THREE.MeshPhongMaterial({transparent:true, opacity:0.75, side:THREE.DoubleSide});
            var mesh = new THREE.Mesh( geometry, material );
            mesh.position.set( Math.random()*10-5, Math.random()*10-5, Math.random()*10-5 );
            container.add( mesh );
        }

        function start() {
            container.rotation.set(0,0,0);
        }

        function update() {
            container.rotation.y += Math.PI/90; 
            container.rotation.z += Math.PI/90; 
            container.rotation.x -= Math.PI/90; 
        }

        return {
            model:container,
            image: assets.get("inventory").get("battery"),
            type:"MOLECULE",
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
             image: assets.get("inventory").get("music"),
             type: "MUSIC"
         };
    }

    return {
        Animator: Animator,
        Battery: Battery,
        Music: Music,
        Molecule: Molecule
    };
});
