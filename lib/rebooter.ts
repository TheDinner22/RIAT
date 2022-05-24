/**
 * 
 * start and stop a node js file
 * 
 * if you use this and it doesnt work...
 * it might be becuase your child_process is spawning other child_processes!
 * if thats the case...
 * consider using https://www.npmjs.com/package/tree-kill
 * and replace nodeApp.kill() the npm packages function
 * code example here https://stackoverflow.com/questions/18694684/spawn-and-kill-a-process-in-node-js
 * 
 */

import { ChildProcess, exec, execFile, ExecFileException } from "child_process";

export class Rebooter {
    fname: string;
    private args: Array<string>;
    private nodeApp!: ChildProcess;
    private startCalled = false;

    constructor(fileName: string, args?: Array<string>){
        this.fname = fileName;
        this.args = args || [];
    }

    private handleError(error: ExecFileException){
        console.log("----------------- \x1b[41mERROR\x1b[0m in nodeApp (prolly ur code not mine! LLL) -----------------");
        console.log("--------------- BEGIN ERROR ---------------\n");
        console.error(error);
        console.log("\n---------------- END ERROR ----------------\n");
    };

    start(){
        if(this.startCalled){console.log("cannot start twice");return;}
        this.startCalled = true;

        this.nodeApp = execFile("node", [this.fname, ...this.args], (error, stdout, stderr) => {
            this.startCalled = false;

            if (error && error.signal != "SIGINT"){this.handleError(error)} // bad idea bad idea bad idea!!!
            else{console.log(`------------------ ${this.fname} ENDED. NO ERRORS ------------------`);}
        });

        this.nodeApp.stdout?.on("data", (data)=>{
            console.log(`\x1b[44m${this.fname}\x1b[0m:\x1b[35m${this.nodeApp.pid}\x1b[0m just logged:\n----------`);
            console.log(data);
            console.log('----------\n');
        });

    };

    startAfter(milis: number){
        setTimeout(() => {
            this.start();
        }, milis);
    };

    terminate(){
        if(!this.startCalled){console.log("nothing to kill");return;}
        this.startCalled = false;
        this.nodeApp.kill("SIGINT");
    };

    terminateAfter(milis: number){
        setTimeout(() => {
            this.terminate();
        }, milis);
    };
}

/** i just used random colors man
 * 
 * terminal colors for me for making things look nice
 * Reset = "\x1b[0m"
 * Bright = "\x1b[1m"
 * Dim = "\x1b[2m"
 * Underscore = "\x1b[4m"
 * Blink = "\x1b[5m"
 * Reverse = "\x1b[7m"
 * Hidden = "\x1b[8m"
 * 
 * FgBlack = "\x1b[30m"
 * FgRed = "\x1b[31m"
 * FgGreen = "\x1b[32m"
 * FgYellow = "\x1b[33m"
 * FgBlue = "\x1b[34m"
 * FgMagenta = "\x1b[35m"
 * FgCyan = "\x1b[36m"
 * FgWhite = "\x1b[37m"
 * 
 * BgBlack = "\x1b[40m"
 * BgRed = "\x1b[41m"
 * BgGreen = "\x1b[42m"
 * BgYellow = "\x1b[43m"
 * BgBlue = "\x1b[44m"
 * BgMagenta = "\x1b[45m"
 * BgCyan = "\x1b[46m"
 * BgWhite = "\x1b[47m"
 *
 * example
 * console.log('\x1b[36m%s\x1b[0m', 'I am cyan');  //cyan
 * 
 */
