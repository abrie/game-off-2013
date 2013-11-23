"use strict";
define([], function() {

    var context, destination, mainOutput, getFrequency = undefined;
    var samples = {};

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

    function loadUrlArrayBuffer(url, id) {
        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.responseType = "arraybuffer";

        request.onload = function( e ) {
            decodeArrayBuffer( e.target.response, id );
        }

        request.onerror = function() {
            alert('BufferLoader: XHR error');
        }

        request.send();
    }

    function decodeArrayBuffer( arrayBuffer, id ) {

        function onSuccess( data ) {
            onSampleLoaded( data, id );
        }

        function onError( error ) {
            console.log("decodeArrayBuffer error:", error );
        }

        context.decodeAudioData(
            arrayBuffer,
            onSuccess,
            onError
        );
    }

    function loadSample( name, id ) {
        loadUrlArrayBuffer( name, id );
    }

    function onSampleLoaded( data, id ) {
        samples[id] = data;
    }

    function play( params ) {
        var at = context.currentTime + params.at;
        var source = context.createBufferSource();
        var envelope = context.createGainNode();
        envelope.gain.setValueAtTime( params.velocity, at );
        envelope.connect( mainOutput );
        source.buffer = samples[ params.note ];
        source.connect( envelope );
        source.start( at );
    }

    return {
        play: play,
        setGain: setGain,
        initialize:initialize,
        loadSample: loadSample,
    }
});
