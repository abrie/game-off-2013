"use strict";

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

    function swapIndicies( i, j ) {
        var sw = arr[i];
        arr[i] = arr[j];
        arr[j] = sw;
    }

    function isHoleAdjacent( center ) {
        return getAdjacentIndicies(center).indexOf( hole() ) >= 0;
    }

    return {
        log:log,
        isHoleAdjacent:isHoleAdjacent,
    }
}

var puzzle = new Puzzle(3);
puzzle.log();

var position = 0;
console.log(position, puzzle.isHoleAdjacent(position) );

var position = 3;
console.log(position, puzzle.isHoleAdjacent(position) );
