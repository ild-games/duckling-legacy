import {
    Component,
    Input,
    Output,
    EventEmitter,
    ViewChild,
    ElementRef
} from '@angular/core';

/**
 * Helper component used to implement input controls
 */
@Component({
    selector: "dk-input",
    styleUrls: ['../build/duckling/controls/input.component.css'],
    template:`
        <md-input-container
            dividerColor="{{dividerColor}}"
            (input)="onUserInput($event.target.value)"
            (focus)="onFocus()">
            <input #rawInputElement
                mdInput
                [disabled]="disabled"
                placeholder={{label}}
                value="{{value}}">
        </md-input-container>
    `
})
export class InputComponent {
    /**
     * HTMLElement of the input element
     */
    @ViewChild('rawInputElement') rawInputElement : ElementRef;
    
    /**
     * Text label displayed to the user.
     */
    @Input() label : string;
    /**
     * The value stored in the control.
     */
    @Input() value : string;
    /**
     * True if the input element is disabled.
     */
    @Input() disabled : boolean;
    /**
     * The color of the input field
     */
    @Input() dividerColor : string = "primary";
    /**
     * Event published when the user enters input.
     */
    @Output() inputChanged = new EventEmitter<String>();
    /**
     * Event published when the user focuses the input
     */
    @Output() focus = new EventEmitter<boolean>();

    onUserInput(newValue : string) {
        this.inputChanged.emit(newValue);
    }

    onFocus() {
        this.focus.emit(true);
    }

    get rawValue() : string {
        return this.rawInputElement.nativeElement.value;
    }
}
