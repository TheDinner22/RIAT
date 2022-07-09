/**
 * 
 * watch for file changes in a dir
 * expose function that is called when file changes
 * 
 */

import { watch, readFile } from "fs";
import { promisify } from "util";
import { getSubDirectoriesRecursive } from "./getAllDirs"
import config from "./config";

const readFileProm = promisify(readFile);

class DirWatcher {
    private dirPath: string;
    private fsWait: boolean;
    private md5Previous: string;
    private onEdit: (fileName: string) => void;
    
    constructor(dirPath: string, onEdit: (fileName: string) => void){
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
            
                this.onEdit(filename);
            }
        });
    };
}

export function makeWatcher(dirPath: string, onEdit: (filename: string) => void){
    // get list of all sub dirs
    const dirsList = getSubDirectoriesRecursive(dirPath);

    // create bunch of watchers
    dirsList.forEach((dirPath) => {
        new DirWatcher(dirPath, onEdit);
    });
};
