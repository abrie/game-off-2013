"use strict";

define(['picker', 'three.min'], function(picker) {
    function View() {
        var camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 10, 10000 );
        camera.position.z = -100;
        camera.position.y = 100;
        camera.position.x = -200;
        camera.lookAt( new THREE.Vector3(0,0,0) );

        var virtual = new THREE.Scene();

        var renderer = new THREE.WebGLRenderer( {antialias:true} );
        renderer.setSize( window.innerWidth, window.innerHeight );

        var light = new THREE.DirectionalLight( 0xFFFFFF );
        light.position.x = camera.position.x;
        light.position.y = camera.position.y;
        light.position.z = camera.position.z;
        light.lookAt( new THREE.Vector3(0,0,0) );
        virtual.add( light );

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

        function updateMatrixWorld() {
            virtual.updateMatrixWorld();
        }

        return {
            glCanvas: renderer.domElement,
            getCamera: getCamera, 
            render: render,
            update: update,
            add: add,
            remove: remove,
            updateMatrixWorld: updateMatrixWorld,
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

            object.up.x = 0;
            object.up.y = -1;
            object.up.z = -1;

            console.log( object.up );
            return {
                model: object,
                add: add,
                remove: remove,
            };
        }

        var places = {
            4: createPlace( 100, 0, 0),
            32: createPlace( -100, 0, 0)
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
            var position = view.getCamera().position.clone();
            position.z = -position.z;
            position.x = -position.x;
            position.y = -position.y;
            return position;
        }

        function updateMatrixWorld() {
            view.updateMatrixWorld();
        }

        function getCamera() {
            return view.getCamera();
        }

        return {
            add: add,
            remove: remove,
            update: update,
            getCameraPosition: getCameraPosition,
            updateMatrixWorld: updateMatrixWorld,
            getCamera: getCamera,
        };
    }

    return {
        Scene:Scene,
    };
});
