"use strict";
define(['filtermode','strawman','assets','puzzle', 'utility', 'product', 'settings' ], function( filtermode, strawman, assets, puzzle, utility, product, settings ) {
    function Level() {

        var filterA = { 
            puzzles:[
                { id:4, generator: puzzle.Hammer }, 
                { id:32, generator: puzzle.Hammer }
            ],
            id:0,
        };

        var placeIndex = 0;
        var places = [ 
            new Place( "clip1", [ filterA ] ), 
            new Place( "clip2", [ filterA ] ) 
        ];

        var filterIndex = 0;
        var filterMax = 0;

        var chain = [];
        var terminalPuzzle;
        function connect() {
            chain.length = 0;
            places.forEach( function(place) {
                place.filters.forEach( function(filter) {
                    filter.puzzles.forEach( function(puzzle) {
                        chain.push(puzzle);
                    });
                });
            });

            terminalPuzzle = chain.shift();
            console.log("terminal:", terminalPuzzle );
            console.log("chain:", chain );
        }


        /*
        var noiseGenerator = new AudioType();
        animator.onScale = function() {
            noiseGenerator.emit( lensId, 1, 1000 );
        };
        animator.onStart = function() {
            noiseGenerator.emit( lensId, 0, 500 );
        };
       */

        function Place( clipName, filterDescriptors ) {
            var video = assets.get( clipName );
            var filters = filterDescriptors.map( function(filterDescriptor) { 
                var filter = new filtermode.Filter( filterDescriptor );
                filter.onSwap = onInteraction; 
                filter.onTransport = onTransport;
                filter.setOnProductProduced( function() { console.log("produced"); } );
                return filter;
            });

            function getVideo() {
                return video;
            }

            function getRandom() {
                var filter = utility.randomElement( filters );
                return {
                    filter: filter,
                    puzzle: filter.getRandomPuzzle(),
                };
            }

            function getFilter( index ) {
                return filters[index];
            }

            return {
                filters: filters,
                getFilter: getFilter,
                getRandom:getRandom,
                getVideo:getVideo,
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

        var transfer = new product.Music();
        //var animator = new product.Animator();

        //animator.onComplete = function(p) { 
          //  result.onProductProduced(p); 
        //};

        function onTransport( o ) {
            if( transfer.currentlyIn ) {
                transfer.currentlyIn.object.removeItem( transfer );
                var index = chain.indexOf( o ) + 1;
                if( index >= chain.length ) {
                    index = 0;
                }
                chain[index].object.addItem( transfer );
                transfer.currentlyIn = chain[index];
            }
            else {
                o.object.addItem( transfer );
                transfer.currentlyIn = o;
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

            var randomPlace = utility.randomElement( places );
            var randomFilterPuzzle;
            do {
                randomFilterPuzzle = randomPlace.getRandom();
            } while( randomFilterPuzzle.filter === sm.filter && randomFilterPuzzle.puzzle === sm.thing );

            randomFilterPuzzle.puzzle.object.bump();
            addStrawman( randomFilterPuzzle.filter, randomFilterPuzzle.puzzle, randomFilterPuzzle.puzzle.object.getHolePosition() );
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
                filterIndex = filterMax;
            }
            return currentFilter();
        }

        function nextFilter() {
            if( ++filterIndex > filterMax ) {
                filterIndex = 0;
            }
            return currentFilter();
        }

        function currentFilter() {
            return currentPlace().getFilter( filterIndex );
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
            currentFilter:currentFilter,
            previousFilter:previousFilter,
            nextFilter:nextFilter,
            currentPlace:currentPlace,
            nextPlace:nextPlace,
            previousPlace:previousPlace,
            update:update,
            connect:connect,
        };
    }

    return {
        Level:Level
    };
});
