"use strict";
define(['filtermode','strawman','assets','puzzle'], function( filtermode, strawman, assets, puzzle ) {
    function Level() {
        var filterIndex = 0;
        var filters = [ new filtermode.Filter( puzzle.Hammer ), new filtermode.Filter( puzzle.City ) ];

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
                spinTween:undefined,
                moveTween:undefined,
                withdrawn:true,
                shouldDisplace: function( f, t ) {
                    return f === this.filter && t === this.thing;
                }
            };
        }

        var sm = new SM();

        function onInteraction(f, o) {
            if( sm.shouldDisplace( f, o )  ) {
                withdrawStrawman();
            }
            else {
                spinStrawman();
            }
        }

        filters.forEach( function(filter) {
            filter.onSwap = onInteraction; 
        });

        var updateCount = 0; 
        var spinFrequency = 100;
        var bumpFrequency = 30; 
        function update() {
            if( updateCount++ % bumpFrequency === 0 ) {
                bumpStrawman();
            }
            else if( updateCount % spinFrequency === 0 ) {
                spinStrawman();
            }
        }

        function spinStrawman() {
            sm.spinTween = sm.object.spin();
            sm.spinTween.start();
        }

        function withdrawStrawman() {
            if( sm.spinTween ) {
                sm.spinTween.stop();
            }
            sm.moveTween = sm.object.withdraw();
            sm.moveTween.onComplete( function() {
                removeStrawman();
                sm.withdrawn = true;
            }); 
            sm.moveTween.start();
        }

        function bumpStrawman() {
            if( !sm.withdrawn ) {
                return;
            }

            var filter, thing;
            do {
                filter = filters[ random(2) ];
                thing = filter.getRandomThing();
            } while( filter === sm.filter && thing === sm.thing );

            thing.object.bump();
            addStrawman( filter, thing, thing.object.getHolePosition() );
            sm.moveTween = sm.object.insert();
            sm.moveTween.onComplete = function() { sm.moveTween = false; };
            sm.withdrawn = false;
            sm.moveTween.start();
        }

        function addStrawman( filter, thing, position ) {
            filter.add( thing.id, sm.object );
            sm.object.setPosition( position );
            sm.thing = thing;
            sm.filter = filter;
        }

        function removeStrawman() {
            sm.filter.remove( sm.thing.id, sm.object );
        }

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
