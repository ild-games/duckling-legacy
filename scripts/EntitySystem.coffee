obs = require('./Observer.js')

class EntitySystem extends obs.Observable
    constructor: ->
        @_entities = {}

    createEntity: (entityName) ->
        @removeEntity entityName if @containsEntity entityName
        @addEntity entityName, {}

    addEntity: (entityName, entity) ->
        @_entities[entityName] = entity
        @notifyChange entityName, "added"

    getEntity: (entityName) ->
        @_entities[entityName]

    forEach: (callback) ->
        callback key,@_entities[key] for key in @_entities
        return

    removeEntity: (entityName) ->
        if @containsEntity()
            @_entities[entityName] = null
            @notifyChange entityName, "removed"

    containsEntity: (entityName) ->
        @_entities[entityName]?
