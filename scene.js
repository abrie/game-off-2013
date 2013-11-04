"use strict";

define(['picker','canvas','assets','ardetector','arview','arobject'], function(picker,canvas,assets,ardetector,arview,arobject) {
    function Scene() {
        var video = assets.get("clip1");
        var detectorCanvas = canvas.create( video.getDimensions() );

        var detector = ardetector.create( detectorCanvas );
        var view = arview.create( video.getDimensions(), detectorCanvas );
        view.setCameraMatrix( detector.getCameraMatrix( 5, 10000 ) );
        document.body.appendChild( view.glCanvas );

        var objectPicker = new picker.Picker( view.getCamera(), view.glCanvas );

        // Create marker objects associated with the desired marker ID.
        var markerObjects = {
            32: arobject.createMarkerObject({color:0x000000}), 
            4: arobject.createMarkerObject({color:0x000000}),
        };

        function update() {
            video.seek(1);
            detectorCanvas.update( video );
            detector.detect( onMarkerCreated, onMarkerUpdated, onMarkerDestroyed );
            view.update();
            view.render();
        }

        function add( object ) {
            object.pickables.forEach( function(mesh) {
                objectPicker.registerPickTarget( mesh );
            });

            view.add( object );

        }

        function addToAR( id, object ) {
            object.pickables.forEach( function(mesh) {
                objectPicker.registerPickTarget( mesh );
            });

            var arObject = markerObjects[id];
            if( arObject ) {
                arObject.add( object );
            }
        }

        function remove( object ) {
            object.pickables.forEach( function(mesh) {
                //TODO: unregistered pickable mesh
            });

            view.remove( object );
        }

        // This function is called when a marker is initally detected on the stream
        function onMarkerCreated(marker) {
            var object = markerObjects[marker.id];
            if( object ) {
                object.transform( marker.matrix );
                view.add( object );
            }
        }

        // This function is called when an existing marker is repositioned
        function onMarkerUpdated(marker) {
            var object = markerObjects[marker.id];
            if( object ) {
                object.transform( marker.matrix );
            }
        }

        // This function is called when a marker disappears from the stream.
        function onMarkerDestroyed(marker) {
            var object = markerObjects[marker.id]; 
            if( object ) {
                view.remove( object );
            }
        }

        return {
            add: add,
            addToAR: addToAR,
            remove: remove,
            update: update,
        };
    }

    return {
        Scene:Scene,
    };
});
