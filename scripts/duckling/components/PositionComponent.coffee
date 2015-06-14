namespace 'components', (exports) ->
  class PhysicsViewModel extends framework.ViewModel
    viewFile: ->
      "views/components/physics_component.html"

  class PhysicsComponent extends BaseComponentType
    constructor: (@position = (x: 0, y: 0), @velocity = (x: 0, y: 0)) ->

    componentViewModel: ->
      PhysicsViewModel

    cppType: ->
      "ild::PlatformPhysicsComponent"

    clone: ->
      new PhysicsComponent(@position, @velocity)

  exports.PhysicsComponent = PhysicsComponent
  exports.PhysicsViewModel = PhysicsViewModel
