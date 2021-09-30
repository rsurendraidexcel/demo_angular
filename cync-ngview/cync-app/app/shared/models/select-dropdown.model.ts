
/**
 * Model class for cync application dropdown for any html page
 */
export class SelectDropDown {
    value: Object;
    display: string;

    constructor(value: Object, display: string) {
        this.value = value;
        this.display = display;
    }
}