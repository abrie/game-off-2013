"use strict";

define([],function() {
    var loaded = false;
    var video = document.createElement('video');
    video.width = 480;
    video.height = 360;
    video.autoplay = false;
    video.loop = true;
    video.preload = "auto";
    video.setAttribute("src","clip1.webm");
    video.addEventListener('loadeddata', function() {
        loaded = true;
        console.log("loadeddata!");
        if( loadCallback ) {
            loadCallback();
        }
    }, false);

    video.load();

    var frameRate = 29.970628;

    function getCurrentFrame() {
        return Math.floor(video.currentTime.toFixed(5) * frameRate);
    }

    function seek(frames) {
        var direction = "forward";
        var frame = getCurrentFrame();
        video.currentTime = ((((direction === 'backward' ? (frame - frames) : (frame + frames))) / frameRate) + 0.00001);
    }

    var getDimensions = function() {
        return {
            width:video.width,
            height:video.height
        };
    };

    var copyToContext = function(context) {
        context.drawImage(video, 0, 0);
    };
        
    var loadCallback;
    function onLoaded( callback ) {
        loadCallback = callback;
        if( loaded ) {
            loadCallback();
        }

    }

    return {
        seek:seek,
        onLoaded: onLoaded,
        copyToContext:copyToContext,
        getDimensions:getDimensions,
    };
}());
