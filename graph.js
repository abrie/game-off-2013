"use strict";
define(['utility'], function( utility ) {

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

        places.forEach( function( place ) {
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

    return {
        Graph: Graph,
        Coordinate: Coordinate,
    };
});