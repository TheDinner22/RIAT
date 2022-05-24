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
import { exec as badExec} from "child_process";
import { promisify } from "util";

// make exec into promise based
const exec = promisify(badExec);

// look for changes here:
const DirToWatch = process.argv[2] || "./lib/" // could also be a file not a directory (use ./where-ever)

// run and re-run here when changed
const fileToRun = process.argv[3] || "dist/index.js" // imagine calling node ${fileToRun}

// create new rebooter
const rebooter = new Rebooter(fileToRun, process.argv.slice(4)); //TODO args bruh

// start the rebooter
rebooter.start();

async function callOnFileChange(filename: string){
    // this function assumes a .ts file is being watched
    // it will kill the app, compile ts to js, run the js

    console.clear();

    // kill app
    console.log("---------- KLLING APP ----------");
    rebooter.terminate();

    // compile ts
    console.log("---------- COMPILING TS ----------");
    const {stderr, stdout} = await exec("tsc");

    // start the app
    console.log(" ---------------- STARTING APP ----------------")
    rebooter.startAfter(200);

    console.log("\n\n---------------- APP RESTARTED ----------------")
};

// create watchers on dirToWatch and all subDirs
createWatcher(DirToWatch, callOnFileChange);
