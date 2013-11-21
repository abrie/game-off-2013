"use strict";
define(['arscene', 'puzzle', 'pitobject' ], function( arscene, puzzle, pitobject ) {

    function random(max) {
        return Math.floor( Math.random()*max );
    }

    function Filter( types ) {
        console.log(types);
        var view = new arscene.View();
        var puzzles = types.map( function(type) {
            return {
                id:type.id, 
                object:type.generator(), 
            };
        });

        function ProductionDelegate( thing ) {
            return function() {
                result.onProductProduced( thing );
            };
        }

        puzzles.forEach( function(p) {
            view.objects.add( p.id, new pitobject.PitObject( { color:0x000000 } ) );
            view.objects.add( p.id, p.object );
            p.object.onProductProduced = new ProductionDelegate( p ); 
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

        function update() {
            puzzles.forEach( function(p) {
                p.object.update();
            });
        }

        function getView() {
            return view;
        }

        puzzles.forEach( function(o) {
            o.object.setOnSwap( function() {
                result.onSwap( result, o );
            } );
        });

        var result = {
            getRandomThing:getRandomThing,
            onProductProduced:undefined,
            puzzles:puzzles,
            onSwap:undefined,
            remove:remove,
            update:update,
            getView:getView,
            add:add,
        };

        return result;
    }

    return {
        Filter:Filter,
    };
});
