/**
 * Created by alexgoddijn on 22/01/2017.
 */

/**
 * Created by alexgoddijn on 22/01/2017.
 */
/**
 * Created by Alex Goddijn on 2017-01-20.
 */

import InsightFacade from "../src/controller/InsightFacade";
import Log from "../src/Util";
import {expect} from 'chai';
import {InsightResponse} from "../src/controller/IInsightFacade";
var fs: any = require("fs");
var testPath = "./test/data/";

describe("AddDatasetfailingSpec", function () {

    var isf: InsightFacade = new InsightFacade();

    function sanityCheck(response: InsightResponse) {
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
    }

    function checkErr(response: InsightResponse) {
        expect(response.code).to.equal(400);
        expect(response.body).to.have.property("error");
    }

    before(function () {
        Log.test('Before: ' + (<any>this).test.parent.title);
    });

    beforeEach(function () {
        Log.test('BeforeTest: ' + (<any>this).currentTest.title);
    });

    after(function () {
        Log.test('After: ' + (<any>this).test.parent.title);
    });

    afterEach(function () {
        Log.test('AfterTest: ' + (<any>this).currentTest.title);
    });

    it("It should reject given zip file with bad JSON", function () {
        var filename = "badZip1";
        var pathToFile: string = testPath + filename + ".zip";
        var zipData = fs.readFileSync(pathToFile);
        isf.addDataset(filename, zipData).then(function (res: InsightResponse) {
            Log.test(JSON.stringify(res));
            expect.fail();
        }).catch(function (err: any) {
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            checkErr(err);
        });
    });

    it("It should reject given bad zip file", function () {
        var filename = "badZip2";
        var pathToFile: string = testPath + filename + ".zip";
        var zipData = fs.readFileSync(pathToFile);
        isf.addDataset(filename, zipData).then(function (res: InsightResponse) {
            Log.test(JSON.stringify(res));
            expect.fail();
        }).catch(function (err: any) {
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            checkErr(err);
        });
    });

});
