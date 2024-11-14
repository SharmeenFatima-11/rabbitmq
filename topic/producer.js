const amqp = require('amqplib')

// check routing key like order.*
const topicExchange = async(routingKey, message) => {
    try {
        // Connect using AMQPS with SSL
        // const connection = await amqp.connect({
        //     protocol: 'amqps',
        //     hostname: 'b-ed63f081-c05c-40a0-bdfd-4336790247ab.mq.eu-north-1.amazonaws.com',
        //     port: 5671,
        //     username: 'vupopadmin',
        //     password: '2uweD635k4kCaYK2jA',
        // });
        const connection = await amqp.connect("amqp://localhost")
        const channel = await connection.createChannel()

        // exchange
        const exchange = "topic_exchange";
        const exchangeType = 'topic'
        

        // exchange
        await channel.assertExchange(exchange, exchangeType, {durable: true}); // durable to save data in queue
       // publish channel
        channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)))
        // channel.publish(exchange, routingKey2, Buffer.from(JSON.stringify(message)))

        console.log("mail data was sent", message, 'routing key..', routingKey);

        setTimeout(() => {
            connection.close()
        }, 5000)
    } catch (error) {
        console.log(error)
    }
}

topicExchange("order.placed", {order:12333})
topicExchange("payment.processed", {payment:'abbb'})