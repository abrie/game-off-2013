"use strict";

define(['colors','assets','puzzlelogic','settings','factory','product','noisemaker', 'three.min','tween.min'],function(colors, assets, puzzlelogic, settings, factory, product, noisemaker ) {
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

    function Puzzle( FactoryType, ProductType, AnimatorType, AudioType, lensId ) {
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

        function HolePiece( params ) {
            var geometry = new THREE.CubeGeometry( params.width, params.height, params.depth );
            var material = new THREE.MeshBasicMaterial( { color:0xAABBCC } );
            var mesh = new THREE.Mesh( geometry, material );
            mesh.isPickable = true;
            var model = new THREE.Object3D();
            model.add( mesh );

            function activate() {
                mesh.visible = true;
                result.isActive = true;
            }

            function deactivate() {
                mesh.visible = false;
                result.isActive = false;
            }

            var result = {
                model: model,
                activate: activate,
                deactivate: deactivate,
                isActive: false
            };

            return result;
        }

        function PuzzlePiece( color, solvedIndex, params ) {
            var index;

            var tileParams = {
                color:color,
                width: puzzleSize/puzzleDim-1,
                height:puzzleSize/puzzleDim-1,
                depth: puzzleSize/puzzleDim/2
            };
            var tile = new Tile( tileParams );
            tile.isPickable = true;

            params.color = colors.palette[1];
            params.width = tileParams.width-0.1;
            params.height = tileParams.height-0.1;
            params.depth = tileParams.depth-0.1;
            params.solvedIndex = solvedIndex;
            var factoryPiece = new FactoryType( params );

            var model = new THREE.Object3D();
            model.add( tile );
            model.add( factoryPiece.model );

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
                        })
                    .onComplete( function() { checkSolved();
                        })
                    .start();
            }

            function getIndex() {
                return index;
            }

            function getSolvedIndex() {
                return solvedIndex; 
            }

            function isSolved() {
                return solvedIndex === index;
            }

            function activate( time ) {
                factoryPiece.activate( time );
            }

            function deactivate( time ) {
                factoryPiece.deactivate( time );
            }

            return {
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
                    var newPiece = new PuzzlePiece( color, index, types[index] );
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

        var pointerSize = 5;
        var pointer = new factory.PointerMesh(pointerSize); 
        pointer.position.set( 0, -settings.arMarkerSize/2-pointerSize*3, 0 );
        container.add( pointer );

        pieces.forEach( function(piece) {
            if( piece ) {
                container.add( piece.model );
                addPickable( piece.model, function() { 
                    logic.doAction( piece.getIndex() );
                    return true;
                });
            }
        });

        var holeParams = {
            color: 0xABCDEF,
            width: puzzleSize/puzzleDim-1,
            height:puzzleSize/puzzleDim-1,
            depth: puzzleSize/puzzleDim/2
        };

        var holePiece = new HolePiece( holeParams );
        container.add( holePiece.model );
        holePiece.visible = false;
        addPickable( holePiece.model, function() {
            if( holePiece.isActive ) {
                console.log("selected hole");
                animator.activate( 1000 );
                return true;
            }
            else {
                return false;
            }
        });

        var product = new ProductType();
        container.add( product.model );
        product.model.visible = false;

        var animator = new AnimatorType( product );
        animator.onComplete = function(p) { 
            result.onProductProduced(p); 
        };

        var noiseGenerator = new AudioType();
        animator.onScale = function() {
            noiseGenerator.emit( lensId, 1, 1000 );
        };
        animator.onStart = function() {
            noiseGenerator.emit( lensId, 0, 500 );
        };

        function activate() {

            pieces.forEach( function(piece) {
                if( piece ) {
                    piece.activate( 1000 );
                }
            });

            holePiece.activate();
        }

        function deactivate() {
            animator.deactivate();

            pieces.forEach( function(piece) {
                if( piece ) {
                    piece.deactivate( 1000 );
                }
            });

            holePiece.deactivate();
        }

        function checkSolved() {
            if( logic.isSolved() ) {
                activate();
            }
            else {
                deactivate();
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

        var result = {
            getHolePosition: getHolePosition,
            getAdjacentPosition: getAdjacentPosition,
            onProductProduced: undefined,
            bump: bump,
            model: container,
            transform: transform,
            pickables: pickables,
            setOnSwap: setOnSwap, 
        };

        return result;
    }

    function Hammer( lensId ) {
        return new Puzzle( factory.Hammer, product.Music, product.Animator, noisemaker.Sine, lensId  );
    }

    function City( lensId ) {
        return new Puzzle( factory.City, product.Battery, product.Animator, noisemaker.Sine, lensId );
    }

    function Refinery( lensId ) {
        return new Puzzle( factory.Refinery, product.Battery, product.Animator, noisemaker.Sawtooth, lensId );
    }

    function Forest( lensId ) {
        return new Puzzle( factory.Forest, product.Molecule, product.Animator, noisemaker.Square, lensId );
    }

    return {
        Hammer: Hammer,
        City: City,
        Refinery: Refinery,
        Forest: Forest,
    };
});
