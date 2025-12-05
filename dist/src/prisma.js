/* FUTILE TROUBLESHOOTING IF PRISMA VERION 7 IS USED:
About when we started on these codealongs, Prisma introduced breaking changes with Prisma 7.
Heinz was not aware of these, and the instructions on Moodle are outdated.
We reverted to using an older version of Prisma because Heinz didn't have time to figure out how to use Prisma 7.
The following research and troubleshooting notes are still useful, though, but the tips found online did not work because of the breaking changes.

Instructions from Heinz on Teams, on top of Moodle instructions: create prisma.js at the root of the project.

import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();

It still didn't work after I removed the line
output = "../src/generated"
in file schema.prisma,
which is in keeping with instructions on Moodle.

Before I learned that the output line should be omitted, I experienced that the following alternative also doesn't work in the long run, just at first.
As I later learned, it is a direct importation and won't work when mixing CommonJS modules and ES modules in one project.

import { PrismaClient } from "./src/generated/client.ts";
export const prisma = new PrismaClient();

Then I found the following sources, which did not do the trick either:
"Alternately, you can generate the client in a different location than the default"
https://github.com/prisma/prisma/issues/7234
Then I found the following on Prima's doc. page:
"import { PrismaClient } from "./generated/client"
const prisma = new PrismaClient()"
https://www.prisma.io/docs/orm/overview/introduction/what-is-prisma
(In the codealong, we had added the folder src to that, see output= above.)

Moodle recommends the following syntax (already mentioned above), but why is it supposed to work with ES modules?
Indeed, the curly brackets are for named imports, not default imports.
import { PrismaClient } from "@prisma/client";
Is the following source incorrect? The person seemed knowledgeable.
Reason:
"ES modules are able to load CJS modules via the import statement, with the minor caveat that only default-import syntax is supported. And CJS modules are able to load other CJS modules via the require() function. So both ES modules and CJS modules are able to load CJS modules."
https://stackoverflow.com/questions/74937600/how-to-support-es-modules-and-commonjs-modules-at-the-same-time

This should work with ES modules since this is a default import.

import pkg from "@prisma/client";
const { PrismaClient } = pkg;
export const prisma = new PrismaClient();

Indeed, the terminal gives me the following error message.
"SyntaxError: Named export 'PrismaClient' not found. The requested module '@prisma/client' is a CommonJS module, which may not support all module.exports as named exports.
CommonJS modules can always be imported via the default export, for example using:

import pkg from '@prisma/client';
const { PrismaClient } = pkg;
"

In a Traversy Media video, I also saw that ' isn't always accepted as a substitute for ".
I think it was with Node.js, so I wonder if the terminal message is misleading, although it shouldn't be.

I also tried changing file name to .cjs to make the following work, but it still did not work:
const { PrismaClient } = require("@prisma/client");
export const prisma = new PrismaClient();


Solution that must have worked before the breaking changes:
"2. Your package is written using ES module loading
This means your package uses import to load dependencies. But don't be fooled - sometimes, especially when using TypeScript, you may be writing import in your code, but it's getting compiled to require() behind the scenes.
Unfortunately, CommonJS modules do not support loading ES modules except (in Node.js) by using the import() function (which is a bit painful and not a great solution).
In order to support CommonJS in this case, your best bet is to transpile your package into a CommonJS module, and ship both CommonJS and ESM versions of your package.
I do this in a number of my own packages mostly by using Rollup, which makes it relatively easy.

The basic concept is this:
1. Write your package as an ES module.
2. Install rollup: npm i -D rollup
3. Run npx rollup index.js --file index.cjs --format cjs to convert your code into a CJS module.
4. Export both from your package.json:
{
    "name": "my-package",
    "version": "1.0.0",
    "main": "index.js",
    "type": "module",
    "exports": {
      "import": "./index.js",
      "require": "./index.cjs"
    }
  }

This way, the CJS module loader knows to load your index.cjs file, while the ESM loader knows to load your index.js file, and both are happy. (...)
Aurast   Over a year ago
@Normal Sort of. UMD isn't really a first-class type of module, it's more like a coding convention to create code that can work in several different environments. In Node.js, a UMD module would be loaded as a CJS module by the CJS module loader. A UMD module contains code that sees "oh look, I have a module.exports object available to me, I must be getting loaded as a CJS module" and it attaches its exports to module.exports in Node.js. In other environments too (like browser and AMD modules) it will detect how it's being loaded and change behavior accordingly."
By Aurast at https://stackoverflow.com/questions/74937600/how-to-support-es-modules-and-commonjs-modules-at-the-same-time

The following attempt still does not work. Similar error message, so I am reverting to an older version of Prisma.
Heinz warned us that we might need to start our assignment from scratch again because of a few technical reasons.
Then, we performed some tests (I was responsible for the testing on Windows, see folder prisma-test-on-windows),
and we figured out that there were breaking changes in Prisma 7.
Heinz then gave us the codealong in folder everride-codealong.

Source that formed the basis of my attempt:
https://www.prisma.io/docs/orm/overview/databases/mysql#using-the-mariadb-driver

import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb"

const adapter = new PrismaMariaDb({
  host: "localhost",
  port: 3306,
  connectionLimit: 5

const prisma = new PrismaClient({ adapter });

OTHER SYNTAX TO APPLY:
  const adapter = new PrismaMariaDb({
    connectionString: process.env.DATABASE_URL
  });
})
*/
import { PrismaClient } from "@prisma/client";
export const prisma = new PrismaClient();
/* Copyright 2025, Marie-Pierre Lessard */
