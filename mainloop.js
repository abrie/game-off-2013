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

    function onFailure(message) {
        var color = {
            background: "#FF0000",
            foreground: "#FFFFFF"
        };
        ui.flash( message, color );
    }

    function onWin() {
        var color = {
            background: "#FFFFFF",
            foreground: "#000000"
        };
    }

    function start() {
        inventory = new Inventory.Inventory();
        scene = new arscene.Scene( document.getElementById("scene"), source );
        hudView = new hud.HUD( document.getElementById("scene"), inventory );
        currentLevel = new level.Level( onPlaceChanged, onFailure, onWin, inventory, hudView );

        ui.addToolListener( changeTool );
        ui.addPlacePreviousListener( previousPlace );
        ui.addPlaceNextListener( nextPlace );

        scene.setView( currentLevel.currentFilter().getView() );
        source.setVideo( currentLevel.currentPlace().getVideo() );

        requestAnimationFrame( animate );
    }

    function changeTool() {
        inventory.previousItem();
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
