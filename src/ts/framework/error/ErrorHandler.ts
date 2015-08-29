module framework.error {
    /**
     * Start listening for uncaught exceptions.
     * @param window Window that exceptions are being listened for on.
     */
    export function startListener(window : Window) {
        window.addEventListener("error", onUncaughtException(window));
    }

    function onUncaughtException(window) {
        return function (e : ErrorEvent) {
            window.alert(e.error.stack);
        }
    }
}
