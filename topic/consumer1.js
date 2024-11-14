const amqp = require("amqplib");

async function recieveMail() {
  try {
    // const connection = await amqp.connect({
    //     protocol: 'amqps',
    //     hostname: 'b-ed63f081-c05c-40a0-bdfd-4336790247ab.mq.eu-north-1.amazonaws.com',
    //     port: 5671,
    //     username: 'vupopadmin',
    //     password: '2uweD635k4kCaYK2jA',
    // });
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    // exchange
    const exchange = "topic_exchange";
    const exchangeType = "topic";
    const queue = "topic_queue_1";
    // exchange
    await channel.assertExchange(exchange, exchangeType, { durable: true }); // durable to save data in queue
    await channel.assertQueue(queue, { durable: false });
    // binding
    await channel.bindQueue(queue, exchange, "order.*");
    channel.consume(queue, (message) => {
      if (message != null) {
        console.log("Recv message for user 1", JSON.parse(message.content));
        // send ack
        channel.ack(message);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

recieveMail();
