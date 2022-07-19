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
import { bothStdOuts } from "./commands"

// start node app if a file is provided
let myNodeApp: NodeApp | undefined = undefined;
if(typeof config.fileToRun === "string"){
    myNodeApp = new NodeApp(config.fileToRun, [], (error, std) => {
        if(error && !error.killed && error.signal != "SIGINT"){
            console.log(error);
        }
    });

    // start the app
    myNodeApp.start();
}

// this is why this line is long https://stackoverflow.com/questions/12802317/passing-class-as-parameter-causes-is-not-newable-error
async function callOnFileChange(dirname: string, filename: string, NodeApp: new (fileName: string, args: string[], onExit?: ExecFileExitHandler) => NodeApp, promiseCommand: (args: string[]) => Promise<bothStdOuts>){
    // im using this for a project so this is an example of this being used!
    
    // get highest parent dir that is not fedora
    const highestParentDir = dirname.replace("./fedora/", "").replace("fedora/", "").split("/")[0];

    // lib changed (compile tsc)
    if(highestParentDir === "lib"){
        // kill the app if possible
        if(typeof myNodeApp !== "undefined"){myNodeApp.stop();}

        // run the tsc command
        console.log("Compiling TSC!");

        let stderrScoped: string;
        let stdoutScoped: string;
        try {
            const {stderr, stdout} = await promiseCommand(["tsc", "-p", config.TsconfigPathFromProjectRoot]);
            stderrScoped = stderr;
            stdoutScoped = stdout;
        } catch (e) {
            console.log(e);
            stderrScoped = "";
            stdoutScoped = "";
        }
        console.log("DONE Compiling TSC!");

        // if there is output, log it
        if(stdoutScoped.trim() != ""){console.log(stdoutScoped);}

        // start the app if possible
        if(typeof myNodeApp !== "undefined"){myNodeApp.start();}
    }

    // routes was changed
    else if(highestParentDir === "routes"){
        const extension = filename.split(".").pop();

        // move css
        if(extension === "css"){
            // GOD i hope this script i wrote works
            console.log("CSS START");
            await promiseCommand(["python3", "fedora/help/cssChange.py"]);
            console.log("CSS END");
        }

        // compile jsx
        if(extension === "tsx"){
            console.log("JSX START");

            // babel
            // technically this is a seperate shell so cd .. is useless
            // TODO catch error
            const babelCMD = 'npx babel routes --out-dir ./../public/clientJS --extensions ".tsx"'.split(" ");
            try {
                await promiseCommand(["cd", "fedora", "&&", ...babelCMD, "&&", "cd", ".."]);
            } catch (e) {
                console.log(e);
            }

            // mine
            await promiseCommand(["python3", "fedora/help/build.py"]);
            console.log("JSX END");
        }
    }
};

config.dirsToWatch.forEach((dirName) => {
    makeWatcher(dirName, callOnFileChange);
});
