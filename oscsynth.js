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

    var Voice = function( params, detune, gain ) {
        var frontVoice = context.createGainNode();
        frontVoice.connect( mainOutput );

        var backVoice = context.createGainNode();
        backVoice.connect( secondaryOutput );

        var envelope = context.createGainNode();
        envelope.connect( frontVoice );
        envelope.connect( backVoice );

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
            oscillator.stop( start + params.duration*5 );
        }

        function isAlive() {
            return oscillator.playbackState !== 3;
        }

        function reRoute( front ) {
            if( front ) {
                backVoice.gain.setTargetValueAtTime(0, context.currentTime, 0.05 );
                frontVoice.gain.setTargetValueAtTime(1, context.currentTime, 1 );
            }
            else {
                backVoice.gain.setTargetValueAtTime(1, context.currentTime, 1 );
                frontVoice.gain.setTargetValueAtTime(0, context.currentTime, 0.05 );
            }
        }

        return {
            play: play,
            isAlive: isAlive,
            lensId: params.lensId,
            reRoute: reRoute,
        };
    };
    
    var voices = [];
    function play( params ) {
        var v = new Voice( params, Math.random()*0.25, 0.5 );
        v.reRoute( v.lensId === currentLens );
        v.play();
        voices.push(v);
    }

    var currentLens = 0;
    function routeToLens( id ) {
        voices = voices.filter( function(voice) { return voice.isAlive(); } );
        voices.forEach( function(voice) { 
            voice.reRoute( voice.lensId === id );
        });
        currentLens = id;
    }

    return {
        initialize: initialize,
        play: play,
        setGain: setGain,
        routeToLens: routeToLens,
    };
});
