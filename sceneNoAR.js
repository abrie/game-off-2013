"use strict";

define(['picker', 'three.min'], function(picker) {
    function View() {
        var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
        camera.position.z = 300;

        var virtual = new THREE.Scene();

        var renderer = new THREE.CanvasRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );

        function add( object ) {
            virtual.add( object.model );
        }

        function remove( object ) {
            virtual.remove( object.model );
        }

        function render() {
            renderer.render( virtual, camera );
        }

        function update() {
        }

        function getCamera() {
            return camera;
        }

        return {
            glCanvas: renderer.domElement,
            getCamera: getCamera, 
            render: render,
            update: update,
            add: add,
            remove: remove,
        };
    }

    function Scene() {
        var view = new View();

        document.body.appendChild( view.glCanvas );

        var objectPicker = new picker.Picker( view.getCamera(), view.glCanvas );

        function update() {
            view.update();
            view.render();
        }

        function add( object ) {
            object.pickables.forEach( function(mesh) {
                objectPicker.registerPickTarget( mesh );
            });

            view.add( object );
        }

        function remove( object ) {
            object.pickables.forEach( function(mesh) {
                //TODO: unregistered pickable mesh
            });

            view.remove( object );
        }

        function getCameraPosition() {
            return view.getCamera().position;
        }

        return {
            add: add,
            remove: remove,
            update: update,
            getCameraPosition: getCameraPosition,
        };
    }

    return {
        Scene:Scene,
    };
});
