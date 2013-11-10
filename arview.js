"use strict";

define(["three.min"], function() {

    var Reality = function(sourceCanvas){
        // Create a default camera and scene.
        var camera = new THREE.Camera();
        var scene = new THREE.Scene();

        // Create a plane geometry to hold the sourceCanvas texture
        var geometry = new THREE.PlaneGeometry(2, 2, 0);

        // Create a material textured with the contents of sourceCanvas.
        var texture = new THREE.Texture(sourceCanvas.getElement());
        var material = new THREE.MeshBasicMaterial({
               map: texture,
               depthTest: false,
               depthWrite: false
        });

        // Build a mesh and add it to the scene.
        var mesh = new THREE.Mesh( geometry, material );
        scene.add(mesh);

        // We need to notify ThreeJS when the texture has changed.
        function update() {
            texture.needsUpdate = true;
        }

        return {
            camera: camera,
            scene: scene,
            update: update, 
        };
    };

    var Scene = function() {
        var scene = new THREE.Scene();
        var camera = new THREE.Camera();

        function add(object) {
            scene.add(object);
        }

        function remove(object) {
            scene.remove(object);
        }

        function setProjectionMatrix(matrix) {
            camera.projectionMatrix.fromArray( matrix );
        }

        return {
            scene:scene,
            camera:camera,
            add:add,
            remove:remove,
            setProjectionMatrix:setProjectionMatrix,
        };
    };

    var create = function(dimensions, sourceCanvas) {
        // Create a canvas which will be used for WebGL
        var glCanvas = document.createElement('canvas');

        // Initialize the renderer and attach it to the canvas
        var renderer = new THREE.WebGLRenderer({
            canvas:glCanvas,
            antialias:true
        });

        renderer.setSize(dimensions.width, dimensions.height);
        renderer.autoClear = false;

        // Create a reality scene
        var reality = new Reality(sourceCanvas);

        // Create an augmented scene
        var virtual = new Scene();

        // Create an occluder scene
        var occluder = new Scene();

        var light = new THREE.DirectionalLight( 0xFFFFFF );
        light.position.x = 0;
        light.position.y = 0;
        light.position.z = 9000;
        light.lookAt( virtual.scene.position );
        virtual.scene.add( light );

        function render() {
            // Render the reality scene
            renderer.render(reality.scene, reality.camera);

            // Deactivate color buffer renderering, leaving only depth buffer active.
            renderer.context.colorMask(false,false,false,false);

            // Render the occluder scene
            renderer.render( occluder.scene, occluder.camera);

            // Reactivate color buffer rendering
            renderer.context.colorMask(true,true,true,true);

            // Render the augmented components on top of the reality scene.
            renderer.render(virtual.scene, virtual.camera);
        }

        function update() {
            // Notify the reality scene to update it's texture
            reality.update();
        }

        function setCameraMatrix( matrix ) {
            virtual.setProjectionMatrix( matrix );
            occluder.setProjectionMatrix( matrix );
        }

        function getCamera() {
            return virtual.camera;
        }

        function add( object ) {
            if( object.model ) {
                virtual.add( object.model );
            }
            if( object.occluder ) {
                occluder.add( object.occluder );
            }
        }

        function remove( object ) {
            if( object.model ) {
                virtual.remove( object.model );
            }
            if( object.occluder ) {
                occluder.remove( object.occluder );
            }
        }

        return {
            add: add,
            remove: remove,
            update: update,
            render: render,
            glCanvas: glCanvas,
            setCameraMatrix: setCameraMatrix,
            getCamera: getCamera,
        };
    };

    return {
        create: create,
    };

});
