"use strict";

requirejs.config({
    waitSeconds: 200,
});

require(['assets', 'loadscreen', 'mainloop' ], function( assets, loadscreen, mainloop ) {

    var loadScreen = new loadscreen.LoadScreen( document.body );

    function loadComplete() {
        loadScreen.close();
        mainloop.start();
    }

    assets.start( loadComplete, loadScreen.update );

});
