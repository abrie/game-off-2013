"use strict";

require(['assets', 'puzzle', 'scene', 'mainloop' ], function( assets, puzzle, scene, mainloop ) {

    function makePuzzle( ar_id ) {
        // puzzleObject exposes an interface with: .model and .pickables
        var puzzleObject = new puzzle.Puzzle();

        // scene.add expectes an interface with .model and .pickables
        scene.add( ar_id, puzzleObject );
    }

    makePuzzle( 4 );
    makePuzzle( 32 );

    assets.whenAllLoaded( function() {
        mainloop.start();
    } );

});
