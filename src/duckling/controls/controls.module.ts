import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AngularMaterialModule} from '../angular-material-all';

import {
    Accordian,
    AccordianElement,
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
    IconButton,
    InputComponent,
    JsonComponent,
    NumberInput,
    TemplateWrapper,
    ToolbarButton,
    ToolbarButtonGroup,
    ValidatedInput,
    VectorInput
} from './index';

const CONTROL_DECLARATIONS : Array<any> = [
    Accordian,
    AccordianElement,
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
    IconButton,
    InputComponent,
    JsonComponent,
    NumberInput,
    TemplateWrapper,
    ToolbarButton,
    ToolbarButtonGroup,
    ValidatedInput,
    VectorInput
];

@NgModule({
    imports: [
        AngularMaterialModule,
        CommonModule,
        FormsModule
    ],
    declarations : CONTROL_DECLARATIONS,
    exports : [
        CONTROL_DECLARATIONS,
        AngularMaterialModule,
        CommonModule,
        FormsModule
    ]
})
export class ControlsModule {

}
