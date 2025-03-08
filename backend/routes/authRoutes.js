// backend/routes/authRoutes.js
import express from "express";
import {
  deleteUser,
  getUser,
  login,
  register,
  users,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user/:email", getUser);
router.get("/users", users);
router.delete("/user/:email", deleteUser);

export default router;
