$ = require 'jquery'
fs = require 'fs'

###
The ViewModel will be used 
###
class ViewModel
    constructor: (@htmlRoot,@data,@window) ->

    $: (selector) ->
        $(@htmlRoot).find(selector) 

    render: ->
        fs.readFile @viewFile(), 'utf8', (err, data) =>
            if err
                @htmlRoot.html(@errorView())
            else
                @htmlRoot.html(data)
                @window.rivets.bind(@htmlRoot, data: @data)

    viewFile: ->
        "views/no_view_defined.html" 

    viewLoaded: ->

    errorView: ->
        "<span>View #{@viewFile()} failed to load</span>"
                
module.exports = ViewModel
