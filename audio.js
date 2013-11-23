"use strict";
define([ 'oscsynth', 'sampler', 'utility', 'google' ], 
function( oscsynth, sampler, utility, google ) {

    var context;
    try {
        context = new ( window.AudioContext || window.webkitAudioContext );
    } catch (e) {
        console.log("Failed to create audio context.",e);
    }

    var waveShaper = new google.WaveShaper( context );
    var masterCompressor = context.createDynamicsCompressor();
    var masterGain = context.createGainNode();
    masterGain.gain.value = 1.0;

    var allPass = context.createBiquadFilter();
    allPass.type = "allpass";

    function connect( chain ) {
        chain.forEach( function(node, index) {
            if( index < chain.length-1 ) {
                var nextNode = chain[index+1];
                var nextNodeInput = nextNode.input ? nextNode.input : nextNode;
                var thisOutput = node.output ? node.output : node;
                thisOutput.connect( nextNodeInput );
             }
        });

        return chain;
    }

    var chain = connect([
        masterGain,
        waveShaper,
        allPass,
        masterCompressor,
        context.destination
    ]);

    oscsynth.initialize( context, chain[0], utility.noteToFrequency );  
    sampler.initialize( context, chain[0], utility.noteToFrequency );

    function dispatch( event ) {
        event.notes.forEach( function( note, index ) {
            event.at = index * 0.15;
            event.note = note;
            switch( event.target ) {
                case 'oscsynth': oscsynth.play( event ); break;
                case 'sampler': sampler.play( event ); break;
            }
        });
    }

	return {
        dispatch: dispatch,
        setOscSynthGain: function(value) { oscsynth.setGain(value); },
        setSamplerGain: function(value) { sampler.setGain(value); },
        setWaveShaperDrive: function(value) { waveShaper.setDrive(value); },
        loadSample: sampler.loadSample,
	};
});
