"use strict";

requirejs.config({
    waitSeconds: 200,
});

require(['assets', 'audio', 'loadscreen', 'mainloop' ], function( assets, audio, loadscreen, mainloop ) {

    var loadScreen = new loadscreen.LoadScreen( document.body );

    function beginAfterDelay() {
        // A brief delay allows the progress bar states to reflect the 100% state.
        window.setTimeout( loadComplete, 500 );
    }

    function loadComplete() {
        audio.setConvolver( assets.get("impulses").get("telephone") );
        loadScreen.close();
        mainloop.start();
    }

    assets.start( beginAfterDelay, loadScreen.initialize, loadScreen.update );

});
