import {Injectable} from 'angular2/core';
import {remote} from 'electron';

import {WindowService} from '../../duckling/util/window.service';


/**
 * Service to manage the Electron window that Duckling is running in.
 */
@Injectable()
export class ElectronWindowService implements WindowService {
    private _curWindow = remote.getCurrentWindow();

    setSize(width : number, height : number) : void {
        this._curWindow.setSize(width, height);
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
}
