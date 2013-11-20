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
        source.setVideo( currentLevel.currentSource() );

        requestAnimationFrame( animate );
    }

    function previousFilter() {
        scene.setView( currentLevel.previousFilter().view ); 
    }

    function nextFilter() {
        scene.setView( currentLevel.nextFilter().view ); 
    }

    function previousSource() {
        source.setVideo( currentLevel.previousSource() ); 
    }

    function nextSource() {
        source.setVideo( currentLevel.nextSource() );
    }

    return {
        start: start,
    };
});
