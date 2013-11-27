"use strict";
define(['filtermode','assets', 'utility', 'settings' ], function( filtermode, assets, utility, settings ) {
    function Place( clipName, filterDescriptors, onTransport, onInteraction ) {
        var video = assets.get( clipName );
        var filters = filterDescriptors.map( function(filterDescriptor) { 
            var filter = new filtermode.Filter( filterDescriptor );
            filter.onSwap = onInteraction; 
            filter.onTransport = onTransport;
            return filter;
        });

        function getVideo() {
            return video;
        }

        function getRandomPuzzle() {
            var filter = utility.randomElement( filters );
            return {
                filter: filter,
                puzzle: filter.getRandomPuzzle(),
            };
        }

        function getFilter( index ) {
            return filters[index];
        }

        var result = {
            filters: filters,
            getFilter: getFilter,
            getRandomPuzzle: getRandomPuzzle,
            getVideo: getVideo,
        };

        return result;
    }

    return {
        Place:Place
    };
});
