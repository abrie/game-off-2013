"use strict";

define([],function() {

    function Video( params ) {
        var duration, buffered;
        var loaded = false;
        var video = document.createElement('video');
        video.width = params.width;
        video.height = params.height;
        video.autoplay = false;
        video.loop = true;
        video.preload = "auto";
        video.setAttribute("src",params.src);

        video.addEventListener('loadedmetadata', function() {
            duration = this.duration;
            notifyLoadPercentage();
        }, false);

        video.addEventListener('progress', function() {
            // IndexSizeError: DOM Exception 1 occurs sometimes. Unable to track down the cause,
            // wrap it in an exception handler as a workaround.
            try {
                buffered = this.buffered.end(0);
            }
            catch( e ) {
                console.log("caught exception for video 'progress' event:",e);
            }
            notifyLoadPercentage();
        }, false);

        video.load();

        function notifyLoadPercentage() {
            if( duration && buffered ) {
                var percent = Math.ceil( buffered / duration * 100 );
                if( progressCallback ) {
                    progressCallback( percent );
                }
                if( percent >= 100 ) {
                    loaded = true;
                    if( loadCallback ) {
                        loadCallback();
                    }
                }
            }
        }

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
                if( progressCallback ) {
                    progressCallback(100);
                }
            }
        }

        var progressCallback;
        function onProgress( callback ) {
            progressCallback = callback;
        }

        function isLoaded() {
            return loaded;
        }

        return {
            seek:seek,
            onLoaded: onLoaded,
            isLoaded: isLoaded,
            onProgress: onProgress,
            copyToContext:copyToContext,
            getDimensions:getDimensions,
        };
    }

    return {
        Video:Video,
    }
}());
