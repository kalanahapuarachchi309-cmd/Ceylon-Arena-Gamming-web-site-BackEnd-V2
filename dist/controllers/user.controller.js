"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refreshToken = exports.login = exports.registerWithBankPayment = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../models/User"));
const mongoose_1 = __importDefault(require("mongoose"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const Payment_1 = __importStar(require("../models/Payment"));
const ACCESS_TOKEN_EXPIRE = "15m";
const REFRESH_TOKEN_EXPIRE = "7d";
const register = async (req, res) => {
    try {
        console.log(req.body);
        const { playerName, email, phone, promoCode, leaderAddress, password, game, gameId, teamName, player2Name, player2GameId, player3Name, player3GameId, player4Name, player4GameId } = req.body;
        const exists = await User_1.default.findOne({ email });
        if (exists)
            return res.status(400).json({ message: "Email already registered" });
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await User_1.default.create({
            playerName,
            email,
            phone,
            promoCode,
            address: leaderAddress,
            password: hashedPassword,
            games: [{ game, gameId, teamName, player2Name, player2GameId, player3Name, player3GameId, player4Name, player4GameId }]
        });
        res.status(201).json({ message: "User registered successfully", data: { id: user._id, playerName: user.playerName, email: user.email, role: user.role } });
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.register = register;
const registerWithBankPayment = async (req, res) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { playerName, email, phone, promoCode, leaderAddress, password, game, gameId, teamName, player2Name, player2GameId, player3Name, player3GameId, player4Name, player4GameId, amount, bankName, accountHolder, accountNumber, ifscCode, transactionId } = req.body;
        if (!req.file) {
            throw new Error("Payment slip required");
        }
        // 1️⃣ Check existing user
        const exists = await User_1.default.findOne({ email }).session(session);
        if (exists) {
            throw new Error("Email already registered");
        }
        // 2️⃣ Hash password
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        // 3️⃣ Upload slip to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
            const stream = cloudinary_1.default.uploader.upload_stream({
                folder: "payment_slips"
            }, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            });
            stream.end(req.file.buffer);
        });
        // 4️⃣ Create user (inside transaction)
        const user = await User_1.default.create([{
                playerName,
                email,
                phone,
                promoCode,
                address: leaderAddress,
                password: hashedPassword,
                games: [{
                        game,
                        gameId,
                        teamName,
                        player2Name,
                        player2GameId,
                        player3Name,
                        player3GameId,
                        player4Name,
                        player4GameId
                    }]
            }], { session });
        // 5️⃣ Create payment (inside transaction)
        const payment = await Payment_1.default.create([{
                userId: user[0]._id,
                amount,
                paymentMethod: Payment_1.PaymentMethod.BANK,
                status: Payment_1.PaymentStatus.PENDING,
                bankName,
                accountHolder,
                accountNumber,
                ifscCode,
                transactionId,
                slipFilePath: uploadResult.secure_url
            }], { session });
        // 6️⃣ Commit transaction
        await session.commitTransaction();
        session.endSession();
        return res.status(201).json({
            success: true,
            message: "Registration and payment submitted successfully",
            data: {
                userId: user[0]._id,
                paymentId: payment[0]._id
            }
        });
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({
            success: false,
            message: error.message || "Transaction failed"
        });
    }
};
exports.registerWithBankPayment = registerWithBankPayment;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User_1.default.findOne({ email });
        if (!user)
            return res.status(400).json({ message: "Invalid credentials" });
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: "Invalid credentials" });
        const accessToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRE });
        const refreshToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRE });
        // Save refresh token in DB
        user.refreshToken = refreshToken;
        await user.save();
        res.json({
            accessToken,
            refreshToken,
            user: {
                id: user._id,
                playerName: user.playerName,
                email: user.email,
                role: user.role
            }
        });
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.login = login;
const refreshToken = async (req, res) => {
    try {
        const { token } = req.body;
        if (!token)
            return res.status(401).json({ message: "No token provided" });
        const user = await User_1.default.findOne({ refreshToken: token });
        if (!user)
            return res.status(403).json({ message: "Invalid refresh token" });
        // Use jwt.verify synchronously and type the payload
        let decoded;
        try {
            decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_REFRESH_SECRET);
        }
        catch (err) {
            return res.status(403).json({ message: "Token expired or invalid" });
        }
        const accessToken = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
        res.json({ accessToken });
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.refreshToken = refreshToken;
const logout = async (req, res) => {
    try {
        const { token } = req.body;
        const user = await User_1.default.findOne({ refreshToken: token });
        if (user) {
            user.refreshToken = "";
            await user.save();
        }
        res.json({ message: "Logged out successfully" });
    }
    catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.logout = logout;
