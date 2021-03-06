"use strict";

define([],function() {
    function PuzzleLogic( arr ) {
        var dim = Math.sqrt( arr.length );
        if( dim % 1 !== 0 ) {
            console.log("warning: puzzle data array is not square.");
        }

        function hole() {
            return arr.indexOf( false );
        }

        function randomAdjacentToHole() {
            var adjacents = getAdjacentIndicies( hole() );
            var random = Math.floor( Math.random() * adjacents.length );
            return adjacents[ random ];
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

        function scramble( depth ) {
            var previousHole = hole();
            for(var index = 0; index < depth; index++) {
                var adjacents = getAdjacentIndicies( hole() );
                var adjacent;
                do {
                    adjacent = adjacents[Math.floor( Math.random()*adjacents.length )];
                } while( adjacent === previousHole );

                previousHole = hole();
                swapIndicies( adjacent, hole() );
            }
        }

        function swapIndicies( i, j ) {
            var sw = arr[i];
            arr[i] = arr[j];
            arr[j] = sw;

            if( arr[i].setIndex ) {
                arr[i].setIndex(i);
            }
            if( arr[j].setIndex ) {
                arr[j].setIndex(j);
            }

            if( onSwap ) {
                onSwap();
            }
        }

        function isHoleAdjacent( center ) {
            return getAdjacentIndicies(center).indexOf( hole() ) >= 0;
        }

        function isSolved() {
            return arr.every( function(piece) {
                return piece ? piece.isSolved() : true;
            });
        }

        function doAction( center ) {
            if( isHoleAdjacent( center ) ) {
                swapIndicies( center, hole() );
            }
        }

        function get() {
            return arr.map( function(i, index) {
                return index === hole() ? false : i;
            });
        }

        var onSwap;
        function setOnSwap( callback ) {
            onSwap = callback;
        }

        return {
            get:get,
            hole:hole,
            randomAdjacentToHole:randomAdjacentToHole,
            doAction:doAction,
            isSolved:isSolved,
            setOnSwap:setOnSwap,
            scramble:scramble,
        };
    }

    return {
        PuzzleLogic:PuzzleLogic
    };
});
