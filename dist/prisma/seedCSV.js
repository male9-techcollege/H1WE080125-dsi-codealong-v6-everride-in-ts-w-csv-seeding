/* TO DO:
npm run prisma:reset
does reset the db, but the seeding (for 1 model/table in types.ts) did not succeed in spite of what terminal said:
"seeding done
The seed command has been executed."
Do I need to seed all tabels for anything to succeed?
*/
/* "The Path module is a built-in Node.js module that provides tools for handling and transforming file paths across different operating systems.
Since Windows uses backslashes (\) and POSIX systems (Linux, macOS) use forward slashes (/), the Path module helps write cross-platform code that works correctly on any system. (...)
Best Practice: For better tree-shaking and smaller bundle sizes, import only the methods you need when using ES modules."
https://www.w3schools.com/nodejs/nodejs_path.asp */
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";
import { readdir, readFile } from "fs/promises";
import { parse } from "csv-parse/sync";
import { fieldTypes } from "./types.js";
import { prisma } from "../src/prisma.js";
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
/* My additions based on example in Node.js Crash Course by Traversy Media on YouTube:
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
TO DO: Q: why is the following constant in the Moodle instructions, then?
This being said, Ivan Gabriele advises to use path.join() in ES-module on Stackoverflow. Another option: see example provided by Bernat on same page, ie.:
https://stackoverflow.com/questions/46745014/alternative-for-dirname-in-node-js-when-using-es6-modules
*/
const dir = path.join(__dirname, "csv");
async function main() {
    const csvFiles = (await readdir(dir)).filter(f => f.endsWith(".csv"));
    /* This can ONLY work if the file name is the same as the name of the corresponding model.
    TO DO: I expect to have a problem with the reading order of the CSV files because of the relationships.
    The alphabetical order certainly does not match the order that I need.
    Solution: just seed the tables on which records in other tables depend.
    Is there a better solution? */
    for (const model of models) {
        /* The instructions on Moodle were missing the backticks. */
        const file = `${model}.csv`;
        if (!csvFiles.includes(file))
            continue;
        /* About readFile:
        readFile(file location, encoding, function) */
        const raw = parse(await readFile(path.join(dir, file), "utf-8"), {
            columns: true,
            skip_empty_lines: true
        });
        console.log(raw);
        const data = await Promise.all(raw.map((row) => cast(model, row)));
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
