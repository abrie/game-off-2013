"use strict";

define(['inventory', 'arscene', 'ui', 'imagesource', 'level', 'hud', 'audio', 'tween.min', 'three.min'], 
       function( Inventory, arscene, ui, imagesource, level, hud, audio ) {

    var source = new imagesource.VideoSource( { width:480, height:360 } );
    var scene, hudView;
    var currentLevel;
    var inventory;

    function animate() {
        requestAnimationFrame( animate );
        currentLevel.update();
        TWEEN.update();
        source.update();
        scene.update();
        scene.render();
        hudView.render();
    }

    function start() {
        inventory = new Inventory.Inventory();
        inventory.add("music"); 
        inventory.add("probe"); 
        inventory.add("battery");
        currentLevel = new level.Level( onPlaceChanged, inventory );
        scene = new arscene.Scene( document.getElementById("scene"), source );
        hudView = new hud.HUD( document.getElementById("scene"), inventory );

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
        inventory.previousItem();
        hudView.previousFilter();
    }

    function nextFilter() {
        scene.setView( currentLevel.nextFilter().getView() ); 
        audio.setLens( currentLevel.currentFilter().id );
        inventory.nextItem();
        hudView.nextFilter();
    }

    function previousPlace() {
        currentLevel.previousPlace();
    }

    function nextPlace() {
        currentLevel.nextPlace();
    }

    function onPlaceChanged() {
        source.setVideo( currentLevel.currentPlace().getVideo() ); 
        scene.setView( currentLevel.currentFilter().getView() ); 
    }

    return {
        start: start,
    };
});
