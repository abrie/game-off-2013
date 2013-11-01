"use strict";

define( [], function() {
    function Puzzle( arr ) {
        var dim = arr.length;

        function hole() {
            return arr.indexOf( false );
        }

        function getAdjacentIndicies( center ) {
            var result = [];

            if( center % dim - 1 >= 0 ) {
                result.push( center - 1 );
            }
            if( center % dim + 1 < dim ) {
                result.push( center + 1 );
            }
            if( center - dim >= 0 ) {
                result.push( center - dim );
            }
            if( center + dim < dim * dim ) {
                result.push( center + dim );
            }
            return result;
        }

        var onIndiciesSwapped = undefined;
        function swapIndicies( i, j ) {
            var sw = arr[i];
            arr[i] = arr[j];
            arr[j] = sw;
            if( onIndiciesSwapped ) {
                onIndiciesSwapped( i, j );
            }
        }

        function isHoleAdjacent( center ) {
            return getAdjacentIndicies(center).indexOf( hole() ) >= 0;
        }

        function doAction( center ) {
            if( isHoleAdjacent( center ) ) {
                swapIndicies( center, hole() );
            }
        }

        function setOnIndiciesSwapped( handler ) {
            onIndiciesSwapped = handler;
        }

        function get() {
            return arr.map( function(i, index) {
                return index === hole() ? false : i;
            });
        }

        return {
            get:get,
            doAction:doAction,
            onIndiciesSwapped:setOnIndiciesSwapped,
        }
    }

    return {
        Puzzle:Puzzle
    }
});
