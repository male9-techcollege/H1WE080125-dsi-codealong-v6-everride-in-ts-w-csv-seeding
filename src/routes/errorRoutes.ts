/* EXERCISE after v3 */
import { Router } from "express";

const routerByMariePierreLessard = Router();

routerByMariePierreLessard.get("/", (req, res) => {
    console.log("Sider til fejlbeskeder");
    res.send("Sider til fejlbeskeder");
});

/* Tested: if I enter the address
http://localhost:4000/errors/404
I can see the text HTTP-response-status code: 404 */
routerByMariePierreLessard.get("/:code", (req, res) => {
    const httpResponseStatusCodeByMariePierreLessard = Number(req.params.code);
    console.log(req.params.code);
    res.send(`HTTP-response-status code: ${httpResponseStatusCodeByMariePierreLessard}`);
});

export { routerByMariePierreLessard as errorRouterByMariePierreLessard };

/* Copyright 2025, Marie-Pierre Lessard */