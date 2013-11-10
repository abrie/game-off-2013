"use strict";

define(["three.min"],function() {
    function Picker( camera, element ) {
        element.addEventListener( 'mousedown', onDocumentMouseDown, false );

        var projector = new THREE.Projector();
        var mouse = { x:0, y:0 };

        function onDocumentMouseDown( event ) 
        {
            var x = event.clientX - element.offsetLeft;
            var y = event.clientY - element.offsetTop;
            mouse.x = x / element.width * 2 - 1;
            mouse.y = -y / element.height * 2 + 1;
            detect();
        }

        function detect() {
            var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
            projector.unprojectVector( vector, camera );
            var ray = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

            var intersects = ray.intersectObjects( registered );

            if ( intersects.length > 0 ) {
                intersects[0].object.onPicked();
            }
        }

        var registered = [];
        function register( list ) {
            list.forEach( function(mesh) {
                registered.push( mesh );
            });
        }    

        function unregister( list ) {
            list.forEach( function(mesh) { 
                var index = registered.indexOf( mesh );
                if( index >= 0) {
                    registered.splice(index,1);
                }
            });
        }

        return {
            register:register,
            unregister:unregister,
        };
    }

    return {
        Picker:Picker,
    };
});
