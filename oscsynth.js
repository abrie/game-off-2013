"use strict";
define([], function() {

    var context, destination, destinationB, mainOutput, secondaryOutput, getFrequency = undefined;
    function initialize( ctx, dst, dstB, ff ) {
        context = ctx;
        destination = dst;
        destinationB = dstB;
        getFrequency = ff;
        mainOutput = context.createGainNode();
        mainOutput.connect( destination );
        secondaryOutput = context.createGainNode();
        secondaryOutput.connect( destinationB );
    }

    function setGain(value) {
        mainOutput.gain.value = value;
    }

    var Voice = function( params, detune, gain, output ) {
        var voiceOutput = context.createGainNode();
        voiceOutput.connect( output );

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
            oscillator.stop( start + params.duration*1.5 );

            voiceOutput.gain.value = gain;
        }

        return {
            play: play,
        };
    };
    
    function play( params ) {
        var v = new Voice( params, Math.random()*0.25, 0.5, params.dull ? secondaryOutput : mainOutput );
        v.play();
    }

    return {
        initialize: initialize,
        play: play,
        setGain: setGain,
    };
});
