"use strict";

define(['colors','puzzlelogic','three.min'],function(colors, puzzlelogic) {

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

    function Hammer( params ) {
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
                if( mesh.isPickable ) {
                    mesh.onPicked = onPicked;
                    pickables.push( mesh );
                }
            });
        }

        function puzzleCoordinate( v ) {
            return puzzleSize/puzzleDim * (2*v - puzzleDim + 1) / 2;
        }

        function PuzzlePiece( color, hammerAngle ) {
            var index = undefined;
            var solvedIndex = undefined;

            var tileParams = {
                color:color,
                width: puzzleSize/puzzleDim-1,
                height:puzzleSize/puzzleDim-1,
                depth: puzzleSize/puzzleDim/2
            }
            var tile = new Tile( tileParams );
            tile.isPickable = true;

            var hammerParams = {
                color: colors.palette[1],
                width: tileParams.width/2,
                height:tileParams.height/2,
                depth: tileParams.depth,
            }
            var hammer = new Hammer( hammerParams );
            hammer.position.z = 1;
            hammer.rotation.z = hammerAngle;

            var model = new THREE.Object3D();
            model.add( tile );
            model.add( hammer );

            function setIndex(i) {
                index = i;
                model.position.x = puzzleCoordinate( index % puzzleDim ); 
                model.position.y = puzzleCoordinate( Math.floor( index / puzzleDim ) )
                model.position.z = 0;
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
                    var newPiece = new PuzzlePiece( color, Math.PI/4*(index+1) );
                    newPiece.setSolvedIndex( index );
                    newPiece.setIndex( index );
                    result.push( newPiece );
                }
            }

            return result;
        }

        function Container( ) {
            var result = new THREE.Object3D();
            result.rotation.x = -1;
            result.rotation.z = 0;
            return result;
        }

        var puzzlePieces = generatePieces();
        var puzzleLogic = new puzzlelogic.PuzzleLogic( puzzlePieces );
        var puzzleModel = new Container();

        puzzlePieces.forEach( function(piece) {
            if( piece ) {
                puzzleModel.add( piece.model );
                addPickable( piece.model, function() { 
                    puzzleLogic.doAction( piece.getIndex() );
                })
            }
        });

        return {
            model: puzzleModel,
            pickables: pickables,
        }
    }

    return {
        PuzzleModel:Puzzle
    }
});
