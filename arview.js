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
        // Create an augmented scene
        var scene = new THREE.Scene();

        // Create an occluder scene
        var occluder = new THREE.Scene();

        // Create a shared camera
        var camera = new THREE.Camera();

        var light = new THREE.DirectionalLight( 0xFFFFFF );
        light.position.x = 0;
        light.position.y = 0;
        light.position.z = 9000;
        light.lookAt( scene.position );
        scene.add( light );

        function add( object ) {
            if( object.model ) {
                scene.add( object.model );
            }
            if( object.occluder ) {
                occluder.add( object.occluder );
            }
        }

        function remove( object ) {
            if( object.model ) {
                scene.remove( object.model );
            }
            if( object.occluder ) {
                occluder.remove( object.occluder );
            }
        }

        function setProjectionMatrix( matrix ) {
            camera.projectionMatrix.fromArray( matrix );
        }

        return {
            scene:scene,
            occluder:occluder,
            camera:camera,
            add:add,
            remove:remove,
            setProjectionMatrix:setProjectionMatrix,
        };
    };

    var Renderer = function(dimensions, sourceCanvas) {
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

        var virtual;
        function setScene( scene ) {
            virtual = scene;
        }

        function render() {
            // Render the reality scene
            renderer.render(reality.scene, reality.camera);

            // Deactivate color buffer renderering, leaving only depth buffer active.
            renderer.context.colorMask(false,false,false,false);

            // Render the occluder scene
            renderer.render( virtual.occluder, virtual.camera);

            // Reactivate color buffer rendering
            renderer.context.colorMask(true,true,true,true);

            // Render the augmented components on top of the reality scene.
            renderer.render( virtual.scene, virtual.camera );
        }

        function update() {
            // Notify the reality scene to update it's texture
            reality.update();
        }

        function setCameraMatrix( matrix ) {
            virtual.setProjectionMatrix( matrix );
        }

        function getCamera() {
            return virtual.camera;
        }

        return {
            setScene: setScene,
            update: update,
            render: render,
            glCanvas: glCanvas,
            setCameraMatrix: setCameraMatrix,
            getCamera: getCamera,
        };
    };

    return {
        Renderer: Renderer,
        Scene: Scene,
    };

});
