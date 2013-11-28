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

        chain = utility.shuffleArray( chain );

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

        function isPresent( check, avoidCoordinates ) {
            return avoidCoordinates.some( function(coordinate) {
                return coordinate === check;
            });
        } 

        function differentCoordinate( avoidCoordinates  ) {
            var result = utility.randomElement( allChain );
            while( isPresent( result, avoidCoordinates ) ) { 
                result = utility.randomElement( allChain );
            } 
            
            return result;
        }

        return {
            nextCoordinate: nextCoordinate,
            differentCoordinate: differentCoordinate,
        };
    }

    return {
        Graph: Graph,
        Coordinate: Coordinate,
    };
});
