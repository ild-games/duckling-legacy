///<reference path="../../../framework/observe/Observable.ts"/>
module entityframework.components.drawing {

    import serialize = util.serialize;

    /**
     * Represents an object that can be drawn in the game.
     */
    export class Drawable extends framework.observe.Observable {
        @serialize.Key("renderPriority")
        private _renderPriority : number;

        @serialize.Key("priorityOffset")
        private _priorityOffset : number;

        @serialize.Key("rotation")
        private _rotation : number;

        @serialize.Key("positionOffset")
        private _positionOffset : math.Vector = new math.Vector();

        @serialize.Key("inactive")
        private _inactive : boolean;

        @serialize.Key("key")
        private _key : string;

        constructor(key : string) {
            super();
            this._key = key;
            this._positionOffset.listenForChanges("positionOffset", this);
        }

        //region Getters and Setters
        public get renderPriority():number {
            return this._renderPriority;
        }

        public set renderPriority(value:number) {
            this.dataChanged("renderPriority", value);
            this._renderPriority = value;
        }

        public get priorityOffset():number {
            return this._priorityOffset;
        }

        public set priorityOffset(value:number) {
            this.dataChanged("priorityOffset", value);
            this._priorityOffset = value;
        }

        public get rotation():number {
            return this._rotation;
        }

        public set rotation(value:number) {
            this.dataChanged("rotation", value);
            this._rotation = value;
        }

        public get positionOffset():math.Vector {
            return this._positionOffset;
        }

        public set positionOffset(value:math.Vector) {
            this._positionOffset = value;
        }

        public get inactive():boolean {
            return this._inactive;
        }

        public set inactive(value:boolean) {
            this.dataChanged("inactive", value);
            this._inactive = value;
        }

        public get key():string {
            return this._key;
        }

        public set key(value:string) {
            this.dataChanged("key", value);
            this._key = value;
        }
        //endregion
    }

}
