/*
 * This file is used to set up interfaces available in NodeWebkit that typescript does
 * not expect.
 */

//region Symbol Interface
declare var Symbol : (key : String) => any;
declare var require : (key : string) => any;

interface JQuery {
    selectpicker : any;
}
//endregion
