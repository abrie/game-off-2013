"use strict";

define(['assets', 'utility', 'three.min'],function( assets, utility ){
    function ProbeAnimator( product ) {
        var state = {z:30};
        var fraction = 2/product.tubes.length;

        function activate( rate, onComplete ) {
            var tween = new TWEEN.Tween( state )
                .to( {z:-100}, rate )
                .easing( TWEEN.Easing.Bounce.Out )
                .onStart( function() {
                })
                .onUpdate( function() {
                    var z = this.z;
                    product.tubes.forEach( function(tube, index) {
                        tube.position.z = z*(fraction*index);
                    });
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
                .to( {z:0}, rate )
                .easing( TWEEN.Easing.Quintic.In )
                .onStart( function() {
                })
                .onUpdate( function() {
                    var z = this.z;
                    product.tubes.forEach( function(tube, index) {
                        tube.position.z = z*(fraction*index);
                    });
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

    function Animator( product ) {
        var state = {z:100};
        var fizzleState = {s:1.0,z:100};

        function fizzle( rate, onComplete ) {
            new TWEEN.Tween( fizzleState )
                .to( {s:0.01}, rate )
                .easing( TWEEN.Easing.Linear.None )
                .onUpdate( function() {
                    product.model.scale.set( this.s, this.s, this.s );
                })
                .chain( new TWEEN.Tween( {r:0} ).to({r:1}, 500).onComplete (onComplete))
                .start();
        }

        function splat( rate, onComplete ) {
            var splatPosition = {z:-100};
            var splatState = {s:1.0, w:1.0};
            var a = new TWEEN.Tween( splatState )
                .to( {s:0.5, w:3}, rate*3 )
                .delay( rate*1/3 )
                .easing( TWEEN.Easing.Exponential.In )
                .onUpdate( function() {
                    product.model.scale.set( this.w, this.w, this.s );
                })
                .chain( new TWEEN.Tween( {r:0} ).to({r:1}, 500).onComplete (onComplete));

            var c = new TWEEN.Tween( splatPosition )
                .to( {z:-30}, 500 )
                .easing( TWEEN.Easing.Quintic.In )
                .onUpdate( function() {
                    product.model.position.z = this.z;
                });

            a.start();
            c.start();
        }

        function reset( ) {
            fizzleState = {s:1.0, z:100};
            product.model.scale.set( 1, 1, 1);
        }

        function detonate( rate, onComplete ) {
            var detonateState = {s:1.0};
            var countDownState = {r:10};
            var countDownTime = 1000;

            new TWEEN.Tween( countDownState )
                .to( {r:10}, countDownTime )
                .onUpdate( function() {
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
            var tween = new TWEEN.Tween( {z:100} )
                .to( {z:-100}, rate )
                .easing( TWEEN.Easing.Bounce.Out )
                .onStart( function() {
                    reset();
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
            var tween = new TWEEN.Tween( {z:-100} )
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
            splat: splat,
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

        function freeze() {
            tween.stop();
            particleSystem.rotation.set(0,0,0);
        }

        function update() {
            particleSystem.rotation.y += Math.PI/90; 
            particleSystem.rotation.z += Math.PI/90; 
            particleSystem.rotation.x -= Math.PI/90; 
        }

        return {
            freeze: freeze,
            model: particleSystem,
            update: update,
            type: "MUSIC"
        };
    }

    function ProbeEnd( color ) {
        var probeLength = 50;
        var probeRadius = 12.5;
        var points = new THREE.SplineCurve3([
            new THREE.Vector3(0, -probeLength, 0),
            new THREE.Vector3(0, 0, 0),
        ]);
           
        // points, ?, radius, facets, ? ?
        var tubes = [];
        function makeTube( radius ) {
            var geometry = new THREE.TubeGeometry(points, 12, radius, 16, false, false);

            geometry.applyMatrix( 
                 new THREE.Matrix4()
                    .makeTranslation( 0, 0, 0 ) );

            geometry.applyMatrix( 
                 new THREE.Matrix4()
                    .makeRotationFromQuaternion(
                        new THREE.Quaternion()
                            .setFromAxisAngle( 
                                new THREE.Vector3( 1, 0, 0), 
                                -Math.PI/2 )));

            var material = new THREE.MeshPhongMaterial({
                color: color,
                side: THREE.DoubleSide,
            });

            return new THREE.Mesh( geometry, material );
        }

        var container = new THREE.Object3D();

        function update() {
        }

        for( var i = 5; i > 0; i-- ) {
            var tube = makeTube( i*3 );
            tubes.push( tube );
            container.add( tube );
        }

        return {
            tubes: tubes,
            model: container,
            update: update,
            type: "PROBE"
        };
    }

    function Product() {
        var currentCoordinate;

        function detonate( callback ) {
            currentCoordinate.filter.transfer.animator.detonate( 500, callback );
        }

        function fizzle( callback ) {
            currentCoordinate.filter.transfer.animator.fizzle( 500, callback );
        }

        function splat( callback ) {
            currentCoordinate.filter.transfer.product.freeze();
            currentCoordinate.filter.transfer.animator.splat( 500, callback );
        }

        function remove() {
            currentCoordinate.puzzle.object.removeItem( currentCoordinate.filter.transfer.product );
        }

        function setCoordinate( coordinate, graph, callback ) {
            if( coordinate.puzzle.object.isSolved() ) {
                coordinate.puzzle.object.addItem( coordinate.filter.transfer.product );
                currentCoordinate = coordinate;
                coordinate.filter.transfer.animator.activate( 1, callback );
            }
            else {
            }
        }

        function transfer( graph, outCallback, inCallback, blockedCallback ) {
            if( !currentCoordinate ) {
                return;
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
                    });
                });
            }
            else {
                if( blockedCallback ) {
                    blockedCallback();
                }
            }
        }

        function getCurrentCoordinate() {
            return currentCoordinate;
        }

        return {
            detonate:detonate,
            fizzle:fizzle,
            splat:splat,
            remove:remove,
            transfer:transfer,
            getCurrentCoordinate: getCurrentCoordinate,
            setCoordinate: setCoordinate,
        };
    }

    function Probe() {
        var nearCoordinate;
        var farCoordinate;
        var withdrawn = true;

        function turnOff() {
            if( !withdrawn ) {
                withdraw( turnOff );
            }
            if( nearCoordinate ) {
                nearCoordinate.puzzle.object.removeItem( nearCoordinate.filter.probe.near );
            }
            if( farCoordinate ) {
                farCoordinate.puzzle.object.removeItem( farCoordinate.filter.probe.far );
            }
        }

        function setCoordinate( coordinate, graph, callback ) {
            var count = 0;
            function twice() {
                if(++count === 2) {
                    callback();
                }
            }

            if( !withdrawn ) {
                withdraw( function() { setCoordinate( coordinate, graph, callback ); } );
            }
            else {
                if( nearCoordinate ) {
                    nearCoordinate.puzzle.object.removeItem( nearCoordinate.filter.probe.near );
                }
                if( farCoordinate ) {
                    farCoordinate.puzzle.object.removeItem( farCoordinate.filter.probe.far );
                }

                nearCoordinate = coordinate;
                farCoordinate = graph.nextCoordinate( nearCoordinate );
                nearCoordinate.puzzle.object.addItem( nearCoordinate.filter.probe.near );
                farCoordinate.puzzle.object.addItem( farCoordinate.filter.probe.far );

                if( farCoordinate.puzzle.object.isSolved() ) {
                    nearCoordinate.filter.probe.nearAnimator.activate( 500, twice );
                    farCoordinate.filter.probe.farAnimator.activate( 500, twice );
                    withdrawn = false;
                }
                else {
                    //console.log("cannot probe. Target is not solved.");
                }
            }
        }

        function recheck() {
            if( nearCoordinate.puzzle.object.isSolved() ) {
                nearCoordinate.filter.probe.nearAnimator.activate( 350 );
            }
            else {
                nearCoordinate.filter.probe.nearAnimator.deactivate( 150 );
                farCoordinate.filter.probe.farAnimator.deactivate( 150 );
            }
            if( farCoordinate.puzzle.object.isSolved() && nearCoordinate.puzzle.object.isSolved() ) {
                farCoordinate.filter.probe.farAnimator.activate( 350 );
            }
            else {
                farCoordinate.filter.probe.farAnimator.deactivate( 150 );
            }
        }

        function withdraw( callback ) {
            if( !nearCoordinate || !farCoordinate ) {
                return;
            }

            var count = 0;
            function twice() {
                if(++count === 2) {
                    withdrawn = true;
                    if( callback ) {
                        callback();
                    }
                }
            }
            nearCoordinate.filter.probe.nearAnimator.deactivate( 250, function() {
                twice();
            });
            farCoordinate.filter.probe.farAnimator.deactivate( 250, function() {
                twice();
            } );
        }

        function getNearCoordinate() {
            return nearCoordinate;
        }

        function getFarCoordinate() {
            return farCoordinate;
        }

        return {
            recheck:recheck,
            turnOff:turnOff,
            withdraw:withdraw,
            setCoordinate: setCoordinate,
            getNearCoordinate:getNearCoordinate,
            getFarCoordinate:getFarCoordinate,
        };
    }

    return {
        Product: Product,
        Animator: Animator,
        Battery: Battery,
        Music: Music,
        ProbeAnimator: ProbeAnimator,
        ProbeEnd: ProbeEnd,
        Probe: Probe,
    };
});
