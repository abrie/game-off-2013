"use strict";
define([], function() {

    var context, destination, mainOutput, getFrequency = undefined;
    function initialize( ctx, dst, ff ) {
        context = ctx;
        destination = dst;
        getFrequency = ff;
        mainOutput = context.createGainNode();
        mainOutput.connect( destination );
    }

    function setGain(value) {
        mainOutput.gain.value = value;
    }

    var Voice = function( params, detune, gain ) {
        var voiceOutput = context.createGainNode();
        voiceOutput.connect( mainOutput );

        var envelope = context.createGainNode();
        envelope.connect( voiceOutput );

        var oscillator = context.createOscillator();
        oscillator.connect( envelope );

        function play() {
            var start = context.currentTime + params.at;
            envelope.gain.setValueAtTime( 0.0, start );
            envelope.gain.linearRampToValueAtTime( params.velocity, start + params.adsr.attack);
            envelope.gain.setTargetValueAtTime( 0.0, start+params.adsr.attack+0.0001, params.adsr.release);

            oscillator.type = params.type;
            oscillator.detune.value = detune;
            oscillator.frequency.value = getFrequency( params.note );
            oscillator.start( start );
            oscillator.stop( start + params.duration );

            voiceOutput.gain.value = gain;
        }

        return {
            play: play,
        };
    };
    
    function play( params ) {
        var v = new Voice( params, Math.random()*0.25, 0.5 );
        v.play();
    }

    return {
        initialize: initialize,
        play: play,
        setGain: setGain,
    };
});
