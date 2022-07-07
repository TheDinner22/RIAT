/**
 * 
 * config vars for the project
 * 
 */

interface configENV {
    iam?: string
    dirToWatch: string
    deBounceMilis: number
}

const ENV: configENV = {
    "iam": "hot as hell",
    "dirToWatch" : "./lib",
    "deBounceMilis": 100
};

export default ENV;
