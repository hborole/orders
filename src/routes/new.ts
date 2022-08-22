import { requireAuth, validateRequest } from '@hbofficial/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

const router = express.Router();

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId').not().isEmpty().withMessage('Ticket id is required'),
    body('ticketId').isMongoId().withMessage('Ticket id is invalid'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    res.send({});
  }
);

export { router as createOrderRouter };
