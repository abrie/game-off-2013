"use strict";

define( [], function() {
    function Puzzle( dim ) {
        var arr = [];
        for( var i = 0; i < dim*dim; i++ ) {
            arr.push( i );
        }

        var holeValue = 4
            function hole() {
                return arr.indexOf( holeValue );
            }

        function log() {
            function char( v ) {
                return v === holeValue ? '.' : '' + v;
            }

            for( var y = 0; y < dim*dim; y+=dim ) {
                console.log(
                    char( arr[y] ),
                    char( arr[y+1] ),
                    char( arr[y+2] )
                );
            }
        }

        function getAdjacentIndicies( center ) {
            var result = [];

            if( center % dim - 1 > 0 ) {
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

        return {
            log:log,
            doAction:doAction,
            onIndiciesSwapped:setOnIndiciesSwapped,
        }
    }

    return {
        Puzzle:Puzzle
    }
});
