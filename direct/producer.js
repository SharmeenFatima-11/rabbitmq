const amqp = require('amqplib')

async function sendMail() {
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
        const exchange = "mail_exchange";
        const routingKey1 = "send_mail_1";
        const routingKey2 = "send_mail_2";

        const message = {
            to: "fatimasharmeen58@gmail.com",
            from: "abcc@isbstudent.comsats.edu.pk",
            subject: "heyy",
            body: "real time message"
        }

        // exchange
        await channel.assertExchange(exchange, "direct", {durable: false}); // durable to save data in queue
        // queues
        await channel.assertQueue("mail_queue_1", {durable: false})
        await channel.assertQueue("mail_queue_2", {durable: false})
        // connection -- binding
        await channel.bindQueue("mail_queue_1", exchange, routingKey1)
        await channel.bindQueue("mail_queue_2", exchange, routingKey2)
        // publish channel
        channel.publish(exchange, routingKey2, Buffer.from(JSON.stringify(message)))
        // channel.publish(exchange, routingKey2, Buffer.from(JSON.stringify(message)))

        console.log("mail data was sent", message);

        setTimeout(() => {
            connection.close()
        }, 5000)
    } catch (error) {
        console.log(error)
    }
}

sendMail()