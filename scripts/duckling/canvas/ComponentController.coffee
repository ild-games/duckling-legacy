namespace 'canvas', (exports) ->

  class ComponentController
    constructor: (@component) ->

    render: (canvas, selected) ->
      null

    selectionBox: ->
      [0, 0, 0, 0]

  exports.ComponentController = ComponentController