"use strict";
define(['filtermode','strawman','assets','puzzle', 'utility', 'product', 'settings' ], function( filtermode, Strawman, assets, Puzzle, utility, product, settings ) {
    function Place( clipName, filterDescriptors, onTransport, onInteraction ) {
        var video = assets.get( clipName );
        var filters = filterDescriptors.map( function(filterDescriptor) { 
            var filter = new filtermode.Filter( filterDescriptor );
            filter.onSwap = onInteraction; 
            filter.onTransport = onTransport;
            return filter;
        });

        function getVideo() {
            return video;
        }

        function getRandomPuzzle() {
            var filter = utility.randomElement( filters );
            return {
                filter: filter,
                puzzle: filter.getRandomPuzzle(),
            };
        }

        function getFilter( index ) {
            return filters[index];
        }

        var result = {
            filters: filters,
            getFilter: getFilter,
            getRandomPuzzle: getRandomPuzzle,
            getVideo: getVideo,
        };

        return result;
    }

    function Coordinate( place, filter, puzzle ) {
        return {
            place:place, 
            filter:filter, 
            puzzle:puzzle
        };
    }

    function Graph( places ) {
        var allChain = [];
        var chain = [];
        var terminalCoordinate;

        places.forEach( function(place) {
            place.filters.forEach( function(filter) {
                filter.puzzles.forEach( function(puzzle) {
                    var coordinate = new Coordinate( place, filter, puzzle );
                    puzzle.coordinate = coordinate;
                    allChain.push( coordinate );
                    chain.push( coordinate );
                });
            });
        });

        terminalCoordinate = chain.shift();

        function nextCoordinate( coordinate ) {
            var index = chain.indexOf( coordinate );
            var nextIndex;

            if( index < 0 ) {
                return undefined;
            }

            if( index < chain.length-1 ) {
                nextIndex = index+1;
            }
            else {
                nextIndex = 0;
            }

            return chain[nextIndex];
        }

        function differentCoordinate( coordinate ) {
            var result = utility.randomElement( allChain );
            while( result === coordinate ) {
                result = utility.randomElement( allChain );
            }
            return result;
        }

        return {
            nextCoordinate: nextCoordinate,
            terminalCoordinate: terminalCoordinate,
            differentCoordinate: differentCoordinate,
        };
    }

    function TransferProduct() {
        var currentCoordinate;

        function transfer( coordinate, graph ) {
            if( currentCoordinate ) {
                if( currentCoordinate != coordinate ) {
                    console.log("cannot transfer. transferProduct is not here.");
                    return;
                }
                var nextCoordinate = graph.nextCoordinate( coordinate );
                if( nextCoordinate.puzzle.object.isSolved() ) {
                    coordinate.filter.transfer.animator.deactivate( 1500, function() {
                        coordinate.puzzle.object.removeItem( coordinate.filter.transfer.product );
                        nextCoordinate.puzzle.object.addItem( nextCoordinate.filter.transfer.product );
                        currentCoordinate = nextCoordinate;
                        nextCoordinate.filter.transfer.animator.activate( 2000 );
                    });
                }
                else {
                    console.log("cannot transfer. Target is not solved.");
                }
            }
            else {
                if( coordinate.puzzle.object.isSolved() ) {
                    coordinate.puzzle.object.addItem( coordinate.filter.transfer.product );
                    currentCoordinate = coordinate;
                    coordinate.filter.transfer.animator.activate( 3000 );
                }
                else {
                    console.log("cannot transfer. Target is not solved.");
                }
            }
        }

        function getCurrentCoordinate() {
            return currentCoordinate;
        }

        return {
            transfer:transfer,
            getCurrentCoordinate: getCurrentCoordinate,
        };
    }

    function Level() {
        var filterIndex = 0;
        var filterMax = 0;
        var filterA = { 
            id:0,
            puzzles:[
                { id:4, generator: Puzzle.Hammer }, 
                { id:32, generator: Puzzle.Hammer }
            ],
        };

        var placeIndex = 0;
        var places = [ 
            new Place( "clip1", [ filterA ], onTransport, onInteraction ), 
            new Place( "clip2", [ filterA ], onTransport, onInteraction ) 
        ];

        var strawman = new Strawman.Strawman();
        strawman.coordinate = new Coordinate(); 
        var graph = new Graph( places );

        function onInteraction( coordinate ) {
            strawman.change( coordinate );
        }

        var transferProduct = new TransferProduct();

        function onTransport( coordinate ) {
            transferProduct.transfer( coordinate, graph );
        }

        var updateCount = 0; 
        function update() {
            if( updateCount++ % settings.bumpFrequency === 0 ) {
                strawman.bump( graph );
            }
            else if( updateCount % settings.spinFrequency === 0 ) {
                strawman.spin();
            }
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
        };
    }

    return {
        Level:Level
    };
});
