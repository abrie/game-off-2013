"use strict";

require(['puzzle', 'scene'], function( puzzle, scene ) {
    // puzzleObject exposes an interface with: .model and .pickables
    var puzzle_A = new puzzle.Puzzle();
    puzzle_A.model.position.x = 0;

    // scene.add expectes an interface with .model and .pickables
    scene.add( puzzle_A);
});
