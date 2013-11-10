"use strict";
define([], function() {
    var filterNextButton = document.createElement("button");
    filterNextButton.innerHTML = "next";
    var filterPreviousButton = document.createElement("button");
    filterPreviousButton.innerHTML = "previous";
    document.body.appendChild( filterPreviousButton );
    document.body.appendChild( filterNextButton );

    function addFilterNextListener( callback ) {
        filterNextButton.addEventListener( "click", callback );
    }

    function addFilterPreviousListener( callback ) {
        filterPreviousButton.addEventListener( "click", callback );
    }

    return {
        addFilterNextListener: addFilterNextListener,
        addFilterPreviousListener: addFilterPreviousListener
    };
});
