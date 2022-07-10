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

type ExecExitHandler = (error: ExecException | null, stdout: string, stderr: string) => void;
type ExecFileExitHandler = (error: ExecFileException | null, stdout: string, stderr: string) => void;



export class NodeApp{
    fname: string;
    private args: Array<string>;
    private nodeApp!: ChildProcess;
    private startCalled = false;
    private onExit: ExecFileExitHandler;


    constructor(fileName: string, args: string[], onExit: ExecFileExitHandler){
        this.fname = fileName;
        this.args = args;
        this.onExit = onExit;
    }
    
    handleError(error: ExecFileException){
        console.log("----------------- \x1b[41mERROR\x1b[0m in nodeApp (prolly ur code not mine! LLL) -----------------");
        console.log("--------------- BEGIN ERROR ---------------\n");
        console.error(error);
        console.log("\n---------------- END ERROR ----------------\n");
    };

    // start
    start(logWhatApplogs = true){
        if(this.startCalled){console.log("cannot start twice");return;}
        this.startCalled = true;

        this.nodeApp = execFile("node", [this.fname, ...this.args], (error, stdout, stderr) => {
            this.startCalled = false;

            if (error && error.signal != "SIGINT"){this.handleError(error);return;} // bad idea bad idea bad idea!!!

            this.onExit(error, stdout, stderr)
        });

        if(logWhatApplogs){
            this.nodeApp.stdout?.on("data", (data) => {
                console.log(data)
            });
        }
    };

    // stop
    stop(exitCode: number | NodeJS.Signals = "SIGINT"){
        if(!this.startCalled){console.log("app is not started! cant stop it");return;}
        this.startCalled = false;
        this.nodeApp.kill(exitCode);
    };

};


// BIG FUCKING WARNING!!!! this function is dangerous!!!!!
// exec is dangerous!!! double triple check whatever you pass into it
export function command(args: string[], onExit: ExecExitHandler){
    // make sure there are args
    if(args.length === 0){throw new Error("args was an empty list. Can't do dat");}

    // if no onExit was provided, sub in dummy funcion
    onExit = typeof onExit === "undefined" ? (a: any, b: any, c: any)=>{} : onExit;

    // trim each element of the args list
    for (let i = 0; i < args.length; i++) {
        args[i] = args[i].trim();
    }

    // generate command string
    const cmdStr = args.join(" ");

    // call command 
    exec(cmdStr, (error, stdout, stderr)=>{onExit(error, stdout, stderr);});
};
