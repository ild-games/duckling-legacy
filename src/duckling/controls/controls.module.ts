import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AngularMaterialModule} from '../angular-material-all';

import {
    AccordianComponent,
    AccordianElementComponent,
    ArrayChoiceComponent,
    ArraySelectComponent,
    Box2Component,
    CheckboxComponent,
    ColorComponent,
    DeleteButtonComponent,
    EnumChoiceComponent,
    EnumSelectComponent,
    FormLabelComponent,
    IconComponent,
    IconButtonComponent,
    InputComponent,
    JsonComponent,
    NumberInputComponent,
    TemplateWrapper,
    ToolbarButtonComponent,
    ToolbarButtonGroupComponent,
    ValidatedInputComponent,
    VectorInputComponent,
    BrowseFileComponent,
    CollapsibleSectionComponent
} from './index';

const CONTROL_DECLARATIONS : Array<any> = [
    AccordianComponent,
    AccordianElementComponent,
    ArrayChoiceComponent,
    ArraySelectComponent,
    Box2Component,
    CheckboxComponent,
    ColorComponent,
    DeleteButtonComponent,
    EnumChoiceComponent,
    EnumSelectComponent,
    FormLabelComponent,
    IconComponent,
    IconButtonComponent,
    InputComponent,
    JsonComponent,
    NumberInputComponent,
    TemplateWrapper,
    ToolbarButtonComponent,
    ToolbarButtonGroupComponent,
    ValidatedInputComponent,
    VectorInputComponent,
    BrowseFileComponent,
    CollapsibleSectionComponent
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
