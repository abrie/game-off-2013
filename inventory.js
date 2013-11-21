"use strict";
define([], function() {
    function Inventory() {
        var changed = false;
        var list = [];
        function add(thing) {
            console.log(thing);
            list.push(thing);
            changed = true;
        }

        function hasChanged() {
            if(changed) {
                changed = false;
                return true;
            }
            return false;
        }

        return {
            add:add,
            list:list,
            hasChanged:hasChanged,
        };
    }

    return {
        Inventory:Inventory
    };
});
