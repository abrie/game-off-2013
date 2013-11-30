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
            assets.get("hudset").get("lens3"),
            assets.get("hudset").get("lens1"),
        ];

        parent.appendChild( element );

        inventory.addItemChangedListener( onInventoryItemChanged );
        function onInventoryItemChanged() {
            inventory.items.forEach( function(item) {
                if( inventory.getCurrentItem() === item ) {
                    item.animator.activate(250);
                }
                else {
                    item.animator.deactivate(250);
                }
            });
        }

        function nextFilter() {
            if( ++lensImageIndex > lensImages.length-1 ) {
                lensImageIndex = 0;
            }
        }

        function previousFilter() {
            if( --lensImageIndex < 0 ) {
                lensImageIndex = lensImages.length-1;
            }
        }

        function clear() {
            context.clearRect(0,0,element.width,element.height);
        }

        function render() {
            clear();
            context.drawImage( faceImage, 0, 0 );
            context.drawImage( lensImages[ lensImageIndex ], 0, 0 );
            x = 8;
            inventory.items.forEach( function( item ) {
                context.drawImage( assets.get("inventory").get(item.name), x, 200, 32*item.scale, 32*item.scale );
                x+=32*item.scale;
            });
        }

        return {
            render:render,
            nextFilter:nextFilter,
            previousFilter:previousFilter,
        };
    }

    return {
        HUD:HUD
    };
});
