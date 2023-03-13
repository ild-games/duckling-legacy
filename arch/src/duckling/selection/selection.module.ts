import { NgModule } from "@angular/core";

import { CopyPasteService, SelectionService } from "./index";

@NgModule({
    providers: [CopyPasteService, SelectionService],
})
export class SelectionModule {}
