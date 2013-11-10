"use strict";
define(['scratchcanvas'],function(scratchcanvas) {
    function ImageSource( dimensions ) {
        var canvas = scratchcanvas.create( dimensions );
        var video;
        var dir = 1;

        function update() {
            if( video.seek( 1 ) ) {
                video.restart();
            }
            canvas.update( video );
        }

        function setVideo( v ) {
            video = v;
        }

        return {
            setVideo:setVideo,
            scratchcanvas:canvas,
            update:update,
            dimensions:dimensions
        };
    }

    return {
        ImageSource:ImageSource
    }
});
