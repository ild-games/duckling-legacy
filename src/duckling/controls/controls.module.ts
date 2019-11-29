import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { JsonSchemaEditComponent } from "./json-schema-edit.component";
import { EditInputComponent } from "./edit-input.component";
import { DucklingMaterialModule } from "./duckling-material.module";

import {
    AccordionComponent,
    AccordionElementComponent,
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
} from "./index";
import { ButtonComponent } from "./button.component";

const CONTROL_DECLARATIONS: Array<any> = [
    AccordionComponent,
    AccordionElementComponent,
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
    ButtonComponent,
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
    EditInputComponent,
];

@NgModule({
    imports: [
        BrowserAnimationsModule,
        DucklingMaterialModule,
        CommonModule,
        FormsModule,
    ],
    declarations: CONTROL_DECLARATIONS,
    exports: [
        CONTROL_DECLARATIONS,
        BrowserAnimationsModule,
        DucklingMaterialModule,
        CommonModule,
        FormsModule,
    ],
    entryComponents: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ControlsModule {}
