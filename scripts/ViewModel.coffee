$ = require 'jquery'
fs = require 'fs'

class CommandBinding
    
###
The ViewModel will be used 
###
class ViewModel
    constructor: (@htmlRoot,@data,@window) ->
        @__attachCommandBinder(@window.rivets)
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

    __attachCommandBinder: (rivets) ->
        return if rivets["command-*"]?
        rivets.binders["command-*"] =
            routine: (el, value) ->
                command = @type.slice("command-".length)
                $(el).off()
                $(el).on('click', => @view.models.handleCommand(command, value))
            unbind: (el) ->
                $(el).off('click')
                
module.exports = ViewModel
