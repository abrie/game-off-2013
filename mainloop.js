"use strict";

define(['arscene', 'ui', 'imagesource', 'level', 'hud', 'inventory', 'audio', 'assets', 'tween.min', 'three.min'], function( arscene, ui, imagesource, level, hud, inventory, audio, assets ) {

    var source = new imagesource.VideoSource( { width:480, height:360 } );
    var scene, hudView;
    var currentLevel;

    var produced  = new inventory.Inventory();

    var hatCount = 0;
    var hatFrequency = 8;
    function animate() {
        requestAnimationFrame( animate );
        currentLevel.update();
        TWEEN.update();
        source.update();
        hudView.update();
        scene.update();
        scene.render();
        if( ++hatCount % hatFrequency === 0 ) {
            audio.dispatch( hatSound );
        }
    }

    var hatSound = {
        target: 'sampler',
        sample: "kick",
        at: 0,
        velocity: 1.0,
        adsr: {attack:0.20, release:0.05 },
        span: 750,
        lensId: -1,
    };

    function start() {
        hatSound.buffer = assets.get("sample").get("hh");
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
    }

    function nextFilter() {
        scene.setView( currentLevel.nextFilter().getView() ); 
        audio.setLens( currentLevel.currentFilter().id );
        hudView.nextFilter();
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
