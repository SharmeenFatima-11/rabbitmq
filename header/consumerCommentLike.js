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
    const exchange = "header_exchange";
    const exchangeType = "headers";
    // exchange
    await channel.assertExchange(exchange, exchangeType, { durable: true }); // durable to save data in queue
    const q = await channel.assertQueue("", { durable: false });
    // binding
    await channel.bindQueue(q.queue, exchange, "", {
      "x-match":"all", // all for and
      "notification-type":"new_Video", 
      "content-type":"video"
    });
    channel.consume(q.queue, (message) => {
      if (message != null) {
        console.log("Recv message for video", JSON.parse(message.content));
        // send ack
        channel.ack(message);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

recieveMail();
