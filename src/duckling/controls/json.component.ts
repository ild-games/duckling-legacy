import {
    Component,
    Input
} from '@angular/core';

/**
 * A Component used to display the json representing an arbitrary value.
 */
@Component({
    selector: "dk-json",
    template: "<div>{{valueAsJSON}}<div>"
})
export class JsonComponent {
    /**
     * The object that will be displayed as json.
     */
    @Input() value : any;

    get valueAsJSON() {
        return JSON.stringify(this.value, null, 4);
    }
}
