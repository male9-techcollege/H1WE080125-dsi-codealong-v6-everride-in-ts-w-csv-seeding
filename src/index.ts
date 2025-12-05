/* NOTES ABOUT CONTENTS OF PACKAGE.JSON IN VERSION 5, BEFORE I CONVERTED PROJECT TO TYPESCRIPT:

About:
"scripts": {
    "start": "node --watch index.js",
    "dev": "node --watch --watch-preserve-output index.js",
  },

To start the server and clear the terminal, enter "npm start" or "npm run start" in the terminal. This command, along with script above, does the same thing as entering "nodemon" in the terminal. 
The "nodemon" command still works (and it contains less characters; faster to type).
Source for "npm start": one of the videos by Traversy Media that I watched on YouTube in the last 2-3 weeks.
To start the server without clearing the terminal, enter "npm run dev".

"--watch (...)
Starts Node.js in watch mode. When in watch mode, changes in the watched files cause the Node.js process to restart. By default, watch mode will watch the entry point and any required or imported module. (...)
--watch-preserve-output (...)
Disable the clearing of the console when watch mode restarts the process."
https://nodejs.org/docs/latest/api/cli.html

TypeScript only synxtax:
"prisma:generate": "prisma generate",
"prisma:migrate": "prisma migrate dev",
"prisma:reset": "prisma migrate reset",
"prisma:seed": "prisma db seed"
"prisma:seed", etc., do not work unless I have .ts files. Without TS, the command to execute the code in seed.js is:
npx prisma db seed

NOTES ABOUT CONTENTS OF PACKAGE.JSON IN VERSION 6 (Everride in TS):

The command "nodemon" no longer works. To start the server, I have to use:
npm run dev

There is a mistake on Moodle at https://moodle.techcollege.dk/course/section.php?id=284926 :
the src folder was missing from the value of the start key. Consequence: "npm run start" did not work.
"start": "node dist/src/index.js",

*/

/* Teacher's code from codealongs can be found at https://github.com/Webudvikler-TechCollege/H1WE080125-dsi-codealong */

/* See additional useful notes in 1st version codealong */

/* Express is not a built-in Node.js module. It is an optional server framework. 
"Den store forskel på Express og de indbyggede server moduler ligger i, at vi ikke definerer en request i Express. Vi definerer mange! Nemlig en per url."
https://moodle.techcollege.dk/course/section.php?id=282537

"Npm er en forkortelse for Node Package Manager og er et værktøj der gør det muligt for JavaScript-udviklere at genbruge og dele små pakker af kode med andre.
Disse pakker kaldes også for moduler. (...)
Alle npm pakker er beskrevet og kan hentes fra npmjs.com. Da der ikke kvalitetskontrol bør du være opmærksom på pakkernes status i forhold til anvendelse og ratings. (...)

Desuden opdateres konfigurationsfilerne package.json og package-lock.json med de installerede moduler og deres versionsnummer.
Konfigurationsfilerne er vigtige altid at få med når vi vil dele vores kode på eksempelvis Github. De betyder nemlig at vi nemt kan geninstallere lige præcis de nødvendige moduler og deres versioner. Og dermed undgår vi også at skulle dele den til tider meget datatunge folder node_modules.

Så husk altid at tilføje node_modules til jeres .gitignore fil."
https://moodle.techcollege.dk/course/section.php?id=282536
*/
/* Default import from express */
import express from "express";
/* Default import from "dotenv" 
The .env file is useful for credentials. 
"Dotenv er et npm-bibliotek, der gør det muligt at indlæse miljøvariabler fra en .env-fil til Node.js-applikationer."
Source: Moodle, page entitled "DOTENV biblioteket" */
import dotenv from "dotenv";
import { carRouterByMariePierreLessard } from "./routes/carRoutes.js";
import { brandRouterByMariePierreLessard } from "./routes/brandRoutes.js";
import { categoryRouterByMariePierreLessard } from "./routes/categoryRoutes.js";
import { fuelRouterByMariePierreLessard } from "./routes/fuelRoutes.js";
import { cfrelRouterByMariePierreLessard } from "./routes/cfrelRoutes.js";
import { userRouterByMariePierreLessard } from "./routes/userRoutes.js";
import { loginRouterByMariePierreLessard } from "./routes/loginRoutes.js";
import { authRouterByMariePierreLessard } from "./routes/authRoutes.js";
import { legalPagesRouterByMariePierreLessard } from "./routes/legalRoutes.js";
import { dealershipRouterByMariePierreLessard } from "./routes/dealershipRoutes.js";
import { errorRouterByMariePierreLessard } from "./routes/errorRoutes.js";

/* Initialiser dotenv config
Indsæt nedenstående i din index.js fil for at kalde config metoden på dotenv objektet og dermed indlæse .env filens variabler ind i node miljøet:
https://moodle.techcollege.dk/course/section.php?id=282538
*/
// TS-version: Indlæs miljøvariabler fra .env (uden at vise logs)
dotenv.config({ quiet: true });
// console.log(process.env.DATABASE_URL);

/* Codealongs v1-v3 said: 
const port = 4000;
*/
/*  Kald variabler på process.env
Nu kan du tilgå variablerne fra .env filen ved at kalde deres key name på objektet process.env:
https://moodle.techcollege.dk/course/section.php?id=282538
*/
/* || 3000 creates a fallback server port in case the key SERVERPORT and therefore its value are not found in .env file.  */
const port = process.env.SERVERPORT || 3000;
 
