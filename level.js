"use strict";
define(['filtermode','strawman','assets','puzzle','utility','inventory', 'settings'], function( filtermode, strawman, assets, puzzle, utility, inventory, settings ) {
    function Level() {
        var produced  = new inventory.Inventory();

        var placeIndex = 0;
        var places = [ new Place("clip1"), new Place("clip2") ];

        function Place( clipName ) {
            var video = assets.get( clipName );
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

            function getVideo() {
                return video;
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
                getVideo:getVideo,
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

            places.forEach( function(source) { 
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

            var randomPlace = places[ utility.random(places.length)];
            var randomFilterThing;
            do {
                randomFilterThing = randomPlace.getRandom();
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
            return currentPlace().previousFilter();
        }

        function nextFilter() {
            return currentPlace().nextFilter();
        }

        function currentFilter() {
            return currentPlace().currentFilter();
        }

        function previousPlace() {
            if(--placeIndex<0) {
                placeIndex = places.length-1;
            }

            return places[placeIndex]; 
        }

        function nextPlace() {
            if(++placeIndex>=places.length) {
                placeIndex = 0;
            }

            return places[placeIndex]; 
        }

        function currentPlace() {
            return places[placeIndex];
        }

        return {
            update:update,
            currentFilter:currentFilter,
            previousFilter:previousFilter,
            nextFilter:nextFilter,
            currentPlace:currentPlace,
            nextPlace:nextPlace,
            previousPlace:previousPlace,
        };
    }

    return {
        Level:Level
    };
});
