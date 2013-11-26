"use strict";
define(['ui','audio','assets'], function(ui,audio,assets) {
    var sound = {
        target: 'sampler',
        sample: "kick",
        at: 0,
        velocity: 1.0,
        adsr: {attack:0.20, release:0.05 },
        span: 750,
        lensId: -1,
    };

    function Inventory() {
        var changed = false;
        var list = [];
        function add(thing) {
            list.push(thing);
            changed = true;
            if( thing.type === "MUSIC") {
                sound.buffer = assets.get("sample").get("kick");
            }
            else {
                sound.buffer = assets.get("sample").get("snare");
            }
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

        function countCaptured(type) {
            return lastCaptured.reduce( function(total, item) {
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

        var lastCaptured = [];
        var isLastMatch = false;
        function capture() {
            var currentCapture = list.slice( 0, list.length );
            isLastMatch = false;
            if( lastCaptured.length === currentCapture.length ) {
                isLastMatch = currentCapture.every( function(item, index)  {
                    return item.type == lastCaptured[index].type;
                });
            }
            if( isLastMatch ) {
                console.log("matched!");
            }
            lastCaptured = currentCapture;
            list = [];
            changed = true;
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

        function getLastMatched() {
            return isLastMatch;
        }

        return {
            add:add,
            count:count,
            getList:getList,
            capture:capture,
            hasChanged:hasChanged,
            countCaptured:countCaptured,
            getLastMatched:getLastMatched,
        };
    }

    return {
        Inventory:Inventory
    };
});
