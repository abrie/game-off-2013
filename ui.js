"use strict";
define([], function() {
    function makeButton(name) {
        var element = document.createElement("button");
        element.innerHTML = name; 
        document.body.appendChild( element );
        return element;
    }
    var filterPreviousButton = makeButton("previous filter");
    var filterNextButton = makeButton("next filter");
    var scenePreviousButton = makeButton("previous scene");
    var sceneNextButton = makeButton("next scene");

    function addFilterNextListener( callback ) {
        filterNextButton.addEventListener( "click", callback );
    }

    function addFilterPreviousListener( callback ) {
        filterPreviousButton.addEventListener( "click", callback );
    }

    function addSourceNextListener( callback ) {
        sceneNextButton.addEventListener( "click", callback );
    }

    function addSourcePreviousListener( callback ) {
        scenePreviousButton.addEventListener( "click", callback );
    }

    return {
        addFilterNextListener: addFilterNextListener,
        addFilterPreviousListener: addFilterPreviousListener,
        addSourceNextListener: addSourceNextListener,
        addSourcePreviousListener: addSourcePreviousListener
    };
});
