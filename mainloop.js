"use strict";

define(['assets', 'arscene', 'ui', 'imagesource', 'level', 'tween.min', 'three.min'], function( assets, arscene, ui, imagesource, level ) {

    var source = new imagesource.VideoSource( {width:480, height:360} );
    var scene;
    var currentLevel;

    function animate() {
        requestAnimationFrame( animate );
        TWEEN.update();
        source.update();
        scene.update();
        scene.render();
    }

    var sources = [];
    var sourceIndex = 0;

    function start() {
        currentLevel = new level.Level();
        scene = new arscene.Scene( document.getElementById("scene"), source );

        ui.addFilterPreviousListener( previousFilter );
        ui.addFilterNextListener( nextFilter );
        ui.addSourcePreviousListener( previousSource );
        ui.addSourceNextListener( nextSource );

        sources.push( assets.get("clip1") );
        sources.push( assets.get("clip2") );

        scene.setView( currentLevel.currentFilter().view );
        source.setVideo( sources[sourceIndex] );

        requestAnimationFrame( animate );
    }

    function previousFilter() {
        scene.setView( currentLevel.previousFilter().view ); 
    }

    function nextFilter() {
        scene.setView( currentLevel.nextFilter().view ); 
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
