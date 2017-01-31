
/**
 * This is the main programmatic entry point for the project.
 */

import {IInsightFacade, InsightResponse, QueryRequest, Course} from "./IInsightFacade";

import {Log} from "../Util";
import ZipParser from "./ZipParser";
import FileSystem from "./FileSystem";
import QueryGenerator from "./QueryGenerator";

var fs = require("fs");

export default class InsightFacade implements IInsightFacade {

    constructor() {
        Log.trace('InsightFacadeImpl::init()');
    }

    addDataset(id: string, content: string): Promise<InsightResponse> {
        var parser = new ZipParser();
        return new Promise(function(fulfill, reject) {
            parser.parse(content, id).then(function (data: Course[]) {

                FileSystem.check(id).then(function(success: boolean) {
                    var code: number;
                    if(success) code = 201;
                    else code = 204;

                    FileSystem.write(id, data).then(function(success: boolean) {
                        if (success) {
                            Log.info("Data successfully cached");
                            fulfill({code: code, body: {message: "Data successfully added"}});
                        } else {
                            Log.info("Data unsuccessfully cached");
                            reject({code: 400, body: {error: "Data unsuccessfully cached"}});
                        }
                    }).catch(function(err: any) {
                        Log.error("Error in InsightFacade.addDataset() [FileSystem.write()]");
                        Log.error(err);
                        reject({code: 400, body: {error: "Could not write file to memory"}});
                    });

                }).catch(function(err: any) {
                    Log.error("Error in InsightFacade.addDataset() [FileSystem.check()]");
                    Log.error(err);
                    reject({code: 400, body: {error: "Could not access memory"}});
                });

            }).catch(function (err: any) {
                Log.error("Error in InsightFacade.addDataset() [zipParser.parse()]");
                Log.error(err);
                reject({code: 400, body: {error: err.message}});
            });
        });
    };


    removeDataset(id: string): Promise<InsightResponse> {
        return new Promise(function(fulfill, reject) {
            FileSystem.remove(id).then(function(success: boolean) {
                if (success) {
                    Log.info("Data successfully removed");
                    fulfill({code: 202, body: {}});
                } else {
                    Log.error("Data could not be removed");
                    reject({code: 404, body: {}});
                }
            }).catch(function(err: any) {
                Log.error("Error in removeDataset");
                Log.error(err);
                reject({code: 404, body: {error: err.message}});
            });
        });
    };

    performQuery(query: QueryRequest): Promise <InsightResponse> {
        return new Promise(function(fulfill, reject) {
            QueryGenerator.checkQuery(query).then(function(isValid: boolean) {
                if(isValid) {
                    QueryGenerator.checkId(query).then(function(ids: string[]) {

                        FileSystem.checkFiles(ids).then(function(missing: string[]) {

                            if (missing.length == 0) {
                                var data: Course[] = new Array<Course>();
                                var promises: Promise<Course[]>[] = new Array<Promise<Course[]>>();
                                for (let id of ids) {
                                    promises.push(FileSystem.read(id));
                                }
                                Promise.all(promises).then(function(courselists: Course[][]) {
                                    for (let courses of courselists) {
                                        data = data.concat(courses);
                                    }

                                    QueryGenerator.filter(data, query).then(function(filtered: Array<{}>) {
                                        fulfill({code: 200, body: {render: 'TABLE', result: filtered}});
                                    }).catch(function(err: any) {
                                        Log.error(err.message);
                                        reject({code: 400, body: {error: err.message}});
                                    });

                                }).catch(function(err: any) {
                                    Log.error(JSON.stringify(err.message));
                                    reject({code: 424, body: {missing: "ids"}});
                                });
                            } else {
                                reject({code: 424, body: {missing: missing}});
                            }

                        }).catch(function(err: any) {
                            reject(err);
                            // TODO
                        });

                    }).catch(function(err: any) {
                        Log.error(err.message);
                        reject(err);
                    });
                } else {
                    reject({code: 400, body: {error: "invalid query"}});
                }
            }).catch(function(err: any) {
                Log.error(err.message);
                reject({code: 400, body: {error: "invalid query"}});
            })
        });
    };
};
