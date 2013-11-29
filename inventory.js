"use strict";

define([], function() {
    function Inventory() {
        var items = [];
        var currentItemIndex = 0;
        function add(item) {
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

    return {
        Inventory:Inventory
    };
});
