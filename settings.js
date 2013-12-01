"use strict";
define([], function() {
    var result = {
        arMarkerPersist: 60,
        arThreshold: 55,
        arMarkerSize: 150,
        tileDepth:30,
        strawLength: 100,
        launcherLength: 100/3,
        launcherRadius: 12,
        strawRadius: 12,
        ballRadius: 10, 
        spinFrequency: 100,
        bumpFrequency: 30, 
    };
    GLOBAL.settings = result;
    return result;
});
