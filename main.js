"use strict";

require(['pz','three.min'],function(pz) {
    var camera, scene, renderer;

    console.log(pz);
    var puzzleModel = new pz.PuzzleModel();

    function init() {
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 250;

        scene = new THREE.Scene();

        scene.add( puzzleModel.model );
        
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
    puzzleModel.doAction(3);
});
