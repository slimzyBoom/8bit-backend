import express from "express";
import {
  login,
  register,
  forgot_password,
} from "../controllers/auth.controller.js";
import validatePayload from "../middleware/validatePayload.js";
import {
  register_schema,
  login_schema,
  forgot_password_schema,
} from "../joi_schemas/auth.schema.js";
const router = express.Router();

router.post("/register", validatePayload(register_schema, "body"), register);
router.post("/login", validatePayload(login_schema, "body"), login);
router.post(
  "/forgot-password",
  validatePayload(forgot_password_schema, "body"),
  forgot_password
);

export default router;
