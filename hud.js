"use strict";
define(['assets'], function(assets) {
    function HUD( parent ) {
        var element = document.createElement("canvas");
        element.width = 270;
        element.height = 360; 
        var context = element.getContext('2d');
        var image = assets.get("hudset").get("character.png");
        context.drawImage(image, 0, 0);

        parent.appendChild( element );

        return {
            context:context
        };
    }

    return {
        HUD:HUD
    };
});
