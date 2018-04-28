import { Injectable, OnDestroy } from '@angular/core';

import { WindowService } from './window.service';

@Injectable()
export class MouseService implements OnDestroy {

    private _heldButtons: { [button: number]: boolean } = {};

    constructor(private _window: WindowService) {
        this._window.onMouseDown((event: MouseEvent) => this.onMouseDown(event));
        this._window.onMouseUp((event: MouseEvent) => this.onMouseUp(event));
    }

    ngOnDestroy() {
        this._window.removeMouseDownEvent();
        this._window.removeMouseUpEvent();
    }

    isButtonDown(button: number) {
        return this._heldButtons[button];
    }

    onMouseDown(event: MouseEvent) {
        this._heldButtons[event.button] = true;
    }

    onMouseUp(event: MouseEvent) {
        this._heldButtons[event.button] = false;
    }
}

/**
 * Enum describing the available mouse buttons.
 */
export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2
}
