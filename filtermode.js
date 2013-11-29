"use strict";
define(['arscene', 'pitobject', 'product', 'strawman', 'utility' ], function( arscene, pitobject, product, Strawman, utility ) {

    function Filter( descriptor ) {
        var view = new arscene.View();
        
        var transfer = {};
        transfer.product = new product.Music();
        transfer.product.model.position.z = 100;
        transfer.animator = new product.Animator( transfer.product );

        var probe = {};
        probe.near = new product.ProbeEnd(0xFF0000);
        probe.far = new product.ProbeEnd(0x00FF00);
        probe.near.model.rotation.x = Math.PI;
        probe.near.model.position.z = -50;
        probe.far.model.position.z = 70;
        probe.nearAnimator = new product.ProbeAnimator( probe.near );
        probe.farAnimator = new product.ProbeAnimator( probe.far );

        var strawman = new Strawman.StrawmanObject();

        var puzzles = descriptor.puzzles.map( function(puzzle) {
            return {
                id: puzzle.id, 
                object: new puzzle.generator( descriptor.id ), 
            };
        });

        function add( id, object ) {
            view.objects.add( id, object );
            view.scene.add( object );
        }

        function remove( id, object ) {
            view.objects.remove( id, object );
            view.scene.remove( object );
        }

        function getRandomPuzzle() {
            return utility.randomElement( puzzles );
        }

        function getView() {
            return view;
        }

        function setOnProductProduced( callback ) {
            puzzles.forEach( function(o) {
                o.object.onProductProduced = callback; 
            });
        }

        puzzles.forEach( function(o) {
            o.object.setOnSwap( function() {
                result.onSwap( o.coordinate );
            });
            o.object.setOnTransport( function() {
                result.onTransport( o.coordinate );
            });
            view.objects.add( o.id, new pitobject.PitObject( { color:0x000000 } ) );
            view.objects.add( o.id, o.object );
        });

        var result = {
            getRandomPuzzle:getRandomPuzzle,
            setOnProductProduced:setOnProductProduced,
            puzzles:puzzles,
            onSwap:undefined,
            onTransport:undefined,
            transfer: transfer,
            strawman: strawman,
            probe: probe,
            remove:remove,
            getView:getView,
            add:add,
            id:descriptor.id,
        };

        return result;
    }

    return {
        Filter:Filter,
    };
});
