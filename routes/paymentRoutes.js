import express from 'express';
import { getPayments, getPaymentByOrderId, createPayment } from '../controllers/paymentController.js';

const router = express.Router();

router.get('/', getPayments);
router.get('/order/:orderId', getPaymentByOrderId);
router.post('/', createPayment);

export default router;
