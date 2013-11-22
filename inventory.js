"use strict";
define(['ui'], function(ui) {
    function Inventory() {
        var changed = false;
        var list = [];
        function add(thing) {
            list.push(thing);
            changed = true;
            compute();
        }

        function count(type) {
            return list.reduce( function(total, item) {
                if( item.type === type ) {
                    return total + 1;
                }
                else {
                    return total;
                }
            }, 0);
        }

        function compute() {
            var batteryCount = count("BATTERY");

            if( batteryCount > 4 ) {
                list.length = 0;
                console.log("BOOM! Inventory destroyed:", list);
                changed = true;
                ui.shake();
            }
        }

        function hasChanged() {
            if(changed) {
                changed = false;
                return true;
            }
            else {
                return false;
            }
        }

        function getList() {
            return list;
        }

        return {
            add:add,
            getList:getList,
            count:count,
            hasChanged:hasChanged,
        };
    }

    return {
        Inventory:Inventory
    };
});
