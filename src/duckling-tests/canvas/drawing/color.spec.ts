import 'reflect-metadata';

import {colorToHex, Color} from '../../../duckling/canvas/drawing/color';

describe("color to hex", function() {
    it("converts decimal numbers to hex", function() {
        var testColor : Color = {r: 255, g: 255, b: 255, a: 0};
        expect(colorToHex(testColor)).toBe("FFFFFF");
    });
    it("pads 1 digit color components with zeroes", function() {
        var testColor : Color = {r: 9, g: 8, b: 15, a: 0};
        expect(colorToHex(testColor)).toBe("09080F");
    });
});
