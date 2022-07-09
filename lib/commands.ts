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

import { ChildProcess, exec, ExecException } from "child_process";

type processExitHandler = (error: ExecException | null, stdout: string, stderr: string) => void;

// BIG FUCKING WARNING!!!! this function is dangerous!!!!!
// exec is dangerous!!! double triple check whatever you pass into it
export function command(args: string[], onExit: processExitHandler){
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