import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MaterialModule} from '@angular/material';

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
    BrowseAssetComponent,
    SectionComponent,
    SectionHeaderComponent
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
    BrowseAssetComponent,
    SectionComponent,
    SectionHeaderComponent
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
    ]
})
export class ControlsModule {

}
