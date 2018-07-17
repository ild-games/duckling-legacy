import { NgModule } from "@angular/core";

import { StoreService } from "./index";
import { OptionsService } from "./options.service";

@NgModule({
  providers: [StoreService, OptionsService]
})
export class StateModule {}
