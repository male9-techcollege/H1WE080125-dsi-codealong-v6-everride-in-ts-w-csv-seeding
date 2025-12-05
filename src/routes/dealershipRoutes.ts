/* EXERCISE after v3 */
import { Router } from "express";

const routerByMariePierreLessard = Router();

routerByMariePierreLessard.get("/", (req, res) => {
    console.log("Sider til afdelinger");
    res.send("Sider til afdelinger");
});

routerByMariePierreLessard.get("/jylland", (req, res) => {
    console.log("Sider til afdelinger i Jylland...");
    res.send("Sider til afdelinger i Jylland...");
});

routerByMariePierreLessard.get("/fyn", (req, res) => {
    console.log("Sider til afdelinger på Fyn...");
    res.send("Sider til afdelinger på Fyn...");
});

routerByMariePierreLessard.get("/sjaelland", (req, res) => {
    console.log("Sider til afdelinger på Sjælland...");
    res.send("Sider til afdelinger på Sjælland...");
});

export { routerByMariePierreLessard as dealershipRouterByMariePierreLessard };

/* Copyright 2025, Marie-Pierre Lessard */