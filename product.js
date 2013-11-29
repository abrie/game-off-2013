"use strict";

define(['assets', 'utility', 'three.min'],function( assets, utility ){
    function Animator( product ) {
        var state = {z:100};

        function fizzle( rate, onComplete ) {
            var fizzleState = {s:1.0};
            var countDownState = {r:10};
            var countDownTime = 3000;

            new TWEEN.Tween( countDownState )
                .to( {r:10}, countDownTime )
                .onUpdate( function() {
                })
                .chain(
                new TWEEN.Tween( fizzleState )
                    .to( {s:0.01}, rate )
                    .easing( TWEEN.Easing.Linear.None )
                    .onUpdate( function() {
                        product.model.scale.set( this.s, this.s, this.s );
                    })
                )
                .start();
        }

        function detonate( rate, onComplete ) {
            var detonateState = {s:1.0};
            var countDownState = {r:10};
            var countDownTime = 3000;

            new TWEEN.Tween( countDownState )
                .to( {r:10}, countDownTime )
                .onUpdate( function() {
                    console.log("tick:", this.r);
                })
                .chain(
                new TWEEN.Tween( detonateState )
                    .to( {s:0.10}, rate/2 )
                    .easing( TWEEN.Easing.Bounce.In )
                    .onUpdate( function() {
                        product.model.scale.set( this.s, this.s, this.s );
                    })
                    .chain(
                    new TWEEN.Tween( detonateState )
                        .to( {s:100}, rate/2 )
                        .easing( TWEEN.Easing.Bounce.Out )
                        .onStart( function() {
                        })
                        .onUpdate( function() {
                            product.model.scale.set( this.s, this.s, this.s );
                        })
                        .onComplete( function() {
                            if( onComplete ) {
                                onComplete();
                            }
                        })
                    )
                )
                .start();
        }

        function activate( rate, onComplete ) {
            var tween = new TWEEN.Tween( state )
                .to( {z:-100}, rate )
                .easing( TWEEN.Easing.Bounce.Out )
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
            detonate: detonate,
            fizzle: fizzle,
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
        var particleCount = 5000;
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

    function Product() {
        var currentCoordinate;
        var jumpCount = 0;

        function detonate( ) {
            currentCoordinate.filter.transfer.animator.detonate( 500 );
        }

        function fizzle( ) {
            currentCoordinate.filter.transfer.animator.fizzle( 500 );
        }

        function setCoordinate( coordinate, graph, callback ) {
            if( coordinate.puzzle.object.isSolved() ) {
                coordinate.puzzle.object.addItem( coordinate.filter.transfer.product );
                currentCoordinate = coordinate;
                coordinate.filter.transfer.animator.activate( 500, callback );
            }
            else {
                console.log("cannot transfer. Target is not solved.");
            }
        }

        function transfer( graph, outCallback, inCallback ) {
            if( !currentCoordinate ) {
                console.log("cannot transfer because no coordinate");
            }

            var nextCoordinate = graph.nextCoordinate( currentCoordinate );
            if( nextCoordinate.puzzle.object.isSolved() ) {
                currentCoordinate.filter.transfer.animator.deactivate( 500, function() {
                    currentCoordinate.puzzle.object.removeItem( currentCoordinate.filter.transfer.product );
                    nextCoordinate.puzzle.object.addItem( nextCoordinate.filter.transfer.product );
                    currentCoordinate = nextCoordinate;
                    if( outCallback ) {
                        outCallback();
                    }
                    nextCoordinate.filter.transfer.animator.activate( 500, function() {
                        if( inCallback ) {
                            inCallback();
                        }
                        notifyJumpCount( ++jumpCount );
                    } );
                });
            }
            else {
                console.log("gate is closed.");
            }
        }

        function getCurrentCoordinate() {
            return currentCoordinate;
        }

        var jumpCountCallback;
        function notifyJumpCount( amount ) {
            jumpCountCallback( amount );
        }

        return {
            detonate:detonate,
            fizzle:fizzle,
            transfer:transfer,
            getCurrentCoordinate: getCurrentCoordinate,
            setCoordinate: setCoordinate,
            setJumpCountCallback: function(callback) { jumpCountCallback = callback; }
        };
    }

    return {
        Product: Product,
        Animator: Animator,
        Battery: Battery,
        Music: Music,
    };
});
