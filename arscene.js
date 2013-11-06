"use strict";

define(['picker','canvas','ardetector','arview','pitobject'], function(picker,canvas,ardetector,arview,pitobject) {
    function Scene( video ) {
        var detectorCanvas = canvas.create( video.getDimensions() );

        var detector = ardetector.create( detectorCanvas );
        var view = arview.create( video.getDimensions(), detectorCanvas );
        view.setCameraMatrix( detector.getCameraMatrix( 5, 10000 ) );
        document.body.appendChild( view.glCanvas );

        var objectPicker = new picker.Picker( view.getCamera(), view.glCanvas );

        // Create marker objects associated with the desired marker ID.
        var markerObjects = {
            32: [new pitobject.PitObject({color:0x000000})], 
            4: [new pitobject.PitObject({color:0x000000})],
        };

        function update() {
            video.seek(1);
            detectorCanvas.update( video );
            detector.detect( onMarkerCreated, onMarkerUpdated, onMarkerDestroyed );
            view.update();
            view.render();
        }

        function add( id, object ) {
            object.pickables.forEach( function(mesh) {
                objectPicker.registerPickTarget( mesh );
            });

            var objects = markerObjects[id];
            if( objects ) {
                var index = objects.indexOf( object );
                if( index < 0) {
                    objects.push( object );
                    view.add( object );
                }
            }
            else {
                // not attached to an AR marker, so just add to the scene.
                view.add( object );
            }
        }

        function remove( id, object ) {
            object.pickables.forEach( function(mesh) {
                //TODO: unregistered pickable mesh
            });

            var objects = markerObjects[id];
            if( objects ) {
                var index = objects.indexOf( object );
                if( index >= 0 ) {
                    var objectToRemove = objects.spice(index,1);
                    view.remove( objectToRemove );
                }
            }
            else {
                // not attached to an AR object, just remove from scene.
                view.remove( object );
            }
        }

        // This function is called when a marker is initally detected on the stream
        function onMarkerCreated(marker) {
            var objects = markerObjects[marker.id];
            if( objects ) {
                objects.forEach( function(object){
                    if( object.transform ) {
                        object.transform( marker.matrix );
                        view.add( object );
                    }
                    else {
                        console.log("DEVELOPMENT: found an object attached to an AR marker but without transform() method.");
                        console.log( object );
                    }
                });
            }
        }

        // This function is called when an existing marker is repositioned
        function onMarkerUpdated(marker) {
            var objects = markerObjects[marker.id];
            if( objects ) {
                objects.forEach( function(object) {
                    object.transform( marker.matrix );
                });
            }
        }

        // This function is called when a marker disappears from the stream.
        function onMarkerDestroyed(marker) {
            var objects = markerObjects[marker.id]; 
            if( objects ) {
                objects.forEach( function(object) {
                    view.remove( object );
                });
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
            getCamera: getCamera,
            updateMatrixWorld: updateMatrixWorld,
        };
    }

    return {
        Scene:Scene,
    };
});
