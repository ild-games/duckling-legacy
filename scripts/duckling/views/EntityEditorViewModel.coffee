namespace 'views', (exports) ->

    class EntityEditorViewModel extends ViewModel
        setEntity: (entity) ->
            @data.entity = entity

        hasEntity: ->
            @data.entity?

        viewFile: ->
            "views/canvas/root_canvas_view.html"

    exports.EntityEditorViewModel = EntityEditorViewModel