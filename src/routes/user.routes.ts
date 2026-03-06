import { Router } from "express";
import { register, login, refreshToken, logout, registerWithBankPayment } from "../controllers/user.controller";
import { upload } from "../middleware/upload";

const router = Router();

router.post("/register", register);
router.post(
  "/register-with-bank-payment",
  upload.single("slipFile"),
  registerWithBankPayment
);
router.post("/login", login);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

export default router;
