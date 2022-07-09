/**
 * watch for file changes in a given dir
 * create event to bind to when file changes
 * 
 */

import { watch } from "fs";
import { exec } from "child_process";

class Watcher {
    private waitPlz: boolean;
    private path: string;
    private onEdit: (fileName: string) => void;

    constructor(path: string, onEdit: (fileName: string) => void){
        this.waitPlz = false;
        this.path = path;
        this.onEdit = onEdit;

        this.makeWatch();
    }

    private makeWatch(){
        watch(this.path, (event, filename)=>{
            // a little de bounce trolling
            if(this.waitPlz){return}
            this.waitPlz = true;
            setTimeout(() => {
                this.waitPlz = false;
            }, 5000);

            if (filename && event === "change"){
                console.log(`\x1b[41m${this.path} WAS CHANGED\x1b[0m`)
                setTimeout(() => {
                    this.onEdit(filename);
                }, 2500);
            }
            
        });
    }
}

export function createWatcher(path: string, onEdit: (filename: string)=>void){
    // get all sub dirs
    exec(`dir ${path} -R -1`, (error, stdout, stderr)=>{
        let dirNames: string[] = [];
        const lines = stdout.split("\n");
        lines.forEach((line)=>{
            if(line.endsWith(":")){
                dirNames.push(line.slice(0, -1));
            }
        });

        dirNames.forEach((dirName)=>{
            new Watcher(dirName, onEdit)
        });
    });

};
