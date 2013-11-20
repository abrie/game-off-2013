"use strict";

define(['arscene', 'ui', 'imagesource', 'level', 'hud', 'tween.min', 'three.min'], function( arscene, ui, imagesource, level, hud ) {

    var source = new imagesource.VideoSource( { width:480, height:360 } );
    var scene, hudView;
    var currentLevel;

    function animate() {
        requestAnimationFrame( animate );
        TWEEN.update();
        source.update();
        currentLevel.update();
        scene.update();
        scene.render();
    }

    function start() {
        currentLevel = new level.Level();
        scene = new arscene.Scene( document.getElementById("scene"), source );
        hudView = new hud.HUD( document.getElementById("scene"), source );

        ui.addFilterPreviousListener( previousFilter );
        ui.addFilterNextListener( nextFilter );
        ui.addSourcePreviousListener( previousSource );
        ui.addSourceNextListener( nextSource );


        scene.setView( currentLevel.currentFilter().view );
        source.setVideo( currentLevel.currentSource().getClip() );

        requestAnimationFrame( animate );
    }

    function previousFilter() {
        scene.setView( currentLevel.previousFilter().view ); 
        hudView.previousFilter();
    }

    function nextFilter() {
        scene.setView( currentLevel.nextFilter().view ); 
        hudView.nextFilter();
    }

    function previousSource() {
        currentLevel.previousSource();
        source.setVideo( currentLevel.currentSource().getClip() ); 
        scene.setView( currentLevel.currentSource().currentFilter().view ); 
    }

    function nextSource() {
        currentLevel.nextSource();
        source.setVideo( currentLevel.currentSource().getClip() ); 
        scene.setView( currentLevel.currentSource().currentFilter().view ); 
    }

    return {
        start: start,
    };
});
