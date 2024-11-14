const amqp = require("amqplib");

async function recieveMail() {
  try {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();
    // exchange
    const exchange = "fanout_exchange";
    const exchangeType = "fanout";
    // exchange
    await channel.assertExchange(exchange, exchangeType, { durable: true }); // durable to save data in queue
    // create temporary queue
    const queue = await channel.assertQueue("", {exclusive:true}) //temp queue
    console.log("waiting for messages", queue)
    // bind queue
    await channel.bindQueue(queue.queue, exchange, "")
    // consumer
    channel.consume(queue.queue, (message) => {
      if (message != null) {
        console.log("Recv message for user 2", JSON.parse(message.content));
        // send ack
        channel.ack(message);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

recieveMail();
