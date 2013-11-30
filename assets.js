"use strict";

define(['media','bufferloader', 'audio', 'three.min'], function( media, bufferloader, audio ) {

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

        if( matched.length === 0 ) {
            console.log("no asset found:",id);
        }

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

        add( "message1", new media.Video({
            src: "assets/message1.m4v",
            width: 480,
            height: 360,
            frameRate: 29.970628
        }), onInitialize, onProgress );

        add( "message2", new media.Video({
            src: "assets/message2.m4v",
            width: 480,
            height: 360,
            frameRate: 29.970628
        }), onInitialize, onProgress );

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

        add( "clip3", new media.Video({
            src: "assets/clip3.m4v",
            width: 480,
            height: 360,
            frameRate: 29.970628
        }), onInitialize, onProgress );

        add( "clip4", new media.Video({
            src: "assets/clip4.m4v",
            width: 480,
            height: 360,
            frameRate: 29.970628
        }), onInitialize, onProgress );

        add( "clip5", new media.Video({
            src: "assets/clip5.m4v",
            width: 480,
            height: 360,
            frameRate: 29.970628
        }), onInitialize, onProgress );

        add( "clip6", new media.Video({
            src: "assets/clip6.m4v",
            width: 480,
            height: 360,
            frameRate: 29.970628
        }), onInitialize, onProgress );

        add( "hudset", new media.BitmapCollection({
            files: [
                { id: 'character', file: 'character.png' },
                { id: 'lens1', file: 'lens-1.png' },
                { id: 'lens2', file: 'lens-2.png' },
                { id: 'lens3', file: 'lens-3.png' }
            ],
            loader: THREE.ImageLoader,
        }), onInitialize, onProgress );

        add( "inventory", new media.BitmapCollection({
            files: [
                { id: 'battery', file: 'battery-border.png' },
                { id: 'music', file: 'note-border.png' },
                { id: 'probe', file: 'molecule.png' }
            ],
            loader: THREE.ImageLoader,
        }), onInitialize, onProgress );

        add( "texture", new media.BitmapCollection({
            files: [
                { id: 'battery', file: 'battery.png' },
                { id: 'music', file: 'note.png' }
            ],
            loader: THREE.TextureLoader,
        }), onInitialize, onProgress );

        add( "impulses", new media.AudioCollection({
            files: [
                { id: 'telephone', file: 'assets/telephone.wav' },
            ],
           loader: bufferloader.BufferLoader,
           context: audio.getContext(),
        }), onInitialize, onProgress );

        add( "sample", new media.AudioCollection({
            files: [
                { id: 'kick', file: 'assets/kick.wav' },
                { id: 'snare', file: 'assets/snare.wav' },
                { id: 'hh', file: 'assets/hihat.wav'},
            ],
           loader: bufferloader.BufferLoader,
           context: audio.getContext(),
        }), onInitialize, onProgress );
    }

    return {
        start: start,
        get: get
    };
});
