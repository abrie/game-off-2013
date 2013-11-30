"use strict";

define([], function() {
    function Inventory() {
        var items = [];
        var currentItemIndex = 0;
        function add(name) {
            var item = {};
            item.name = name;
            item.animator = new Animator(item);
            items.push(item);
        }

        function getCurrentItem() {
            return items[currentItemIndex];
        } 

        function nextItem() {
            if( ++currentItemIndex  >= items.length ) {
                currentItemIndex = 0;
            }
            notifyOnItemChanged();
        }

        function previousItem() {
            if( --currentItemIndex < 0 ) {
                currentItemIndex = items.length-1;
            }
            notifyOnItemChanged();
        }

        function notifyOnItemChanged() {
            onItemChangedListeners.forEach( function(callback) {
                callback(items[currentItemIndex]);
            });
        }

        var onItemChangedListeners = [];
        function addItemChangedListener( callback ) {
            onItemChangedListeners.push(callback);
        }

        return {
            add: add,
            items:items,
            nextItem: nextItem,
            previousItem: previousItem,
            getCurrentItem: getCurrentItem,
            addItemChangedListener: addItemChangedListener,
        };
    }

    function Animator( item ) {
        var state = {scale:0.25};

        console.log( TWEEN.Easing );
        function activate( rate ) {
            new TWEEN.Tween( state )
                .to( {scale:5.0}, rate )
                .easing( TWEEN.Easing.Circular.Out )
                .onStart( function() {
                })
                .onUpdate( function() {
                    item.scale = this.scale;
                })
                .start();
        }

        function deactivate( rate ) {
            new TWEEN.Tween( state )
                .to( {scale:1.0}, rate )
                .easing( TWEEN.Easing.Circular.In )
                .onStart( function() {
                })
                .onUpdate( function() {
                    item.scale = this.scale;
                })
                .start();
        }

        var result = {
            activate: activate,
            deactivate: deactivate,
        };

        return result;
    }

    return {
        Inventory:Inventory
    };
});
