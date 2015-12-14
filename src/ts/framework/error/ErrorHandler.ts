module framework.error {
    /**
     * Start listening for uncaught exceptions.
     * @param window Window that exceptions are being listened for on.
     */
    export function startListener(window : Window) {
        window.addEventListener("error", onUncaughtException(window));
    }

    /*
     * Create an error handler for a promise.
     * @param context Context that the error is occuring in.
     */
    export function onPromiseError(context : Context) {
        return function(error) {
            window.console.log(error);
            alert(error.stack);
        };
    }

    function onUncaughtException(window) {
        return function (e : ErrorEvent) {
            window.console.log(e);
            window.alert(e.error.stack);
        }
    }
}
