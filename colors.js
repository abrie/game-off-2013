"use strict";

define(['utility'],function(utility) {
    var palette = [
        0x17A768,
        0xF1601D,
        0xF1AD1D,
        0xE7E0D2,
        0xBBAE93
    ];

    function randomColor() {
        return palette[ utility.random(palette.length) ];
    }

    return {
        palette: palette,
        randomColor: randomColor,
    };
});
