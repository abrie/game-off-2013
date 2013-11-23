"use strict";

define(['audio'], function( audio ) {
    function Generic() {
        var sound = {
            target: 'oscsynth',
            notes: [71-12, 64, 68, 71, 71-12],
            type: "sine",
            at: 0,
            velocity: 1.0,
            adsr: {attack:0.10, release:0.05 },
            span: 250/1000,
        };

        function emit() {
            audio.dispatch( sound );
        }
        return {
            emit:emit,
        };
    }

    return {
        Generic: Generic,
    };
});
