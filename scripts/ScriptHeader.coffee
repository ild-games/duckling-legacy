# Public: Used to export a variable into the given namespace.  Stolen from https://github.com/jashkenas/coffeescript/wiki/FAQ.
#  see the source for usage examples.
#
# target - (Optional) The object the namespace is attached to.  Defaults to window or exports if two values are provided.
# name - The name of the resulting namespace.
# block - The variable that is being placed in the namespace.
namespace = (target, name, block) ->
  [target, name, block] = [(if typeof exports isnt 'undefined' then exports else window), arguments...] if arguments.length < 3
  top    = target
  target = target[item] or= {} for item in name.split '.'
  block target, top