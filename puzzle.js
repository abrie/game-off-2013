"use strict";

define(['colors','puzzlelogic','arobject','three.min','tween.min'],function(colors, puzzlelogic, arobject) {
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

    function Hammer( params ) {
        var points = [];
        var shape;

        if( params.type === "corner" ) {
            points.push( new THREE.Vector2 ( -params.width/2, -params.height/2) );
            points.push( new THREE.Vector2 ( -params.width/2, params.height/2 ) );
            points.push( new THREE.Vector2 ( params.width/2, -params.height/2 ) );
            shape = new THREE.Shape( points );
        }
        else if( params.type === "edge" ) {
            points.push( new THREE.Vector2 ( 0, -params.height/2) );
            points.push( new THREE.Vector2 ( -params.width/2, params.height/2 ) );
            points.push( new THREE.Vector2 ( params.width/2, params.height/2 ) );
            shape = new THREE.Shape( points );
        }

        var extrusionSettings = {
            amount: params.depth/2,
            curveSegments: 3,
            bevelThickness: 4, bevelSize: 2, bevelEnabled: false,
            material: 0, extrudeMaterial: 1
        };

        var geometry = new THREE.ExtrudeGeometry( shape, extrusionSettings );

        var materialFront = new THREE.MeshBasicMaterial( { color: 0xffff00, side:THREE.DoubleSide } );
        var materialSide = new THREE.MeshBasicMaterial( { color: 0xff8800, side:THREE.DoubleSide } );
        var materialArray = [ materialFront, materialSide ];
        var material = new THREE.MeshFaceMaterial(materialArray);

        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.set(0,0,0);
        mesh.rotation.z = params.rotation;

        return mesh;
    }

    function Puzzle() {
        var puzzleDim = 3, puzzleSize = arobject.getMarkerSize();
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
            var hammer = new Hammer( params );
            hammer.position.z = 0;

            var model = new THREE.Object3D();
            model.add( tile );
            model.add( hammer );

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

            var hammerTween = undefined;
            function raiseHammer() {
                if( hammerTween ) { hammerTween.stop(); }
                hammerTween = new TWEEN.Tween( { z:hammer.position.z } )
                    .to( { z:2.5 }, 500 )
                    .easing( TWEEN.Easing.Exponential.In )
                    .onUpdate( function () {
                            hammer.position.z = this.z;
                            } )
                .start();
            }

            function lowerHammer() {
                if( hammerTween ) { hammerTween.stop(); }
                hammerTween = new TWEEN.Tween( { z:hammer.position.z } )
                    .to( { z:0.1 }, 500 )
                    .easing( TWEEN.Easing.Exponential.Out )
                    .onUpdate( function () {
                            hammer.position.z = this.z;
                            } )
                .start();
            }

            return {
                setSolvedIndex:setSolvedIndex,
                getSolvedIndex:getSolvedIndex,
                raiseHammer:raiseHammer,
                lowerHammer:lowerHammer,
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
                    var newPiece = new PuzzlePiece( color, types[index] ); //Math.PI/4*(index+1) );
                    newPiece.setSolvedIndex( index );
                    newPiece.setIndex( index );
                    result.push( newPiece );
                }
            }

            return result;
        }

        function Container( ) {
            var result = new THREE.Object3D();
            result.rotation.x = 0;
            result.rotation.z = 0;
            return result;
        }

        var pieces = generatePieces();
        var logic = new puzzlelogic.PuzzleLogic( pieces );
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
                        piece.raiseHammer();
                    }
                });
            }
            else {
                pieces.forEach( function(piece) {
                    if( piece ) {
                        piece.lowerHammer();
                    }
                });
            }
        }

        checkSolved();

        return {
            model: container,
            pickables: pickables,
        };
    }

    return {
        Puzzle:Puzzle
    };
});
