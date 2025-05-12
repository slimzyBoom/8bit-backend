import express from "express";
const router = express.Router();
import { getUser, updateUser, getAvatars, getNationalites } from "../controllers/user.controller.js";
import { updateUserSchema } from "../joi_schemas/user.schema.js";
import validatePayload from "../middleware/validatePayload.js";

router.get("/", getUser);
router.patch("/", validatePayload(updateUserSchema, "body"), updateUser);
router.get("/nationalities", getNationalites);
router.get("/avatars", getAvatars)

export default router;
