"use strict";
define(['arscene', 'puzzle', 'pitobject' ], function( arscene, puzzle, pitobject ) {

    function random(max) {
        return Math.floor( Math.random()*max );
    }

    function Filter( generator ) {
        var view = new arscene.View();
        var puzzles = [{id:4, object: new generator()}, {id:32, object: new generator()}];

        puzzles.forEach( function(p) {
            view.objects.add( p.id, new pitobject.PitObject({color:0x000000}) );
            view.objects.add( p.id, p.object );
        });

        function add( id, object ) {
            view.objects.add( id, object );
            view.scene.add( object );
        }

        function remove( id, object ) {
            view.objects.remove( id, object );
            view.scene.remove( object );
        }

        function getRandomPuzzle() {
            return puzzles[random(puzzles.length)];
        }

        puzzles.forEach( function(o) {
            o.object.setOnSwap( function() {
                result.onSwap( result, o );
            } );
        });

        var result = {
            getRandomPuzzle:getRandomPuzzle,
            puzzles:puzzles,
            onSwap:undefined,
            remove:remove,
            view:view,
            add:add,
        };

        return result;
    }

    return {
        Filter:Filter,
    };
});
