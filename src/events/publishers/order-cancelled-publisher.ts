import { OrderCancelledEvent, Publisher, Subjects } from '@hbofficial/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
