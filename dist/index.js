"use strict";
/**
 *
 * combine file watcher logic
 * and rebooter logic to make a nodemon clone that
 * DOESNT BREAK ALL THE FUCKING TIME
 * AND ACTUALLY TAKES ARGS AND PASSES THEM TO NODE FILE
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
const watcher_1 = require("./watcher");
const rebooter_1 = require("./rebooter");
const child_process_1 = require("child_process");
// look for changes here:
const DirToWatch = process.argv[2] || "./lib/"; // could also be a file not a directory (use ./where-ever)
// run and re-run here when changed
const fileToRun = process.argv[3] || "fedora/dist/index.js"; // imagine calling node ${fileToRun}
// create new rebooter
const rebooter = new rebooter_1.Rebooter(fileToRun, process.argv.slice(4)); //TODO args bruh
// start the rebooter
rebooter.start();
function callOnFileChange(filename) {
    // this function assumes a .ts file is being watched
    // it will kill the app, compile ts to js, run the js
    console.clear();
    // kill app
    console.log("---------- KLLING APP ----------");
    rebooter.terminate();
    console.log("---------- APP KILLED ----------\n");
    // compile ts
    console.log("---------- COMPILING TS ----------");
    (0, child_process_1.exec)("tsc", (error, stdout, stderr) => {
        // we dont throw error because tsc will error for tsc compiler issues which is expected when
        // writing code in typescript
        // the rebooter should not error when the ts does not compile
        if (stdout != "") {
            console.log("-------------- COMPILER ERROR --------------");
            console.log("stdout errors");
            console.log("------------ END COMPILER ERROR ------------\n");
        }
        else {
            console.log("---------- COMPILIED WITHOUT ERRORS ----------\n");
        }
        // start the app
        console.log("---------------- STARTING APP ----------------");
        rebooter.start();
        console.log("---------------- APP RESTARTED ---------------\n");
    });
}
;
// create watchers on dirToWatch and all subDirs
(0, watcher_1.createWatcher)(DirToWatch, callOnFileChange);
