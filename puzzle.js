"use strict";

define(['colors','three.min'],function(colors) {
    function PuzzleStructure( arr ) {
        var dim = Math.sqrt( arr.length );

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

    function PuzzleModel( picker ) {
        var puzzleDim = 3, puzzleSize = 100, puzzleModel, puzzleTileModels = [];
        var puzzlePieces = [];
        var pickables = [];

        function addPickable( mesh, onPicked ) {
            mesh.onPicked = onPicked;
            pickables.push( mesh );
        }

        function puzzleCoordinate( v ) {
            return puzzleSize/puzzleDim * (2*v - puzzleDim + 1) / 2;
        }

        function PuzzlePieceModel( color, onPicked ) {
            var geometry = new THREE.CubeGeometry(
                puzzleSize/puzzleDim-1,
                puzzleSize/puzzleDim-1,
                puzzleSize/puzzleDim/2
            );

            var material = new THREE.MeshPhongMaterial({
                color: color
            });

            var mesh = new THREE.Mesh( geometry, material );

            var object = new THREE.Object3D();
            object.add(mesh);

            addPickable( mesh, onPicked );

            return object;
        }

        function PuzzlePiece( index, onPicked ) {
            var color = colors.palette[index % colors.palette.length];
            var model = new PuzzlePieceModel( color, invokeOnPicked );
            setIndex( index );

            var thisIndex = index;
            function setIndex(i) {
                thisIndex = i;
                model.position.x = puzzleCoordinate( i % puzzleDim ); 
                model.position.y = puzzleCoordinate( Math.floor( i / puzzleDim ) )
                model.position.z = 0;
            }

            function invokeOnPicked() {
                onPicked(thisIndex);
            }

            function add( thing ) {
                thing.model.position.z = 10;
                model.add( thing.model );
            }

            function remove( thing ) {
                model.remove( thing.model );
            }

            return {
                setIndex:setIndex,
                remove:remove,
                model:model,
                add:add,
            }
        }

        for( var index = 0; index < puzzleDim*puzzleDim; index++ ) {
            if( index === Math.floor( puzzleDim*puzzleDim/2 ) ) {
                puzzlePieces.push( false );
            }
            else {
                puzzlePieces.push( new PuzzlePiece( index, doAction ) );
            }
        }

        var puzzleObject = new PuzzleStructure( puzzlePieces );
        function doAction(index) {
            puzzleObject.doAction(index);
        }

        puzzleModel = new THREE.Object3D();
        puzzleModel.rotation.x = -1;
        puzzleModel.rotation.z = 0;

        puzzlePieces.forEach( function( puzzlePiece ) {
            if( puzzlePiece ) {
                puzzleModel.add( puzzlePiece.model );
            }
        });

        function addPlayer( player ) {
            puzzlePieces[0].add( player );
        }

        return {
            model: puzzleModel,
            doAction: puzzleObject.doAction,
            addPlayer: addPlayer,
            pickables: pickables,
        }
    }

    return {
        PuzzleModel:PuzzleModel
    }
});
