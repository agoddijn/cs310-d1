/**
 * Created by alexgoddijn on 22/01/2017.
 */

import Log from "../Util";
import {Course, zipDat, Result} from "./IInsightFacade";
import {isUndefined} from "util";
import {isNull} from "util";
import {isNullOrUndefined} from "util";
var JSZip = require("jszip");

interface IZipParser {
    parse(zipBin: string, id: string): Promise<Course[]>;
    genCourseList(courseDat: zipDat, id: string): Promise<Course[]>;
    genCourse(courseObj: Result, id: string): Course;
}

export default class ZipParser implements IZipParser {

    constructor() {
        Log.trace("ZipParser::init()");
    }

    public parse(zipBin: string, id: string): Promise<Course[]>{
        var vm = this;
        var zip = new JSZip();

        return new Promise(function(fulfill, reject) {
            // Options for decoding
            let options = {
                base64: true
            };

            // Load the zip data
            zip.loadAsync(zipBin, options).then(function(data: any) {
                // Iterate through all the files
                // ask for a promise of course list for each file
                // wait until all promises are fulfilled
                let promiseList: Promise<Course[]>[] = new Array<Promise<Course[]>>();
                let subPromiseList: Promise<string>[] = new Array<Promise<string>>();
                for (let filename in data.files) {
                    let file = data.file(filename);
                    if(!isNullOrUndefined(file)) {
                        // Each file reading is an asynchronous call
                        subPromiseList.push(file.async("string"));
                    }
                }

                // Push all promises generated from unzipped files to promiseList
                Promise.all(subPromiseList).then(function(contents: string[]){
                    for (let content of contents) {
                        let courseDat: zipDat = JSON.parse(content);
                        promiseList.push(vm.genCourseList(courseDat, id));
                    }

                    // Concatenate the course lists
                    Promise.all(promiseList).then(function(coursesList: Course[][]){
                        // The variable to fulfill
                        let toReturn: Course[] = [];
                        for(let courses of coursesList) {
                            toReturn = toReturn.concat(courses);
                        }
                        fulfill(toReturn);
                    }).catch(function(err: any) {
                        // Log error if it occurs
                        Log.error("Error in ZipParser.parse [genCourseList()]");
                        Log.error(err);
                        reject(err);
                    });

                }).catch(function(err: any){
                    // Log error if it occurs
                    Log.error("Error in ZipParser.parse() [file.aync()]");
                    Log.error(err);
                    reject(err);
                });

            }).catch(function(err: any) {
                // Log an error if it occurs
                Log.error("Error in ZipParser.parse() [loadAsync()]");
                Log.error(err);
                reject(err);
            });
        });
    }

    public genCourseList(courseDat: zipDat, id: string): Promise<Course[]> {

        var vm = this;

        return new Promise(function(fulfill, reject) {
            let toReturn: Course[] = [];
            for (let course of courseDat.result) {
                try {
                    // Create the course and push it to the course array
                    toReturn.push(vm.genCourse(course, id));
                } catch(err) {
                    Log.error("Error in ZipParser.genCourseList() [genCourse()]");
                    Log.error(err);
                    reject(err);
                }
            }
            fulfill(toReturn);
        });
    }

    public genCourse(courseObj: Result, id: string): Course {
        var course: Course = {};
            course[id + "_id"] = courseObj.Course;
            course[id + "_dept"] = courseObj.Subject;
            course[id + "_audit"] = courseObj.Audit;
            course[id + "_avg"] = courseObj.Avg;
            course[id + "_title"] = courseObj.Title;
            course[id + "_fail"] = courseObj.Fail;
            course[id + "_pass"] = courseObj.Pass;
            course[id + "_instructor"] = courseObj.Professor;
        return course;
    }

}