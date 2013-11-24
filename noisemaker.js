"use strict";

define(['audio'], function( audio ) {
    function Generator( waveform, burstPattern, fadePattern ) {
        var types = [
            {
                target: 'oscsynth',
                notes: fadePattern,
                type: waveform,
                at: 0,
                velocity: 1.0,
                adsr: {attack:1.5, release:1.0 },
            },

            {
                target: 'oscsynth',
                notes: burstPattern,
                type: waveform,
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
    function Sine() {
        return new Generator("sine", [71-12, 64, 68, 71, 71], [71-12] );
    }

    function Square() {
        return new Generator("square", [71-12], [71-12, 64, 68] );
    }

    function Sawtooth() {
        return new Generator("sawtooth", [71-12, 64, 68, 71, 71], [71-12] );
    }

    return {
        Sine: Sine,
        Square: Square,
        Sawtooth: Sawtooth,
    };
});
