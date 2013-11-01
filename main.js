"use strict";

require(['puzzle','three.min'],function(puzzle) {
    var colorPalette = [0x17A768, 0xF1601D, 0xF1AD1D, 0xE7E0D2, 0xBBAE93];
    var camera, scene, renderer;

    var puzzleDim = 3, puzzleSize = 100, puzzleModel;
    var puzzleObject = new puzzle.Puzzle( puzzleDim );

    function puzzleCoordinate( v ) {
        return puzzleSize/puzzleDim * (2*v - puzzleDim + 1) / 2;
    }

    function createPuzzleTile( index ) {
        var geometry = new THREE.CubeGeometry( puzzleSize/puzzleDim-1, puzzleSize/puzzleDim-1, puzzleSize/puzzleDim/2 );
        var material = new THREE.MeshPhongMaterial( { color: colorPalette[index % colorPalette.length]} );

        var mesh = new THREE.Mesh( geometry, material );
        mesh.position.x = puzzleCoordinate( index % puzzleDim ); 
        mesh.position.y = puzzleCoordinate( Math.floor( index / puzzleDim ))
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

        puzzleObject.get().forEach( function( i ) {
            if( i !== false ) {
                var puzzleTile = createPuzzleTile( i );
                puzzleModel.add( puzzleTile );
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
});
