import { NgModule } from '@angular/core';

import { DialogService, WindowService } from '../duckling/util';

import { ElectronDialogService } from './util/electron-dialog.service';
import { ElectronWindowService } from './util/electron-window.service';

@NgModule({
  providers: [
    { provide: DialogService, useClass: ElectronDialogService },
    { provide: WindowService, useClass: ElectronWindowService },
  ],
})
export class DucklingElectronModule {}
