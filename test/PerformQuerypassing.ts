/**
 * Created by shrey on 2017-01-21.
 */
/**
 * Created by rtholmes on 2016-10-31.
 */

import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse, QueryRequest, IInsightFacade} from "../src/controller/IInsightFacade";
import JSON = Mocha.reporters.JSON;
import InsightFacade from "../src/controller/InsightFacade";


describe("PerformQueryPassing", function () {


    function sanityCheck(response: InsightResponse) {
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
    }

    var insightFacade : InsightFacade = null;

    before(function () {
        Log.test('Before: ' + (<any>this).test.parent.title);
    });

    beforeEach(function () {
        Log.test('BeforeTest: ' + (<any>this).currentTest.title);
        insightFacade = new InsightFacade();
    });

    after(function () {
        Log.test('After: ' + (<any>this).test.parent.title);
    });

    afterEach(function () {
        Log.test('AfterTest: ' + (<any>this).currentTest.title);
        insightFacade = null;
    });

    it("Simple query with GT", function () {
        let queryRequest = require("./data/simpleGTquery.json");
        let objBody = require("./data/simpleGTbody.json");
        return insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.equal(objBody);
        }).catch(function (err) {
            Log.test('Error:' + err);
            expect.fail();
        });
    });

    it("Simple query with EQ", function () {
        let queryRequest = require("./data/simpleEQquery.json");
        let objBody = require("./data/simpleEQbody.json");
        return insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.equal(objBody);
        }).catch(function (err) {
            Log.test('Error:' + err);
            expect.fail();
        });
    });

    it("Simple query with LT", function () {
        let queryRequest = require("./data/simpleLTquery.json");
        let objBody = require("./data/simpleLTbody.json");
        return insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.equal(objBody);
        }).catch(function (err) {
            Log.test('Error:' + err);
            expect.fail();
        });
    });

    it("Complex query", function () {
        let queryRequest = require("./data/complexQuery.json");
        let objBody = require("./data/complexQueryBody.json");
        return insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.equal(objBody);
        }).catch(function (err) {
            Log.test('Error:' + err);
            expect.fail();
        });
    });

    it("Complex query with NOT", function () {
        let queryRequest = require("./data/complexQueryNOT.json");
        let objBody = require("./data/complexQueryNOTbody.json");
        return insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.equal(objBody);
        }).catch(function (err) {
            Log.test('Error:' + err);
            expect.fail();
        });
    });



});
