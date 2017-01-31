/**
 * Created by Alex Goddijn on 2017-01-20.
 */

import InsightFacade from "../src/controller/InsightFacade";
import {expect} from 'chai';
import {Log} from "../src/Util";
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

    it("It should throw 400 Query is not valid given null", function (done) {
        isf.performQuery(null).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            expect(err.body.error).to.equal("Query is not valid");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 Query is not valid given undefined", function (done) {
        isf.performQuery(undefined).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");;
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.body).to.have.key("error");
            expect(err.body.error).to.equal("Query is not valid");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 Query is not valid given empty JSON object", function (done) {
        isf.performQuery({}).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");;
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.body).to.have.key("error");
            expect(err.body.error).to.equal("Query is not valid");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 Query is not valid given empty JSON array", function (done) {
        isf.performQuery([]).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");;
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.body).to.have.key("error");
            expect(err.body.error).to.equal("Query is not valid");
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    // it("It should throw 400 Query is not valid given an invalid JSON object", function () {
    //     isf.performQuery({"invalid"}).then(function(res: InsightResponse) {
    //         Log.test(JSON.stringify(res));
    //         done("Should not accept query");;
    //     }).catch(function(err: any){
    //         Log.test(JSON.stringify(err));
    //         sanityCheck(err);
    //         expect(err.code).to.equal(400);
    //         expect(err.body).to.deep.equal({"error":"Query is not valid"});
    //     });
    // });

    it("It should throw 400 token not supported given an invalid MCOMPARATOR JSON object", function (done) {
        isf.performQuery(badReq1).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");;
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(400);
            expect(err.body).to.have.key("error");
            expect(err.body.error).to.equal(tokNotSupported.body.error);
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 400 token not supported given an invalid MCOMPARATOR anywhere in the chain", function (done) {
        isf.performQuery(badReq2).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");;
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.body).to.have.key("error");
            expect(err.body.error).to.equal(tokNotSupported.body.error);
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    // it("It should throw 400 inavlid JSON given an invalid JSON", function () {
    //     isf.performQuery('invalidJson').then(function(res: InsightResponse) {
    //         Log.test(JSON.stringify(res));
    //         done("Should not accept query");;
    //     }).catch(function(err: any){
    //         Log.test(JSON.stringify(err));
    //         sanityCheck(err);
    //         expect(err.code).to.equal(400);
    //         expect(err.body).to.deep.equal(invJson);
    //     });
    // });

    // it("It should throw 400 inavlid JSON given an invalid JSON", function () {
    //     isf.performQuery('invalidJson').then(function(res: InsightResponse) {
    //         Log.test(JSON.stringify(res));
    //         done("Should not accept query");;
    //     }).catch(function(err: any){
    //         Log.test(JSON.stringify(err));
    //         sanityCheck(err);
    //         expect(err.code).to.equal(400);
    //         expect(err.body).to.deep.equal(invJson);
    //     });
    // });

    it("It should throw 424 not found given a non existent id", function (done) {
        isf.performQuery(badReq3).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");;
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(424);
            expect(err.body).to.have.key("missing");
            expect(err.body.error).to.equal(notFound1.body.missing);
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

    it("It should throw 424 not found given multiple non existent id's", function (done) {
        isf.performQuery(badReq4).then(function(res: InsightResponse) {
            Log.test(JSON.stringify(res));
            done("Should not accept query");
        }).catch(function(err: any){
            Log.test(JSON.stringify(err));
            sanityCheck(err);
            expect(err.code).to.equal(424);
            expect(err.body).to.have.key("missing");
            expect(err.body.error).to.equal(notFound2.body.missing);
            done();
        }).catch(function(err: any) {
            done(err);
        });
    });

});
