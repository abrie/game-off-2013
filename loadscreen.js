"use strict";

define([], function() {
    function LoadScreen( parent ) {

        var progressContainer = document.createElement("div");
        progressContainer.className = "centered";
        parent.appendChild( progressContainer );

        function update(id, percent) {
            var elementId = "preload_"+id;
            var element = getProgressElement( elementId );
            if( !element ) {
                element = createProgressElement(elementId);
            }
            element.value = percent;
        }

        function getProgressElement(id) {
            return document.getElementById(id);
        }

        function createProgressElement(id) {
            var result = document.createElement("progress");
            result.max = 100;
            result.id = id;
            result.className = "assetProgress";
            progressContainer.appendChild( result );
            return result;
        }

        function close() {
            parent.removeChild( progressContainer );
        }

        return {
            update: update,
            close: close,
        };
    }

    return {
        LoadScreen:LoadScreen,
    };
});