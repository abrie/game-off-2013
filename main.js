"use strict";

require(['puzzle','three.min'],function(puzzle) {
    var colorPalette = [0x17A768, 0xF1601D, 0xF1AD1D, 0xE7E0D2, 0xBBAE93];
    var camera, scene, renderer;

    var puzzleDim = 3, puzzleSize = 100, puzzleModel, puzzleTileModels = [];
    var puzzlePieces = [];

    function PuzzlePiece(index) {
        var model = createPuzzleTile(index);
        model.position.x = puzzleCoordinate( index % puzzleDim ); 
        model.position.y = puzzleCoordinate( Math.floor( index / puzzleDim ) )
        model.position.z = 0;

        return {
            model:model
        }
    }

    for( var i = 0; i < puzzleDim*puzzleDim; i++ ) {
        if( i === Math.floor( puzzleDim*puzzleDim/2 ) ) {
            puzzlePieces.push( false );
        }
        else {
            puzzlePieces.push( new PuzzlePiece(i) );
        }
    }

    var puzzleObject = new puzzle.Puzzle( puzzlePieces );
    puzzleObject.onIndiciesSwapped( function(i,j) {
        update( i );
        update( j );
    });

    function update( index ) {
        var puzzlePiece = puzzlePieces[index];
        if( puzzlePiece ) {
            puzzlePiece.model.position.x = puzzleCoordinate( index % puzzleDim ); 
            puzzlePiece.model.position.y = puzzleCoordinate( Math.floor( index / puzzleDim ) )
        }
    }

    function puzzleCoordinate( v ) {
        return puzzleSize/puzzleDim * (2*v - puzzleDim + 1) / 2;
    }

    function createPuzzleTile( index ) {
        var geometry = new THREE.CubeGeometry( puzzleSize/puzzleDim-1, puzzleSize/puzzleDim-1, puzzleSize/puzzleDim/2 );
        var material = new THREE.MeshPhongMaterial( { color: colorPalette[index % colorPalette.length]} );
        var mesh = new THREE.Mesh( geometry, material );

        return mesh;
    }

    function init() {
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 250;

        scene = new THREE.Scene();

        puzzleModel = new THREE.Object3D();
        puzzleModel.rotation.x = -1;
        puzzleModel.rotation.z = 0;

        puzzlePieces.forEach( function( puzzlePiece ) {
            if( puzzlePiece ) {
                puzzleModel.add( puzzlePiece.model );
            }
        });

        scene.add( puzzleModel );
        
        var directionalLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
        directionalLight.position.set( 0, 1, 0 );
        scene.add( directionalLight );

        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );

        document.body.appendChild( renderer.domElement );
    }

    function animate() {
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
    }

    init();
    animate();
    puzzleObject.doAction(3);
});
