import { Router } from "express";
import { register, login, refreshToken, logout, registerWithBankPayment } from "../controllers/user.controller";
import multer from "multer";

const router = Router();

const upload = multer({
  dest: "uploads/",
  fileFilter: (_req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed"));
    } else {
      cb(null, true);
    }
  }
});

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
