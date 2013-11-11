"use strict";

define(['assets', 'arscene', 'ui', 'imagesource', 'filtermode', 'tween.min', 'three.min'], function( assets, arscene, ui, imagesource, filtermode ) {

    var source = new imagesource.VideoSource( {width:480, height:360} );
    var scene;

    function animate() {
        requestAnimationFrame( animate );
        TWEEN.update();
        source.update();
        scene.update();
        scene.render();
    }

    var filters = [];
    var filterIndex = 0;

    var sources = [];
    var sourceIndex = 0;

    function start() {
        scene = new arscene.Scene( document.getElementById("scene"), source );

        ui.addFilterPreviousListener( previousFilter );
        ui.addFilterNextListener( nextFilter );
        ui.addSourcePreviousListener( previousSource );
        ui.addSourceNextListener( nextSource );

        filters.push( new filtermode.FilterA() );
        filters.push( new filtermode.FilterB() );

        sources.push( assets.get("clip1") );
        sources.push( assets.get("clip2") );

        scene.setView( filters[filterIndex] );
        source.setVideo( sources[sourceIndex] );

        requestAnimationFrame( animate );
    }

    function previousFilter() {
        if(--filterIndex<0) {
            filterIndex = filters.length-1;
        }
       scene.setView( filters[filterIndex] ); 
    }

    function nextFilter() {
        if(++filterIndex>=filters.length) {
            filterIndex = 0;
        }

        scene.setView( filters[filterIndex] ); 
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
