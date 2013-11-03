"use strict";

define(['video'], function(video) {

    var list = [];
    function add( id, obj ) {
        list.push( {
            id:id,
            obj:obj
        });

        obj.onLoaded( function() {
            assetLoaded(id);
        });
    }

    function get( id ) {
        var matched = list.filter( function(asset) {
            return asset.id === id;
        });

        return matched[0].obj;
    }

    var notifyAllLoaded;
    function assetLoaded( id ) {
        console.log("asset complete:",id);

        if( areAllLoaded() && notifyAllLoaded ) {
            notifyAllLoaded();
        }
    }

    // Define the assets here. Might be better in a seperate file...
    add( "clip1", new video.Video({
        src: "clip1.webm",
        width: 480,
        height: 360,
        frameRate: 29.970628
    }));


    function areAllLoaded() {
        return list.every( function(asset) {
            return asset.obj.isLoaded();
        });
    }

    function setNotifyAllLoaded( callback ) {
        notifyAllLoaded = callback;
        if( areAllLoaded() ) {
            notifyAllLoaded();
        }
    }

    return {
        whenAllLoaded: setNotifyAllLoaded,
        get: get
    };
});
