import { Component, Input } from '@angular/core';

/**
 * A simple label for a form
 */
@Component({
  selector: 'dk-form-label',
  styleUrls: ['./form-label.component.scss'],
  template: ` <div class="form-label">{{ title }}</div> `,
})
export class FormLabelComponent {
  @Input() title: string;
}
