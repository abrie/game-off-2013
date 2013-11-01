"use strict";

require(['puzzle','colors','picker','three.min'],function(puzzle,colors,picker) {
    var camera, scene, renderer, objectPicker, puzzleObject;


    function init() {
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 150;

        scene = new THREE.Scene();

        var directionalLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
        directionalLight.position.set( 0, 1, 0 );
        scene.add( directionalLight );

        renderer = new THREE.WebGLRenderer({antialias:true});
        renderer.setSize( window.innerWidth, window.innerHeight );

        document.body.appendChild( renderer.domElement );

        objectPicker = new picker.Picker(camera);
        puzzleObject = new puzzle.PuzzleModel( objectPicker );
        scene.add( puzzleObject.model );
    }

    function animate() {
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
    }

    init();
    animate();

    function Player() {
        var geometry = new THREE.CubeGeometry(
            20,20,20
        );

        var material = new THREE.MeshPhongMaterial({
            color: colors.palette[0],
        });

        var mesh = new THREE.Mesh( geometry, material );
        var object = new THREE.Object3D();
        object.add(mesh);
        
        return {
            model:object,
        }
    }

    var player = new Player();
    puzzleObject.addPlayer(player);
    puzzleObject.doAction(4);
});
