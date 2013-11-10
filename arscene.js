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

    function Scene( element, imageSource ) {
        var detector = ardetector.create( imageSource.scratchcanvas );
        var view = arview.create( imageSource.dimensions, imageSource.scratchcanvas );
        view.setCameraMatrix( detector.getCameraMatrix( 5, 10000 ) );
        element.appendChild( view.glCanvas );

        var objectPicker = new picker.Picker( view.getCamera(), view.glCanvas );

        // Create marker objects associated with the desired marker ID.
        var markerObjects = {
            32: [ new pitobject.PitObject({color:0x000000}) ], 
            4: [ new pitobject.PitObject({color:0x000000}) ],
        };

        function update() {
            imageSource.update()
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

        function add( object, arId ) {
            object.pickables.forEach( function(mesh) {
                objectPicker.registerPickTarget( mesh );
            });

            var objects = markerObjects[arId];
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

        function remove( object, arId ) {
            object.pickables.forEach( function(mesh) {
                //TODO: unregistered pickable mesh
            });

            var objects = markerObjects[arId];
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
    };
});
