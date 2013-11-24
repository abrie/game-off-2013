"use strict";
define(['arscene', 'pitobject', 'utility' ], function( arscene, pitobject, utility ) {

    function Filter( descriptor ) {
        var view = new arscene.View();
        var puzzles = descriptor.puzzles.map( function(puzzle) {
            return {
                id: puzzle.id, 
                object: new puzzle.generator(), 
            };
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
            return puzzles[ utility.random( puzzles.length ) ];
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
