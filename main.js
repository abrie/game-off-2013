"use strict";

require(['assets', 'mainloop' ], function( assets, mainloop ) {

    function loadComplete() {
        mainloop.start();
    }

    function loadProgress(id, percent) {
        console.log(id,":",percent+"%");
    }

    assets.start( loadComplete, loadProgress );

});
