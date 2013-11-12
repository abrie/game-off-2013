"use strict";

define([],function() {
    var palette = [
        0x17A768,
        0xF1601D,
        0xF1AD1D,
        0xE7E0D2,
        0xBBAE93
    ];

    function randomColor() {
        return palette[ Math.floor( Math.random() * palette.length) ];
    }

    return {
        palette: palette,
        randomColor: randomColor,
    };
});
