/**
 * Created by alexgoddijn on 27/01/2017.
 */

import {Log, validKeys, validLogic} from '../Util';
import {Course, QueryRequest, Body} from './IInsightFacade';


export default class QueryGenerator {

    public static checkQuery(query: QueryRequest): Promise<boolean> {
        return new Promise(function(fulfill, reject) {
            if (!(Object.prototype.toString.call(query) === '[object Object]')) reject(false);
            if (Object.keys(query).length != 2) reject(false);
            for (let key in query) {
                if (key === "WHERE") {
                    if (!(QueryGenerator.checkBody(query["WHERE"]))) reject(false);
                }
                else if (key === "OPTIONS") {
                    if (!(QueryGenerator.checkOptions(query["OPTIONS"]))) reject(false);
                }
                else reject(false);
            }
            fulfill(true);
        });
    }

    public static checkBody(body: Body): boolean {
        if (!(Object.prototype.toString.call(body) === '[object Object]')) return false;
        if (Object.keys(body).length < 1) return false;
        for (let key in body) {
            if (key === "AND" || key === "OR") {
                if (!QueryGenerator.checkLogicComparison(body[key])) return false;
            }
            else if (key === "GT" || key === "LT" || key === "EQ") {
                if (!(QueryGenerator.checkMComparison(body[key]))) return false;
            }
            else if (key === "IS") {
                if (!(QueryGenerator.checkSComparison(body[key]))) return false;
            }
            else if (key === "NOT") {
                if (!(QueryGenerator.checkNegation(body[key]))) return false;
            }
            else return false;
        }
        return true;
    }

    public static checkLogicComparison(lcomp: any): boolean {
        if (!(Object.prototype.toString.call(lcomp) === '[object Array]')) return false;
        for (let filter of lcomp) {
            if(!(QueryGenerator.checkBody(filter))) return false;
        }
        return true;
    }

    public static checkMComparison(mcomp: any): boolean {
        if (Object.keys(mcomp).length > 1) return false;
        for (let key in mcomp) {
            if(!QueryGenerator.checkKey(key)) return false;
            if(!(Object.prototype.toString.call(mcomp[key]) === '[object Number]')) return false;
        }
        return true;
    }

    public static checkSComparison(scomp: any): boolean {
        if (Object.keys(scomp).length > 1) return false;
        for (let key in scomp) {
            if(!QueryGenerator.checkKey(key)) return false;
            if(!(typeof scomp[key] === "string")) return false;
        }
        return true;
    }

    public static checkNegation(neg: any): boolean {
        if (!(Object.prototype.toString.call(neg) === '[object Object]')) return false;
        return QueryGenerator.checkBody(neg);
    }

    public static checkKey(key: string): boolean {
        for(let validKey of validKeys) {
            if (key.indexOf(validKey) >= 0)  return true;
        }
        return false;
    }

    public static checkOptions(options: any): boolean {
        if (!("COLUMNS" in options)) return false;
        if (!QueryGenerator.checkColumns(options["COLUMNS"])) return false;
        if (!("FORM" in options)) return false;
        if (!QueryGenerator.checkForm(options["FORM"])) return false;
        if ("ORDER" in options) {
            if (!(QueryGenerator.checkOrder(options["ORDER"]))) return false;
        }
        return true;
    }

    public static checkColumns(columns: any): boolean {
        for (let key of columns) {
            if (!QueryGenerator.checkKey(key)) return false;
        }
        return true;
    }

    public static checkOrder(order: string): boolean {
        return QueryGenerator.checkKey(order);
    }

    public static checkForm(form: string): boolean {
        return form === "TABLE";
    }

