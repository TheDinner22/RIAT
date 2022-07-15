/**
 * 
 * combine file watcher logic
 * and rebooter logic to make a nodemon clone that
 * DOESNT BREAK ALL THE FUCKING TIME
 * AND ACTUALLY TAKES ARGS AND PASSES THEM TO NODE FILE
 * 
 */

import { makeWatcher } from "./watcher";
import { NodeApp, command, ExecExitHandler, ExecFileExitHandler} from "./commands";
import config from "./config";

// function that takes a function as an arg! LLL
export type callOnFileChangeLike = (dirname: string, filename: string, NodeApp: new (fileName: string, args: string[], onExit?: ExecFileExitHandler) => NodeApp , command: (args: string[], onExit?: ExecExitHandler) => void) => void;


// this is why this line is long https://stackoverflow.com/questions/12802317/passing-class-as-parameter-causes-is-not-newable-error
async function callOnFileChange(dirname: string, filename: string, NodeApp: new (fileName: string, args: string[], onExit?: ExecFileExitHandler) => NodeApp , command: (args: string[], onExit?: ExecExitHandler) => void){
    // im using this for a project so this is an example of this being used!
    
    // get highest parent dir that is not fedora
    const highestParentDir = dirname.replace("./fedora/", "").replace("fedora/", "").split("/")[0];

    // lib changed (compile tsc)
    if(highestParentDir === "lib"){

    }

    // routes was changed
    if(highestParentDir === "routes"){
        const extension = filename.split(".");

        // move css
        if(extension === "css"){

        }

        if(filename.split(".")){}
        // compile jsx
    }










};

config.dirsToWatch.forEach((dirName) => {
    makeWatcher(dirName, callOnFileChange);
});
