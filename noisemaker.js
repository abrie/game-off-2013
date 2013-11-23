"use strict";

define(['audio'], function( audio ) {
    function Sine() {
        var sound = {
            target: 'oscsynth',
            notes: [71-12, 64, 68, 71, 71-12],
            type: "sine",
            at: 0,
            velocity: 1.0,
            adsr: {attack:0.10, release:0.1 },
            span: 1.2,
        };

        function emit() {
            audio.dispatch( sound );
        }
        return {
            emit:emit,
        };
    }

    function Square() {
        var sound = {
            target: 'oscsynth',
            notes: [64-12, 71, 68, 71, 64-12],
            type: "square",
            at: 0,
            velocity: 1.0,
            adsr: {attack:0.10, release:0.1 },
            span: 1.2,
        };

        function emit() {
            audio.dispatch( sound );
        }
        return {
            emit:emit,
        };
    }

    function Sawtooth() {
        var sound = {
            target: 'oscsynth',
            notes: [68-12, 64, 71, 68, 64],
            type: "sawtooth",
            at: 0,
            velocity: 1.0,
            adsr: {attack:0.10, release:0.1 },
            span: 1.2,
        };

        function emit() {
            audio.dispatch( sound );
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
