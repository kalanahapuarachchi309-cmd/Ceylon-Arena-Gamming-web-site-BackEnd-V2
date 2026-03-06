// routes/payments.ts
import express from 'express';
import { changePaymentStatus, deletePayment, getPayments } from '../controllers/payments.controller';
import { authenticate, isAdmin } from '../middleware/user.middleware';

const router = express.Router();

// GET /api/payments?page=1&limit=10
router.get("/", authenticate, isAdmin, getPayments);
router.patch("/:id/status", authenticate, isAdmin, changePaymentStatus);
router.delete("/:id", authenticate, isAdmin, deletePayment);

export default router;