import request from 'supertest';
import { app } from '../../app';

import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';

it('fetches orders for a particular user', async () => {
  // Create three tickets
  const ticketOne = Ticket.build({ title: 'Concert 1', price: 20 });
  await ticketOne.save();

  const ticketTwo = Ticket.build({ title: 'Concert 2', price: 30 });
  await ticketTwo.save();

  const ticketThree = Ticket.build({ title: 'Concert 3', price: 40 });
  await ticketThree.save();

  // Create one order as User #1
  const userOne = global.signin();
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // Create two orders as User #2
  const userTwo = global.signin();
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);

  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  // Make request to get orders for User #2
  const response = await request(app)
    .get('/api/orders/')
    .set('Cookie', userTwo)
    .send()
    .expect(200);

  // Make sure we only got the orders for User #2
  const orders = response.body;
  expect(orders.length).toEqual(2);
  expect(orders[0].id).toEqual(orderOne.id);
  expect(orders[1].id).toEqual(orderTwo.id);
});
