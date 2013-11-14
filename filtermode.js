"use strict";
define(['arscene', 'puzzle', 'strawman', 'pitobject', 'city'], function(arscene, puzzle, strawman, pitobject,city ) {

    var strawmanObject = new strawman.Strawman();
    var filters = [ new FilterA(), new FilterB() ];

    function pieceMoved() {
        var random = Math.floor( Math.random()*2 ); 
        removeStrawman();
        addStrawman( random );
    }

    filters[0].puzzles.forEach( function(object) {
        object.object.setOnSwap( pieceMoved );
    });

    var currentIndex = undefined;
    function addStrawman(index) {
        var p = filters[0].get(index);
        filters[0].view.objects.add( p.id, strawmanObject );
        strawmanObject.move( p.object.getHolePosition() );
        currentIndex = index;
    }

    function removeStrawman() {
        var p = filters[0].get(currentIndex);
        filters[0].view.objects.remove( p.id, strawmanObject );
    }

    addStrawman(0);

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
        var puzzles = [{id:4, object: new city.Puzzle()}, {id:32, object: new city.Puzzle()}];

        puzzles.forEach( function(p) {
            view.objects.add( p.id, new pitobject.PitObject({color:0x000000}) );
            view.objects.add( p.id, p.object );
        });

        return {
            view:view,
            puzzles:puzzles,
        };
    }

    return {
        filters:filters,
    };
});

