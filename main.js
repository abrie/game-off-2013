"use strict";

require(['puzzle', 'scene'],function( puzzle, scene ) {
    // puzzleObject exposes an interface of: .model and .pickables
    var puzzleObject = new puzzle.PuzzleModel();
    puzzleObject.model.position.x = 100;
    var puzzleObject2 = new puzzle.PuzzleModel();
    puzzleObject2.model.position.x = -100;

    // scene.add interprets the interface of .model and .pickables
    scene.add( puzzleObject );
    scene.add( puzzleObject2 );
});
