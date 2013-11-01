"use strict";
define(['picker','three.min'], function(picker) {
    var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 150;

    var objectPicker = new picker.Picker(camera);

    var scene = new THREE.Scene();

    var directionalLight = new THREE.DirectionalLight( 0xffffff, 1.0 );
    directionalLight.position.set( 0, 1, 0 );
    scene.add( directionalLight );

    var renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );

    function animate() {
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
    };

    animate();

    function add( object ) {
        scene.add( object.model );
    }

    function remove( object ) {
        scene.remove( object.model );
    }

    function register( object ) {
    }

    return {
        add: add,
        remove: remove,
        register: register,
        objectPicker: objectPicker,
    }
});
