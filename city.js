"use strict";

define(['colors','puzzlelogic','settings','three.min','tween.min'],function(colors, puzzlelogic, settings) {
    function Tile( params ) {
        var geometry = new THREE.CubeGeometry(
            params.width, 
            params.height,
            params.depth
        );

        var material = new THREE.MeshPhongMaterial({
            color: params.color,
            side: THREE.DoubleSide,
        });

        var mesh = new THREE.Mesh( geometry, material );

        return mesh;
    }
    function Puzzle() {
        var puzzleDim = 3, puzzleSize = settings.arMarkerSize;
        var pickables = [];

        function addPickable( object, onPicked ) {
            object.children.forEach( function(mesh) {
                if( mesh.isPickable ) {
                    mesh.onPicked = onPicked;
                    pickables.push( mesh );
                }
            });
        }

        function puzzleCoordinate( v ) {
            return puzzleSize/puzzleDim * (2*v - puzzleDim + 1) / 2;
        }

        function CityBlock( params ) {
            var block = new THREE.Object3D();
            var w = params.width/2;
            var h = params.height/2;
            var cx = w/2;
            var cy = h/2;
            for( var x = 0; x < 2; x++ ) {
                for( var y = 0; y < 2; y++ ) {
                    var depth = Math.floor( Math.random()*3+1 ) * 25;
                    var g = new THREE.CubeGeometry( w-1, h-1, depth );
                    var m = new THREE.MeshLambertMaterial({side:THREE.DoubleSide, color:colors.randomColor()});
                    var mesh = new THREE.Mesh( g, m );
                    mesh.position.x = w*x-cx;
                    mesh.position.y = h*y-cy;
                    mesh.position.z = -depth/2;
                    block.add( mesh );
                    if( Math.random()*100 > 50 ) {
                        var g = new THREE.CylinderGeometry( 1, 5, 25 );
                        var m = new THREE.MeshPhongMaterial({side:THREE.DoubleSide, color:colors.randomColor()});
                        g.applyMatrix( 
                             new THREE.Matrix4()
                                .makeTranslation( 10, 0, 0 ) );

                        g.applyMatrix( 
                             new THREE.Matrix4()
                                .makeRotationFromQuaternion(
                                    new THREE.Quaternion()
                                        .setFromAxisAngle( 
                                            new THREE.Vector3( 1, 0, 0), 
                                            -Math.PI/2 )));
                        var mesh = new THREE.Mesh(g,m);
                        mesh.position.x = w*x-w-cx;
                        mesh.position.y = h*y-h-cy;
                        mesh.position.z = -depth-25/2;
                        block.add( mesh );
                    }
                }
            }

            return block;
        }

        function PuzzlePiece( color ) {
            var index = undefined;
            var solvedIndex = undefined;

            var tileParams = {
                color:color,
                width: puzzleSize/puzzleDim-1,
                height:puzzleSize/puzzleDim-1,
                depth: puzzleSize/puzzleDim/2
            };
            var tile = new Tile( tileParams );
            tile.isPickable = true;

            var cityBlock = new CityBlock( tileParams );

            var model = new THREE.Object3D();
            model.add( tile );
            model.add( cityBlock );

            function setIndex(i) {
                index = i;
                movePiece();
            }

            var moveTween = undefined;
            function movePiece() {
                if( moveTween ) { moveTween.stop(); }
                var newx = puzzleCoordinate( index % puzzleDim ); 
                var newy = puzzleCoordinate( Math.floor( index / puzzleDim ) );
                moveTween = new TWEEN.Tween( { x:model.position.x, y:model.position.y } )
                    .to( {x:newx, y:newy }, 500 )
                    .easing( TWEEN.Easing.Bounce.Out)
                    .onUpdate( function () {
                            model.position.x = this.x; 
                            model.position.y = this.y;
                            model.position.z = 0;
                            } )
                .start();
            }

            function getIndex() {
                return index;
            }

            function setSolvedIndex(i) {
                solvedIndex = i;
            }

            function getSolvedIndex() {
                return solvedIndex; 
            }

            function isSolved() {
                return solvedIndex === index;
            }

            return {
                setSolvedIndex:setSolvedIndex,
                getSolvedIndex:getSolvedIndex,
                isSolved:isSolved,
                setIndex:setIndex,
                getIndex:getIndex,
                model:model,
            };
        }
        
        function generatePieces() {
            var result = [];
            for( var index = 0; index < puzzleDim*puzzleDim; index++ ) {
                if( index === Math.floor( puzzleDim*puzzleDim/2 ) ) {
                    result.push( false );
                }
                else {
                    var color = colors.palette[3];
                    var newPiece = new PuzzlePiece( color );
                    newPiece.setSolvedIndex( index );
                    newPiece.setIndex( index );
                    result.push( newPiece );
                }
            }

            return result;
        }

        function Container( ) {
            var result = new THREE.Object3D();
            result.matrixAutoUpdate = false;
            return result;
        }

        var pieces = generatePieces();
        var logic = new puzzlelogic.PuzzleLogic( pieces );
        //logic.scramble(3);
        var container = new Container();

        pieces.forEach( function(piece) {
            if( piece ) {
                container.add( piece.model );
                addPickable( piece.model, function() { 
                    logic.doAction( piece.getIndex() );
                    checkSolved();
                });
            }
        });

        function checkSolved() {
            if( logic.isSolved() ) {
            }
        }

        function getHolePosition() {
            var holeIndex = logic.hole();
            var x = puzzleCoordinate( holeIndex % puzzleDim ); 
            var y = puzzleCoordinate( Math.floor( holeIndex / puzzleDim ) );
            var vector = new THREE.Vector3( x, y, 0 );
            return vector;
        }

        checkSolved();

        function transform(m) {
            container.matrix.fromArray(m);
            container.matrixWorldNeedsUpdate = true;
        }

        function setOnSwap( callback ) {
            logic.setOnSwap( callback );
        }

        return {
            getHolePosition: getHolePosition,
            model: container,
            transform: transform,
            pickables: pickables,
            setOnSwap: setOnSwap, 
        };
    }

    return {
        Puzzle:Puzzle
    };
});
