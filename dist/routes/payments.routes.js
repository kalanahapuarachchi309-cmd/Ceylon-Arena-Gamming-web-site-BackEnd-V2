"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/payments.ts
const express_1 = __importDefault(require("express"));
const Payment_1 = __importDefault(require("../models/Payment"));
const router = express_1.default.Router();
// GET /api/payments?page=1&limit=10
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const [payments, totalCount] = await Promise.all([
            Payment_1.default.find().sort({ paymentDate: -1 }).skip(skip).limit(limit),
            Payment_1.default.countDocuments(),
        ]);
        res.json({
            page,
            limit,
            totalPages: Math.ceil(totalCount / limit),
            totalCount,
            payments,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});
exports.default = router;
