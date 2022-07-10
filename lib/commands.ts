/**
 * 
 * high level commands to be run when app changes
 * examples:
 * 
 * start - run a file
 * kill - stop file
 * run - run a command
 * 
 * 
 */

import { ChildProcess, execFile, exec, ExecFileException, ExecException } from "child_process";
import { promisify } from "util";

interface bothStdOuts {
    stdout: string
    stderr: string
};
export type ExecExitHandler = (error: ExecException | null, std: bothStdOuts) => void;
export type ExecFileExitHandler = (error: ExecFileException | null, std: bothStdOuts) => void;

export class NodeApp{
    fname: string;
    private args: Array<string>;
    private nodeApp!: ChildProcess;
    private startCalled = false;
    private onExit: ExecFileExitHandler;
    badSolutionLLL = promisify(this.start).bind(this);


    constructor(fileName: string, args: string[], onExit?: ExecFileExitHandler){
        this.fname = fileName;
        this.args = args;
        if(typeof onExit === "undefined"){
            this.onExit = (error: ExecFileException | null, std: bothStdOuts) => {};
        }
        else{
            this.onExit = onExit
        }
    }
    
    private handleError(error: ExecFileException){
        console.log("----------------- \x1b[41mERROR\x1b[0m in nodeApp (prolly ur code not mine! LLL) -----------------");
        console.log("--------------- BEGIN ERROR ---------------\n");
        console.error(error);
        console.log("\n---------------- END ERROR ----------------\n");
    };

    // start
    start(logWhatApplogs = true, doNotHandleErrors = false, onExit: ExecFileExitHandler = this.onExit){
        if(this.startCalled){console.log("cannot start twice");return;}
        this.startCalled = true;

        this.nodeApp = execFile("node", [this.fname, ...this.args], (error, stdout, stderr) => {
            this.startCalled = false;

            if (!doNotHandleErrors && error && error.signal != "SIGINT"){this.handleError(error);return;} // bad idea bad idea bad idea!!!

            onExit(error, {stdout, stderr});
        });

        if(logWhatApplogs){
            this.nodeApp.stdout?.on("data", (data) => {
                console.log(`\x1b[0m:\x1b[35m${this.nodeApp.pid}\x1b[0m` + ":" , data);
            });
        }
    };

    promiseStart(logWhatApplogs = true, doNotHandleErrors = false){
        return this.badSolutionLLL(logWhatApplogs, doNotHandleErrors);
    }

    // stop
    stop(exitCode: number | NodeJS.Signals = "SIGINT"){
        if(!this.startCalled){console.log("app is not started! cant stop it");return;}
        this.startCalled = false;
        this.nodeApp.kill(exitCode);
    };

};


// BIG FUCKING WARNING!!!! this function is dangerous!!!!!
// exec is dangerous!!! double triple check whatever you pass into it
export function command(args: string[], onExit?: ExecExitHandler){
    // make sure there are args
    if(args.length === 0){throw new Error("args was an empty list. Can't do dat");}

    // trim each element of the args list
    for (let i = 0; i < args.length; i++) {
        args[i] = args[i].trim();
    }

    // generate command string
    const cmdStr = args.join(" ");

    // call command 
    exec(cmdStr, (error, stdout, stderr)=>{
        if(typeof onExit !== "undefined"){
            onExit(error, {stdout, stderr});
        }
    });
};

export const promiseCommand = promisify(command);
