class Event
    constructor: (@object,@key,@data,@child) -> 

class Observable
    constructor: ->
        @_observers = [] 

    addObserver: (name, observer) ->
        @_observers.push name:name observer:observer

    removeObserver: (observer) ->
        @_observers.filter entry -> not entry.observer.is(x)

    dataChanged: (name, event) ->
        @notifyChange name event

    notifyChange: (key, data, trigger) ->
        event = new Event this, key, trigger, data
        @_observers.forEach (entry) ->
            entry.observer.dataChanged entry.key event

module.export = Event: Event Observable: Observable
