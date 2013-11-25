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

        var itemWidth = 32;
        var itemHeight = 32;

        function column(index) {
            return index*(itemWidth+1)+1;
        }

        function row(index) {
            return 168+index*(itemHeight+1);
        }

        function render() {
            clear();
            context.drawImage( faceImage, 0, 0 );
            context.drawImage( lensImages[ lensImageIndex ], 0, 0 );

            var index;

            var image = assets.get("inventory").get("battery");
            for( index = 0; index < inventory.count("BATTERY"); index++ ) {
                context.drawImage( image, column(index), row(0), itemWidth, itemHeight );
            }
            for( index = 0; index < inventory.countCaptured("BATTERY"); index++ ) {
                context.drawImage( image, column(index), row(3), itemWidth, itemHeight );
            }

            image = assets.get("inventory").get("music");
            for( index = 0; index < inventory.count("MUSIC"); index++ ) {
                context.drawImage( image, column(index), row(1), itemWidth, itemHeight );
            }
            for( index = 0; index < inventory.countCaptured("MUSIC"); index++ ) {
                context.drawImage( image, column(index), row(4), itemWidth, itemHeight );
            }

            image = assets.get("inventory").get("molecule");
            for( index = 0; index < inventory.count("MOLECULE"); index++ ) {
                context.drawImage( image, column(index), row(2), itemWidth, itemHeight );
            }
            for( index = 0; index < inventory.countCaptured("MOLECULE"); index++ ) {
                context.drawImage( image, column(index), row(5), itemWidth, itemHeight );
            }
        }

        function update() {
            if( inventory.hasChanged() ) {
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
