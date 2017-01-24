/**
 * Created by alexgoddijn on 22/01/2017.
 */
/**
 * Created by Alex Goddijn on 2017-01-20.
 */

import InsightFacade from "../src/controller/InsightFacade";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";
var fs: any = require("fs");

describe("AddDatasetPassingSpec", function () {

    var isf: InsightFacade = new InsightFacade();

    function sanityCheck(response: InsightResponse) {
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
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

    it("It should parse a zip file", function () {
        fs.readFile("../courses.zip", function(err: any, data: any) {
            if(err) {
                Log.error(err);
                throw err;
            }
            isf.addDataset("1", data).then(function(res: InsightResponse) {
                Log.test(JSON.stringify(res));
                isf.removeDataset("1").then(function(res: InsightResponse) {
                    Log.test(JSON.stringify(res));
                }).catch(function(err: any) {
                    Log.test(JSON.stringify(err));
                });
            }).catch(function(err: any){
                Log.test(JSON.stringify(err));
            });
        });
    });

});
