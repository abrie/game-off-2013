"use strict";

define(['arscene', 'ui', 'imagesource', 'level', 'hud', 'inventory', 'audio', 'assets', 'tween.min', 'three.min'], function( arscene, ui, imagesource, level, hud, inventory, audio, assets ) {

    var source = new imagesource.VideoSource( { width:480, height:360 } );
    var scene, hudView;
    var currentLevel;

    var produced  = new inventory.Inventory();

    function animate() {
        requestAnimationFrame( animate );
        currentLevel.update();
        TWEEN.update();
        source.update();
        hudView.update();
        scene.update();
        scene.render();
    }

    function start() {
        currentLevel = new level.Level( produced );
        scene = new arscene.Scene( document.getElementById("scene"), source );
        hudView = new hud.HUD( document.getElementById("scene"), produced );

        ui.addFilterPreviousListener( previousFilter );
        ui.addFilterNextListener( nextFilter );
        ui.addPlacePreviousListener( previousPlace );
        ui.addPlaceNextListener( nextPlace );

        scene.setView( currentLevel.currentFilter().getView() );
        source.setVideo( currentLevel.currentPlace().getVideo() );

        requestAnimationFrame( animate );
    }

    function previousFilter() {
        scene.setView( currentLevel.previousFilter().getView() ); 
        audio.setLens( currentLevel.currentFilter().id );
        hudView.previousFilter();
        produced.capture();
    }

    function nextFilter() {
        scene.setView( currentLevel.nextFilter().getView() ); 
        audio.setLens( currentLevel.currentFilter().id );
        hudView.nextFilter();
        produced.capture();
    }

    function previousPlace() {
        currentLevel.previousPlace();
        source.setVideo( currentLevel.currentPlace().getVideo() ); 
        scene.setView( currentLevel.currentFilter().getView() ); 
    }

    function nextPlace() {
        currentLevel.nextPlace();
        source.setVideo( currentLevel.currentPlace().getVideo() ); 
        scene.setView( currentLevel.currentFilter().getView() ); 
    }

    return {
        start: start,
    };
});
