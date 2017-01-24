/**
 * Created by alexgoddijn on 22/01/2017.
 */
/**
 * Created by Alex Goddijn on 2017-01-20.
 */

import InsightFacade from "../src/controller/InsightFacade";
import Log from "../src/Util";
import {expect} from 'chai';
import {InsightResponse, Course} from "../src/controller/IInsightFacade";
import FileSystem from "../src/controller/FileSystem";
var fs: any = require("fs");
var testPath = "./test/data/";

describe("AddDatasetPassingSpec", function () {

    var isf: InsightFacade = new InsightFacade();

    function sanityCheck(response: InsightResponse) {
        expect(response).to.have.property('code');
        expect(response).to.have.property('body');
        expect(response.code).to.be.a('number');
    }

    function courseCheck(response: Course) {
        expect(response).to.have.property('courses_dept');
        expect(response.courses_dept).to.be.a('string');
        expect(response).to.have.property('courses_id');
        expect(response.courses_id).to.be.a('string');
        expect(response).to.have.property('courses_avg');
        expect(response.courses_avg).to.be.a('number');
        expect(response).to.have.property('courses_instructor');
        expect(response.courses_instructor).to.be.a('string');
        expect(response).to.have.property('courses_title');
        expect(response.courses_title).to.be.a('string');
        expect(response).to.have.property('courses_pass');
        expect(response.courses_pass).to.be.a('number');
        expect(response).to.have.property('courses_fail');
        expect(response.courses_fail).to.be.a('number');
        expect(response).to.have.property('courses_audit');
        expect(response.courses_audit).to.be.a('number');
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
        var cachePath = './cache';
        if( fs.existsSync(cachePath) ) {
            fs.readdirSync(cachePath).forEach(function(file: any,index: any){
                var curPath = cachePath + "/" + file;
                fs.unlinkSync(curPath);
            });
            fs.rmdirSync(cachePath);
        }
    });

    it("It should parse and cache a big zip file", function (done) {
        this.timeout(100000);
        var filename = "courses";
        var pathToFile: string = testPath + filename + ".zip";
        var zipData = fs.readFileSync(pathToFile);
        isf.addDataset(filename, zipData).then(function (res: InsightResponse) {
            Log.test(JSON.stringify(res));
            sanityCheck(res);
            expect(res.code).to.equal(204);
            FileSystem.read(filename).then(function (data1: Course[]) {

                expect(data1.length).to.equal(64612);
                courseCheck(data1[0]);

                isf.addDataset(filename, zipData).then(function (res: InsightResponse) {
                    Log.test(JSON.stringify(res));
                    sanityCheck(res);
                    expect(res.code).to.equal(201);

                    FileSystem.read(filename).then(function (data2: Course[]) {

                        expect(data2.length).to.equal(64612);
                        courseCheck(data2[0]);

                        isf.removeDataset(filename).then(function (res: InsightResponse) {
                            Log.test(JSON.stringify(res));
                            FileSystem.check(filename).then(function(exists) {
                                expect(exists).to.equal(false);
                                done();

                            }).catch(function (err: any) {
                                Log.test(JSON.stringify(err));
                                done(err);
                            });


                        }).catch(function (err: any) {
                            Log.test(JSON.stringify(err));
                            done(err);
                        });

                    }).catch(function (err: any) {
                        Log.test(JSON.stringify(err));
                        done(err);
                    });

                }).catch(function (err: any) {
                    Log.test(JSON.stringify(err));
                    done(err);
                });

            }).catch(function (err: any) {
                Log.test(JSON.stringify(err));
                done(err);
            });

        }).catch(function (err: any) {
            Log.test(JSON.stringify(err));
            done(err);
        });
    });

});
