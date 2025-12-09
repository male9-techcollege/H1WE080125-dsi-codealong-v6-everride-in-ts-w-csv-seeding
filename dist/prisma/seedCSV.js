/* "The Path module is a built-in Node.js module that provides tools for handling and transforming file paths across different operating systems.
Since Windows uses backslashes (\) and POSIX systems (Linux, macOS) use forward slashes (/), the Path module helps write cross-platform code that works correctly on any system. (...)
Best Practice: For better tree-shaking and smaller bundle sizes, import only the methods you need when using ES modules."
https://www.w3schools.com/nodejs/nodejs_path.asp */
/* Node.js modules, in the order in which they are used below */
import path from "path";
import { fileURLToPath } from "url";
import { parse } from "csv-parse/sync";
import { readdir, readFile } from "fs/promises";
import bcrypt from "bcrypt";
/* Files, in the order in which they are used below */
import { fieldTypes } from "./types.js";
import { prisma } from "../src/prisma.js";
/* "The Object.keys() method returns an array with the keys of an object."
https://www.w3schools.com/jsref/jsref_object_keys.asp */
const models = Object.keys(fieldTypes);
/* "In Node.js, __dirname and __filename are special variables available in CommonJS modules that provide the directory name and file name of the current module."
https://www.w3schools.com/nodejs/nodejs_path.asp
The console logs below are taken from this source.
In the example in Node.js Crash Course by Traversy Media on YouTube, the code is:
url.fileURLToPath(import.meta.url)
the first url representing the built-in url module, but unlike that author, we are just importing fileURLToPath from url package, not the whole package.
As a consequence, it is not necessary to indicate the JS module and then the desired function in that module.

The finds the __filename and __dirname of the current ES module: */
const __filename = fileURLToPath(import.meta.url);
console.log("ES Module file path:", __filename);
const __dirname = path.dirname(__filename);
console.log("ES Module directory:", __dirname);
/* My additions based on example in Node.js Crash Course by Traversy Media on YouTube at https://www.youtube.com/watch?v=32M1al-Y6Ag :
.basename() returns the last portion of a path;
.parse() returns all the different parts of a path */
const __basenameByMariePierreLessard = path.basename(__filename);
console.log("Just the file name with the extension:", __basenameByMariePierreLessard);
const __parsedPathByMariePierreLessard = path.parse(__filename);
console.log("All the parts of the file path:", __parsedPathByMariePierreLessard);
/* Acc. to  Node.js Crash Course by Traversy Media on YouTube, the following line makes sure that
the right delimiters are used in the file path (forward or backward slash depending on the OS).
In this case, a folder called csv is joined together with (getting appended to) __dirname.

"Use path.join() or path.resolve() with __dirname to build file paths in CommonJS modules.
For ES modules, use import.meta.url with fileURLToPath and dirname to get the equivalent functionality."
https://www.w3schools.com/nodejs/nodejs_path.asp
And yet, the following constant in the Moodle instructions.
const dir = path.join(__dirname, "csv");

Same advice is found on Stackoverflow: Ivan Gabriele advises to use path.join() in ES-module.
Another option: see example provided by Bernat on same page, ie.:
https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-js-when-using-es6-modules

Acc. to advice by jameshfisher found at https://stackoverflow.com/questions/16301503/can-i-use-requirepath-join-to-safely-concatenate-urls ,
citing the URL living standard at https://url.spec.whatwg.org,
something like the following should work, but it doesn't (type error: invalid URL). My test database was not seeded even though no error was thrown in the terminal.
const dir = new URL('/csv', __dirname).href;
I asked Heinz why, but he doesn't know this syntax, and he doesn't think that the recommendation on W3 Schools matters much because the method below works.
*/
const dir = new URL('csv', __dirname).href;
console.log(dir);
async function main() {
    const csvFiles = (await readdir(dir)).filter(f => f.endsWith(".csv"));
    /* This can ONLY work if the file name is the same as the name of the corresponding model.
    As a consequence, this code does not allow the importation of CSV files in a specific reading order based on relationships.
    This means that I cannot seed the car and carFuelRel tables because their records can only exist if other records in other tables exist.
    Solution: I just seeded the tables on which future records in other tables will depend. */
    for (const model of models) {
        /* The instructions on Moodle were missing the backticks. */
        const file = `${model}.csv`;
        /* continue has a different effect than return:

        "return vs break vs continue in JavaScript/TypeScript – When & Why to Use Them (...)
         Chandan Kumar (...) Jun 4, 2025 (...)
         return → Exits the entire function
         break → Exits the current loop
         continue → Skips the current iteration and moves to the next"
         https://developerchandan.medium.com/return-vs-break-vs-continue-in-javascript-typescript-when-why-to-use-them-f5a6ff1e5a8f

        So, if a model name (in schema.prisma) does not have a corresponding file name, the function skips that one and moves to the next.
        */
        if (!csvFiles.includes(file))
            continue;
        /* About readFile:
        readFile(file location, encoding, function) */
        /* raw is an array. */
        const raw = parse(await readFile(path.join(dir, file), "utf-8"), {
            columns: true,
            skip_empty_lines: true
        });
        console.log(raw);
        /* "The Promise.all() method returns a single Promise from a list of promises, when all promises fulfill.
        Syntax
            Promise.all(iterable) (...)
        
        Promise Methods
            catch()
            finally()
            then()
            
        Static Methods
            Promise.all()
            Promise.allSettled()
            Promise.any()
            Promise.race()
            Promise.reject()
            Promise.resolve()
            Promise.try() (new in 2025)"
        https://www.w3schools.com/jsref/jsref_promise_all.asp
        
        raw is an array, which must be why there is more than 1 promise
        Note: there has to be a method applied to the promise (Promise() does not work).
        
        TO DO: cast() is not a built-in JS function. Where does it come from?
        
        */
        const data = await Promise.all(raw.map((row) => cast(model, row)));
        /* Decimals have to use periods in the CSV file, or error NaN is thrown!
        My exports from HeidiSQL had a comma instead, probably because of my regional choices in Windows. */
        await prisma[model].createMany({ data, skipDuplicates: true });
    }
    ;
}
;
async function cast(model, row) {
    const types = fieldTypes[model];
    const out = {};
    for (const key in row) {
        const val = row[key]?.toString().trim();
        const type = types[key];
        if (key === "password")
            out[key] = await bcrypt.hash(val, 10);
        else if (type === "number")
            out[key] = Number(val);
        else if (type === "boolean")
            out[key] = val !== "0";
        else if (type === "date")
            out[key] = val ? new Date(val) : null;
        /* Alternative to the logical OR operator, which checks for falsy values, not null or undefined values:
        "The nullish coalescing operator is a new JavaScript feature introduced in the ECMAScript 2020 specification. It is represented by two consecutive question marks (??). (...)
        The nullish coalescing operator provides a default value for null or undefined values. (...) It is a newer addition to JavaScript (introduced in the ES2020 specification) that explicitly checks for null or undefined values rather than any falsy value. (...)
        In this code, the logical OR operator provides default values for userName and userAge if the corresponding input variables are falsy. However, what if you wanted to allow the user to enter a name or age of 0? In that case, the logical OR operator would not work as expected because 0 is a falsy value.
        In summary, the nullish coalescing operator is a valuable addition to JavaScript that allows you to provide default values for variables more precisely and reasonably. It’s handy when you need to allow for the possibility of null or undefined values or when you want to avoid assigning default values for other falsy values such as 0 or “”."
        https://codedamn.com/news/javascript/double-question-mark-in-javascript-nullish-coalescing-operator
        TO DO: ask Q because ?? null seems to defeat the point of using the nullish coalescing operator!
        */
        else
            out[key] = val ?? null;
    }
    ;
    return out;
}
;
main()
    .then(() => console.log("Seeding done"))
    .finally(() => prisma.$disconnect());
/* Copyright 2025, Marie-Pierre Lessard */
