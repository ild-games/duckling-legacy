import * as React from "react";

import ValidatorInputComponent, {TextInputProps} from './ValidatorInputComponent';

var regex=/^\-?[0-9]+(\.[0-9]+)?$/;

/**
 * React component that validates the input is a number.
 */
export default function NumberInputComponent(props : TextInputProps) {
    return (
        <ValidatorInputComponent
            validator={(value) => value.match(regex) !== null }
            {...props}
        />
    )
}
