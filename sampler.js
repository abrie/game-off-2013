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

    function play( params ) {
        var at = context.currentTime + params.at;
        var source = context.createBufferSource();
        var envelope = context.createGainNode();
        envelope.gain.setValueAtTime( params.velocity, at );
        envelope.connect( mainOutput );
        source.buffer = params.buffer;
        source.connect( envelope );
        source.start( at );
    }

    return {
        play: play,
        setGain: setGain,
        initialize:initialize,
    };
});
