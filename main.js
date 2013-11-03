"use strict";

requirejs.config({
    waitSeconds: 200,
});

require(['assets', 'mainloop' ], function( assets, mainloop ) {

    function loadComplete() {
        mainloop.start();
        document.body.removeChild( progressContainer );
    }

    function loadProgress(id, percent) {
        var element = document.getElementById(id);
        if( !element ) {
            element = document.createElement("progress");
            element.max = 100;
            element.id = id;
            element.className = "assetProgress";
            progressContainer.appendChild(element);
        }
        element.value = percent;
    }

    var progressContainer = document.createElement("div");
    progressContainer.className = "centered";
    document.body.appendChild( progressContainer );

    assets.start( loadComplete, loadProgress );

});
