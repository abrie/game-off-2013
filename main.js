"use strict";

require(['puzzle', 'scene', 'colors'],function( puzzle, scene, colors ) {

    // puzzleObject exposes an interface of: .model and .pickables
    var puzzleObject = new puzzle.PuzzleModel();

    // scene.add interprets the interface of .model and .pickables
    scene.add( puzzleObject );

    function Player() {
        var geometry = new THREE.CubeGeometry(
            20,20,20
        );

        var material = new THREE.MeshPhongMaterial({
            color: colors.palette[0],
        });

        var mesh = new THREE.Mesh( geometry, material );
        var object = new THREE.Object3D();
        object.add(mesh);
        
        return {
            model:object,
        }
    }

    var player = new Player();
    puzzleObject.addPlayer(player);
    puzzleObject.doAction(4);
});
