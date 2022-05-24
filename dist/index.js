"use strict";
/**
 *
 * combine file watcher logic
 * and rebooter logic to make a nodemon clone that
 * DOESNT BREAK ALL THE FUCKING TIME
 * AND ACTUALLY TAKES ARGS AND PASSES THEM TO NODE FILE
 *
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const watcher_1 = require("./watcher");
const rebooter_1 = require("./rebooter");
const child_process_1 = require("child_process");
const util_1 = require("util");
// make exec into promise based
const exec = (0, util_1.promisify)(child_process_1.exec);
// look for changes here:
const DirToWatch = process.argv[2] || "./lib/"; // could also be a file not a directory (use ./where-ever)
// run and re-run here when changed
const fileToRun = process.argv[3] || "dist/index.js"; // imagine calling node ${fileToRun}
// create new rebooter
const rebooter = new rebooter_1.Rebooter(fileToRun, process.argv.slice(4)); //TODO args bruh
// start the rebooter
rebooter.start();
function callOnFileChange(filename) {
    return __awaiter(this, void 0, void 0, function* () {
        // this function assumes a .ts file is being watched
        // it will kill the app, compile ts to js, run the js
        console.clear();
        // kill app
        console.log("---------- KLLING APP ----------");
        rebooter.terminate();
        // compile ts
        console.log("---------- COMPILING TS ----------");
        const { stderr, stdout } = yield exec("tsc");
        // start the app
        console.log(" ---------------- STARTING APP ----------------");
        rebooter.startAfter(200);
        console.log("\n\n---------------- APP RESTARTED ----------------");
    });
}
;
// create watchers on dirToWatch and all subDirs
(0, watcher_1.createWatcher)(DirToWatch, callOnFileChange);
