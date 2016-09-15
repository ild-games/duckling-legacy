import {NgModule} from '@angular/core';
import {AngularMaterialModule} from '../angular-material-all';

import {
    Accordian,
    ArrayChoiceComponent,
    ArraySelect,
    Box2Component,
    CheckboxComponent,
    ColorInput,
    DeleteButton,
    EnumChoiceComponent,
    EnumSelect,
    FormLabel,
    Icon,
    InputComponent,
    JsonComponent,
    NumberInput,
    ToolbarButton,
    ValidatedInput,
    VectorInput
} from './index';

const CONTROL_DECLARATIONS : Array<any> = [
    Accordian,
    ArrayChoiceComponent,
    ArraySelect,
    Box2Component,
    CheckboxComponent,
    ColorInput,
    DeleteButton,
    EnumChoiceComponent,
    EnumSelect,
    FormLabel,
    Icon,
    InputComponent,
    JsonComponent,
    NumberInput,
    ToolbarButton,
    ValidatedInput,
    VectorInput
];

@NgModule({
    imports: [
        AngularMaterialModule
    ],
    declarations : CONTROL_DECLARATIONS,
    exports : CONTROL_DECLARATIONS
})
export class ControlsModule {

}
