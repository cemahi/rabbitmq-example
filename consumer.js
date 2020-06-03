const amqp = require("amqplib")
const data = require("./data.json")
const queueName = process.argv[2] || "jobsQueue"
connectToRabbitMQ();

async function connectToRabbitMQ(){
    
    try{
        const connection = await amqp.connect("amqp://localhost:5672")
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName)

        channel.consume(queueName, message => {
            const messageInfo = JSON.parse(message.content.toString())
            const userInfo = data.find(u => u.id == messageInfo.description)
            if(userInfo){
                console.log("İşlenen Kayıt", userInfo);
                channel.ack(message);
            }
        });

    }catch(error){
        console.log("Error", error)
    }
    
}