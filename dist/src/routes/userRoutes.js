import { Router } from "express";
import { createRecordByMariePierreLessard, getRecordsByMariePierreLessard, getRecordByMariePierreLessard, updateRecordByMariePierreLessard, deleteRecord } from "../controllers/userController.js";
const router = Router();
router.post("/", createRecordByMariePierreLessard);
router.get("/", getRecordsByMariePierreLessard);
router.get("/:id", getRecordByMariePierreLessard);
router.put('/:id', updateRecordByMariePierreLessard);
router.delete("/:id", deleteRecord);
export { router as userRouterByMariePierreLessard };
/* Copyright 2025, Marie-Pierre Lessard */ 
