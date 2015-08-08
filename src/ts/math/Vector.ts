///<reference path="../util/JsonLoader.ts"/>
module math {
    /**
     * A 2D vector.
     */
    export class Vector extends framework.observe.Observable {
        @util.JsonKey("x")
        private _x : number;

        @util.JsonKey("y")
        private _y : number;

        /**
         * Construct a new vector.
         * @param x Optional initial x.
         * @param y Optional initial y.
         */
        constructor(x? : number, y? : number) {
            super();
            this._x = x || 0;
            this._y = y || 0;
        }

        //region Getters and Setters
        get x() {
            return this._x;
        }
        get y() {
            return this._y;
        }

        set x(val : number) {
            this._x = Number(val);
            this.dataChanged("x", val);
        }

        set y(val : number) {
            this._y = Number(val);
            this.dataChanged("y", val);
        }
        //endregion
    }
}