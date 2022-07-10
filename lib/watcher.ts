/**
 * 
 * watch for file changes in a dir
 * expose function that is called when file changes
 * 
 */

import { callOnFileChangeLike } from ".";
import { watch, readFile } from "fs";
import { promisify } from "util";
import { getSubDirectoriesRecursive } from "./getAllDirs"
import { NodeApp, command } from "./commands";
import config from "./config";

const readFileProm = promisify(readFile);

class DirWatcher {
    private dirPath: string;
    private fsWait: boolean;
    private md5Previous: string;
    private onEdit: callOnFileChangeLike;
    
    constructor(dirPath: string, onEdit: callOnFileChangeLike){
        this.dirPath = dirPath;
        this.fsWait = false;
        this.md5Previous = "";
        this.onEdit = onEdit;
        
        
        console.log(`Watching for file changes on ${this.dirPath}`);
        this.watchADir();
    }

    watchADir(){
        watch(this.dirPath, async (event, filename) => {
            if (filename && event === "change") {
                // little de bounce trolling
                if (this.fsWait) { return; }
                this.fsWait = true;
                setTimeout(() => {
                    this.fsWait = false;
                }, config.deBounceMilis);
            
                const dirName = filename.split("/")[0]
                this.onEdit(dirName, filename, NodeApp, command);
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
