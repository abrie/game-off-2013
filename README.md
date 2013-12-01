![Product of a Disheveled Mind](screenshot.png)

A #ggo13 entry. This is what happens when a undirected mind writes a game. The result of searching for a game mechanic by hoping for accidents. Various game objects and abandoned ideas are hidden behind a wall of commits. A month of hopeless thrashing around --- with moments of optimistic exultation and periods of empty surrender. [play the game](http://abrie.github.io/game-off-2013/).

## The Game
In this game you chase a strawman around by solving [8-puzzles](http://en.wikipedia.org/wiki/15_puzzle). A solved 8-puzzle turns into a Jumphole through which you pass a Jingleball. The Jingleball triggers a Jangle after a number of Jumps. If the Jangle occurs in the same scene as the Strawman then you earn a point and the level advances. You can switch between scenes using the left/right arrows keys or A/D of WASD. Click in the center hole of a solved puzzle to trigger starts Jangleball Jump, but be warned that the Jump will be blocked if the destination puzzle is unsolved. And remember that the Jangleball fizzles out if it runs out of jumps. A Blocked Jump or a Fizzled Jangle subtracts a point from your score.

## The Hints
You can switch to a Probe Tool by pressing the 't' key. This will indicate to where a jumphole leads. Probing will not earn or cost points. If the probe doesn't enter the Jumphole then it means the Jump Destination puzzle is unsolved. Also note that you can displace the Strawman by shifting a tile of the puzzle he occupies.

## The Technicals
This game is written in Javascript, and uses the following libraries:
* [THREE.JS](http://threejs.org)
* [JSARToolkit](https://github.com/kig/JSARToolKit)
* [TWEENJS](https://github.com/sole/tween.js/)

## For further information
abrhie@gmail, twitter@abrihe
