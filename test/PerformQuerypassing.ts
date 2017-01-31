/**
 * Created by shrey on 2017-01-21.
 */
/**
 * Created by rtholmes on 2016-10-31.
 */

import {expect} from 'chai';
import {Log} from "../src/Util";
import {InsightResponse, QueryRequest, IInsightFacade} from "../src/controller/IInsightFacade";
import InsightFacade from "../src/controller/InsightFacade";
var fs: any = require("fs");
var testPath = "./test/data/";


describe("PerformQueryPassing", function () {


    function sanityCheck(response: InsightResponse) {
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
    }

    var insightFacade: InsightFacade = new InsightFacade();

    before(function (done) {
        Log.test('Before: ' + (<any>this).test.parent.title);
        this.timeout(300000);
        let data = fs.readFileSync(testPath + "courses.zip");
        insightFacade.addDataset("courses", data).then(function(res: InsightResponse) {
            done();
        }).catch(function(err: any) {
            Log.test(JSON.stringify(err));
            done("Could not load dataset");
        })
    });

    beforeEach(function () {
        Log.test('BeforeTest: ' + (<any>this).currentTest.title);
        insightFacade = new InsightFacade();
    });

    after(function () {
        Log.test('After: ' + (<any>this).test.parent.title);
        var cachePath = './cache';
        if( fs.existsSync(cachePath) ) {
            fs.readdirSync(cachePath).forEach(function(file: any,index: any){
                var curPath = cachePath + "/" + file;
                fs.unlinkSync(curPath);
            });
            fs.rmdirSync(cachePath);
        }
    });

    afterEach(function () {
        Log.test('AfterTest: ' + (<any>this).currentTest.title);
        insightFacade = null;
    });

    it("Simple query with GT", function (done) {
        let queryRequest = require("./data/simpleGTquery.json");
        let objBody = require("./data/simpleGTbody.json");
        insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Log.test('Error:' + err);
            done(err);
        });
    });

    it("Simple query with EQ", function (done) {
        let queryRequest = require("./data/simpleEQquery.json");
        let objBody = require("./data/simpleEQbody.json");
        insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Log.test('Error:' + err);
            done(err);
        });
    });

    it("Simple query with LT", function (done) {
        let queryRequest = require("./data/simpleLTquery.json");
        let objBody = require("./data/simpleLTbody.json");
        insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Log.test('Error:' + err);
            done(err);
        });
    });

    it("Complex query", function (done) {
        let queryRequest = require("./data/complexQuery.json");
        let objBody = require("./data/complexQueryBody.json");
        insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Log.test('Error:' + err);
            done(err);
        });
    });

    it("Complex query with NOT", function (done) {
        let queryRequest = require("./data/complexQueryNOT.json");
        let objBody = require("./data/complexQueryNOTbody.json");
        insightFacade.performQuery(queryRequest).then(function (value: InsightResponse) {
            sanityCheck(value);
            expect(value.code).to.equal(200);
            expect(value.body).to.deep.equal(objBody);
            done();
        }).catch(function (err) {
            Log.test('Error:' + err);
            done(err);
        });
    });



});
