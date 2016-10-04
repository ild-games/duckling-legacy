import {Injectable, OnDestroy} from '@angular/core';

import {WindowService} from './window.service';

/**
 * Service that can determine if a keyboard key is down at any time.
 */
@Injectable()
export class KeyboardService implements OnDestroy {

    private _heldKeys : {[keyCode : number] : boolean} = {};

    constructor(private _window : WindowService) {
        this._window.onKeyDown((event : KeyboardEvent) => this._onKeyDown(event));
        this._window.onKeyUp((event : KeyboardEvent) => this._onKeyUp(event));
    }

    ngOnDestroy() {
        this._window.removeKeyDownEvent();
        this._window.removeKeyUpEvent();
    }

    isKeyDown(keyCode : number) {
        return this._heldKeys[keyCode];
    }

    private _onKeyDown(event : KeyboardEvent) {
        this._heldKeys[event.keyCode] = true;
    }

    private _onKeyUp(event : KeyboardEvent) {
        this._heldKeys[event.keyCode] = false;
    }
}


/**
 * Lookup functions for keyboard key codes
 */
export class KeyboardCodeLibrary {
    static isSpacebar(keyCode : number) : boolean {
        return keyCode === 32;
    }

    static isUp(keyCode : number) : boolean {
        return keyCode === 38;
    }

    static isRight(keyCode : number) : boolean {
        return keyCode === 39;
    }

    static isDown(keyCode : number) : boolean {
        return keyCode === 40;
    }

    static isLeft(keyCode : number) : boolean {
        return keyCode === 37;
    }
}
