"use strict";

define([],function() {
    function create( params ) {
        var canvas = document.createElement("canvas");
        canvas.width = params.width;
        canvas.height = params.height;
        var context = canvas.getContext('2d');
        
        function update( source ) {
            source.copyToContext( context );
            canvas.changed = true;
        }

        function getElement() { return canvas; }
        function getWidth() { return canvas.width; }
        function getHeight() { return canvas.height; }

        return {
            getElement:getElement,
            getWidth:getWidth,
            getHeight:getHeight,
            update:update
        };
    }

    return {
        create:create
    };
});
