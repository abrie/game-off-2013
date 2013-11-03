"use strict";

define([],function() {

    function Video( params ) {
        var loaded = false;
        var video = document.createElement('video');
        video.width = params.width;
        video.height = params.height;
        video.autoplay = false;
        video.loop = true;
        video.preload = "auto";
        video.setAttribute("src",params.src);
        video.addEventListener('loadeddata', function() {
            loaded = true;
            if( loadCallback ) {
                loadCallback();
            }
        }, false);

        video.load();

        function getCurrentFrame() {
            return Math.floor(
                video.currentTime.toFixed(5) * params.frameRate
            );
        }

        function frameToTime( frame ) {
            return frame / params.frameRate + 0.00001;
        }

        function seek( delta ) {
            var time = frameToTime( getCurrentFrame() + delta );
            video.currentTime = time;
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

        function isLoaded() {
            return loaded;
        }

        return {
            seek:seek,
            onLoaded: onLoaded,
            isLoaded: isLoaded,
            copyToContext:copyToContext,
            getDimensions:getDimensions,
        };
    }

    return {
        Video:Video,
    }
}());
