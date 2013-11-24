"use strict";
define([], function() {
    function BufferLoader( context, urlList ) {
        var loadCount = 0;

        function load() {
            urlList.forEach( function(descriptor) { 
                loadBuffer(descriptor); 
            });
        }

        function loadBuffer( descriptor ) {
            // Load buffer asynchronously
            var request = new XMLHttpRequest();
            request.open("GET", descriptor.file, true);
            request.responseType = "arraybuffer";

            request.onload = function() {
                // Asynchronously decode the audio file data in request.response
                context.decodeAudioData(
                    request.response,
                    function(buffer) {
                        if (!buffer) {
                            alert('error decoding file data: ' + descriptor.file );
                            return;
                        }
                        descriptor.buffer = buffer;
                        result.onProgress( descriptor, ++loadCount, urlList.length );
                    },
                    function(error) {
                        console.error('decodeAudioData error', error);
                    }
                );
            };

            request.onerror = function() {
                alert('BufferLoader: XHR error');
            };

            request.send();
        }

        var result = {
            onProgress: undefined,
            load: load
        };

        return result;
    }

    return {
        BufferLoader:BufferLoader
    };
});
