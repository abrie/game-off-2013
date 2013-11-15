"use strict";
define(['arscene', 'puzzle', 'strawman', 'pitobject', 'city'], function(arscene, puzzle, strawman, pitobject,city ) {

    var strawmanObject = new strawman.Strawman();
    var filters = [ new Filter(), new Filter() ];

    function pieceMoved() {
        removeStrawman();
        var randomFilter = Math.floor( Math.random()*2 ); 
        var randomIndex = Math.floor( Math.random()*2 );
        addStrawman( randomFilter, randomIndex );
    }

    var currentIdIndex = undefined;
    var currentFilterIndex = undefined;

    function addStrawman( filterIndex, idIndex ) {
        var filter = filters[filterIndex];
        var thing = filter.get(idIndex);
        filter.add( thing.id, strawmanObject );
        strawmanObject.move( thing.object.getHolePosition() );
        currentFilterIndex = filterIndex;
        currentIdIndex = idIndex;
    }

    function removeStrawman() {
        var filter = filters[currentFilterIndex];
        var thing = filter.get(currentIdIndex);
        filter.remove( thing.id, strawmanObject );
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
            o.object.setOnSwap( pieceMoved );
        });

        return {
            get:get,
            add:add,
            view:view,
            remove:remove,
            puzzles:puzzles,
        };
    }

    return {
        filters:filters,
    };
});

