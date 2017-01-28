
/**
 * This is the main programmatic entry point for the project.
 */

import {IInsightFacade, InsightResponse, QueryRequest, Course} from "./IInsightFacade";

import Log from "../Util";
import ZipParser from "./ZipParser";
import FileSystem from "./FileSystem";

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
        return null;
    };
};
