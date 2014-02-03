![Product of a Disheveled Mind](screenshot.png)

A #ggo13 entry. The result of a constantly changing mind.

**_Regrettable cross-browser bugs were discovered post-deadline. The consequence of a naive testing strategy._**

## The Game
In this game you chase a Strawman around by solving [8-puzzles](http://en.wikipedia.org/wiki/15_puzzle). A solved 8-puzzle turns into a Jumphole through which you pass a Jingleball. The first puzzle you see has been solved for you as a model. Click the center hole and the Jingleball will begin a Jump Sequence. The Jingleball will Jangle after a number of Jumps. If the Jangle occurs in the same scene as the Strawman then a point is earned and the level advances with an additional scene. You can switch between scenes using the left/right arrows keys or the A/D of WASD. Be warned that the Jump Sequence will be blocked if the destination puzzle is unsolved. That'll cost you a point. And you should know that the Jangleball fizzles out if it runs out of jumps. That'll also cost a point. [Play the game](http://abrie.github.io/game-off-2013/).

## The Hints
You can switch to an optional Probe Tool by pressing the 't' key. Use this tool to discover where a jumphole leads. Probing will neither earn nor cost points. If the probe doesn't enter the Jumphole then it means the Jump Destination puzzle is unsolved, so search for a likely candiate and solve it! Also note that you can displace the Strawman by shifting a tile of the puzzle he occupies.

## The Bugs
* Startup hangs when using Firefox because of an idiosyncracy in the webaudio implementation. This maybe be fixed as standards are standardized. Please use Chrome as a workaround.

The game was developed with Chrome on OSX.

## The Technicals
This game is written in Javascript, and uses the following libraries:
* [THREE.JS](http://threejs.org)
* [JSARToolkit](https://github.com/kig/JSARToolKit)
* [TWEENJS](https://github.com/sole/tween.js/)

## For further information
abrhie@gmail, twitter@abrihe
