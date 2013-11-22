"use strict";
define([], function() {
    function random(max) {
        return Math.floor( Math.random()*max );
    }
    function randomZero(max) {
        return Math.floor( Math.random()*max-max/2 );
    }

    return {
        random: random,
        randomZero: randomZero
    };
});
