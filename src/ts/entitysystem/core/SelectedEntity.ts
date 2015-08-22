module entityframework.core {

    /**
     * Object designed to be used as a shared object on the context.  It represents
     * the entity that is currently being worked on.  ViewModels should listen to
     * the object in order to show data related to the entity currently selected
     * by the user.
     */
    export class SelectedEntity extends framework.observe.Observable {
        private _entityKey : string;

        public get entityKey():string {
            return this._entityKey;
        }

        public set entityKey(value:string) {
            this._entityKey = value;
            this.dataChanged("entityKey", value);
        }
    }
}