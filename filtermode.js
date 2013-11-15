"use strict";
define(['arscene', 'puzzle', 'strawman', 'pitobject', 'city'], function(arscene, puzzle, strawman, pitobject,city) {

    var filters = [ new Filter(), new Filter() ];

    function SM() {
        return {
            object:new strawman.Strawman(),
            thing:undefined,
            filter:undefined,
            shouldDisplace: function( f, t ) {
                return f === this.filter && t === this.thing;
            }
        };
    }

    var sm = new SM();

    function onInteraction(f, o) {
        if( sm.shouldDisplace( f, o ) ) {
            moveStrawman();
        }
        else {
            spinStrawman();
        }
    }

    filters.forEach( function(filter) {
        filter.onSwap = onInteraction; 
    });

    function random(max) {
        return Math.floor( Math.random()*max );
    }

    function spinStrawman() {
        sm.object.spin().start();
    }

    function moveStrawman() {
        sm.object.withdraw().onComplete( function() {
            removeStrawman();
            var filter = filters[random(2)];
            addStrawman( filter, filter.getRandomPuzzle() );
        }).chain( sm.object.insert().chain( sm.object.spin() ) ).start(); 
    }

    function addStrawman( filter, thing ) {
        filter.add( thing.id, sm.object );
        sm.object.setPosition( thing.object.getHolePosition() );
        sm.thing = thing;
        sm.filter = filter;
    }

    function removeStrawman() {
        sm.filter.remove( sm.thing.id, sm.object );
    }

    addStrawman( filters[1], filters[1].getRandomPuzzle() );
    moveStrawman();

    function Filter() {
        var view = new arscene.View();
        var puzzles = [{id:4, object: new puzzle.Puzzle()}, {id:32, object: new puzzle.Puzzle()}];

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

