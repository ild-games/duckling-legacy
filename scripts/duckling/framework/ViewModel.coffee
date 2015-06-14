$ = require 'jquery'
fs = require 'fs'

class CommandBinding
    
###
The ViewModel will be used 
###
class ViewModel
    constructor: (@htmlRoot,@data,@window) ->
        @__commandCallbacks = {}

    $: (selector) ->
        $(@htmlRoot).find(selector) 

    render: ->
        fs.readFile @viewFile(), 'utf8', (err, data) =>
            if err
                @htmlRoot.html(@errorView())
            else
                @htmlRoot.html(data)
                @rivetsView = @window.rivets.bind(@htmlRoot, this)
                @onRenderComplete()

    viewFile: ->
        "views/no_view_defined.html" 

    onRenderComplete: ->

    viewLoaded: ->

    errorView: ->
        "<span>View #{@viewFile()} failed to load</span>"

    setCallback: (name, callback) ->
        @__commandCallbacks[name] = callback

    handleCommand: (name, arg) ->
        if not name in @__commandCallbacks
            debugger
        else
            @__commandCallbacks[name].call(@, arg)


                
module.exports = ViewModel
