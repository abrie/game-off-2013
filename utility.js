"use strict";
define([], function() {
    function random(max) {
        return Math.floor( Math.random()*max );
    }

    function randomElement( array ) {
        return array[ random(array.length-1) ];
    }

    function randomZero(max) {
        return Math.floor( Math.random()*max-max/2 );
    }

    function noteToFrequency( noteNumber ) {
        return Math.pow(2, ( noteNumber - 69 ) / 12) * 440;
    }

    function rotateArray(array,n) {
        var result = array.slice();
        result.unshift.apply( result, result.splice( -n, result.length ) );
        return result;
    }

    //http://stackoverflow.com/a/12646864
    function shuffleArray(arr) {
        var array = arr.slice();
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    return {
        random: random,
        randomZero: randomZero,
        randomElement: randomElement,
        noteToFrequency: noteToFrequency,
        shuffleArray: shuffleArray,
        rotateArray: rotateArray
    };
});
