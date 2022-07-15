/**
 * 
 * watch for file changes in a dir
 * expose function that is called when file changes
 * 
 */

import { watch, readFile } from "fs";
import { promisify } from "util";
import { getSubDirectoriesRecursive } from "./getAllDirs"
import { NodeApp, command, ExecFileExitHandler, ExecExitHandler } from "./commands";
import config from "./config";

const readFileProm = promisify(readFile);

// function that takes a function as an arg! LLL
type callOnFileChangeLike = (dirname: string, filename: string, NodeApp: new (fileName: string, args: string[], onExit?: ExecFileExitHandler) => NodeApp , command: (args: string[], onExit?: ExecExitHandler) => void) => Promise<void>;

class DirWatcher {
    private dirPath: string;
    private fsWait: boolean;
    private onEdit: callOnFileChangeLike;
    
    constructor(dirPath: string, onEdit: callOnFileChangeLike){
        this.dirPath = dirPath;
        this.fsWait = false;
        this.onEdit = onEdit;
        
        // console.log(`Watching for file changes on ${this.dirPath}`);
        this.watchADir();
    }

    watchADir(){
        watch(this.dirPath, async (event, filename) => {
            if (filename && event === "change") {
                // little de bounce trolling
                if (this.fsWait) { return; }
                this.fsWait = true;
                
                await this.onEdit(this.dirPath, filename, NodeApp, command);
                
                setTimeout(() => {
                    this.fsWait = false;
                }, config.deBounceMilis);
            }
        });
    };
}

export function makeWatcher(dirPath: string, onEdit: callOnFileChangeLike){
    // get list of all sub dirs
    const dirsList = getSubDirectoriesRecursive(dirPath);

    // create bunch of watchers
    dirsList.forEach((dirPath) => {
        new DirWatcher(dirPath, onEdit);
    });
};
