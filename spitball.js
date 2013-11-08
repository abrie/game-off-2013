"use strict";
define(['settings', 'tween.min'], function(settings) {
    function Spitball(source, target) {
        var ballGeometry = new THREE.SphereGeometry( settings.ballRadius );
        var ballMaterial = new THREE.MeshBasicMaterial( {color:0x00FF00} );
        var ballMesh = new THREE.Mesh( ballGeometry, ballMaterial );
        ballMesh.position = source;

        function launch() {
            var tween = new TWEEN.Tween( { x:source.x, y:source.y, z:source.z } )
                .to( {x:target.x, y:target.y, z:target.z}, 250 )
                .easing( TWEEN.Easing.Linear.None)
                .onUpdate( function () {
                    ballMesh.position.x = this.x;
                    ballMesh.position.y = this.y;
                    ballMesh.position.z = this.z;
                });

            tween.start();
        }

        return {
            model: ballMesh,
            pickables: [],
            launch: launch,
        };
    }

    return {
        Spitball:Spitball,
    };
});
