import RivetsViewModel from '../RivetsViewModel';
/**
* Used to track all of the jade view templates.  Will usually be attached to the
* context object.
*/
export default class Views {
    private _templates;

    /**
    * Initialize the views object.
    * @param templateObject The object containing all of the jade templates.
    */
    constructor(templateObject) {
        this._templates = templateObject;
    }

    /**
    *
    * @param key A string key describing the template.
    * @returns A function that can be used to generate the view.
    */
    getTemplate(key: string) : (locals: RivetsViewModel<any>)=>string {
        return <(locals: RivetsViewModel<any>)=>string>this._templates[key];
    }
}
