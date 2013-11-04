"use strict";

define([],function() {

    function Video( params ) {
        var duration, buffered;
        var loaded = false;
        var video = document.createElement('video');
        video.width = params.width;
        video.height = params.height;
        video.autoplay = true;
        video.loop = true;
        video.setAttribute("src",params.src);

        video.addEventListener('loadedmetadata', function() {
            duration = this.duration;
            if( this.buffered.length > 0 ) {
                buffered = this.buffered.end(0);
            }
            notifyLoadPercentage();
        }, false);

        video.addEventListener('progress', function() {
            if( this.buffered.length > 0 ) {
                buffered = this.buffered.end(0);
            }
            notifyLoadPercentage();
        }, false);

        function load() {
            duration = 0;
            buffered = 0;
            video.load();
        }

        load();

        function notifyLoadPercentage() {
            if( duration > 0 && buffered > 0 && !loaded ) {
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
