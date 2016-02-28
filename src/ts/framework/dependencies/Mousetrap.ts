/**
* Initialize the mousetrap key bindings.
* @param window window that mousetrap is being initialized in.
* @param context Context that the key bindings should act on.
*/
export function setupMouestrapBindings(window, context) {
    var mousetrap = window["Mousetrap"];
    var commandQueue = context.commandQueue;

    mousetrap.bind(["command+z", "ctrl+z"], (e) => {
        commandQueue.undo();

        //Prevent the browser from intercepting the event and using its own undo stack
        return false;
    });

    mousetrap.bind(["command+y", "ctrl+y"], (e) => {
        commandQueue.redo();

        //Prevent the browser from intercepting the event and using its own undo stack
        return false;
    });

    //Prevent mousetrap from ignoring keybindings in input controls.
    mousetrap.prototype.stopCallback = function () {
        return false;
    }
}
