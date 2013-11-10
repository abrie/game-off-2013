"use strict";

define(['picker','ardetector','arview' ], function(picker,ardetector,arview ) {

    function View() {
        return {
            objects: new arview.Objects(),
            scene: new arview.Scene(),
        };
    }

    function Scene( element, imageSource  ) {
        var detector = ardetector.create( imageSource.scratchcanvas );
        var renderer = new arview.Renderer( imageSource.dimensions, imageSource.scratchcanvas );
        renderer.setCameraMatrix( detector.getCameraMatrix( 5, 10000 ) );
        element.appendChild( renderer.glCanvas );

        var objectPicker = new picker.Picker( renderer.getCamera(), renderer.glCanvas );

        var view;
        function setView( newView ) {
            view = newView;
            renderer.setScene( view.scene );
            detector.reset();
        }

        function update() {
            detector.detect( 
                onMarkerCreated, 
                onMarkerUpdated, 
                onMarkerDestroyed 
            );
            renderer.update();
        }

        function render() {
            renderer.render();
        }

        function add( object ) {
            objectPicker.register( object.pickables );
            view.scene.add( object );
        }

        function remove( object ) {
            objectPicker.unregister( object.pickables );
            view.scene.remove( object );
        }

        // This function is called when a marker is initally detected on the stream
        function onMarkerCreated( marker ) {
            var objects = view.objects.get( marker.id );
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
            var objects = view.objects.get( marker.id );
            if( objects ) {
                objects.forEach( function( object ) {
                    object.transform( marker.matrix );
                });
            }
        }

        // This function is called when a marker disappears from the stream.
        function onMarkerDestroyed(marker) {
            var objects = view.objects.get( marker.id ); 
            if( objects ) {
                objects.forEach( remove ); 
            }
        }

        return {
            add: add,
            remove: remove,
            update: update,
            render: render,
            setView: setView,
        };
    }

    return {
        Scene:Scene,
        View:View,
    };
});
