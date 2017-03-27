import {NgModule, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '@angular/material';
import {JsonSchemaEditComponent} from './json-schema-edit.component';
import {EditInputComponent} from './edit-input.component';

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
    TemplateWrapperDirective,
    ToolbarButtonComponent,
    ToolbarButtonGroupComponent,
    ValidatedInputComponent,
    VectorInputComponent,
    SectionComponent,
    SectionHeaderComponent,
    InlineEditLabelComponent
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
    TemplateWrapperDirective,
    ToolbarButtonComponent,
    ToolbarButtonGroupComponent,
    ValidatedInputComponent,
    VectorInputComponent,
    SectionComponent,
    SectionHeaderComponent,
    InlineEditLabelComponent,
    JsonSchemaEditComponent,
    EditInputComponent
];

@NgModule({
    imports: [
        MaterialModule.forRoot(),
        CommonModule,
        FormsModule
    ],
    declarations : CONTROL_DECLARATIONS,
    exports : [
        CONTROL_DECLARATIONS,
        MaterialModule,
        CommonModule,
        FormsModule
    ],
    entryComponents: [
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})
export class ControlsModule {

}
