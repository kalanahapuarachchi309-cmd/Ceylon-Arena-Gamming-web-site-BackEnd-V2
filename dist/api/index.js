"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const db_1 = __importDefault(require("../config/db"));
const app_1 = __importDefault(require("../app"));
async function handler(req, res) {
    await (0, db_1.default)();
    return (0, app_1.default)(req, res);
}
