/* Additional exercise in v4 */
import { Router } from "express";
import { createRecordByMariePierreLessard, getRecordsByMariePierreLessard, getRecordByMariePierreLessard, updateRecordByMariePierreLessard, deleteRecordByMariePierreLessard } from "../controllers/cfrelController.js";
const routerByMariePierreLessard = Router();
routerByMariePierreLessard.post("/", createRecordByMariePierreLessard);
routerByMariePierreLessard.get("/", getRecordsByMariePierreLessard);
/* Before exercise and codealong in version 4, the code to use was:
routerByMariePierreLessard.get("/:id", (req, res) => {
    const identifier = Number(req.params.id);
    // console.log(req.params.id);
    res.send(`Detaljer for ${identifier}`);
});
 */
routerByMariePierreLessard.get("/:id", getRecordByMariePierreLessard);
routerByMariePierreLessard.put('/:id', updateRecordByMariePierreLessard);
routerByMariePierreLessard.delete("/:id", deleteRecordByMariePierreLessard);
export { routerByMariePierreLessard as cfrelRouterByMariePierreLessard };
/* Copyright 2025, Marie-Pierre Lessard */ 
