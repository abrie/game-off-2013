"use strict";

define(['picker','scratchcanvas','ardetector','arview','pitobject'], function(picker,scratchcanvas,ardetector,arview,pitobject) {

    function ImageSource( dimensions ) {
        var canvas = scratchcanvas.create( dimensions );
        var video;

        function update() {
            video.seek(1);
            canvas.update( video );
        }

        function setVideo( v ) {
            video = v;
        }

        return {
            setVideo:setVideo,
            scratchcanvas:canvas,
            update:update,
            dimensions:dimensions
        };
    }

    function MarkerSet() {
        // Create marker objects associated with the desired marker ID.
        var markerObjects = {};

        function add( arId, object ) {
            var objects = markerObjects[arId];
            if( !objects ) {
                objects = [];
                markerObjects[arId] = objects;
            }
            if( objects ) {
                var index = objects.indexOf( object );
                if( index < 0) {
                    objects.push( object );
                }
            }
        }

        function remove( arId, object ) {
            var objects = markerObjects[arId];
            if( objects ) {
                var index = objects.indexOf( object );
                if( index >= 0 ) {
                    objects.splice(index,1);
                }
            }
        }

        function get( arId ) {
            return markerObjects[arId];
        }

        return {
            get:get,
            add:add,
            remove:remove,
        };
    }

    function Scene( element, imageSource, markers ) {
        var detector = ardetector.create( imageSource.scratchcanvas );
        var view = arview.create( imageSource.dimensions, imageSource.scratchcanvas );
        view.setCameraMatrix( detector.getCameraMatrix( 5, 10000 ) );
        element.appendChild( view.glCanvas );

        var objectPicker = new picker.Picker( view.getCamera(), view.glCanvas );

        function update() {
            detector.detect( 
                onMarkerCreated, 
                onMarkerUpdated, 
                onMarkerDestroyed 
            );
            view.update();
        }

        function render() {
            view.render();
        }

        function add( object ) {
            objectPicker.register( object.pickables );
            view.add( object );
        }

        function remove( object ) {
            objectPicker.unregister( object.pickables );
            view.remove( object );
        }

        // This function is called when a marker is initally detected on the stream
        function onMarkerCreated( marker ) {
            var objects = markers.get( marker.id );
            if( objects ) {
                objects.forEach( function(object){
                    if( !object.transform ) {
                        console.log("DEVELOPMENT: found an object attached to an AR marker but without transform() method.");
                        console.log( object );
                    }
                    else {
                        object.transform( marker.matrix );
                        add( object );
                    }
                });
            }
        }

        // This function is called when an existing marker is repositioned
        function onMarkerUpdated(marker) {
            var objects = markers.get( marker.id );
            if( objects ) {
                objects.forEach( function( object ) {
                    object.transform( marker.matrix );
                });
            }
        }

        // This function is called when a marker disappears from the stream.
        function onMarkerDestroyed(marker) {
            var objects = markers.get( marker.id ); 
            if( objects ) {
                objects.forEach( remove ); 
            }
        }

        return {
            add: add,
            remove: remove,
            update: update,
            render: render,
        };
    }

    return {
        Scene:Scene,
        ImageSource:ImageSource,
        MarkerSet:MarkerSet,
    };
});
