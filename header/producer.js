const amqp = require('amqplib')

// have headers
const headerExchange = async(headers, message) => {
    try {
       
        const connection = await amqp.connect("amqp://localhost")
        const channel = await connection.createChannel()

        // exchange
        const exchange = "header_exchange";
        const exchangeType = 'headers'
        

        // exchange
        await channel.assertExchange(exchange, exchangeType, {durable: true}); // durable to save data in queue
       // publish channel
        channel.publish(exchange, "", Buffer.from(JSON.stringify(message)), {
            persistent:true, //storing object in local when server is crashed
            headers
        })
        // channel.publish(exchange, routingKey2, Buffer.from(JSON.stringify(message)))

        console.log("mail data was sent", message);

        setTimeout(() => {
            connection.close()
        }, 5000)
    } catch (error) {
        console.log(error)
    }
}

headerExchange({"x-match":"all", "notification-type":"new_Video", "content-type":"video"}, {id:12333, message:"videoo"})
headerExchange({"x-match":"all", "notification-type":"live_stream", "content-type":"gaming"}, {id:12333,  message:"gaming"})
headerExchange({"x-match":"any", "notification-type-comment":"comment", "content-type":"vlog"}, {id:12333,  message:"vlog-comment"})
headerExchange({"x-match":"any", "notification-type-like":"like", "content-type":"vlog"}, {id:12333,  message:"vlog-like"})
