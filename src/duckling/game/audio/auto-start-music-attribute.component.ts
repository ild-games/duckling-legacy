import {
    Component,
    Input,
    Output,
    EventEmitter
} from '@angular/core';

import { AutoStartMusicAttribute } from './auto-start-music-attribute';
import { immutableAssign } from '../../util/model';

@Component({
    selector: "dk-auto-start-music-attribute",
    template: `
        <dk-input
            label="Music Key to Play"
            [value]="attribute.musicKeyToPlay"
            (inputChanged)="onMusicKeyToPlayInput($event)">
        </dk-input>
    `
})
export class AutoStartMusicAttributeComponent {
    @Input() attribute: AutoStartMusicAttribute;
    @Output() attributeChanged = new EventEmitter<AutoStartMusicAttribute>();
    
    onMusicKeyToPlayInput(newMusicKeyToPlay : string) {
        this.attributeChanged.emit(immutableAssign(this.attribute, {musicKeyToPlay: newMusicKeyToPlay}));
    }
}
