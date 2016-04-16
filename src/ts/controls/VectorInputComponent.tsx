import * as React from "react";

import NumberInputComponent from './NumberInputComponent';
import {TextInputProps} from './ValidatorInputComponent';

export interface VectorInputProps {
    onInput(x : number, y : number),
    value : {x : number, y : number},
    name : string
}

/**
 * Control that allows a user to modify a vector.
 */
export default function VectorInputComponent(props :VectorInputProps) {
    return (
        <div>
            <NumberInputComponent
                hintText="Enter the x value"
                floatingLabelText={"X " + props.name}
                value={props.value.x}
                onValidInput={(xvalue) => props.onInput(Number(xvalue), props.value.y)} />
            <br />
            <NumberInputComponent
                hintText="Enter the y value"
                floatingLabelText={"Y " + props.name}
                value={props.value.y}
                onValidInput={(yvalue) => props.onInput(props.value.x, (Number(yvalue)))} />
            <br />
        </div>
    );
}
