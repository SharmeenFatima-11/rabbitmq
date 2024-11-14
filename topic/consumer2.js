const amqp = require("amqplib");

async function recieveMail() {
  try {
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
    await channel.bindQueue(queue, exchange, "payment.*");
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
