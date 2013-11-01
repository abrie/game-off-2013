"use strict";

require(['puzzle','three.min'],function(puzzle) {
    var colorPalette = [0x17A768, 0xF1601D, 0xF1AD1D, 0xE7E0D2, 0xBBAE93];
    var camera, scene, renderer;

    var puzzleDim = 3, puzzleSize = 100, puzzleModel, puzzleTileModels = [];
    var puzzleArray = [];
    for( var i = 0; i < puzzleDim*puzzleDim; i++ ) {
        if( i === Math.floor( puzzleDim*puzzleDim/2 ) ) {
            puzzleArray.push( false );
        }
        else {
            puzzleArray.push( createPuzzleTile(i) );
        }
    }

    var puzzleObject = new puzzle.Puzzle( puzzleArray );
    puzzleObject.onIndiciesSwapped( function(i,j) {
        console.log("swap:",i,j);
        if( puzzleArray[i] ) {
            puzzleArray[i].position.x = puzzleCoordinate( i % puzzleDim ); 
            puzzleArray[i].position.y = puzzleCoordinate( Math.floor( i / puzzleDim ) )
        }
        if( puzzleArray[j] ) {
            puzzleArray[j].position.x = puzzleCoordinate( j % puzzleDim ); 
            puzzleArray[j].position.y = puzzleCoordinate( Math.floor( j / puzzleDim ) )
        }
    });

    function puzzleCoordinate( v ) {
        return puzzleSize/puzzleDim * (2*v - puzzleDim + 1) / 2;
    }

    function createPuzzleTile( index ) {
        var geometry = new THREE.CubeGeometry( puzzleSize/puzzleDim-1, puzzleSize/puzzleDim-1, puzzleSize/puzzleDim/2 );
        var material = new THREE.MeshPhongMaterial( { color: colorPalette[index % colorPalette.length]} );

        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.x = puzzleCoordinate( index % puzzleDim ); 
        mesh.position.y = puzzleCoordinate( Math.floor( index / puzzleDim ) )
        mesh.position.z = 0;

        return mesh;
    }

    function init() {
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 250;

        scene = new THREE.Scene();

        puzzleModel = new THREE.Object3D();
        puzzleModel.rotation.x = -1;
        puzzleModel.rotation.z = 0;

        puzzleArray.forEach( function( i ) {
            if( i !== false ) {
                puzzleModel.add( i );
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
