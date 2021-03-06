/**
 * Created by alexgoddijn on 23/01/2017.
 */

import {Course} from "./IInsightFacade";
import {Log} from "../Util";
var fs = require("fs");
var rootPath = "./cache/";

export default class FileSystem {

    public static write(filename: string, data: Course[]): Promise<boolean> {
        return new Promise(function(fulfill, reject) {
            filename = rootPath + filename;
            try {
                // Create directory
                if(!fs.existsSync(rootPath)) fs.mkdirSync(rootPath);
                fs.writeFileSync(filename, JSON.stringify(data));
                fulfill(true);
            } catch (err) {
                Log.error("Error in FileSystem [writeFileSync()]");
                Log.error(err);
                reject(err);
            }
        })
    }

    public static read(filename: string): Promise<Course[]> {
        return new Promise(function(fulfill, reject) {
            try {
                filename = rootPath + filename;
                var file = JSON.parse(fs.readFileSync(filename));
                fulfill(file);
            } catch (err) {
                Log.error("Error in FileSystem [JSON.parse() or fs.readFileSync()]");
                Log.error(err);
                reject(err);
            }
        })
    }

    public static check(filename: string): Promise<boolean> {
        return new Promise(function(fulfill, reject) {
            try {
                let exists: boolean = fs.existsSync(rootPath + filename);
                fulfill(exists);
            } catch (err) {
                Log.error("Error in FileSystem [existsSync()]");
                Log.error(err);
                reject(err);
            }
        });
    }

    public static checkFiles(filenames: string[]): Promise<string[]> {
        return new Promise(function(fulfill, reject) {
            var missing: string[] = new Array<string>();
            var promises: Promise<boolean>[] = new Array<Promise<boolean>>();
            for (let filename of filenames) {
                promises.push(FileSystem.check(filename));
            }
            Promise.all(promises).then(function(exists: boolean[]) {
                for (let i = 0; i < exists.length; i++) {
                    if(!exists[i]) missing.push(filenames[i]);
                }
                fulfill(missing);
            }).catch(function(err: any) {
                Log.error(err.message);
                reject(err);
            });
        })
    }

    public static remove(filename: string): Promise<boolean> {
        return new Promise(function(fulfill, reject) {
            try {
                fs.unlinkSync(rootPath + filename);
                fulfill(true);
            } catch (err) {
                Log.error("Error in FileSystem [rmdirSync()]");
                Log.error(err);
                reject(err);
            }
        })
    }

}