// routes/payments.ts
import express from 'express';
import PaymentModel from '../models/Payment';

const router = express.Router();

// GET /api/payments?page=1&limit=10
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const skip = (page - 1) * limit;

    const [payments, totalCount] = await Promise.all([
      PaymentModel.find().sort({ paymentDate: -1 }).skip(skip).limit(limit),
      PaymentModel.countDocuments(),
    ]);

    res.json({
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      payments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;