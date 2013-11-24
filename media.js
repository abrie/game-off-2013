"use strict";

define([], function() {
    function AudioCollection( params ) {
        var loaded = false;
        var collection = {};
        var loader = new params.loader( params.context, params.files );
        loader.onProgress = function( item, current, total) {
            collection[item.id] = item.buffer;
            var percent = Math.ceil( current/total *100 );
            if( progressCallback ) {
                progressCallback( percent );
            }
            if( percent >= 100 ) {
                loaded = true;
                if( loadCallback ) {
                    loadCallback();
                }
            }
        };

        loader.load();

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

        function get( name ) {
            return collection[name];
        }

        return {
            get: get,
            onLoaded: onLoaded,
            isLoaded: isLoaded,
            onProgress: onProgress,
        };
    }

    function BitmapCollection( params ) {
        var loaded = false;
        var collection = {};
        var loader = new THREE.LoadingManager();
        loader.onProgress = function( item, current, total) {
            var percent = Math.ceil( current/total *100 );
            if( progressCallback ) {
                progressCallback( percent );
            }
            if( percent >= 100 ) {
                loaded = true;
                if( loadCallback ) {
                    loadCallback();
                }
            }
        };

        function load() {
            var imageLoader = new params.loader( loader );
            params.files.forEach( function(entry) {
                imageLoader.load( 'assets/'+entry.file, function(obj) { 
                    collection[entry.id] = obj;
                });
            });
        }

        load();

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

        function get( name ) {
            return collection[name];
        }

        return {
            get: get,
            onLoaded: onLoaded,
            isLoaded: isLoaded,
            onProgress: onProgress,
        };
    }

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
                    video.pause();
                    video.currentTime = 0;
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

        function restart() {
            video.currentTime = 0;
        }

        function frameToTime( frame ) {
            return frame / params.frameRate + 0.00001;
        }

        function seek( delta ) {
            var time = frameToTime( getCurrentFrame() + delta );
            video.currentTime = time;
            return video.currentTime >= (video.duration - 1 );
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
            restart: restart,
            onProgress: onProgress,
            copyToContext:copyToContext,
            getDimensions:getDimensions,
        };
    }

    return {
        Video:Video,
        BitmapCollection:BitmapCollection,
        AudioCollection:AudioCollection,
    };
}());
