import { Injectable, OnDestroy } from "@angular/core";

import { WindowService } from "./window.service";

/**
 * Service that can determine if a keyboard key is down at any time.
 */
@Injectable()
export class KeyboardService implements OnDestroy {
    private _heldKeys: { [keyCode: number]: boolean } = {};

    constructor(private _window: WindowService) {
        this._window.onKeyDown((event: KeyboardEvent) =>
            this._onKeyDown(event)
        );
        this._window.onKeyUp((event: KeyboardEvent) => this._onKeyUp(event));
    }

    ngOnDestroy() {
        this._window.removeKeyDownEvent();
        this._window.removeKeyUpEvent();
    }

    isKeyDown(keyCode: number) {
        return this._heldKeys[keyCode];
    }

    private _onKeyDown(event: KeyboardEvent) {
        this._heldKeys[event.keyCode] = true;
    }

    private _onKeyUp(event: KeyboardEvent) {
        this._heldKeys[event.keyCode] = false;
    }
}

/**
 * Lookup for keyboard codes
 */
export const KeyboardCode = {
    SPACEBAR: 32,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    LEFT: 37,
    DELETE: 46,
    CTRL: 17,
};
