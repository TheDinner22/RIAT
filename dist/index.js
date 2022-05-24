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
// look for changes here:
const DirToWatch = process.argv[2] || "./lib/"; // could also be a file not a directory (use ./where-ever)
// run and re-run here when changed
const fileToRun = process.argv[3] || "dist/index.js"; // imagine calling node ${fileToRun}
// create new rebooter
const rebooter = new rebooter_1.Rebooter(fileToRun, process.argv.slice(4)); //TODO args bruh
// start the rebooter
rebooter.start();
(0, watcher_1.createWatcher)(DirToWatch, (fileName) => {
    console.clear();
    console.log(" ---------------- RESTARTING APP ----------------");
    // if there is a change, kill and then restart the node app
    rebooter.terminate();
    rebooter.startAfter(1000);
    console.log(" ---------------- APP RESTARTED ----------------");
});
