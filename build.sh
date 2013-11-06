#!/bin/sh
dest='yolo-octo-nemesis'
rm -rf $dest/build
mkdir $dest/build
r.js -o build-parameters.js
cp -r assets $dest/build/assets
cp index.* $dest/build
cp require.min.js $dest/build
