/* "The Path module is a built-in Node.js module that provides tools for handling and transforming file paths across different operating systems.
Since Windows uses backslashes (\) and POSIX systems (Linux, macOS) use forward slashes (/), the Path module helps write cross-platform code that works correctly on any system. (...)
Best Practice: For better tree-shaking and smaller bundle sizes, import only the methods you need when using ES modules."
https://www.w3schools.com/nodejs/nodejs_path.asp */
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from 'bcrypt';
import { readdir, readFile } from 'fs/promises';
import { parse } from 'csv-parse/sync';
import { fieldTypes } from './types.js';
import { prisma } from '../src/prisma.js';
const models = Object.keys(fieldTypes);
/* "In Node.js, __dirname and __filename are special variables available in CommonJS modules that provide the directory name and file name of the current module."
https://www.w3schools.com/nodejs/nodejs_path.asp
The console logs below are taken from this source. */
const __filename = fileURLToPath(import.meta.url);
console.log('ES Module file path:', __filename);
const __dirname = path.dirname(__filename);
console.log('ES Module directory:', __dirname);
/* "Use path.join() or path.resolve() with __dirname to build file paths in CommonJS modules.
For ES modules, use import.meta.url with fileURLToPath and dirname to get the equivalent functionality."
https://www.w3schools.com/nodejs/nodejs_path.asp
TO DO: Q: why is the following constant in the Moodle instructions, then? */
const dir = path.join(__dirname, 'csv');
async function main() {
    const csvFiles = (await readdir(dir)).filter(f => f.endsWith('.csv'));
    for (const model of models) {
        /* TO DO: this syntax (in instructions on Moodle) does not appear to be understood in TypeScript.
        The error prevents the build from being created. */
        const file = `${model}.csv`;
        if (!csvFiles.includes(file))
            continue;
        const raw = parse(await readFile(path.join(dir, file), 'utf-8'), {
            columns: true,
            skip_empty_lines: true
        });
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
        if (key === 'password')
            out[key] = await bcrypt.hash(val, 10);
        else if (type === 'number')
            out[key] = Number(val);
        else if (type === 'boolean')
            out[key] = val !== '0';
        else if (type === 'date')
            out[key] = val ? new Date(val) : null;
        else
            out[key] = val ?? null;
    }
    ;
    return out;
}
;
main()
    .then(() => console.log('seeding done'))
    .finally(() => prisma.$disconnect());
