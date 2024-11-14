const amqp = require('amqplib')

async function recieveMail() {
    try {
        const connection = await amqp.connect("amqp://localhost")
        const channel = await connection.createChannel()
        await channel.assertQueue("mail_queue_1", {durable: false})

        channel.consume("mail_queue_1", (message) => {
            if(message != null){
                console.log("Recv message for user 1", JSON.parse(message.content))
                // send ack
                channel.ack(message)
            }
        })

 
    } catch (error) {
        console.log(error)
    }
}

recieveMail()