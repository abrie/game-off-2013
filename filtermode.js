"use strict";
define(['arscene', 'puzzle', 'strawman', 'pitobject', 'city'], function(arscene, puzzle, strawman, pitobject,city ) {

    var strawmanObject = new strawman.Strawman();
    var filters = [ new FilterA(), new FilterB() ];

    function pieceMoved() {
        removeStrawman();
        var randomFilter = Math.floor( Math.random()*2 ); 
        var randomIndex = Math.floor( Math.random()*2 );
        addStrawman( randomFilter, randomIndex );
    }

    filters[0].puzzles.forEach( function(object) {
        object.object.setOnSwap( pieceMoved );
    });

    var currentIdIndex = undefined;
    var currentFilterIndex = undefined;

    function addStrawman( filterIndex, idIndex ) {
        var p = filters[filterIndex].get(idIndex);
        filters[filterIndex].view.objects.add( p.id, strawmanObject );
        strawmanObject.move( p.object.getHolePosition() );
        currentFilterIndex = filterIndex;
        currentIdIndex = idIndex;
        console.log( filterIndex, idIndex );
    }

    function removeStrawman() {
        var p = filters[currentFilterIndex].get(currentIdIndex);
        filters[currentFilterIndex].view.objects.remove( p.id, strawmanObject );
    }

    addStrawman(1,0);

    function FilterA() {
        var view = new arscene.View();
        var puzzles = [{id:4, object: new puzzle.Puzzle()}, {id:32, object: new puzzle.Puzzle()}];

        puzzles.forEach( function(p) {
            view.objects.add( p.id, new pitobject.PitObject({color:0x000000}) );
            view.objects.add( p.id, p.object );
        });

        function get( index ) {
            return puzzles[index];
        }

        return {
            view:view,
            puzzles:puzzles,
            get:get
        };
    }

    function FilterB() {
        var view = new arscene.View();
        var puzzles = [{id:4, object: new puzzle.Puzzle()}, {id:32, object: new puzzle.Puzzle()}];

        puzzles.forEach( function(p) {
            view.objects.add( p.id, new pitobject.PitObject({color:0x000000}) );
            view.objects.add( p.id, p.object );
        });

        function get( index ) {
            return puzzles[index];
        }

        return {
            view:view,
            puzzles:puzzles,
            get:get,
        };
    }

    return {
        filters:filters,
    };
});

