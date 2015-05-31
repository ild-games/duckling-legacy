module.exports = (window) ->
        return if window.rivets["command-*"]?

        window.rivets.adapters["@"] =
            observe: ->

            unobserve: ->

            get: (obj, keypath) ->
                window[keypath]

            set: (obj, keypath, value) ->
                window[keypath] = value

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

