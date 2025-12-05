import { Router } from "express";
import { login } from "../controllers/loginController.js";

const router = Router();

/* These are subroutes. The routes in index.js file are called base routes. */
router.post("/", login);

export { router as loginRouterByMariePierreLessard };

/* Copyright 2025, Marie-Pierre Lessard */