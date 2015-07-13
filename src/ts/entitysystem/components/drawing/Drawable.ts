///<reference path="../../../framework/observe/Observable.ts"/>
module entityframework.components.drawing {

    /**
     * Represents an object that can be drawn in the game.
     */
    export class Drawable extends framework.observe.Observable {
        private _renderPriority : number;
        private _priorityOffset : number;
        private _rotation : number;
        private _positionOffset : math.Vector = new math.Vector();
        private _inactive : boolean;
        private _key : string;

        constructor() {
            super();

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
