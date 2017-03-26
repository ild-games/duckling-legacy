import 'mocha';
import {expect} from 'chai';
import {PathService} from '../../duckling/util/path.service';

describe("path.toKey", function() {
    let path = new PathService();

    it("Handles absolute paths", function() {
        let directory = "/home/jeff/Projects/SickProjectName/resources/";
        let file = "/home/jeff/Projects/SickProjectName/resources/images/a_duck.png";
        expect(path.toKey(directory, file)).to.eql("images/a_duck");
    });

    it("Handles relative paths", function() {
        let directory = "resources/";
        let file = "resources/images/a_duck.png";
        expect(path.toKey(directory, file)).to.eql("images/a_duck");
    });

    it("Handles absolute windows paths", function() {
        let directory = "C:/jeff/Projects/SickProjectName/resources/";
        let file = "C:/jeff/Projects/SickProjectName/resources/images/a_duck.png";
        expect(path.toKey(directory, file)).to.eql("images/a_duck");
    });
});
