"use strict";
define(['strawman', 'puzzle', 'place', 'graph', 'utility', 'settings' ], function( Strawman, Puzzle, Place, Graph, utility, settings ) {

    function TransferProduct() {
        var currentCoordinate;
        var energy = 0;

        function detonate( ) {
            currentCoordinate.filter.transfer.animator.detonate( 500 );
        }

        function transfer( coordinate, graph ) {
            if( currentCoordinate ) {
                if( currentCoordinate != coordinate ) {
                    console.log("cannot transfer. transferProduct is not here.");
                    return;
                }
                var nextCoordinate = graph.nextCoordinate( coordinate );
                if( nextCoordinate.puzzle.object.isSolved() ) {
                    coordinate.filter.transfer.animator.deactivate( 500, function() {
                        coordinate.puzzle.object.removeItem( coordinate.filter.transfer.product );
                        nextCoordinate.puzzle.object.addItem( nextCoordinate.filter.transfer.product );
                        currentCoordinate = nextCoordinate;
                        nextCoordinate.filter.transfer.animator.activate( 500, function() {
                            energy--;
                            console.log("energy now:", energy);
                            if( energy === 0 ) {
                                detonate();
                            }
                        } );
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
                    coordinate.filter.transfer.animator.activate( 500 );
                    energy = 3;
                    console.log("initial energy: ", energy);
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
            new Place.Place( "clip1", [ filterA ], onTransport, onInteraction ), 
            new Place.Place( "clip2", [ filterA ], onTransport, onInteraction ) 
        ];

        var strawman = new Strawman.Strawman();
        strawman.coordinate = new Graph.Coordinate(); 
        var graph = new Graph.Graph( places );

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
