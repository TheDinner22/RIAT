/**
 * 
 * config vars for the project
 * 
 */

interface configENV {
    iam?: string
    dirsToWatch: string[] 
    deBounceMilis: number
    TsconfigPathFromProjectRoot: string
    fileToRun?: string
}

const ENV: configENV = {
    "iam": "hot as hell",
    "dirsToWatch" : [ "./fedora/lib", "./fedora/routes" ],
    "deBounceMilis": 50,
    "TsconfigPathFromProjectRoot": "./fedora/tsconfig.json",
    "fileToRun" : "./fedora/build/dist/index.js"
};

export default ENV;
