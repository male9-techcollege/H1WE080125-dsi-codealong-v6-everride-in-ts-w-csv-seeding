/* EXERCISE after v3 */
import { Router } from "express";
const routerByMariePierreLessard = Router();
/* Just like when we add a class list to an object with .classList,
with .get, we are adding the following code to the function expression router.
Interestingly, the only thing that needs to be exported is router, not all of these additions.

In my to-do list assignment, I was struggling with putting event listeners in modules because I didn't know how this works. */
routerByMariePierreLessard.get("/", (req, res) => {
    console.log("Sider til at imødekomme juridiske krav");
    res.send("Sider til at imødekomme juridiske krav");
});
routerByMariePierreLessard.get("/terms", (req, res) => {
    console.log("Dette er siden Handelsbetingelser...");
    res.send("Dette er siden Handelsbetingelser...");
});
routerByMariePierreLessard.get("/privacy", (req, res) => {
    console.log("Dette er siden Privatlivspolitik...");
    res.send("Dette er siden Privatlivspolitik...");
});
routerByMariePierreLessard.get("/payment", (req, res) => {
    console.log("Dette er siden Betalingsmidler...");
    res.send("Dette er siden Betalingsmidler...");
});
routerByMariePierreLessard.get("/delivery", (req, res) => {
    console.log("Dette er siden Levering...");
    res.send("Dette er siden Levering...");
});
routerByMariePierreLessard.get("/returns", (req, res) => {
    console.log("Dette er siden Levering...");
    res.send("Dette er siden Retur...");
});
routerByMariePierreLessard.get("/warranty", (req, res) => {
    console.log("Dette er siden Garanti og service...");
    res.send("Dette er siden Garanti og service...");
});
export { routerByMariePierreLessard as legalPagesRouterByMariePierreLessard };
/* Copyright 2025, Marie-Pierre Lessard */ 
