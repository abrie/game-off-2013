"use strict";

define(['video'], function(video) {

    var list = [], onAllLoaded;

    function add( id, obj, onProgress ) {
        list.push( {
            id:id,
            obj:obj
        });

        if( onProgress ) {
            obj.onProgress( function(percent) {
                onProgress( id, percent );
            });
        }

        obj.onLoaded( assetLoaded );
    }

    function get( id ) {
        var matched = list.filter( function(asset) {
            return asset.id === id;
        });

        return matched[0].obj;
    }

    function assetLoaded() {
        if( areAllLoaded() && onAllLoaded ) {
            onAllLoaded();
        }
    }

    function areAllLoaded() {
        return list.every( function(asset) {
            return asset.obj.isLoaded();
        });
    }

    // Define the assets here. Might be better in a seperate file...
    function start( onComplete, onProgress ) {

        onAllLoaded = onComplete;

        add( "clip1", new video.Video({
            src: "assets/clip1.webm",
            width: 480,
            height: 360,
            frameRate: 29.970628
        }), onProgress );

        add( "clip2", new video.Video({
            src: "assets/clip2.webm",
            width: 480,
            height: 360,
            frameRate: 29.970628
        }), onProgress );
    }

    return {
        start: start,
        get: get
    };
});
