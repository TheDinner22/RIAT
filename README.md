# RUN IT AGAIN TONY - R.I.A.T

## Expose a function that is called when a given directory changes

## why?

- nodemon errored on me

- nodemon no let me pass args!

- nodemon + typescript = sad

- needed custom build tool for a project

## about

- no npm dependencies (wont kill children of children LLL)

- pass args to dist/index.js (after passing dir to watch and file to run and path the .tsconfig relative to dist/index.js)

## probably only works on linux

- sorry if i end up needing to run code on windows ill make one for there

- reason it only works on linux is that fs.watch has recusive options on windows/mac but not on linux
this menas I had to implement my own recursive logic and so this prolly wont work on windows/mac

- if it does it will probably be inefficent/slow compared to using recursive flag
