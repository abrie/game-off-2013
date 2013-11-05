"use strict";

requirejs.config({
    waitSeconds: 200,
});

require(['assets', 'loadscreen', 'mainloop' ], function( assets, loadscreen, mainloop ) {

    var loadScreen = new loadscreen.LoadScreen( document.body );

    function beginAfterDelay() {
        // A brief delay allows the progress bar states to reflect the 100% state.
        window.setTimeout( loadComplete, 500 );
    }

    function loadComplete() {
        loadScreen.close();
        mainloop.start();
    }

    assets.start( beginAfterDelay, loadScreen.initialize, loadScreen.update );

});
