/**
 * Contains helper functions for jquery operations.
 */

 import * as $ from 'jquery';

 /**
 * Adds an option with a given value and text to a select element.
 *
 * @param select JQuery object for the select element.
 * @param value Value of the option.
 * @param text Text of the option.
 */
 export function addOptionToSelect(select : JQuery, value : string, text : string) {
     select.append(
         $("<option></option>")
         .attr("value", value)
         .text(text));
     }
