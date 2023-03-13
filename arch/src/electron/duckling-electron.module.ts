import { NgModule } from "@angular/core";

import { DialogService, WindowService } from "../duckling/util";
import { FileToolbarService } from "../duckling/shell";

import { ElectronToolbarService } from "./shell/electron-toolbar.service";
import { ElectronDialogService } from "./util/electron-dialog.service";
import { ElectronWindowService } from "./util/electron-window.service";

@NgModule({
    providers: [
        { provide: FileToolbarService, useClass: ElectronToolbarService },
        { provide: DialogService, useClass: ElectronDialogService },
        { provide: WindowService, useClass: ElectronWindowService },
    ],
})
export class DucklingElectronModule {}
