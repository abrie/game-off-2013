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

        places.forEach( add );

        function nextCoordinate( coordinate ) {
            var index = chain.indexOf( coordinate );
            index++;
            if( index >= chain.length ) {
                index = 0;
            }
            return chain[index];
        }

        function add( place ) {
            place.filters.forEach( function(filter) {
                filter.puzzles.forEach( function(puzzle) {
                    var coordinate = new Coordinate( place, filter, puzzle );
                    puzzle.coordinate = coordinate;
                    chain.push( coordinate );
                });
            });
        }

        function randomCoordinate() {
            return utility.randomElement( chain );
        }

        function getCoordinate( index ) {
            return chain[index];
        }

        function isPresent( check, avoidCoordinates ) {
            return avoidCoordinates.some( function(coordinate) {
                return coordinate === check;
            });
        } 

        return {
            add: add,
            getCoordinate: getCoordinate,
            nextCoordinate: nextCoordinate,
            randomCoordinate: randomCoordinate,
        };
    }

    return {
        Graph: Graph,
        Coordinate: Coordinate,
    };
});
