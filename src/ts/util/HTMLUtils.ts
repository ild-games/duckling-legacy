/**
* Passes an event to a given element.
*
* @param event The Event to pass.
* @param element The element to pass the event to.
*/
export function passMouseEventToElement(event : Event, element : HTMLElement) {
    element.dispatchEvent(new MouseEvent(event.type, event));
}

/**
* Gets the string representation of what the control key is for the given OS.
* Windows / Linux use "Ctrl" while OSX uses the command symbol (⌘)
*/
export function getCtrlKeyRepresentation() : string {
    var ctrlKey = "";
    switch (process.platform) {
        case "darwin":
        ctrlKey = "&#8984;"
        break;
        default:
        ctrlKey = "Ctrl";
        break;
    }
    return ctrlKey;
}
