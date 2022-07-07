/**
 * 
 * get all the sub dirs of a given dir recursively
 * https://stackoverflow.com/questions/18112204/get-all-directories-within-directory-nodejs
 * 
 */

import fs from 'fs';
import path from 'path';

function flatten(lists: Array<string[]>) {
  return lists.reduce((a, b) => a.concat(b), []);
}

function getDirectories(srcpath: string): string[] {
  return fs.readdirSync(srcpath)
    .map(file => path.join(srcpath, file))
    .filter(path => fs.statSync(path).isDirectory());
}

// includes srcpath!
export function getSubDirectoriesRecursive(srcpath: string): string[]{
  return [srcpath, ...flatten(getDirectories(srcpath).map(getSubDirectoriesRecursive))];
}
