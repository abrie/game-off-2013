"use strict";

define(['media','three.min'], function(media) {

    var list = [], onAllLoaded;

    function add( id, obj, onInitialize, onProgress ) {
        list.push( {
            id:id,
            obj:obj
        });

        onInitialize( id );

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
    function start( onComplete, onInitialize, onProgress ) {

        onAllLoaded = onComplete;

        add( "clip1", new media.Video({
            src: "assets/clip1.m4v",
            width: 480,
            height: 360,
            frameRate: 29.970628
        }), onInitialize, onProgress );

        add( "clip2", new media.Video({
            src: "assets/clip2.m4v",
            width: 480,
            height: 360,
            frameRate: 29.970628
        }), onInitialize, onProgress );

        add( "hudset", new media.BitmapCollection({
            files: ['character.png','lens-1.png','lens-2.png'],
            loader: THREE.ImageLoader,
        }), onInitialize, onProgress );

        add( "inventory", new media.BitmapCollection({
            files: ['battery.png'],
            loader: THREE.ImageLoader,
        }), onInitialize, onProgress );

        add( "texture", new media.BitmapCollection({
            files: ['battery.png','note.png'],
            loader: THREE.TextureLoader,
        }), onInitialize, onProgress );
    }

    return {
        start: start,
        get: get
    };
});
