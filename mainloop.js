"use strict";

define(['assets', 'arscene', 'ui', 'imagesource', 'level', 'tween.min', 'three.min'], function( assets, arscene, ui, imagesource, level ) {

    var source = new imagesource.VideoSource( {width:480, height:360} );
    var scene;

    function animate() {
        requestAnimationFrame( animate );
        TWEEN.update();
        source.update();
        scene.update();
        scene.render();
    }

    var filterIndex = 0;

    var sources = [];
    var sourceIndex = 0;

    function start() {
        scene = new arscene.Scene( document.getElementById("scene"), source );

        ui.addFilterPreviousListener( previousFilter );
        ui.addFilterNextListener( nextFilter );
        ui.addSourcePreviousListener( previousSource );
        ui.addSourceNextListener( nextSource );

        sources.push( assets.get("clip1") );
        sources.push( assets.get("clip2") );

        scene.setView( level.filters[filterIndex].view );
        source.setVideo( sources[sourceIndex] );

        requestAnimationFrame( animate );
    }

    function previousFilter() {
        if( --filterIndex < 0 ) {
            filterIndex = level.filters.length-1;
        }
        scene.setView( level.filters[filterIndex].view ); 
    }

    function nextFilter() {
        if( ++filterIndex >= level.filters.length ) {
            filterIndex = 0;
        }

        scene.setView( level.filters[filterIndex].view ); 
    }

    function previousSource() {
        if(--sourceIndex<0) {
            sourceIndex = sources.length-1;
        }

        source.setVideo( sources[sourceIndex] ); 
    }

    function nextSource() {
        if(++sourceIndex>=sources.length) {
            sourceIndex = 0;
        }

        source.setVideo( sources[sourceIndex] ); 
    }

    return {
        start: start,
    };
});
