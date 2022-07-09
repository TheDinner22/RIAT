/**
 * 
 * config vars for the project
 * 
 */

interface configENV {
    iam?: string
    dirsToWatch: string[] 
    deBounceMilis: number
}

const ENV: configENV = {
    "iam": "hot as hell",
    "dirsToWatch" : [ "./lib" ],
    "deBounceMilis": 200
};

export default ENV;
