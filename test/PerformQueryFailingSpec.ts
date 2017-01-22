/**
 * Created by Alex Goddijn on 2017-01-20.
 */

import InsightFacade from "../src/controller/InsightFacade";
import {expect} from 'chai';
import Log from "../src/Util";
import {InsightResponse} from "../src/controller/IInsightFacade";

var badReq1 = require("./data/badRequest1.json");
var badReq2 = require("./data/badRequest2.json");
var badReq3 = require("./data/badRequest3.json");
var badReq4 = require("./data/badRequest4.json");
var tokNotSupported = require("./data/tokenNotSupported.json");
var invJson = require("./data/invalidJson.json");
var notFound1 = require("./data/notFound1.json");
var notFound2 = require("./data/notFound2.json");

describe("PerformQueryFailingSpec", function () {

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

    it("It should throw 400 Query is not valid given null", function () {
        isf.performQuery(null).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            sanityCheck(res);
            expect(res.code).to.equal(400);
            expect(res.body).to.contain({"error":"Query is not valid"});
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            expect.fail();
        });
    });

    it("It should throw 400 Query is not valid given undefined", function () {
        isf.performQuery(undefined).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            sanityCheck(res);
            expect(res.code).to.equal(400);
            expect(res.body).to.contain({"error":"Query is not valid"});
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            expect.fail();
        });
    });

    it("It should throw 400 Query is not valid given empty JSON object", function () {
        isf.performQuery({}).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            sanityCheck(res);
            expect(res.code).to.equal(400);
            expect(res.body).to.deep.equal({"error":"Query is not valid"});
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            expect.fail();
        });
    });

    it("It should throw 400 Query is not valid given empty JSON array", function () {
        isf.performQuery([]).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            sanityCheck(res);
            expect(res.code).to.equal(400);
            expect(res.body).to.deep.equal({"error":"Query is not valid"});
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            expect.fail();
        });
    });

    it("It should throw 400 Query is not valid given an invalid JSON object", function () {
        isf.performQuery('').then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            sanityCheck(res);
            expect(res.code).to.equal(400);
            expect(res.body).to.deep.equal({"error":"Query is not valid"});
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            expect.fail();
        });
    });

    it("It should throw 400 token not supported given an invalid MCOMPARATOR JSON object", function () {
        isf.performQuery(badReq1).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            sanityCheck(res);
            expect(res.code).to.equal(400);
            expect(res.body).to.deep.equal(tokNotSupported);
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            expect.fail();
        });
    });

    it("It should throw 400 token not supported given an invalid MCOMPARATOR anywhere in the chain", function () {
        isf.performQuery(badReq2).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            sanityCheck(res);
            expect(res.code).to.equal(400);
            expect(res.body).to.deep.equal(tokNotSupported);
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            expect.fail();
        });
    });

    it("It should throw 400 inavlid JSON given an invalid JSON", function () {
        isf.performQuery('invalidJson').then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            sanityCheck(res);
            expect(res.code).to.equal(400);
            expect(res.body).to.deep.equal(invJson);
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            expect.fail();
        });
    });

    it("It should throw 400 inavlid JSON given an invalid JSON", function () {
        isf.performQuery('invalidJson').then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            sanityCheck(res);
            expect(res.code).to.equal(400);
            expect(res.body).to.deep.equal(invJson);
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            expect.fail();
        });
    });

    it("It should throw 424 not found given a non existent id", function () {
        isf.performQuery(badReq3).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            sanityCheck(res);
            expect(res.code).to.equal(400);
            expect(res.body).to.deep.equal(notFound1);
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            expect.fail();
        });
    });

    it("It should throw 424 not found given multiple non existent id's", function () {
        isf.performQuery(badReq4).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            sanityCheck(res);
            expect(res.code).to.equal(400);
            expect(res.body).to.deep.equal(notFound2);
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            expect.fail();
        });
    });

});
