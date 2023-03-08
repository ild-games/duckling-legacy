import { Injectable } from "@angular/core";
import { getCurrentWindow} from "@electron/remote";

import { WindowService } from "../../duckling/util/window.service";

/**
 * Service to manage the Electron window that Duckling is running in.
 */
@Injectable()
export class ElectronWindowService extends WindowService {
    private _curWindow = getCurrentWindow();

    get width(): number {
        return this._curWindow.getSize()[0];
    }

    get height(): number {
        return this._curWindow.getSize()[1];
    }

    onResize(handler: Function) {
        window.onresize = () => handler();
    }

    removeResizeEvent() {
        window.onresize = null;
    }

    onKeyDown(handler: Function) {
        window.onkeydown = (event: KeyboardEvent) => handler(event);
    }

    onKeyUp(handler: Function) {
        window.onkeyup = (event: KeyboardEvent) => handler(event);
    }

    removeKeyDownEvent() {
        window.onkeydown = null;
    }

    removeKeyUpEvent() {
        window.onkeyup = null;
    }

    onMouseDown(handler: Function) {
        window.onmousedown = (event: MouseEvent) => handler(event);
    }

    onMouseUp(handler: Function) {
        window.onmouseup = (event: MouseEvent) => handler(event);
    }

    removeMouseDownEvent() {
        window.onmousedown = null;
    }

    removeMouseUpEvent() {
        window.onmouseup = null;
    }

    setSize(width: number, height: number): void {
        this._curWindow.setSize(width, height);
    }

    setMinimumSize(minWidth: number, minHeight: number): void {
        this._curWindow.setMinimumSize(minWidth, minHeight);
    }

    center(): void {
        this._curWindow.center();
    }

    maximize(): void {
        this._curWindow.maximize();
    }

    unmaximize(): void {
        this._curWindow.unmaximize();
    }

    setResizable(isResizable: boolean): void {
        this._curWindow.setResizable(isResizable);
    }

    clearSelection(): void {
        window.getSelection().removeAllRanges();
    }
}
