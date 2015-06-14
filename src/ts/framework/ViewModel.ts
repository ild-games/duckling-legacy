/**
 * Created by jeff on 6/13/15.
 */
module framework {
    export class ViewModel {
        protected _context : framework.Context;
        protected _htmlRoot : HTMLElement;
        protected _rivetsBinding;
        protected _commandCallbacks = {};
        data;

        init(context: framework.Context, htmlRoot : HTMLElement, data) : ViewModel {
            this._context = context;
            this._htmlRoot = htmlRoot;
            this.data = data;
            this.render();
            return this;
        }

        render() {
            this._htmlRoot.innerHTML = this._context.Views.getTemplate(this.viewFile)(this);
            this._rivetsBinding = this._context.Rivets.bind(this._htmlRoot, this);
        }

        get viewFile() : string {
            return "no_view_defined";
        }

        get viewModelName() : string {
            return this.constructor["name"];
        }

        setCallback(name : string, callback) {
            this._commandCallbacks[name] = callback;
        }

        handleCommand(name, arg) {
            if (name in this._commandCallbacks) {
                this._commandCallbacks[name].call(this, arg);
            } else {
                debugger;
            }
        }
    }
}
