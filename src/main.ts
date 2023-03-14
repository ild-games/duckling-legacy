import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DucklingAppModule } from './duckling/duckling.module';

platformBrowserDynamic()
  .bootstrapModule(DucklingAppModule)
  .catch((err) => console.error(err));
