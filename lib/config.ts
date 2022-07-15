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
}

const ENV: configENV = {
    "iam": "hot as hell",
    "dirsToWatch" : [ "./fedora/lib", "./fedora/routes" ],
    "deBounceMilis": 50,
    "TsconfigPathFromProjectRoot": "./fedora/tsconfig.json"
};

export default ENV;
