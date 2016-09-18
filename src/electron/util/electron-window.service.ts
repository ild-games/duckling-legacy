import {Injectable} from '@angular/core';
import {remote} from 'electron';

import {WindowService} from '../../duckling/util/window.service';


/**
 * Service to manage the Electron window that Duckling is running in.
 */
@Injectable()
export class ElectronWindowService extends WindowService {
    private _curWindow = remote.getCurrentWindow();

    get width() : number {
        return this._curWindow.getSize()[0];
    }

    get height() : number {
        return this._curWindow.getSize()[1];
    }

    onResize(handler: Function) {
        window.onresize = () => handler();
    }

    removeResizeEvent() {
        window.onresize = null;
    }

    onKeyDown(handler: Function) {
        window.onkeydown = (event : KeyboardEvent) => handler(event);
    }

    removeKeyDownEvent() {
        window.onkeydown = null;
    }

    onKeyUp(handler: Function) {
        window.onkeyup = (event : KeyboardEvent) => handler(event);
    }

    removeKeyUpEvent() {
        window.onkeyup = null;
    }

    setSize(width : number, height : number) : void {
        this._curWindow.setSize(width, height);
    }

    setMinimumSize(minWidth : number, minHeight : number) : void {
        this._curWindow.setMinimumSize(minWidth, minHeight);
    }

    center() : void {
        this._curWindow.center();
    }

    maximize() : void {
        this._curWindow.maximize();
    }

    setResizable(isResizable : boolean) : void {
        this._curWindow.setResizable(isResizable);
    }

    clearSelection() : void {
        window.getSelection().removeAllRanges();
    }
}