/* If I include the following, nodemon crashes. It's because it's CommonJS.
This declaration was not in the codealong, but in instructions at https://expressjs.com (it's commonJs and doesn't work with ES modules) 
const express = require("express");
*/
/* This does the same as createServer in v1 of the codealong: it initialises Express acc. to "Express Crash Course" by Traversy Media on YouTube at https://m.youtube.com/watch?v=CnH3kAXSrmU */
const serverAppByMariePierreLessard = express();
/* urlencoded corresponds to the test method we are taught to use in Postman
There are other options, which also correspond to other test methods in Postman, e.g.:
serverAppByMariePierreLessard.use(express.json());
in order to send raw JSON from Postman.
see "Express Crash Course" by Traversy Media on YouTube at https://m.youtube.com/watch?v=CnH3kAXSrmU 
and Express + TypeScript instructions on Moodle at https://moodle.techcollege.dk/course/section.php?id=284926 */
// Gør det muligt at modtage form-data (fx fra formularer)
serverAppByMariePierreLessard.use(express.urlencoded({ extended: true }));
// Gør det muligt at modtage JSON i requests
serverAppByMariePierreLessard.use(express.json());

/* It's easier to test in the browser with get than with other HTTP-request methods. */
/* This calls root route with request and response object. 
   "/" is a synonym for root. */
/* "Ved at bruge metoden get i Express kan vi sætte en listener op for hver enkelt url og definere hvilket svar, serveren skal give de enkelte forespørgsler. Dermed kan vi nemmere håndtere hvilke sider brugerne må og kan se og omvendt. Det kaldes også routing i moderne fagsprog."
https://moodle.techcollege.dk/course/section.php?id=282537 */
/* Troubleshooting: 
now that I added api to the root "/", the index file is no longer found at the address http://localhost:${port} */
serverAppByMariePierreLessard.get("/api", (request, response) => {
    /* The following only gets printed to the console or displayed in browser when serverAppByMariePierreLessard is called.
    To call serverAppByMariePierreLessard, first I have to type nodemon in the console, and then I use CTRL+click on the URL in the terminal. */
    response.send("Velkommen til Everride!"); //To see text in browser
    console.log("Velkommen til Everride!"); //To see text in terminal
    // console.log(request); //To see text in terminal
});

/* On large sites, it is advisable to create JS files for endpoints (routes) in each section, otherwise the list gets very long. 
The following says that carRouter is called at the endpoint /cars. 
Middleware, like carRouter, is code that gets implemented between "the incoming request and the outgoing response" acc. to "Express Crash Course" by Traversy Media on YouTube at https://m.youtube.com/watch?v=CnH3kAXSrmU */
serverAppByMariePierreLessard.use("/api/cars", carRouterByMariePierreLessard);
/* Additional exercise in v4 */
serverAppByMariePierreLessard.use("/api/brands", brandRouterByMariePierreLessard);
serverAppByMariePierreLessard.use("/api/categories", categoryRouterByMariePierreLessard);
/* Exercise in v5 */
serverAppByMariePierreLessard.use("/api/fuels", fuelRouterByMariePierreLessard);
serverAppByMariePierreLessard.use("/api/cfrel", cfrelRouterByMariePierreLessard);
serverAppByMariePierreLessard.use("/api/users", userRouterByMariePierreLessard);
serverAppByMariePierreLessard.use("/api/login", loginRouterByMariePierreLessard);
serverAppByMariePierreLessard.use("/api/auth", authRouterByMariePierreLessard);

/* EXERCISE after v3 */
serverAppByMariePierreLessard.use("/api/legal", legalPagesRouterByMariePierreLessard);
serverAppByMariePierreLessard.use("/api/dealerships", dealershipRouterByMariePierreLessard);
serverAppByMariePierreLessard.use("/api/errors", errorRouterByMariePierreLessard);

/* EXERCISE after v2
Du må selv bestemme hvilke sider du vil oprette listeners til 
Og tænk over hvordan du kan håndtere brugerforespørgsler på sider som ikke er sat op i din router (404 requests). Kom gerne med løsningsforslag. 

FEJLSSIDER:
Se eksempel på
https://github.com/expressjs/express/blob/master/examples/error-pages/index.js
(Fundet via https://expressjs.com/en/starter/examples.html)

serverAppByMariePierreLessard.get("/api/vehicles", (request, response) => {
    response.send("Dette er siden Biler til salg...");
});

serverAppByMariePierreLessard.get("/api/dealerships", (request, response) => {
    response.send("Dette er siden Afdelinger...");
});

serverAppByMariePierreLessard.get("/api/about", (request, response) => {
    response.send("Dette er siden Om Everride...");
});

serverAppByMariePierreLessard.get("/api/contact", (request, response) => {
    response.send("Dette er siden Kontakt os...");
});

serverAppByMariePierreLessard.get("/api/terms", (request, response) => {
    response.send("Dette er siden Handelsbetingelser...");
});

serverAppByMariePierreLessard.get("/api/privacy", (request, response) => {
    response.send("Dette er siden Privatlivspolitik...");
});

serverAppByMariePierreLessard.get("/api/payment", (request, response) => {
    response.send("Dette er siden Betalingsmidler...");
});

serverAppByMariePierreLessard.get("/api/delivery", (request, response) => {
    response.send("Dette er siden Levering...");
});

serverAppByMariePierreLessard.get("/api/returns", (request, response) => {
    response.send("Dette er siden Retur...");
});

serverAppByMariePierreLessard.get("/api/warranty", (request, response) => {
    response.send("Dette er siden Garanti og service...");
});
*/

/* To check if access is given at that port.
1. Enter nodemon followed by Enter in terminal
2. Open link in browser */
/* When I had the following mistake in the code, 
Windows Explorer opened instead of the browser 
when I used CTRL+click on link in the console. 
(Dot instead of a colon)
http://localhost.${port}
*/
serverAppByMariePierreLessard.listen(port, () => {
    console.log(`Express-server kører på http://localhost:${port}/api`);
});


/* Copyright 2025, Marie-Pierre Lessard */