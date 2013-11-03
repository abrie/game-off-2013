"use strict";

require(['assets', 'mainloop' ], function( assets, mainloop ) {

    assets.start( function() {
        mainloop.start();
    } );

});
