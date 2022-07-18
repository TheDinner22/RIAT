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


// start node app if a file is provided
let myNodeApp: NodeApp | undefined = undefined;
if(typeof config.fileToRun === "string"){
    myNodeApp = new NodeApp(config.fileToRun, [], (error, std) => {
        if(error){
            console.log(error);
        }
    });

    // start the app
    myNodeApp.start();
}

// this is why this line is long https://stackoverflow.com/questions/12802317/passing-class-as-parameter-causes-is-not-newable-error
async function callOnFileChange(dirname: string, filename: string, NodeApp: new (fileName: string, args: string[], onExit?: ExecFileExitHandler) => NodeApp, command: (args: string[], onExit?: ExecExitHandler) => void){
    // im using this for a project so this is an example of this being used!
    // todo this is called every time??!
    const promiseCommand = promisify(command);

    // get highest parent dir that is not fedora
    const highestParentDir = dirname.replace("./fedora/", "").replace("fedora/", "").split("/")[0];

    // lib changed (compile tsc)
    if(highestParentDir === "lib"){
        // kill the app if possible
        if(typeof myNodeApp !== "undefined"){myNodeApp.stop();}

        // run the tsc command
        console.log("Compiling TSC!");
        const {stderr, stdout} = await promiseCommand(["tsc", "-p", config.TsconfigPathFromProjectRoot]);
        console.log("DONE Compiling TSC!");

        // if there is output, log it
        if(stdout.trim() != ""){console.log(stdout);}

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
            // babel
            // technically this is a seperate shell so cd .. is useless
            // but i put it there anyways!!! todo
            const babelCMD = 'npx babel routes --out-dir ./../public/clientJS --extensions ".tsx"'.split(" ");
            await promiseCommand(["cd", "fedora", "&&", ...babelCMD, "&&", "cd", ".."]);

            // mine
            console.log("JSX START");
            await promiseCommand(["python3", "fedora/help/build.py"]);
            console.log("JSX END");
        }
    }
};

config.dirsToWatch.forEach((dirName) => {
    makeWatcher(dirName, callOnFileChange);
});
