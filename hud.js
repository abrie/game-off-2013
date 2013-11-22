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

        function column(index) {
            return index*65+1;
        }

        function row(index) {
            return 180+index*65;
        }

        function render() {
            clear();
            context.drawImage( faceImage, 0, 0 );
            context.drawImage( lensImages[ lensImageIndex ], 0, 0 );

            var index;
            for( index = 0; index < inventory.count("BATTERY"); index++ ) {
                context.drawImage( assets.get("inventory").get("battery"), column(index), row(0) );
            }
            for( index = 0; index < inventory.count("MUSIC"); index++ ) {
                context.drawImage( assets.get("inventory").get("note"), column(index), row(1) );
            }
        }

        function update() {
            if( inventory.hasChanged() ) {
                console.log(inventory.getList());
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
