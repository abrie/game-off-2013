"use strict";

define(['audio'], function( audio ) {
    function Sine() {
        var types = [
            {
                target: 'oscsynth',
                notes: [71-12],
                type: "sine",
                at: 0,
                velocity: 1.0,
                adsr: {attack:1.5, release:1.0 },
            },

            {
                target: 'oscsynth',
                notes: [71-12, 64, 68, 71, 71],
                type: "sine",
                at: 0,
                velocity: 1.0,
                adsr: {attack:0.10, release:0.1 },
            }
        ];

        function emit( lensId, type, span ) {
            types[type].lensId = lensId;
            types[type].span = span;
            audio.dispatch( types[type] );
        }

        return {
            emit:emit,
        };
    }

    function Square() {
        var types = [
            {
                target: 'oscsynth',
                notes: [71-12],
                type: "square",
                at: 0,
                velocity: 1.0,
                adsr: {attack:1.0, release:0.2 },
            },

            {
                target: 'oscsynth',
                notes: [71-12, 64, 68],
                type: "square",
                at: 0,
                velocity: 1.0,
                adsr: {attack:0.10, release:0.1 },
            }
        ];

        function emit( lensId, type, span ) {
            types[type].lensId = lensId;
            types[type].span = span;
            audio.dispatch( types[type] );
        }

        return {
            emit:emit,
        };
    }

    function Sawtooth() {
        var types = [
            {
                target: 'oscsynth',
                notes: [71-12],
                type: "sawtooth",
                at: 0,
                velocity: 1.0,
                adsr: {attack:1.5, release:2.0 },
            },

            {
                target: 'oscsynth',
                notes: [71-12, 71-11, 71-10, 71-6, 71-3 ],
                type: "sawtooth",
                at: 0,
                velocity: 1.0,
                adsr: {attack:0.10, release:0.1 },
            }
        ];

        function emit( lensId, type, span ) {
            types[type].lensId = lensId;
            types[type].span = span;
            audio.dispatch( types[type] );
        }

        return {
            emit:emit,
        };
    }

    return {
        Sine: Sine,
        Square: Square,
        Sawtooth: Sawtooth,
    };
});
