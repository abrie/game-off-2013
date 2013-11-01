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

    return {
        log:log,
    }
}

var puzzle = new Puzzle(3);
puzzle.log();
