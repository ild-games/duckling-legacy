/**
 * Enum describing the available mouse buttons.
 */
export enum MouseButton {
    None = 0,
    Left = 1,
    Right = 2
}

/**
 * Given a mouse event determine if the given button is pressed.
 * @param  event  The mouse event that was triggered.
 * @param  button A button that may be pressed.
 * @return True if the button is pressed.  False otherwise.
 */
export function isMouseButtonPressed(event : MouseEvent, button : MouseButton) {
    return !!(event.buttons & button);
}
