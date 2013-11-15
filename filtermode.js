"use strict";
define(['arscene', 'puzzle', 'strawman', 'pitobject', 'city'], function(arscene, puzzle, strawman, pitobject,city ) {

    var filters = [ new Filter(), new Filter() ];

    function SM() {
        return {
            object:new strawman.Strawman(),
            idIndex:undefined,
            filterIndex:undefined,
        };
    }

    var sm = new SM();

    filters.forEach( function(filter) {
        filter.onSwap = function(o) {
            pieceMoved();
        };
    });

    function pieceMoved() {
        removeStrawman();
        var randomFilter = Math.floor( Math.random()*2 ); 
        var randomIndex = Math.floor( Math.random()*2 );
        addStrawman( randomFilter, randomIndex );
    }

    function addStrawman( filterIndex, idIndex ) {
        var filter = filters[filterIndex];
        var thing = filter.get(idIndex);
        filter.add( thing.id, sm.object );
        sm.object.move( thing.object.getHolePosition() );
        sm.idIndex = idIndex;
        sm.filterIndex = filterIndex;
    }

    function removeStrawman() {
        var filter = filters[ sm.filterIndex ];
        var thing = filter.get( sm.idIndex );
        filter.remove( thing.id, sm.object );
    }

    addStrawman(1,0);

    function Filter() {
        var view = new arscene.View();
        var puzzles = [{id:4, object: new puzzle.Puzzle()}, {id:32, object: new puzzle.Puzzle()}];

        puzzles.forEach( function(p) {
            view.objects.add( p.id, new pitobject.PitObject({color:0x000000}) );
            view.objects.add( p.id, p.object );
        });

        function get( index ) {
            return puzzles[index];
        }

        function add( id, object ) {
            view.objects.add( id, object );
            view.scene.add( object );
        }

        function remove( id, object ) {
            view.objects.remove( id, object );
            view.scene.remove( object );
        }

        puzzles.forEach( function(o) {
            o.object.setOnSwap( function() {
                result.onSwap( o );
            } );
        });

        var result = {
            get:get,
            add:add,
            view:view,
            onSwap:undefined,
            remove:remove,
            puzzles:puzzles,
        };

        return result;
    }

    return {
        filters:filters,
    };
});

