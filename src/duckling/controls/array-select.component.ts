import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Select control that accepts an array of options.
 */
@Component({
  selector: 'dk-array-select',
  template: `
    <select [(ngModel)]="value">
      <option *ngFor="let option of options" [value]="option.value">
        {{ option.title }}
      </option>
    </select>
  `,
})
export class ArraySelectComponent {
  /**
   * The selected value.
   */
  @Input() value: string;

  /**
   * The available options.
   */
  @Input() options: SelectOption[];

  /**
   * Event that is published with the new value whenever the user changes it.
   */
  @Output() selection = new EventEmitter<string>();

  onSelectionChanged(index: number) {
    this.selection.emit(this.options[index].value);
  }

  indexOfValue(value: string) {
    return this.options.findIndex((option) => option.value === value);
  }
}

/**
 * Describes a single option provided to the user.
 */
export interface SelectOption {
  value: string;
  title: string;
}

/**
 * Takes an array of values and returns SelectOptions for those values. This will
 * set the values to be all lowercase and the title of the SelectOptions will
 * have the first letter in uppercase
 *
 * @param values string array of values to turn into SelectOptions
 * @return array of SelectOptions based on the values
 */
export function toSelectOptions<T extends string>(
  ...values: T[]
): SelectOption[] {
  let selectOptions: SelectOption[] = [];
  for (let value of values) {
    selectOptions.push(toSelectOption(value));
  }
  return selectOptions;
}

/**
 * Takes a value and returns a SelectOption for the value. This will
 * set the value to be all lowercase and the title of the SelectOption will
 * have the first letter in uppercase
 *
 * @param value string value to turn into a SelectOption
 * @return SelectOption based on the value
 */
export function toSelectOption<T extends string>(value: T): SelectOption {
  return {
    value: value.toLowerCase(),
    title: value.substring(0, 1).toUpperCase() + value.substring(1),
  };
}
