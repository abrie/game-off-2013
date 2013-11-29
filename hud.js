"use strict";
define(['assets'], function(assets) {
    function HUD( parent, inventory ) {
        var element = document.createElement("canvas");
        element.width = 261;
        element.height = 360; 
        var context = element.getContext('2d');
        var faceImage = assets.get("hudset").get("character");
        var lensImageIndex = 0;
        var lensImages = [
            assets.get("hudset").get("lens1"),
            assets.get("hudset").get("lens2"),
            assets.get("hudset").get("lens3"),
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

        function clear() {
            context.clearRect(0,0,element.width,element.height);
        }

        function render() {
            clear();
            context.drawImage( faceImage, 0, 0 );
            context.drawImage( lensImages[ lensImageIndex ], 0, 0 );
            inventory.items.forEach( function(item, index) {
                context.drawImage( assets.get("inventory").get(item), index*64, 168, 64, 64 );
            });
        }

        render();

        return {
            nextFilter:nextFilter,
            previousFilter:previousFilter,
        };
    }

    return {
        HUD:HUD
    };
});
