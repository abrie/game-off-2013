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

        function forwardCoordinate( coordinate ) {
            var index = chain.indexOf( coordinate );
            index++;
            if( index >= chain.length ) {
                index = 0;
            }
            return chain[index];
        }

        function nextCoordinate( coordinate ) {
            var result = forwardCoordinate( coordinate );
            while( result.puzzle === undefined ) {
                result = forwardCoordinate( result );
            }
            return result;
        }

        function add( place ) {
            place.filters.forEach( function(filter) {
                if( filter.puzzles.length === 0) {
                    var coordinate = new Coordinate( place, filter, undefined);
                    chain.push( coordinate );
                    console.log(coordinate);
                }
                else {
                    filter.puzzles.forEach( function(puzzle) {
                        var coordinate = new Coordinate( place, filter, puzzle );
                        puzzle.coordinate = coordinate;
                        chain.push( coordinate );
                    });
                }
            });
        }

        function randomCoordinate() {
            var coordinate = utility.randomElement( chain );
            while( coordinate.puzzle === undefined ) {
                coordinate = utility.randomElement( chain );
            }
            return coordinate;
        }

        function getCoordinate( index ) {
            return chain[index];
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
