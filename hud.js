"use strict";
define(['assets'], function(assets) {
    function HUD( parent, inventory ) {
        var element = document.createElement("canvas");
        element.width = 270;
        element.height = 360; 
        var context = element.getContext('2d');
        var faceImage = assets.get("hudset").get("character.png");
        var lensImageIndex = 0;
        var lensImages = [
            assets.get("hudset").get("lens-1.png"),
            assets.get("hudset").get("lens-2.png"),
        ];

        parent.appendChild( element );

        function nextFilter() {
            if( ++lensImageIndex > lensImages.length-1 ) {
                lensImageIndex = 0;
            }

            render();
        }

        function previousFilter() {
            if( --lensImageIndex < 0 ) {
                lensImageIndex = lensImages.length-1;
            }

            render();
        }

        function render() {
            context.drawImage( faceImage, 0, 0 );
            context.drawImage( lensImages[ lensImageIndex ], 0, 0 );

            inventory.list.forEach( function(item, index) {
                context.drawImage( assets.get("inventory").get("battery.png"), index*26, 180 );
            });
        }

        function update() {
            if( inventory.hasChanged ) {
                render();
            }
        }

        render();

        return {
            nextFilter:nextFilter,
            previousFilter:previousFilter,
            update:update,
        };
    }

    return {
        HUD:HUD
    };
});
