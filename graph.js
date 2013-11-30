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
        var chain = [];

        places.forEach( function( place ) {
            place.filters.forEach( function(filter) {
                filter.puzzles.forEach( function(puzzle) {
                    var coordinate = new Coordinate( place, filter, puzzle );
                    puzzle.coordinate = coordinate;
                    chain.push( coordinate );
                });
            });
        });

        function deltaCoordinate( coordinate, delta ) {
            var index = chain.indexOf( coordinate );
            var rotated = utility.rotateArray( chain, index );
            return utility.rotateArray( rotated, delta )[0];
        }

        function nextCoordinate( coordinate ) {
            return deltaCoordinate( coordinate, 1);
        }

        function randomCoordinate() {
            return utility.randomElement( chain );
        }

        function isPresent( check, avoidCoordinates ) {
            return avoidCoordinates.some( function(coordinate) {
                return coordinate === check;
            });
        } 

        function differentCoordinate( avoidCoordinates ) {
            var result = utility.randomElement( chain );
            while( isPresent( result, avoidCoordinates ) ) { 
                result = utility.randomElement( chain );
            } 
            
            return result;
        }

        return {
            nextCoordinate: nextCoordinate,
            differentCoordinate: differentCoordinate,
            randomCoordinate: randomCoordinate,
        };
    }

    return {
        Graph: Graph,
        Coordinate: Coordinate,
    };
});
