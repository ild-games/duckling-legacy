/**
 * Contains helper functions for html operations.
 */
module util.html {

    /**
     * Passes an event to a given element.
     *
     * @param event The Event to pass.
     * @param element The element to pass the event to.
     */
    export function passMouseEventToElement(event : Event, element : HTMLElement) {
        element.dispatchEvent(new MouseEvent(event.type, event));
    }
}
