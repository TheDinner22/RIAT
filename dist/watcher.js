"use strict";
/**
 * watch for file changes in a given dir
 * create event to bind to when file changes
 *
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWatcher = void 0;
const fs_1 = require("fs");
const child_process_1 = require("child_process");
class Watcher {
    constructor(path, onEdit) {
        this.waitPlz = false;
        this.path = path;
        this.onEdit = onEdit;
        this.makeWatch();
    }
    makeWatch() {
        (0, fs_1.watch)(this.path, (event, filename) => {
            // a little de bounce trolling
            if (this.waitPlz) {
                return;
            }
            this.waitPlz = true;
            setTimeout(() => {
                this.waitPlz = false;
            }, 300);
            if (filename && event === "change") {
                this.onEdit(filename);
            }
        });
    }
}
function createWatcher(path, onEdit) {
    // get all sub dirs
    (0, child_process_1.exec)(`dir ${path} -R -1`, (error, stdout, stderr) => {
        let dirNames = [];
        const lines = stdout.split("\n");
        lines.forEach((line) => {
            if (line.endsWith(":")) {
                dirNames.push(line.slice(0, -1));
            }
        });
        dirNames.forEach((dirName) => {
            new Watcher(dirName, onEdit);
        });
    });
}
exports.createWatcher = createWatcher;
;
createWatcher("./../../fedoraenv/fedora/lib", (file) => { console.log(file); });
