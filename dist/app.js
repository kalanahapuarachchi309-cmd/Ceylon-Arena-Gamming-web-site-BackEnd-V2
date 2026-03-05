"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const user_routes_2 = __importDefault(require("./routes/user.routes"));
const payments_routes_1 = __importDefault(require("./routes/payments.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "https://ceylon-arena-gamming-web-site.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
}));
app.use(express_1.default.json());
app.use("/api/v1/users", user_routes_1.default);
app.use("/api/v1/auth", user_routes_2.default);
app.use("/api/v1/payments", payments_routes_1.default);
exports.default = app;
