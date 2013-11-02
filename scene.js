"use strict";
define(['picker','three.min'], function(picker) {
    var camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 450;

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
        object.pickables.forEach( function(mesh) {
            objectPicker.registerPickTarget( mesh );
        });
    }

    function remove( object ) {
        scene.remove( object.model );
        object.pickables.forEach( function(mesh) {
            //TODO: unregistered pickable mesh
        });
    }

    function register( object ) {
    }

    return {
        add: add,
        remove: remove,
        register: register,
    }
});