    public static checkId(query: QueryRequest): Promise<string[]> {
        return new Promise(function(fulfill, reject) {
            var toReturn : string[] = new Array<string>();
            var toCheck: any = new Array();
            toCheck.push(query["WHERE"]);
            while(!(toCheck.length == 0)) {
                try {
                    let cur = toCheck.pop();
                    if (Object.prototype.toString.call(cur) === '[object Array]') {
                        for (let obj of cur) {
                            toCheck.push(obj);
                        }
                    } else if (Object.prototype.toString.call(cur) === '[object Object]') {
                        for (let key in cur) {
                            let added: boolean = false;
                            if(QueryGenerator.checkKey(key)) {
                                let toAdd: string = key.substring(0, key.indexOf("_"));
                                if (toReturn.indexOf(toAdd) < 0) toReturn.push(toAdd);
                                added = true;
                            }
                            if (!added) {
                                toCheck.push(cur[key]);
                            }
                        }
                    }
                } catch(err) {
                    Log.error(err.message);
                    reject(err);
                }
            }
            fulfill(toReturn);
        });
    }

    public static filter(courses: Course[], query: QueryRequest): Promise<Array<{}>> {
        return new Promise(function(fulfill, reject) {
            let filter = query["WHERE"];
            var filtered: Course[] = new Array<Course>();
            for (let course of courses) {
                if(QueryGenerator.filterOne(course, filter, true)) filtered.push(course);
            }
            QueryGenerator.sort(filtered, query["OPTIONS"]).then(function(sorted: Course[]) {
                QueryGenerator.columns(sorted, query["OPTIONS"]["COLUMNS"]).then(function(toReturn: Array<{}>) {
                    fulfill(toReturn);
                }).catch(function(err: any) {
                    Log.error(err.message);
                    reject(err);
                });
            }).catch(function(err: any) {
                Log.error(err.message);
                reject(err);
            });
        });
    }

    public static filterOne(course: Course, filter: any): boolean {
        for (let key in filter) {
            if (key === 'AND') {
                let toReturn = true;
                for (let filt of filter[key]) {
                    let pass = QueryGenerator.filterOne(course, filt);
                    toReturn = toReturn && pass;
                }
                return toReturn;
            } else if (key === 'OR') {
                let toReturn = false;
                for (let filt of filter[key]) {
                    let pass = QueryGenerator.filterOne(course, filt);
                    toReturn = toReturn || pass;
                }
                return toReturn;
            } else if (key === 'GT') {
                for (let critKey in filter[key]) {
                    if (course[critKey] <= filter[key][critKey]) return false;
                    return true;
                }
            } else if (key === 'LT') {
                for (let critKey in filter[key]) {
                    if (course[critKey] >= filter[key][critKey]) return false;
                    return true;
                }
            } else if (key === 'EQ') {
                for (let critKey in filter[key]) {
                    if (course[critKey] != filter[key][critKey]) return false;
                    return true;
                }
            } else if (key === 'IS') {
                for (let critKey in filter[key]) {
                    if (course[critKey] !== filter[key][critKey]) return false;
                    return true;
                }
            } else if (key === 'NOT') {
                let pass = QueryGenerator.filterOne(course, filter[key]);
                return !pass;
            }
        }
    }

    public static sort(courses: Course[], options: any): Promise<Course[]> {
        return new Promise(function(fulfill, reject) {
            if (options["ORDER"]) {
                let crit = options["ORDER"];
                if(QueryGenerator.isNum(crit)) {
                    fulfill(courses.sort(function(a: Course, b: Course) {
                        return a[crit] - b[crit];
                    }));
                } else {
                    fulfill(courses.sort(function(a: Course, b: Course) {
                        if (a[crit] > b[crit]) return 1;
                        if (a[crit] < b[crit]) return -1;
                        return 0;
                    }));
                }
            } else {
                fulfill(courses);
            }

        });
    }

    public static isNum(key: string): boolean {
        return ((key.indexOf("_avg") >= 0) || (key.indexOf("_pass") >= 0) || (key.indexOf("_fail") >= 0) || (key.indexOf("_audit") >= 0));
    }

    public static columns(courses: Course[], columns: string[]): Promise<Array<{}>> {
        return new Promise(function(fulfill, reject) {
            var toReturn: Array<{}> = new Array();
            for (let course of courses) {
                var obj: any = {};
                for (let crit of columns) {
                    if (QueryGenerator.isNum(crit)) obj[crit] = <number> course[crit];
                    else obj[crit] = <string> course[crit];
                }
                toReturn.push(obj);
            }
            fulfill(toReturn);
        });
    }

}