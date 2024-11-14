const amqp = require('amqplib')

// routing key is ignored in fanout
const fanoutExchange = async(product) => {
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
        const exchange = "fanout_exchange";
        const exchangeType = 'fanout'
        await channel.assertExchange(exchange, exchangeType, {durable: true}); // durable to save data in queue
       // publish channel
        channel.publish(exchange, "", Buffer.from(JSON.stringify(product)), {persistent: true})
        // channel.publish(exchange, routingKey2, Buffer.from(JSON.stringify(message)))
        console.log("mail data was sent", product);
        setTimeout(() => {
            connection.close()
        }, 5000)
    } catch (error) {
        console.log(error)
    }
}
fanoutExchange({id:12333, name:"fanout"})
