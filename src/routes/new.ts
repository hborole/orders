import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from '@hbofficial/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Order, OrderStatus } from '../models/order';
import { Ticket } from '../models/ticket';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId').not().isEmpty().withMessage('Ticket id is required'),
    body('ticketId').isMongoId().withMessage('Ticket id is invalid'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure that this ticket is not already reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    // Calculate an expiration date
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      expiresAt: expiration,
      status: OrderStatus.Created,
      ticket,
    });
    await order.save();

    // Publish an event saying that an order was created

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
