import {NgModule} from '@angular/core';
import {MdButtonModule} from '@angular2-material/button';
import {MdCardModule} from '@angular2-material/card';
import {MdCheckboxModule} from '@angular2-material/checkbox';
import {MdInputModule} from '@angular2-material/input';
import {MdListModule} from '@angular2-material/list';
import {MdRippleModule} from '@angular2-material/core/ripple/ripple';
import {OverlayModule} from '@angular2-material/core/overlay/overlay-directives';

const MATERIAL_MODULES = [
    MdButtonModule,
    MdCardModule,
    MdCheckboxModule,
    MdInputModule,
    MdListModule,
    MdRippleModule,
    OverlayModule,
];

@NgModule({
    imports: MATERIAL_MODULES,
    exports: MATERIAL_MODULES
})
export class AngularMaterialModule { }