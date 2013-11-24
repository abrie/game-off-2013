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
        var voiceOutput = context.createGainNode();

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

        function isAlive() {
            return oscillator.playbackState !== 3;
        }

        function setOutput( target ) {
            var saveGain = voiceOutput.gain.value;
            voiceOutput.gain.value = 0;
            voiceOutput.disconnect();
            voiceOutput.connect(target);
            voiceOutput.gain.setTargetValueAtTime( saveGain, context.currentTime, 0.5) ;
        }

        return {
            play: play,
            isAlive: isAlive,
            lensId: params.lensId,
            setOutput: setOutput,
        };
    };
    
    var voices = [];
    function play( params ) {
        var v = new Voice( params, Math.random()*0.25, 0.5 );
        if( v.lensId === currentLens ) {
            v.setOutput( mainOutput );
        }
        else {
            v.setOutput( secondaryOutput );
        }
        v.play();
        voices.push(v);
    }

    var currentLens = 0;
    function routeToLens( id ) {
        voices = voices.filter( function(voice) { return voice.isAlive(); } );
        voices.forEach( function(voice) { 
            if( voice.lensId === id) {
                voice.setOutput( mainOutput );
            }
            else {
                voice.setOutput( secondaryOutput );
            }
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
