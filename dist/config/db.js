"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MONGO_URI = process.env.MONGO_URI;
let isConnected = false;
const connectDB = async () => {
    if (isConnected) {
        return;
    }
    const db = await mongoose_1.default.connect(MONGO_URI, {
        bufferCommands: false,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log("✅ MongoDB Connected");
};
exports.default = connectDB;
