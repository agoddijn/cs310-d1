/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse, QueryRequest, Course} from "./IInsightFacade";

import Log from "../Util";
import ZipParser from "./ZipParser";
import Database from "./Database";
import FileSystem from "./FileSystem";

var fs = require("fs");

export default class InsightFacade implements IInsightFacade {

    constructor() {
        Log.trace('InsightFacadeImpl::init()');
    }

    addDataset(id: string, content: string): Promise<InsightResponse> {
        var parser = new ZipParser();
        var vm = this;
        return new Promise(function(fulfill, reject) {
            FileSystem.check(id).then(function(exists: boolean) {
                if(!exists) {
                    parser.parse(content).then(function (data: Course[]) {

                        FileSystem.write(id, data).then(function(success: boolean) {
                            if (success) Log.info("Data successfully cached");
                            else Log.info("Data unsuccessfully cached");
                        }).catch(function(err: any) {
                            Log.error("Error in InsightFacade.addDataset() [FileSystem.write()]");
                            Log.error(err);
                        })

                        Database.createDatabase(data).then(function (success: boolean) {
                            if (success) Log.info("Database successfully created");
                            else Log.info("Database unsuccessfully created");
                            // TODO
                        }).catch(function (err: any) {
                            Log.error("Error in InsightFacade.addDataset() [FileSystem.write()]");
                            Log.error(err);
                        });

                    }).catch(function (err: any) {
                        Log.error("Error in InsightFacade.addDataset() [zipParser.parse()]");
                        Log.error(err);
                        reject({"code": 400, "error": err.message});
                    });
                } else {
                    FileSystem.read(id).then(function(data: Course[]) {
                        Log.info("Got data from cache");
                        Database.createDatabase(data).then(function (success: boolean) {
                            if (success) Log.info("Database successfully created");
                            else Log.info("Database unsuccessfully created");
                            // TODO
                        }).catch(function (err: any) {
                            Log.error("Error in InsightFacade.addDataset() [FileSystem.write()]");
                            Log.error(err);
                        });

                    }).catch(function(err:any) {
                        Log.error("Error in InsightFacade.addDataset() [FileSystem.read()]");
                        Log.error(err);
                        reject({"code": 400, "error": err.message});
                    });
                }
            }).catch(function(err: any) {
                Log.error("Error in InsightFacade.addDataset() [FileSystem.check()]");
                Log.error(err);
                reject({"code": 400, "error": err.message});
            });
        });
    }


    removeDataset(id: string): Promise<InsightResponse> {
        return null;
    }

    performQuery(query: QueryRequest): Promise <InsightResponse> {
        return null;
    }
}
