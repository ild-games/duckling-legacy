ViewModel = require('../framework/ViewModel.js')

class EntityEditorViewModel extends ViewModel 
    setEntity: (entity) ->
        @data.entity = entity

    hasEntity: ->
        @data.entity?

    viewFile: ->
        "views/canvas/root_canvas_view.html"

module.exports = CanvasViewModel
