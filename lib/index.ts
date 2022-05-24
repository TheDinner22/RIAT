/**
 * 
 * combine file watcher logic
 * and rebooter logic to make a nodemon clone that
 * DOESNT BREAK ALL THE FUCKING TIME
 * AND ACTUALLY TAKES ARGS AND PASSES THEM TO NODE FILE
 * 
 */

import { createWatcher } from "./watcher";
import { Rebooter } from "./rebooter";

// look for changes here:
const DirToWatch = process.argv[2] || "./lib/" // could also be a file not a directory (use ./where-ever)

// run and re-run here when changed
const fileToRun = process.argv[3] || "dist/index.js" // imagine calling node ${fileToRun}

// create new rebooter
const rebooter = new Rebooter(fileToRun, process.argv.slice(4)); //TODO args bruh

// start the rebooter
rebooter.start();

createWatcher(DirToWatch, (fileName)=>{
    console.clear();
    console.log(" ---------------- RESTARTING APP ----------------")

    // if there is a change, kill and then restart the node app
    rebooter.terminate();

    rebooter.startAfter(1000);

    console.log(" ---------------- APP RESTARTED ----------------")
});
