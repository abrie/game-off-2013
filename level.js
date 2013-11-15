"use strict";
define(['filtermode','strawman'], function( filtermode, strawman ) {
    var filters = [ new filtermode.Filter(), new filtermode.Filter() ];

    function random(max) {
        return Math.floor( Math.random()*max );
    }

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

    function spinStrawman() {
        sm.object.spin().start();
    }

    function moveStrawman() {
        sm.object.withdraw().onComplete( function() {
            removeStrawman();
            var filter = filters[ random(2) ];
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

    return {
        filters:filters,
    };
});
