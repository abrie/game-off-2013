"use strict";
define(['arscene', 'pitobject' ], function( arscene, pitobject ) {

    function random(max) {
        return Math.floor( Math.random()*max );
    }

    function Filter( types ) {
        var view = new arscene.View();
        var puzzles = types.map( function(type) {
            return {
                id:type.id, 
                object: new type.generator(), 
            };
        });

        puzzles.forEach( function(p) {
        });

        function add( id, object ) {
            view.objects.add( id, object );
            view.scene.add( object );
        }

        function remove( id, object ) {
            view.objects.remove( id, object );
            view.scene.remove( object );
        }

        function getRandomThing() {
            return puzzles[random(puzzles.length)];
        }

        function getView() {
            return view;
        }

        function setOnProductProduced( callback ) {
            puzzles.forEach( function(o) {
                o.object.onProductProduced = callback; 
            });
        }

        puzzles.forEach( function(o) {
            o.object.setOnSwap( function() {
                result.onSwap( result, o );
            } );
            view.objects.add( o.id, new pitobject.PitObject( { color:0x000000 } ) );
            view.objects.add( o.id, o.object );
        });

        var result = {
            getRandomThing:getRandomThing,
            setOnProductProduced:setOnProductProduced,
            puzzles:puzzles,
            onSwap:undefined,
            remove:remove,
            getView:getView,
            add:add,
        };

        return result;
    }

    return {
        Filter:Filter,
    };
});
