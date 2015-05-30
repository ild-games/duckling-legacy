vm = require('../ViewModel.js')

class SystemBuilderViewModel extends vm
    constructor: (args...) ->
        super args...
        @table = [
            (name: "Alpha", number: 5, deleteEntity: -> debugger)
            (name: "Green", number: 7)
        ]
        @setCallback("delete-entity", (entity) => @deleteEntity entity)
        @setCallback("create-entity", => @createEntity @newEntityName)
        @setCallback("change-entity", => @changeEntity @entitySelector, @entityValue)

    viewFile: ->
        'views/proto/system_builder.html'

    deleteEntity: (entity) -> 
        @table = @table.filter (x) -> not (x is entity)

    createEntity: (entityName) ->
        @table.push(name: entityName, number: 0)

    changeEntity: (selector, value) ->
        @table.forEach (entity) ->
            entity.number = value if entity.name == selector

module.exports = SystemBuilderViewModel