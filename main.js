"use strict";

require(['puzzle', 'scene', 'player'],function( puzzle, scene, player ) {
    // puzzleObject exposes an interface of: .model and .pickables
    var puzzleObject = new puzzle.PuzzleModel();

    // scene.add interprets the interface of .model and .pickables
    scene.add( puzzleObject );

    // TODO: the player object should also exposes a pickables[] for consistency
    var player = new player.Player();
    puzzleObject.addPlayer(player);
});
