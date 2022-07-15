/**
 * 
 * combine file watcher logic
 * and rebooter logic to make a nodemon clone that
 * DOESNT BREAK ALL THE FUCKING TIME
 * AND ACTUALLY TAKES ARGS AND PASSES THEM TO NODE FILE
 * 
 */

import { makeWatcher } from "./watcher";
import { NodeApp, ExecExitHandler, ExecFileExitHandler} from "./commands";
import config from "./config";
import { promisify } from "util";

// this is why this line is long https://stackoverflow.com/questions/12802317/passing-class-as-parameter-causes-is-not-newable-error
async function callOnFileChange(dirname: string, filename: string, NodeApp: new (fileName: string, args: string[], onExit?: ExecFileExitHandler) => NodeApp, command: (args: string[], onExit?: ExecExitHandler) => void){
    // im using this for a project so this is an example of this being used!
    // todo this is called every time??!
    const promiseCommand = promisify(command);

    
    // get highest parent dir that is not fedora
    const highestParentDir = dirname.replace("./fedora/", "").replace("fedora/", "").split("/")[0];

    // lib changed (compile tsc)
    if(highestParentDir === "lib"){
        // run the tsc command
        console.log("Compiling TSC!");
        const {stderr, stdout} = await promiseCommand(["tsc", "-p", config.TsconfigPathFromProjectRoot]);
        console.log("DONE Compiling TSC!");

        // if there is output, log it
        if(stdout.trim() != ""){console.log(stdout);}
    }

    // routes was changed
    else if(highestParentDir === "routes"){
        const extension = filename.split(".")[-1];

        // move css
        if(extension === "css"){

        }

        // compile jsx
        if(extension === "tsx"){

        }
    }










};

config.dirsToWatch.forEach((dirName) => {
    makeWatcher(dirName, callOnFileChange);
});
