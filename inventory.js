"use strict";
define([], function() {
    function Inventory() {
        var list = [];
        function add(thing) {
            list.push(thing);
            console.log(list);
        }

        return {
            add:add
        };
    }

    return {
        Inventory:Inventory
    };
});
