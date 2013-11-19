"use strict";
define([], function() {
    function random(max) {
        return Math.floor( Math.random()*max );
    }

    return {
        random:random
    };
});
