# Duckling Game Editor

## About

Duckling is an interactive game editor used to create map files for the Ancona game engine.

More information about Ancona game engine can be found at the [Ancona github page](https://github.com/tlein/ancona)

![](http://i.imgur.com/n628Eeu.png)


## Setup Instructions

### Installing Dependencies

1. Install npm
2. Install project dependencies `npm install`

### Running from Command Line

`npm start`

### Running Unit Tests

`npm test`

## Configuration Options

Duckling has an optional static configuration file. The file is located at `$HOME/.duckling/options.json`.

### WebGL vs Canvas Renderer

Ducking defaults to WebGL for rendering the game map. Some graphics drivers have problems
with the WebGL renderer. You can use the canvas renderer by setting the "useWebGL" key to false.

#### Example
`
// In $HOME/.duckling/options.json
{
    "useWebGL" : false
}
`
