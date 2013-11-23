"use strict";
define([], function() {
    function random(max) {
        return Math.floor( Math.random()*max );
    }

    function randomZero(max) {
        return Math.floor( Math.random()*max-max/2 );
    }

    function noteToFrequency( noteNumber ) {
        return Math.pow(2, ( noteNumber - 69 ) / 12) * 440;
    }

    return {
        random: random,
        randomZero: randomZero,
        noteToFrequency: noteToFrequency,
    };
});
