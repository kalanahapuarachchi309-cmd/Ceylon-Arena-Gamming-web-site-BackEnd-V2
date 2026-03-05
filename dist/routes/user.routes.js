"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    fileFilter: (_req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            cb(new Error("Only image files are allowed"));
        }
        else {
            cb(null, true);
        }
    }
});
router.post("/register", user_controller_1.register);
router.post("/register-with-bank-payment", upload.single("slipFile"), user_controller_1.registerWithBankPayment);
router.post("/login", user_controller_1.login);
router.post("/refresh-token", user_controller_1.refreshToken);
router.post("/logout", user_controller_1.logout);
exports.default = router;
