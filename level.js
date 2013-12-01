"use strict";
define(['audio', 'strawman', 'puzzle', 'place', 'product', 'graph','utility', 'settings' ], 
       function( audio, Strawman, Puzzle, Place, Product, Graph, utility, settings ) {

    function Level( onPlaceChanged, onFailure, onWin, onGameComplete, inventory, hud ) {
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

        var filterC = { 
            id:0,
            puzzles:[
                { id:4, generator: Puzzle.Hammer }, 
                { id:32, generator: Puzzle.Hammer },
                { id:16, generator: Puzzle.Hammer }
            ],
        };

        var nextToAdd = 2;
        var allPlaces = [ 
            new Place.Place( "message1", [ filterB ], onTransport, onInteraction, true ), 
            new Place.Place( "message2", [ filterA ], onTransport, onInteraction, true ), 
            new Place.Place( "clip2", [ filterA ], onTransport, onInteraction, true ),
            new Place.Place( "clip3", [ filterA ], onTransport, onInteraction, true ),
            new Place.Place( "clip3b", [ filterB ], onTransport, onInteraction, true ),
            new Place.Place( "clip7", [ filterC ], onTransport, onInteraction, true ), 
            new Place.Place( "clip4", [ filterA ], onTransport, onInteraction, true ),
            new Place.Place( "clip6", [ filterA ], onTransport, onInteraction, true ),
        ];

        var placeIndex = 0;
        var places = [ allPlaces[0], allPlaces[1] ]; 

        var jumpLevel = 1;
        var jumpsRequired = jumpLevel;

        inventory.clear();
        inventory.add("music"); 
        inventory.add("probe"); 
        inventory.select("music");

        var graph = new Graph.Graph( places );

        var strawman = new Strawman.Strawman();
        strawman.bump( graph.getCoordinate(2) );
        hud.setJumpNumber( jumpsRequired );

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

        function resetJumps() {
            jumpsRequired = jumpLevel;
            hud.setJumpNumber( jumpsRequired );
        }

        function increaseJumps() {
            jumpLevel++;
            resetJumps();
        }

        var ignoreJumpCount = false;
        function onJumpPathBlocked() {
            ignoreJumpCount = true;
            audio.dispatch( sound2_blocked );
            transferProduct.splat( function() {
                onFailure("BLOCKED");
                transferProduct.remove();
                resetJumps();
            });
        }

        var sound1 = {
            notes: [69, 72, 76, 57], 
            span: 500,
            delay: 0,
            target: "oscsynth",
            type: "sine",
            velocity: 1,
            adsr: {attack:0.05, release:0.05},
            lensId: 0,
        };

        var sound2_blocked = {
            notes:[30],
            span: 1000,
            delay: 450,
            target: "oscsynth",
            type: "sawtooth",
            velocity: 1,
            adsr: {attack:0.5, release:0.15},
            lensId: 0,
        };

        var sound3_burst = {
            notes:[77, 81, 84, 65, 69],
            span: 900,
            delay: 0,
            target: "oscsynth",
            type: "square",
            velocity: 1,
            adsr: {attack:0.05, release:0.05},
            lensId: 0,
        };

        var sound3_down = {
            notes:[50, 53, 69],
            span: 900,
            delay: 0,
            target: "oscsynth",
            type: "sine",
            velocity: 1,
            adsr: {attack:0.05, release:0.05},
            lensId: 0,
        };

        var sound4_layer1 = {
            notes:[72, 84, 69, 65, 62],
            span: 600,
            delay: 1000,
            target: "oscsynth",
            type: "sine",
            velocity: 1,
            adsr: {attack:0.05, release:0.05},
            lensId: 0,
        };

        var sound4_layer2 = {
            notes:[57, 53, 50, 60, 72],
            span: 900,
            delay: 1000,
            target: "oscsynth",
            type: "sine",
            velocity: 1,
            adsr: {attack:0.05, release:0.12},
            lensId: 0,
        };

        var sound5 = {
            notes:[64],
            span: 500,
            delay: 1000,
            target: "oscsynth",
            type: "sine",
            velocity: 1,
            adsr: {attack:0.10, release:0.5},
            lensId: 0,
        };

            
        function onJumpCountChanged() {
            if( !ignoreJumpCount ) {
                jumpsRequired--;
            }
            hud.setJumpNumber( jumpsRequired );
            if( jumpsRequired === 0 ) {
                var productCoordinate = transferProduct.getCurrentCoordinate();
                var strawmanCoordinate = strawman.getCurrentCoordinate();
                if( productCoordinate.place === strawmanCoordinate.place ) {
                    audio.dispatch(sound3_burst);
                    audio.dispatch(sound4_layer1);
                    audio.dispatch(sound4_layer2);
                    sound4_layer1.notes = utility.rotateArray( sound4_layer1.notes, 1 );
                    sound4_layer2.notes = utility.rotateArray( sound4_layer2.notes, 2 );
                    transferProduct.detonate( function() {
                        onWin();
                        var newPlace = allPlaces[nextToAdd++];
                        if( !newPlace ) {
                            gameOver = true;
                            onGameComplete();
                            return;
                        }
                        places.push( newPlace );
                        graph.add( newPlace );
                        transferProduct.remove();
                        strawman.bump( graph.nextCoordinate( strawman.getCurrentCoordinate() ) );
                        increaseJumps();
                    });
                }
                else {
                    audio.dispatch(sound3_down);
                    audio.dispatch(sound5);
                    transferProduct.fizzle( function() {
                        onFailure("OUT OF JUMPS");
                        transferProduct.remove();
                        resetJumps();
                    });
                }
            }
            else {
                transferProduct.transfer( graph, setPlace, onJumpCountChanged, onJumpPathBlocked );
            }
        }

        var gameOver = false;
        function onTransport( coordinate ) {
            if( gameOver ) {
                return;
            }
            ignoreJumpCount = false;
            if( inventory.getCurrentItem().name === "music" ) {
                transferProduct.setCoordinate( coordinate, graph, function() { 
                    transferProduct.transfer( graph, setPlace, onJumpCountChanged, onJumpPathBlocked ); 
                });
            }
            else if( inventory.getCurrentItem().name === "probe" ) {
                probeProduct.setCoordinate( coordinate, graph, function() {
                });
            }
        }

        function setPlace() {
            var newPlaceIndex = places.indexOf( transferProduct.getCurrentCoordinate().place ); 
            audio.dispatch( sound1 );
            sound1.notes = utility.rotateArray( sound1.notes, 1 );
            if( newPlaceIndex != placeIndex ) {
                placeIndex = newPlaceIndex;
                onPlaceChanged();
            }
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
