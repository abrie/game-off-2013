"use strict";

define(['audio'], function( audio ) {
    function Generator( waveform, burstPattern, fadePattern, velocity ) {
        var types = [
            {
                target: 'oscsynth',
                notes: fadePattern,
                type: waveform,
                at: 0,
                velocity: velocity,
                adsr: {attack:1, release:0.25 },
            },

            {
                target: 'oscsynth',
                notes: burstPattern,
                type: waveform,
                at: 0,
                velocity: velocity,
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

    function triad( base,x,y ) {
        var intervals = [2,2,1,2,2,2,1];
        function add(a,b) { return a+b; }
        function get(degree) { return intervals.slice(0, degree).reduce( add, 0 ); }
        return [ get(0)+base, get(x)+base, get(y)+base ];
    }

    function Sine() {
        return new Generator("sine", triad(64,2,3), [64-12*2], 0.25 );
    }

    function Square() {
        return new Generator("square", triad(64,3,2), [64-12*2], 0.25 );
    }

    function Sawtooth() {
        return new Generator("sawtooth", triad(64-12,1,3), [64-12*2], 0.15 );
    }

    return {
        Sine: Sine,
        Square: Square,
        Sawtooth: Sawtooth,
    };
});
