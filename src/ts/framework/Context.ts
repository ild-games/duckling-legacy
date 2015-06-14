/**
 * Created by jeff on 6/13/15.
 */
module framework {
    export class Context {
        _views : framework.Views;
        _commandQueue : framework.CommandQueue;
        _window : Window;
        _rivets;

        constructor(templateContainer, window: Window) {
            this._views = new framework.Views(templateContainer);
            this._commandQueue = new framework.CommandQueue();
            this._window = window;
            this._rivets = window["rivets"];
        }

        get Views() : framework.Views {
            return this._views;
        }

        get CommandQueue() : framework.CommandQueue {
            return this._commandQueue;
        }

        get Window() : Window {
            return this._window;
        }

        get Rivets() {
            return this._rivets;
        }
    }
}