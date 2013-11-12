"use strict";
define(['arscene', 'puzzle', 'strawman', 'pitobject', 'city'], function(arscene, puzzle, strawman, pitobject,city ) {
    function FilterA() {
        var view = new arscene.View();

        var pitObject = new pitobject.PitObject({color:0x00FF00});
        var puzzleObject = new puzzle.Puzzle();
        var strawmanObject = new strawman.Strawman();

        view.objects.add( 4, new pitobject.PitObject({color:0xAF1200}) );
        view.objects.add( 32, pitObject );
        view.objects.add( 32, puzzleObject );
        view.objects.add( 32, strawmanObject );

        return view;
    }

    function FilterB() {
        var view = new arscene.View();

        var pitObject = new pitobject.PitObject({color:0x00FF00});
        var puzzleObject = new city.Puzzle();
        var strawmanObject = new strawman.Strawman();

        view.objects.add( 4, pitObject );
        view.objects.add( 32, new pitobject.PitObject({color:0x1F10FF}) );
        view.objects.add( 4, puzzleObject );
        view.objects.add( 4, strawmanObject );

        return view;
    }

    return {
        FilterA:FilterA,
        FilterB:FilterB
    };
});

