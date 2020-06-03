const amqp = require("amqplib")

const message = {
    description : "Bu bir test mesajidir.."
}

const queueName = process.argv[2] || "jobsQueue"
const data = require("./data.json")

connectToRabbitMQ();

async function connectToRabbitMQ(){
    
    try{
        const connection = await amqp.connect("amqp://localhost:5672")
        const channel = await connection.createChannel();
        await channel.assertQueue(queueName)

        data.forEach(i => {
            message.description = i.id;
            channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
            console.log("Gonderilen Mesaj", i.id);    
        })

        // setInterval(() => {
        //     message.description = new Date().getTime()
        //     channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)))
        //     console.log("Gonderilen Mesaj", message);
        // },1000)

        console.log("Gonderilen Mesaj", message)
    }catch(error){
        console.log("Error", error)
    }
    
}