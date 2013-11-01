"use strict";

require(['puzzle', 'scene', 'player'],function( puzzle, scene, player ) {
    // puzzleObject exposes an interface of: .model and .pickables
    var puzzleObject = new puzzle.PuzzleModel();
    puzzleObject.model.position.x = 100;
    var puzzleObject2 = new puzzle.PuzzleModel();
    puzzleObject2.model.position.x = -100;

    // scene.add interprets the interface of .model and .pickables
    scene.add( puzzleObject );
    scene.add( puzzleObject2 );

    // TODO: the player object should also exposes a pickables[] for consistency
    var player = new player.Player();
    puzzleObject.addPlayer(player);
});
