module framework {
    /**
     * Used to track all of the jade view templates.  Will usually be attached to the
     * context object.
     */
    export class Views {
        private _templates;

        /**
         * Initialize the Views object.
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
        getTemplate(key: string) : (locals: ViewModel)=>string {
            return <(locals: ViewModel)=>string>this._templates[key];
        }
    }
}