"use strict";

require(['puzzle','colors','three.min'],function(puzzle,colors) {
    var camera, scene, renderer;

    var puzzleObject = new puzzle.PuzzleModel();

    function init() {
        camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 250;

        scene = new THREE.Scene();

        scene.add( puzzleObject.model );
        
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

    var keyDownAction = {
        37:function() { move(-1,0); },
        38:function() { move(0,1); },
        39:function() { move(1,0);},
        40:function() { move(0,-1); },
        90:function() { swap(); }
    }

    document.onkeydown = function (e) { 
        e = e || window.event; 
        if( keyDownAction[e.keyCode] ) {
            keyDownAction[e.keyCode]();
            e.preventDefault();
            e.stopPropagation()
            return false;
        }
    };

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
    puzzleObject.doAction(3);
});
