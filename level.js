"use strict";
define(['strawman', 'puzzle', 'place', 'product', 'graph', 'settings' ], 
       function( Strawman, Puzzle, Place, Product, Graph, settings ) {

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
            new Place.Place( "clip2", [ filterA ], onTransport, onInteraction ),
            new Place.Place( "clip3", [ filterA ], onTransport, onInteraction ),
            new Place.Place( "clip4", [ filterA ], onTransport, onInteraction ), 
        ];

        var strawman = new Strawman.Strawman();
        strawman.coordinate = new Graph.Coordinate(); 
        var graph = new Graph.Graph( places );

        function onInteraction( coordinate ) {
            strawman.change( coordinate );
        }

        var transferProduct = new Product.Product();
        transferProduct.setJumpCountCallback( onJumpCountChanged );
        function onJumpCountChanged( amount ) {
            if( amount === 3 ) {
                var productCoordinate = transferProduct.getCurrentCoordinate();
                var strawmanCoordinate = strawman.getCurrentCoordinate();
                if( productCoordinate.place === strawmanCoordinate.place ) {
                    transferProduct.detonate();
                    console.log("win!");
                }
                else {
                    transferProduct.fizzle();
                    console.log("loss.");
                }
            }
            else {
                transferProduct.transfer( graph );
            }
        }

        function onTransport( coordinate ) {
            if( !transferProduct.getCurrentCoordinate() ) {
                transferProduct.setCoordinate( coordinate, graph, function() { console.log("!"); transferProduct.transfer(graph); } );
            }
        }

        var updateCount = 0; 
        function update() {
            if( updateCount++ % settings.bumpFrequency === 0 ) {
                strawman.bump( graph, transferProduct.getCurrentCoordinate() );
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
