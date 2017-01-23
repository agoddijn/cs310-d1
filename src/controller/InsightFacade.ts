/**
 * This is the main programmatic entry point for the project.
 */
import {IInsightFacade, InsightResponse, QueryRequest} from "./IInsightFacade";

import Log from "../Util";
import ZipParser from "./ZipParser";

export default class InsightFacade implements IInsightFacade {

    constructor() {
        Log.trace('InsightFacadeImpl::init()');
    }

    addDataset(id: string, content: string): Promise<InsightResponse> {
        var parser = new ZipParser();
        return new Promise(function(fulfill, reject) {
            parser.parse(content).then(function(data: Course[]){

            }).catch(function(err: any){
                Log.error("Error in InsightFacade.addDataset() [zipParser.parse()]");
                Log.error(err);
                reject(err);
                // TODO
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
