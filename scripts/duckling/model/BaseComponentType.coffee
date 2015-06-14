namespace 'model', (exports) ->
  class BaseComponentType
    componentViewModel: ->
      null

    cppType: ->
      null

    clone: ->

  BaseComponentType.ComponentController = ComponentController

  exports.BaseComponentType = BaseComponentType

