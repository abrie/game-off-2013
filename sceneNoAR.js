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

        function createPlace( x, y, z) {
            var object = new THREE.Object3D();
            object.position.x = x;
            object.position.y = y;
            object.position.z = z;

            function add( child ) {
                object.add( child.model );
            }

            function remove( child ) {
                object.remove( child.model );
            }

            return {
                model: object,
                add: add,
                remove: remove,
            };
        }

        var places = {
            4: createPlace( 200, 0, 0),
            32: createPlace( -200, 0, 0)
        };

        view.add( places[4] );
        view.add( places[32] );

        function update() {
            view.update();
            view.render();
        }

        function add( id, object ) {
            object.pickables.forEach( function(mesh) {
                objectPicker.registerPickTarget( mesh );
            });

            if( id >= 0) {
                places[id].add( object );
            }
            else {
                view.add( object );
            }
        }

        function remove( id, object ) {
            object.pickables.forEach( function(mesh) {
                //TODO: unregistered pickable mesh
            });

            if( id >= 0) {
                places[id].remove( object );
            }
            else {
                view.remove( object );
            }
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
