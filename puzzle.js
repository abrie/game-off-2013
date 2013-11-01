"use strict";

define(['colors','three.min'],function(colors) {
    function PuzzleStructure( arr ) {
        var dim = Math.sqrt( arr.length );
        if( dim % 1 !== 0 ) {
            console.log("warning: puzzle data array is not square.");
        }

        function hole() {
            return arr.indexOf( false );
        }

        function getAdjacentIndicies( center ) {
            var result = [];

            if( center % dim - 1 >= 0 ) {
                result.push( center - 1 );
            }
            if( center % dim + 1 < dim ) {
                result.push( center + 1 );
            }
            if( center - dim >= 0 ) {
                result.push( center - dim );
            }
            if( center + dim < dim * dim ) {
                result.push( center + dim );
            }

            return result;
        }

        function swapIndicies( i, j ) {
            var sw = arr[i];
            arr[i] = arr[j];
            arr[j] = sw;

            if( arr[i].setIndex ) {
                arr[i].setIndex(i);
            }
            if( arr[j].setIndex ) {
                arr[j].setIndex(j);
            }
        }

        function isHoleAdjacent( center ) {
            var a = getAdjacentIndicies(center);
            return getAdjacentIndicies(center).indexOf( hole() ) >= 0;
        }

        function doAction( center ) {
            if( isHoleAdjacent( center ) ) {
                swapIndicies( center, hole() );
            }
        }

        function get() {
            return arr.map( function(i, index) {
                return index === hole() ? false : i;
            });
        }

        return {
            get:get,
            doAction:doAction,
        }
    }

    function Tile( params ) {
        var geometry = new THREE.CubeGeometry(
            params.width, 
            params.height,
            params.depth
        );

        var material = new THREE.MeshPhongMaterial({
            color: params.color
        });

        var mesh = new THREE.Mesh( geometry, material );

        return mesh;
    }

    function Puzzle() {
        var puzzleDim = 3, puzzleSize = 100;
        var puzzlePieces = [];
        var pickables = [];

        function addPickable( object, onPicked ) {
            object.children.forEach( function(mesh) {
                mesh.onPicked = onPicked;
                pickables.push( mesh );
            });
        }

        function puzzleCoordinate( v ) {
            return puzzleSize/puzzleDim * (2*v - puzzleDim + 1) / 2;
        }

        function PuzzlePiece( color ) {
            var index = undefined;
            var tileParams = {
                color:color,
                width: puzzleSize/puzzleDim-1,
                height:puzzleSize/puzzleDim-1,
                depth: puzzleSize/puzzleDim/2
            }
            var tile = new Tile( tileParams );

            var model = new THREE.Object3D();
            model.add( tile );

            function setIndex(i) {
                index = i;
                model.position.x = puzzleCoordinate( index % puzzleDim ); 
                model.position.y = puzzleCoordinate( Math.floor( index / puzzleDim ) )
                model.position.z = 0;
            }

            function getIndex() {
                return index;
            }

            function add( thing ) {
                thing.model.position.z = tileParams.depth;
                model.add( thing.model );
            }

            function remove( thing ) {
                model.remove( thing.model );
            }

            return {
                setIndex:setIndex,
                getIndex:getIndex,
                remove:remove,
                model:model,
                add:add,
            }
        }
        
        function generatePieces() {
            var result = [];
            for( var index = 0; index < puzzleDim*puzzleDim; index++ ) {
                if( index === Math.floor( puzzleDim*puzzleDim/2 ) ) {
                    result.push( false );
                }
                else {
                    var color = colors.palette[index % colors.palette.length];
                    var newPiece = new PuzzlePiece( color );
                    newPiece.setIndex( index );
                    result.push( newPiece );
                }
            }

            return result;
        }

        function addPlayer( player ) {
            puzzlePieces[0].add( player );
        }

        function Container( ) {
            var result = new THREE.Object3D();
            result.rotation.x = -1;
            result.rotation.z = 0;
            return result;
        }

        var puzzlePieces = generatePieces();
        var puzzleObject = new PuzzleStructure( puzzlePieces );
        var puzzleModel = new Container();

        puzzlePieces.forEach( function(piece) {
            if( piece ) {
                puzzleModel.add( piece.model );
                addPickable( piece.model, function() { 
                    puzzleObject.doAction( piece.getIndex() );
                })
            }
        });

        return {
            model: puzzleModel,
            addPlayer: addPlayer,
            pickables: pickables,
        }
    }

    return {
        PuzzleModel:Puzzle
    }
});
