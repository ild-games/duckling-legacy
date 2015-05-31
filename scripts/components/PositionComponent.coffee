ViewModel = require '../framework/ViewModel.js'
BaseComponentType = require "../model/BaseComponentType.js"

class PhysicsViewModel extends ViewModel
    viewFile: ->
        "views/components/physics_component.html"

class PhysicsComponent extends BaseComponentType
    constructor: (@position = (x:0, y:0), @velocity = (x:0, y:0)) ->

    componentViewModel: ->
        PhysicsViewModel

    cppType: ->
        "ild::PlatformPhysicsComponent"

    clone: ->
        new PhysicsComponent(@position, @velocity)

    
module.exports = PhysicsComponent
