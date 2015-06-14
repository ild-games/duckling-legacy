((window) ->
  return if window.rivets["command-*"]?

  next_unique_id = 0
  getUniqueId = (object) ->
    object.__ild_unique_id = "#{object.constructor.name}#{++next_unique_id}" if not object.__ild_unique_id?
    return object.__ild_unique_id

  window.rivets.adapters["@"] =
    observe: ->
      null

    unobserve: ->
      null

    get: (obj, keypath) ->
      window[keypath]

    set: (obj, keypath, value) ->
      window[keypath] = value

  window.rivets.adapters["&"] =
    observe: ->
      null

    unobserve: ->
      null

    get: (obj, keypath) ->
      obj

    set: (obj, keypath, value) ->
      throw EventException("Set should never be called on the this adapter")

  window.rivets.adapters["#"] =
    observe: ->
      null

    unobserve: ->
      null

    get: (obj, keypath) ->
      keypath

    set: (obj, keypath, value) ->
      throw EventException("Set should never be called on an Id binding")

  window.rivets.formatters.unique_id = (value, sub_objects...) ->
    if sub_objects.length
      prefix = (getUniqueId object for object in sub_objects).join("#")
      prefix + "#" + value
    else
      value


  window.rivets.binders["command-*"] =
    routine: (el, value) ->
      command = @type.slice("command-".length)
      $(el).off()
      $(el).on('click', => @view.models.handleCommand(command, value))
    unbind: (el) ->
      $(el).off('click')

  window.rivets.components['view-model'] =
    template: ->
      '<div class="view_root"></div>"'
    initialize: (el, data) ->
      vm = new data.vm window.$(el), data.data, window
      vm.render()
)(this)
