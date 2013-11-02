"use strict";
define([],function() {
    var video = document.createElement('video');
    video.width = 480;
    video.height = 360;
    video.autoplay = true;
    video.loop = true;
    video.setAttribute("src","clip1.webm");

    var getDimensions = function() {
        return {
            width:video.width,
            height:video.height
        }
    }

    var copyToContext = function(context) {
        context.drawImage(video, 0, 0);
    }

    return {
        copyToContext:copyToContext,
        getDimensions:getDimensions,
    }
}());
