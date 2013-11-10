"use strict";

define(['assets', 'arscene', 'puzzle', 'strawman', 'pitobject', 'ui', 'imagesource', 'tween.min', 'three.min'], function( assets, arscene, puzzle, strawman, pitobject, ui, imagesource ) {

    var source = new imagesource.VideoSource( {width:480, height:360} );
    var scene;

    function animate() {
        requestAnimationFrame( animate );
        TWEEN.update();
        source.update();
        scene.update();
        scene.render();
    }

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

    var sources = [];
    var sourceIndex = 0;

    function start() {
        scene = new arscene.Scene( document.body, source );

        filters.push( new FilterA() );
        filters.push( new FilterB() );

        sources.push( assets.get("clip1") );
        sources.push( assets.get("clip2") );

        scene.setView( filters[filterIndex] );
        source.setVideo( sources[sourceIndex] );

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

    function previousSource() {
        if(--sourceIndex<0) {
            sourceIndex = sources.length-1;
        }

        source.setVideo( sources[sourceIndex] ); 
    }

    function nextSource() {
        if(++sourceIndex>=sources.length) {
            sourceIndex = 0;
        }

        source.setVideo( sources[sourceIndex] ); 
    }

    ui.addFilterPreviousListener( previousFilter );
    ui.addFilterNextListener( nextFilter );
    ui.addSourcePreviousListener( previousSource );
    ui.addSourceNextListener( nextSource );

    return {
        start: start,
    };
});
