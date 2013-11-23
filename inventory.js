"use strict";
define(['ui','audio'], function(ui,audio) {
    var sound = {
        target: 'oscsynth',
        notes: [68-12],
        type: "sawtooth",
        at: 0,
        velocity: 1.0,
        adsr: {attack:0.20, release:0.15 },
        span: 0.75
    };

    function Inventory() {
        var changed = false;
        var list = [];
        function add(thing) {
            list.push(thing);
            changed = true;
            audio.dispatch( sound );
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

            if( batteryCount > 8 ) {
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
