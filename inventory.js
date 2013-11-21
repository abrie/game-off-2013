"use strict";
define([], function() {
    function Inventory() {
        var changed = false;
        var list = [];
        function add(thing) {
            list.push(thing);
            changed = true;
            compute();
        }

        function compute() {
            var batteryCount = list.reduce( function(total, item) {
                if( item.type === "BATTERY" ) {
                    return total + 1;
                }
                else {
                    return total;
                }
            }, 0 );

            if( batteryCount > 4 ) {
                list.length = 0;
                console.log("BOOM! Inventory destroyed:", list);
                changed = true;
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
            hasChanged:hasChanged,
        };
    }

    return {
        Inventory:Inventory
    };
});
