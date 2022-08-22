import { OrderCreatedEvent, Publisher, Subjects } from '@hbofficial/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
