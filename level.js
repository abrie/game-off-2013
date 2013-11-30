"use strict";
define(['strawman', 'puzzle', 'place', 'product', 'graph', 'settings' ], 
       function( Strawman, Puzzle, Place, Product, Graph, settings ) {

    function Level( onPlaceChanged, onFailure, onWin, inventory ) {
        var filterIndex = 0;
        var filterMax = 0;
        var filterA = { 
            id:0,
            puzzles:[
                { id:4, generator: Puzzle.Hammer }, 
                { id:32, generator: Puzzle.Hammer }
            ],
        };

        var filterB = { 
            id:0,
            puzzles:[
                { id:32, generator: Puzzle.Hammer }, 
            ],
        };

        var nextToAdd = 2;
        var allPlaces = [ 
            new Place.Place( "clip1", [ filterB ], onTransport, onInteraction ), 
            new Place.Place( "clip2", [ filterA ], onTransport, onInteraction ),
            new Place.Place( "clip3", [ filterA ], onTransport, onInteraction ),
            new Place.Place( "clip4", [ filterA ], onTransport, onInteraction ),
            new Place.Place( "clip5", [ filterA ], onTransport, onInteraction ),
            new Place.Place( "clip6", [ filterA ], onTransport, onInteraction ),
        ];

        var placeIndex = 0;
        var places = [ allPlaces[0], allPlaces[1] ]; 

        var jumpsRequired = 1;

        inventory.clear();
        inventory.add("music"); 
        inventory.add("probe"); 
        inventory.select("music");

        var graph = new Graph.Graph( places );

        var strawman = new Strawman.Strawman();
        strawman.bump( graph.getCoordinate(0) );

        function onInteraction( coordinate ) {
            if( strawman.getCurrentCoordinate() === coordinate ) {
                strawman.bump( graph.nextCoordinate(coordinate));
            }
        }

        inventory.addItemChangedListener( onInventoryItemChanged );
        function onInventoryItemChanged() {
            probeProduct.withdraw( function() {
                console.log("probe withdrawn due to inventory switch");
            });
        }

        var transferProduct = new Product.Product();
        var probeProduct = new Product.Probe();

        function onJumpPathBlocked() {
            transferProduct.splat( function() {
                onFailure();
                transferProduct.remove();
            });
        }

        function onJumpCountChanged( amount ) {
            if( amount === jumpsRequired ) {
                var productCoordinate = transferProduct.getCurrentCoordinate();
                var strawmanCoordinate = strawman.getCurrentCoordinate();
                if( productCoordinate.place === strawmanCoordinate.place ) {
                    transferProduct.detonate( function() {
                        onWin();
                        var newPlace = allPlaces[nextToAdd++];
                        places.push( newPlace );
                        graph.add( newPlace );
                        transferProduct.remove();
                        strawman.bump( graph.randomCoordinate() );
                        jumpsRequired++;
                    });
                }
                else {
                    transferProduct.fizzle( function() {
                        onFailure();
                        transferProduct.remove();
                    });
                }
            }
            else {
                transferProduct.transfer( graph, setPlace, onJumpCountChanged, onJumpPathBlocked );
            }
        }

        function onTransport( coordinate ) {
            if( inventory.getCurrentItem().name === "music" ) {
                transferProduct.setCoordinate( coordinate, graph, function() { 
                    transferProduct.transfer( graph, setPlace, onJumpCountChanged, onJumpPathBlocked ); 
                });
            }
            else if( inventory.getCurrentItem().name === "probe" ) {
                probeProduct.setCoordinate( coordinate, graph, function() {
                    console.log("probing...");
                });
            }
        }

        function setPlace() {
            placeIndex = places.indexOf( transferProduct.getCurrentCoordinate().place ); 
            onPlaceChanged();
        }
        
        var updateCount = 0; 
        function update() {
            if( ++updateCount % settings.spinFrequency === 0 ) {
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

            onPlaceChanged();
        }

        function nextPlace() {
            if(++placeIndex>=places.length) {
                placeIndex = 0;
            }

            onPlaceChanged();
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
