ComponentController = require "../canvas/ComponentController.js"

class BaseComponentType
    componentViewModel: ->
        null

    cppType: ->
        null

    clone: ->

module.exports = BaseComponentType
BaseComponentType.ComponentController = ComponentController
