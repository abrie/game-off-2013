"use strict";

define(["three.min"],function() {
    function Picker( camera, element ) {
        element.addEventListener( 'mousedown', onDocumentMouseDown, false );

        var projector = new THREE.Projector();
        var mouse = { x:0, y:0 };

        function onDocumentMouseDown( event ) 
        {
            var x = event.clientX - element.offsetLeft - element.parentElement.offsetLeft;
            var y = event.clientY - element.offsetTop - element.parentElement.offsetTop;
            console.log(x,y);
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
        function setList( list ) {
            registered = list;
        }

        return {
            setList:setList,
        };
    }

    return {
        Picker:Picker,
    };
});
