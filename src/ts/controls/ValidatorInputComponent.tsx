import {TextField} from "material-ui";
import * as React from "react";

export interface ValidatorInputState {
    value?: string | number;
    errorText?: React.ReactNode;
}

export interface TextInputProps {
    disabled?: boolean;
    errorText?: React.ReactNode;
    floatingLabelText?: React.ReactNode;
    fullWidth?: boolean;
    hintText?: React.ReactNode;
    id?: string;
    underlineShow?: boolean;
    value?: string | number;
    onValidInput : (string) => void;
}

export interface ValidatorInputProps extends TextInputProps {
    validator : (string) => boolean;
}

/**
 * A control that allows you to validate the user's input. It will only update the model if the user's input is valid.
 */
export default class ValidatorInputComponent extends React.Component<ValidatorInputProps, ValidatorInputState> {
    constructor(props : ValidatorInputProps) {
        super(props);
        this.state = { value: props.value };
    }

    componentWillReceiveProps(nextProps : ValidatorInputProps) {
        this.setState({ value: nextProps.value });
    }

    render() {
        return (
            <TextField
                onChange={(event) => this.textChanged(event)}
                value={this.state.value}
                disabled={this.props.disabled}
                errorText={this.state.errorText}
                floatingLabelText={this.props.floatingLabelText}
                fullWidth={this.props.fullWidth}
                hintText={this.props.hintText}
                id={this.props.id}
                underlineShow={this.props.underlineShow}
            />
        );
    }

    textChanged(event) {
        this.setState({ value: event.target.value });
        if (this.props.validator(event.target.value)) {
            this.props.onValidInput(event.target.value);
            this.setState({ errorText: null });
        } else {
            this.setState({ errorText: "Error: Not a number" });
        }
    }
}
