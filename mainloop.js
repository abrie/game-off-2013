"use strict";

define(['assets', 'arscene', 'puzzle', 'strawman', 'pitobject', 'ui', 'tween.min', 'three.min'], function( assets, arscene, puzzle, strawman, pitobject, ui ) {

    var imageSource = new arscene.ImageSource( {width:480, height:360} );
    var scene;

    function animate() {
        requestAnimationFrame( animate );
        TWEEN.update();
        imageSource.update();
        scene.update();
        scene.render();
    }

    GLOBAL.setVideo = function(name) {
        imageSource.setVideo( assets.get(name) );
    };

    GLOBAL.setFilter = function(name) {
        scene.setView( filters[name] );
    };

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
        var puzzleObject = new puzzle.Puzzle();
        var strawmanObject = new strawman.Strawman();

        view.objects.add( 4, pitObject );
        view.objects.add( 32, new pitobject.PitObject({color:0x1F10FF}) );
        view.objects.add( 4, puzzleObject );
        view.objects.add( 4, strawmanObject );

        return view;
    }

    var filters = [];
    var filterIndex = 0;

    function start() {
        scene = new arscene.Scene( document.body, imageSource );
        imageSource.setVideo( assets.get("clip2") );

        filters.push( new FilterA() );
        filters.push( new FilterB() );

        scene.setView( filters[filterIndex] );

        requestAnimationFrame( animate );
    }

    function previousFilter() {
        if(--filterIndex<0) {
            filterIndex = filters.length-1;
        }
       scene.setView( filters[filterIndex] ); 
    }

    function nextFilter() {
        if(++filterIndex>=filters.length) {
            filterIndex = 0;
        }
       scene.setView( filters[filterIndex] ); 
    }

    ui.addFilterPreviousListener( previousFilter );
    ui.addFilterNextListener( nextFilter );

    return {
        start: start,
    };
});
