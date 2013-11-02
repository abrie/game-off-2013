"use strict";
define(['picker','canvas', 'video','ardetector','arview','arobject','three.min','tween.min'], function(picker,canvas,video,ardetector,arview,arobject) {
    var camera = new THREE.PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 450;

    var detectorCanvas = canvas.create( video.getDimensions() );

    var detector = ardetector.create( detectorCanvas );
    var view = arview.create( video.getDimensions(), detectorCanvas );
    view.setCameraMatrix( detector.getCameraMatrix(10,1000) );
    document.body.appendChild( view.glCanvas );

    var objectPicker = new picker.Picker(view.getCamera(), view.glCanvas);

    function animate() {
        requestAnimationFrame( animate );
        TWEEN.update();
        detectorCanvas.update( video );
        detector.detect( onMarkerCreated, onMarkerUpdated, onMarkerDestroyed );
        view.update();
        view.render();
    };

    animate();

    function add( object ) {
        object.pickables.forEach( function(mesh) {
            objectPicker.registerPickTarget( mesh );
        });

        addAR( 32, object );
        addAR( 4, object );
    }

    function remove( object ) {
        object.pickables.forEach( function(mesh) {
            //TODO: unregistered pickable mesh
        });
    }

    function addAR( id, object ) {
        markerObjects[id].add( object );
    }

    // This function is called when a marker is initally detected on the stream
    function onMarkerCreated(marker) {
        var object = markerObjects[marker.id];
        object.transform( marker.matrix );
        view.add( object, function(isSelected) {
            onMarkerSelectionChanged(marker.id, isSelected);
        });
    }

    // This function is called when an existing marker is repositioned
    function onMarkerUpdated(marker) {
        var object = markerObjects[marker.id];
        object.transform( marker.matrix );
    }

    // This function is called when a marker disappears from the stream.
    function onMarkerDestroyed(marker) {
        var object = markerObjects[marker.id]; 
        view.remove( object );
    }

    // This function is called when a marker object is selected/unselected.
    function onMarkerSelectionChanged(id, isSelected) {
        notifyWarpholeStateChanged( id, isSelected );
    }

    // Create marker objects associated with the desired marker ID.
    var markerObjects = {
        4: arobject.createMarkerObject({color:0xAA0000}), // Marker #4, red.
        32: arobject.createMarkerObject({color:0xAA0044}), // Marker #32, red.
    };

    return {
        add: add,
        remove: remove,
    }
});
