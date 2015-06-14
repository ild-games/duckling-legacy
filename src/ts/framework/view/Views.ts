/**
 * Created by jeff on 6/13/15.
 */
module framework {
    export class Views {
        private _templates;

        constructor(templateObject) {
            this._templates = templateObject;
        }

        getTemplate(key: string) : (locals: ViewModel)=>string {
            return <(locals: ViewModel)=>string>this._templates[key];
        }
    }
}