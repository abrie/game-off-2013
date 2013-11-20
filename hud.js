"use strict";
define(['assets'], function(assets) {
    function HUD( parent ) {
        var element = document.createElement("canvas");
        element.width = 270;
        element.height = 360; 
        var context = element.getContext('2d');
        var image = assets.get("hudset").get("character.png");
        var lenses = [
            assets.get("hudset").get("lens-1.png"),
            assets.get("hudset").get("lens-2.png"),
        ];

        parent.appendChild( element );

        var lensIndex = 0;
        function nextFilter() {
            if( ++lensIndex > lenses.length-1 ) {
                lensIndex = 0;
            }

            render();
        }

        function previousFilter() {
            if( --lensIndex < 0 ) {
                lensIndex = lenses.length-1;
            }

            render();
        }

        function render() {
            context.drawImage( image, 0, 0 );
            context.drawImage( lenses[lensIndex], 0, 0 );
        }

        render();

        return {
            nextFilter:nextFilter,
            previousFilter:previousFilter
        };
    }

    return {
        HUD:HUD
    };
});
