#!/bin/sh
rm -rf yolo-octo-nemesis/build
mkdir yolo-octo-nemesis/build
r.js -o build-parameters.js
cp -r assets yolo-octo-nemesis/build/assets
cp index.* yolo-octo-nemesis/build
cp require.min.js yolo-octo-nemesis/build
