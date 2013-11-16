"use strict";
define(['filtermode','strawman','assets','puzzle','city'], function( filtermode, strawman, assets, puzzle, city ) {
    function Level() {
        var filterIndex = 0;
        var filters = [ new filtermode.Filter( puzzle.Puzzle ), new filtermode.Filter( city.Puzzle ) ];

        var sourceIndex = 0;
        var sources = [ assets.get("clip1"), assets.get("clip2") ];

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

        var updateCount = 0; 
        var triggerFrequency = 30;
        function update() {
            if( updateCount++ % triggerFrequency === 0 )
                sm.object.spin().start();
        }

        function spinStrawman() {
            sm.object.spin().start();
        }

        function moveStrawman() {
            sm.object.withdraw().onComplete( function() {
                removeStrawman();
                var filter = filters[ random(2) ];
                addStrawman( filter, filter.getRandomPuzzle() );
                var insertTween = sm.object.insert().chain( sm.object.spin() );
                insertTween.start();
            }).start(); 
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

        function previousFilter() {
            if( --filterIndex < 0 ) {
                filterIndex = filters.length-1;
            }

            return filters[filterIndex];
        }

        function nextFilter() {
            if( ++filterIndex >= filters.length ) {
                filterIndex = 0;
            }

            return filters[filterIndex];
        }

        function currentFilter() {
            return filters[filterIndex];
        }

        function previousSource() {
            if(--sourceIndex<0) {
                sourceIndex = sources.length-1;
            }

            return sources[sourceIndex]; 
        }

        function nextSource() {
            if(++sourceIndex>=sources.length) {
                sourceIndex = 0;
            }

            return sources[sourceIndex]; 
        }

        function currentSource() {
            return sources[sourceIndex];
        }

        return {
            update:update,
            currentFilter:currentFilter,
            previousFilter:previousFilter,
            nextFilter:nextFilter,
            currentSource:currentSource,
            nextSource:nextSource,
            previousSource:previousSource,
        };
    }

    return {
        Level:Level
    };
});
