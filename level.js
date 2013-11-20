"use strict";
define(['filtermode','strawman','assets','puzzle','utility','inventory', 'settings'], function( filtermode, strawman, assets, puzzle, utility, inventory, settings ) {
    function Level() {
        var produced  = new inventory.Inventory();

        var sourceIndex = 0;
        var sources = [ new Source("clip1"), new Source("clip2") ];
        function currentSource() {
            return sources[sourceIndex];
        }

        function Source(clipName) {
            var clip = assets.get(clipName);
            var filterIndex = 0;
            var filters = [ new filtermode.Filter( puzzle.Hammer ), new filtermode.Filter( puzzle.City ) ];
            filters.forEach( function(filter) {
                filter.onSwap = onInteraction; 
                filter.onProductProduced = produced.add;
            });

            function update() {
                filters.forEach( function(filter) { 
                    filter.update(); 
                });
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

            function getClip() {
                return clip;
            }

            function getRandom() {
                var filter = filters[ utility.random(2) ];
                var thing = filter.getRandomThing();
                return {
                    filter:filter,
                    thing:thing,
                };
            }

            return {
                previousFilter:previousFilter,
                nextFilter:nextFilter,
                currentFilter:currentFilter,
                getClip:getClip,
                getRandom:getRandom,
                update:update,
            };
        }

        var sm = new strawman.Strawman();

        function onInteraction(f, o) {
            if( sm.shouldDisplace( f, o ) ) {
                withdrawStrawman();
            }
            else {
                spinStrawman();
            }
        }

        var updateCount = 0; 
        function update() {
            if( updateCount++ % settings.bumpFrequency === 0 ) {
                bumpStrawman();
            }
            else if( updateCount % settings.spinFrequency === 0 ) {
                spinStrawman();
            }

            sources.forEach( function(source) { 
                source.update(); 
            });
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

            var randomSource = sources[ utility.random(sources.length)];
            var randomFilterThing;
            do {
                randomFilterThing = randomSource.getRandom();
            } while( randomFilterThing.filter === sm.filter && randomFilterThing.thing === sm.thing );

            randomFilterThing.thing.object.bump();
            addStrawman( randomFilterThing.filter, randomFilterThing.thing, randomFilterThing.thing.object.getHolePosition() );
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
            return currentSource().previousFilter();
        }

        function nextFilter() {
            return currentSource().nextFilter();
        }

        function currentFilter() {
            return currentSource().currentFilter();
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
