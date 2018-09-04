import { NgModule } from "@angular/core";

import { ControlsModule } from "../controls/controls.module";
import { EntityEditorModule } from "../entityeditor/entity-editor.module";
import { CanvasModule } from "../canvas/canvas.module";
import { SplashModule } from "../splash/splash.module";
import { ShellComponent } from "./shell.component";

@NgModule({
    imports: [EntityEditorModule, CanvasModule, SplashModule, ControlsModule],
    declarations: [ShellComponent],
    exports: [ShellComponent],
})
export class ShellModule {}
