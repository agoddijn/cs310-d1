/**
 * Created by alexgoddijn on 23/01/2017.
 */

var fs = require("fs");
import Log from "../Util";
import {Course, InsightResponse} from "./IInsightFacade";
import FileSystem from "./FileSystem";

interface IDatabase {
    createDatabase(data: Course[]): Promise<boolean>;
    updateHashTables(course: Course): Promise<boolean>;
}

export default class Database {

    public static createDatabase(data: Course[]): Promise<boolean> {
        return new Promise(function(fulfill, reject) {
            fulfill(true);
        });
    }

}