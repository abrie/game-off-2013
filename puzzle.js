"use strict";

define(['colors','puzzlelogic','settings','factory','three.min','tween.min'],function(colors, puzzlelogic, settings, factory) {
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

    function Puzzle( FactoryType ) {
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

        function PuzzlePiece( color, hammerParams ) {
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

            var params = {
                color: colors.palette[1],
                width: tileParams.width-0.1,
                height:tileParams.height-0.1,
                depth: tileParams.depth-0.1,
                type: hammerParams.type,
                rotation: hammerParams.rotation,
            };

            var hammer = new FactoryType( params );

            var model = new THREE.Object3D();
            model.add( tile );
            model.add( hammer.model );

            function setIndex(i) {
                index = i;
                movePiece();
            }

            var moveTween;
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

            function activate() {
                hammer.activate();
            }

            function deactivate() {
                hammer.deactivate();
            }

            return {
                setSolvedIndex:setSolvedIndex,
                getSolvedIndex:getSolvedIndex,
                activate:activate,
                deactivate:deactivate,
                isSolved:isSolved,
                setIndex:setIndex,
                getIndex:getIndex,
                model:model,
            };
        }
        
        var types = [
            {type:"corner", rotation:Math.PI},
            {type:"edge", rotation:Math.PI},
            {type:"corner", rotation:-Math.PI/2},
            {type:"edge", rotation:Math.PI/2},
            {type:"hole", rotation:0},
            {type:"edge", rotation:-Math.PI/2},
            {type:"corner", rotation:Math.PI/2},
            {type:"edge", rotation:0},
            {type:"corner", rotation:0}
        ];

        function generatePieces() {
            var result = [];
            for( var index = 0; index < puzzleDim*puzzleDim; index++ ) {
                if( index === Math.floor( puzzleDim*puzzleDim/2 ) ) {
                    result.push( false );
                }
                else {
                    var color = colors.palette[3];
                    var newPiece = new PuzzlePiece( color, types[index] );
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
        logic.scramble(3);
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
                pieces.forEach( function(piece) {
                    if( piece ) {
                        piece.activate();
                    }
                });
            }
            else {
                pieces.forEach( function(piece) {
                    if( piece ) {
                        piece.deactivate();
                    }
                });
            }
        }

        function getHolePosition() {
            var holeIndex = logic.hole();
            var x = puzzleCoordinate( holeIndex % puzzleDim ); 
            var y = puzzleCoordinate( Math.floor( holeIndex / puzzleDim ) );
            var vector = new THREE.Vector3( x, y, 0 );
            return vector;
        }

        function getAdjacentPosition() {
            var index = logic.randomAdjacentToHole();
            var x = puzzleCoordinate( index % puzzleDim ); 
            var y = puzzleCoordinate( Math.floor( index / puzzleDim ) );
            var vector = new THREE.Vector3( x, y, 0 );
            return vector;
        }

        function bump() {
            var index = logic.randomAdjacentToHole();
            logic.doAction( index );
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
            getAdjacentPosition: getAdjacentPosition,
            bump: bump,
            model: container,
            transform: transform,
            pickables: pickables,
            setOnSwap: setOnSwap, 
        };
    }

    function Hammer() {
        return new Puzzle( factory.Hammer );
    }

    function City() {
        return new Puzzle( factory.City );
    }

    return {
        Hammer:Hammer,
        City:City,
    };
});
